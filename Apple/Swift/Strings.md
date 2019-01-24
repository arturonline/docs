# Strings

## Substrings

When you get some substring from a String you get a `Substring` type back rather than a `String`.

Why is this? Strings are value types in Swift. That means if you use one `String` to make a new one, then it has to be copied over. This is good for stability but bad for efficiency.

A `Substring`, on the other hand, is a reference back to the original `String` from which it came. There is no copying needed so it is much more efficient to use.

Because the `Substring` is referencing the `String`, the system would have to hold on to the entire `String` for as long as the `Substring` is around. Thus, whenever you are done manipulating your `Substring`, convert it to a `String`.

```swift
let myString = String(mySubstring)
```

This will copy just the substring over and the old String can be garbage collected. `Substrings` (as a type) are meant to be short lived.

Another big improvement in Swift 4 is that `Strings` are **Collections** (again). That means that whatever you can do to a Collection, you can do to a String (use subscripts, iterate over the characters, filter, etc).

The following examples show how to get a `substring` in Swift.

## Getting substrings

You can get a substring from a string by using subscripts or a number of other methods (for example, prefix, suffix, split). You still need to use `String.Index` and not an Int index for the range, though.

### Beginning of a string

You can use a subscript (note the Swift 4 one-sided range):

```swift
let index = str.index(str.startIndex, offsetBy: 5)
let mySubstring = str[..<index] // Hello
```

or prefix:

```swift
let index = str.index(str.startIndex, offsetBy: 5)
let mySubstring = str.prefix(upTo: index) // Hello
```

or even easier:

```swift
let mySubstring = str.prefix(5) // Hello
```

### End of a string

Using subscripts:

```swift
let index = str.index(str.endIndex, offsetBy: -10)
let mySubstring = str[index...] // playground
```

or suffix:

```swift
let index = str.index(str.endIndex, offsetBy: -10)
let mySubstring = str.suffix(from: index) // playground
```

or even easier:

```swift
let mySubstring = str.suffix(10) // playground
```

Note that when using the `suffix(from: index)` I had to count back from the end by using -10. That is not necessary when just using `suffix(x)`, which just takes the last x characters of a `String`.

### Range in a string

Again we simply use subscripts here.

```swift
let start = str.index(str.startIndex, offsetBy: 7)
let end = str.index(str.endIndex, offsetBy: -6)
let range = start..<end

let mySubstring = str[range]  // play
```

### Converting Substring to String

Don't forget, when you are ready to save your `substring`, you should convert it to a `String` so that the old string's memory can be cleaned up.

```swift
let myString = String(mySubstring)
```

## Using an Int index extension

Although in Swift 4, `Strings` are collections, the Swift team purposely hasn't used Int indexes. It is still `String.Index`. This has to do with Swift Characters being composed of varying numbers of Unicode codepoints. The actual index has to be uniquely calculated for every string.
