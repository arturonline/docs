# Coding keys

## 1 Using custom coding keys

When you declare a struct that conforms to Codable (Decodable and Encodable protocols) with the following implementation...

```swift
struct Address: Codable {
    var street: String
    var zip: String
    var city: String
    var state: String
}
... the compiler automatically generates a nested enum that conforms to CodingKey protocol for you.

struct Address: Codable {
    var street: String
    var zip: String
    var city: String
    var state: String

    // compiler generated
    private enum CodingKeys: String, CodingKey {
        case street
        case zip
        case city
        case state
    }
}
```

Therefore, if the keys used in your serialized data format don't match the property names from your data type, you can manually implement this enum and set the appropriate rawValue for the required cases.

The following example shows how to do:

```swift
import Foundation

struct Address: Codable {
    var street: String
    var zip: String
    var city: String
    var state: String

    private enum CodingKeys: String, CodingKey {
        case street
        case zip = "zip_code"
        case city
        case state
    }
}
let address = Address(street: "Apple Bay Street", zip: "94608", city: "Emeryville", state: "California")

let encoder = JSONEncoder()
if let jsonData = try? encoder.encode(address), let jsonString = String(data: jsonData, encoding: .utf8) {
    print(jsonString)
}

/*
 prints:
 {"state":"California","street":"Apple Bay Street","zip_code":"94608","city":"Emeryville"}
 */
```

```swift
let jsonString = """
{"state":"California","street":"Apple Bay Street","zip_code":"94608","city":"Emeryville"}
"""

let decoder = JSONDecoder()
if let jsonData = jsonString.data(using: .utf8), let address = try? decoder.decode(Address.self, from: jsonData) {
    print(address)
}

/*
 prints:
 Address(street: "Apple Bay Street", zip: "94608", city: "Emeryville", state: "California")
 */
 ```

## 2 Using snake case to camel case key coding strategies

If your JSON has snake-cased keys and you want to convert them to camel-cased properties for your model object, you can set your JSONEncoder's keyEncodingStrategy and JSONDecoder's keyDecodingStrategy properties to .convertToSnakeCase.

The following example shows how to do:

```swift
import Foundation

struct Address: Codable {
    var street: String
    var zipCode: String
    var cityName: String
    var state: String
}
let address = Address(street: "Apple Bay Street", zipCode: "94608", cityName: "Emeryville", state: "California")

let encoder = JSONEncoder()
encoder.keyEncodingStrategy = .convertToSnakeCase
if let jsonData = try? encoder.encode(address), let jsonString = String(data: jsonData, encoding: .utf8) {
    print(jsonString)
}

/*
 prints:
 {"state":"California","street":"Apple Bay Street","zip_code":"94608","city_name":"Emeryville"}
 */
let jsonString = """
{"state":"California","street":"Apple Bay Street","zip_code":"94608","city_name":"Emeryville"}
"""

let decoder = JSONDecoder()
decoder.keyDecodingStrategy = .convertFromSnakeCase
if let jsonData = jsonString.data(using: .utf8), let address = try? decoder.decode(Address.self, from: jsonData) {
    print(address)
}

/*
 prints:
 Address(street: "Apple Bay Street", zipCode: "94608", cityName: "Emeryville", state: "California")
 */
 ```

## 3 Using custom key coding strategies

If necessary, JSONEncoder and JSONDecoder allow you to set a custom strategy to map coding keys using JSONEncoder.KeyEncodingStrategy.custom(_:) and JSONDecoder.KeyDecodingStrategy.custom(_:).

The following example shows how to implement them:

```swift
import Foundation

struct Address: Codable {
    var street: String
    var zip: String
    var city: String
    var state: String
}

struct AnyKey: CodingKey {
    var stringValue: String
    var intValue: Int?

    init?(stringValue: String) {
        self.stringValue = stringValue
    }

    init?(intValue: Int) {
        self.stringValue = String(intValue)
        self.intValue = intValue
    }
}
```

```swift
let address = Address(street: "Apple Bay Street", zip: "94608", city: "Emeryville", state: "California")

let encoder = JSONEncoder()
encoder.keyEncodingStrategy = .custom({ (keys) -> CodingKey in
    let lastKey = keys.last!
    guard lastKey.intValue == nil else { return lastKey }
    let stringValue = lastKey.stringValue.prefix(1).uppercased() + lastKey.stringValue.dropFirst()
    return AnyKey(stringValue: stringValue)!
})

if let jsonData = try? encoder.encode(address), let jsonString = String(data: jsonData, encoding: .utf8) {
    print(jsonString)
}

/*
 prints:
 {"Zip":"94608","Street":"Apple Bay Street","City":"Emeryville","State":"California"}
 */
```

```swift
let jsonString = """
{"State":"California","Street":"Apple Bay Street","Zip":"94608","City":"Emeryville"}
"""

let decoder = JSONDecoder()
decoder.keyDecodingStrategy = .custom({ (keys) -> CodingKey in
    let lastKey = keys.last!
    guard lastKey.intValue == nil else { return lastKey }
    let stringValue = lastKey.stringValue.prefix(1).lowercased() + lastKey.stringValue.dropFirst()
    return AnyKey(stringValue: stringValue)!
})

if let jsonData = jsonString.data(using: .utf8), let address = try? decoder.decode(Address.self, from: jsonData) {
    print(address)
}

/*
 prints:
 Address(street: "Apple Bay Street", zip: "94608", city: "Emeryville", state: "California")
 */
 ```