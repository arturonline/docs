# Swift Ranges

## Closed Ranges:  a...b

This range operator creates a Swift range which includes both element a and element b, even if b is the maximum possible value for a type (like Int.max). There are two different types of closed ranges: `ClosedRange` and `CountableClosedRange`.

### 1. ClosedRange

The elements of all ranges in Swift are comparable (ie, they conform to the Comparable protocol). That allows you to access the elements in the range from a collection. Here is an example:

```swift
let myRange: ClosedRange = 1...3

let myArray = ["a", "b", "c", "d", "e"]
myArray[myRange] // ["b", "c", "d"]
```

However, a ClosedRange is not countable (ie, it does not conform to the Sequence protocol). That means you can't iterate over the elements with a for loop. For that you need the CountableClosedRange.

### 2. CountableClosedRange

This is similar to the last one except now the range can also be iterated over.

```swift
let myRange: CountableClosedRange = 1...3

let myArray = ["a", "b", "c", "d", "e"]
myArray[myRange] // ["b", "c", "d"]

for index in myRange {
    print(myArray[index])
}
```

## Half-Open Ranges: a..<b

This range operator includes element a but not element b. Like above, there are two different types of half-open ranges: Range and CountableRange.

### 1. Range

As with `ClosedRange`, you can access the elements of a collection with a Range. Example:

```swift
let myRange: Range = 1..<3

let myArray = ["a", "b", "c", "d", "e"]
myArray[myRange] // ["b", "c"]
```

Again, though, you cannot iterate over a Range because it is only comparable, not stridable.

### 2. CountableRange

A `CountableRange` allows iteration.

```swift
let myRange: CountableRange = 1..<3

let myArray = ["a", "b", "c", "d", "e"]
myArray[myRange] // ["b", "c"]

for index in myRange {
    print(myArray[index])
}
```

## NSRange

You can (must) still use NSRange at times in Swift (when making attributed strings, for example), so it is helpful to know how to make one.

```swift
let myNSRange = NSRange(location: 3, length: 2)
```

Note that this is location and length, not start index and end index. The example here is similar in meaning to the Swift range `3..<5`. However, since the types are different, they are not interchangeable.

## Ranges with Strings

The `...` and `..<` range operators are a shorthand way of creating ranges. For example:

```swift
let myRange = 1..<3
```

The long hand way to create the same range would be

```swift
let myRange = CountableRange<Int>(uncheckedBounds: (lower: 1, upper: 3)) // 1..<3
```

You can see that the index type here is Int. That doesn't work for String, though, because Strings are made of Characters and not all characters are the same size. (Read this for more info.) An emoji like 😀, for example, takes more space than the letter "b".

### Problem with NSRange

Try experimenting with NSRange and an NSString with emoji and you'll see what I mean. Headache.

```swift
let myNSRange = NSRange(location: 1, length: 3)

let myNSString: NSString = "abcde"
myNSString.substring(with: myNSRange) // "bcd"

let myNSString2: NSString = "a😀cde"
myNSString2.substring(with: myNSRange) // "😀c"    Where is the "d"!?
```

The smiley face takes two UTF-16 code units to store, so it gives the unexpected result of not including the "d".

#### Swift Solution

Because of this, with Swift Strings you use Range<String.Index>, not Range<Int>. The String Index is calculated based on a particular string so that it knows if there are any emoji or extended grapheme clusters.

Example

```swift
var myString = "abcde"
let start = myString.index(myString.startIndex, offsetBy: 1)
let end = myString.index(myString.startIndex, offsetBy: 4)
let myRange = start..<end
myString[myRange] // "bcd"

myString = "a😀cde"
let start2 = myString.index(myString.startIndex, offsetBy: 1)
let end2 = myString.index(myString.startIndex, offsetBy: 4)
let myRange2 = start2..<end2
myString[myRange2] // "😀cd"
```

## One-sided Ranges: a... and ...b and ..<b

In Swift 4 things were simplified a bit. Whenever the starting or ending point of a range can be inferred, you can leave it off.

### Int

You can use one-sided integer ranges to iterate over collections. Here are some examples from the documentation.

```swift
// iterate from index 2 to the end of the array
for name in names[2...] {
    print(name)
}

// iterate from the beginning of the array to index 2
for name in names[...2] {
    print(name)
}

// iterate from the beginning of the array up to but not including index 2
for name in names[..<2] {
    print(name)
}

// the range from negative infinity to 5. You can't iterate forward
// over this because the starting point in unknown.
let range = ...5
range.contains(7)   // false
range.contains(4)   // true
range.contains(-1)  // true

// You can iterate over this but it will be an infinate loop 
// so you have to break out at some point.
let range = 5...
```

### String

This also works with String ranges. If you are making a range with str.startIndex or str.endIndex at one end, you can leave it off. The compiler will infer it.

Given

```swift
var str = "Hello, playground"
let index = str.index(str.startIndex, offsetBy: 5)

let myRange = ..<index    // Hello
You can go from the index to str.endIndex by using ...

var str = "Hello, playground"
let index = str.index(str.endIndex, offsetBy: -10)
let myRange = index...        // playground
```