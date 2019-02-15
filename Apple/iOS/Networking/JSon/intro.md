# Intro

More [here](https://www.raywenderlich.com/382-encoding-decoding-and-serialization-in-swift-4)

## Renaming Properties With CodingKeys

The CodingKeys enum, which conforms to CodingKey protocol, lets you rename specific properties in case the serialized format doesn’t match the requirements of the API.
Add the nested enumeration CodingKeys like this:

```swift
struct Employee: Codable {
  var name: String
  var id: Int
  var favoriteToy: Toy

  enum CodingKeys: String, CodingKey {
    case id = "employeeId"
    case name
    case favoriteToy
  }
}
```

There are several things to note here:

1. CodingKeys is a nested enumeration in your type.
2. It has to conform to CodingKey.
3. You also need String as the raw type, since the keys are always strings.
4. You have to include all properties in the enumeration, even if you don’t plan to rename them.
5. By default, this enumeration is created by the compiler, but when you need to rename a key you need to implement it yourself.

Now if you print the JSON, you’ll see that the stored property id key has changed to employeeId:

```json
{ "employeeId": 7, "name": "John Appleseed", "favoriteToy": {"name":"Teddy Bear"}}
```