# Random Number Functions In Swift 4.2+

```swift
// generates a random integer number between 0 and 10, not including 10

let number = Int.random(in: 0 ..< 10)
```

```swift
// generates a random integer number between 0 and 10, including 10

let number = Int.random(in: 0 .. 10)
```

```swift
// A random floating-point value

let fraction = Float.random(in: 0 ..< 1)
```

```swift
// Returns true or false – a random boolean!

let stayOrGo = Bool.random()```
```

```swift
// Randomizing the order of an array

let names = ["Ford", "Zaphod", "Trillian", "Arthur", "Marvin"]
names.shuffle()
// `names` can now be: ["Zaphod", "Marvin", "Arthur", "Ford", "Trillian"]
```

```swift
//  shuffle a Sequence

let sequence = 0 ..< 7
let shuffledSequence = sequence.shuffled()
// `shuffledSequence` can now be: [0, 6, 2, 3, 4, 1, 5]
```