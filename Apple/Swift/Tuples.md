# Tuples

Tuple is a group of different objects or values represented as one without having to create a new type. Tuples are passed by value, not reference.

```swift
let tuple1 = ("Angela", 12)

let tuple2 = (name: "Angela", age: 12)

let tuple3 = (name: String, age: Int)
tuple3 = (name: "Angela", age: 12)
```

Tuples can be accessed using element names (*"name"* and *"age"* above), or using a position in the tuple, e.g. 0 and 1.

```swift
print(tuple1.0) // Angela
print(tuple2.age) // 12
```

## Extract tuple into an explicit type

```swift
class TextView: UIView {
    typealias Texts = (title: String, subtitle: String, description: String)

    func render(_ texts: Texts) {
        titleLabel.text = texts.title
        subtitleLabel.text = texts.subtitle
        descriptionLabel.text = texts.description
    }
}
```

## Using tuples to return multiple values from a function

```swift
func split(name: String) -> (firstName: String, lastName: String) {
    let split = name.components(separatedBy: " ")
    return (split[0], split[1])
}

let parts = split(name: "Paul Hudson")
parts.0
parts.1
parts.firstName
parts.lastName
```