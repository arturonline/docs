# Archiving

An object should be responsible for encoding and decoding its own instance variables. For an object to be encoded or decoded, it mus adopt and conform to a codable protocol

## Codable protocols

Broadly speaking, `NSCoding` is the Objective-C way of archiving data and `Codable` is the Swift way. However, that doesn’t mean the two can’t work together – you can save any NSCoding data right inside Codable, which is helpful because many Apple types such as UIColor and UIImage conform to NSCoding but not Codable.

Once an object conforms to a codable protocol, an `Encoder` object can be used to encode the object as data that can be saved to disk. Similarly, a `Decoder` object can be used to turn that encoded data into its corresponding model object.

## Data

`Data` is a swift structure that represents data stored as bytes. `Data` provides instance methods for writing to and reading from a file.

## Writing data to a file

iOS apps work in the sandbox model. Your app has a few directories that it can use to save data. One, of those directories is called the `Documents` directory, and it's where you're allowed to save and modify information related to your app.

As parat of the sandbox model, the file path to the Documents directory will change each time your app is loaded into memory for security reasons.

To work with files in your app directory we use a `FileManager`.

### Getting the Documents directory url

```Swift
documentsDirectory =
    FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!

// Documents/
```

`urls` -> array of URL objects which point to the directories that match your search.<br>
`documentDirectory` -> Documents directory<br>
`userDomainMask` -> user's home folder.<br>

### Getting the full path for the file

```Swift
let archiveURL =
    documentsDirectory.appendingPathComponent("test").appendingPathExtension("plist")

// Documents/test.plist
```

### Writing the data

Now that you have a file path at which to save, you can use `write(to:options:)` method on Data to wirte to that path:

```Swift
try? encodedNote?.write(to: archiveURL, options: .noFileProtection)
```

### Retrieving the data

To retrieve the data from the file, you can initialize a Data object using its throwing initializer `init(contenstOf:)` and pass it the URL at which the data is stored.

```Swift
if let retrievedNoteData = try? Data(contentsOf: archiveURL),
    let decodedNote = try? propertyListDecoder.decode(Note.self,
    from: retrievedNoteData)
    print(decodedNote)
```