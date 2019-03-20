# File System: Working with Files and Directories

[Source]("https://www.raywenderlich.com/666-filemanager-class-tutorial-for-macos-getting-started-with-the-file-system")

## URL

In Swift we use `URL` to handle addresses. `URL` stands for *Uniform Resource Locator*. Instead of `https://`, local file URLs start with `file://`.

```Swift
let completePath = "/Users/sarah/Desktop/Files.playground"
let completeUrl = URL(fileURLWithPath: completePath)
```

`NSString` has a lot of file path manipulation methods, but Swift’s `String struct` doesn’t. Instead, you should use `URLs` when working with `file paths`.

## FileManager Class

```Swift
let home = FileManager.default.homeDirectoryForCurrentUser
let desktopPath = "test2/test.txt"
let desktopURL = home.appendingPathComponent(desktopPath)

// file:///Users/artur/
// "test2/test.txt"
// file:///Users/artur/test2/test.txt
```

```Swift
desktopURL.path
desktopURL.absoluteString
desktopURL.baseURL
desktopURL.pathComponents
desktopURL.lastPathComponent
desktopURL.pathExtension
desktopURL.isFileURL
desktopURL.hasDirectoryPath

// "/Users/artur/test2/test.txt"
// "file:///Users/artur/test2/test.txt"
// nil
// ["/", "Users", "artur", "test2", "test.txt"]
// "test.txt"
// "txt"
// true
// false
```

```swift
var urlForEditing = home
// "/Users/artur"

urlForEditing.appendPathComponent("Desktop")
// "/Users/artur/Desktop"

urlForEditing.appendPathComponent("TestFile")
// "/Users/artur/Desktop/TestFile"

urlForEditing.appendPathExtension("txt")
// "/Users/artur/Desktop/TestFile.txt"

urlForEditing.deletePathExtension()
// "/Users/artur/Desktop/TestFile"

urlForEditing.deleteLastPathComponent()
// "/Users/artur/Desktop"
```

## Check if a file exists

```swift
let home = FileManager.default.homeDirectoryForCurrentUser
let desktopPath = "test2/test.txt"
let desktopURL = home.appendingPathComponent(desktopPath)


let fileManager = FileManager.default
fileManager.fileExists(atPath: desktopURL.path)

let missingFile = URL(fileURLWithPath: "this_file_does_not_exist.missing")
fileManager.fileExists(atPath: missingFile.path)
```

## Check if a directory exists

```swift
let home = FileManager.default.homeDirectoryForCurrentUser
let desktopPath = "test2/test.txt"
let desktopURL = home.appendingPathComponent(desktopPath)

var isDirectory: ObjCBool = false
fileManager.fileExists(atPath: desktopURL.path, isDirectory: &isDirectory)
isDirectory.boolValue

```

## Retrieve Folder contents

```swift
func contentsOf(folder: URL) -> [URL] {
  // 1
  let fileManager = FileManager.default

  // 2
  do {
    // 3
    let contents = try fileManager.contentsOfDirectory(atPath: folder.path)

    // 4
    let urls = contents.map { return folder.appendingPathComponent($0) }
    return urls
  } catch {
    // 5
    return []
  }
}
```