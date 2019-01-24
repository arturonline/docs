# String Index

[Source](https://stackoverflow.com/questions/39676939/how-does-string-index-work-in-swift/39676940#39676940
)
All of the following examples use

```swift
var str = "Hello, playground"
```

## startIndex and endIndex

`startIndex` is the index of the first character
`endIndex` is the index after the last character.
Example

```swift
// character
str[str.startIndex] // H
str[str.endIndex]   // error: after last character

// range
let range = str.startIndex..<str.endIndex
str[range]  // "Hello, playground"
```

With Swift 4's one-sided ranges, the range can be simplified to one of the following forms.

```swift
let range = str.startIndex...
let range = ..<str.endIndex
```

I will use the full form in the follow examples for the sake of clarity, but for the sake of readability, you will probably want to use the one-sided ranges in your code.

## after

As in: `index(after: String.Index)`

after refers to the index of the character directly after the given index.
Examples

```swift
// character
let index = str.index(after: str.startIndex)
str[index]  // "e"

// range
let range = str.index(after: str.startIndex)..<str.endIndex
str[range]  // "ello, playground"
```

## before

As in: `index(before: String.Index)`

before refers to the index of the character directly before the given index.
Examples

```swift
// character
let index = str.index(before: str.endIndex)
str[index]  // d

// range
let range = str.startIndex..<str.index(before: str.endIndex)
str[range]  // Hello, playgroun
```

## offsetBy

As in: `index(String.Index, offsetBy: String.IndexDistance)`

The offsetBy value can be positive or negative and starts from the given index. Although it is of the type String.IndexDistance, you can give it an Int.
Examples

```swift
// character
let index = str.index(str.startIndex, offsetBy: 7)
str[index]  // p

// range
let start = str.index(str.startIndex, offsetBy: 7)
let end = str.index(str.endIndex, offsetBy: -6)
let range = start..<end
str[range]  // play
```

## limitedBy

As in: `index(String.Index, offsetBy: String.IndexDistance, limitedBy: String.Index)`

The `limitedBy` is useful for making sure that the offset does not cause the index to go out of bounds. It is a bounding index. Since it is possible for the offset to exceed the limit, this method returns an Optional. It returns nil if the index is out of bounds.
Example

```swift
// character
if let index = str.index(str.startIndex, offsetBy: 7, limitedBy: str.endIndex) {
    str[index]  // p
}
```

If the offset had been 77 instead of 7, then the if statement would have been skipped.

## Why is String.Index needed

It would be much easier to use an Int index for Strings. The reason that you have to create a new String.Index for every String is that Characters in Swift are not all the same length under the hood. A single Swift Character might be composed of one, two, or even more Unicode code points. Thus each unique String must calculate the indexes of its Characters.

It is possibly to hide this complexity behind an Int index extension, but I am reluctant to do so. It is good to be reminded of what is actually happening.