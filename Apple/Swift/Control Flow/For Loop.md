# Array iteration with index

```Swift
let count = 1...10

```Swift
for number in count {
    print("Number is \(number)")
}
```

We can do the same with arrays:

```Swift
let albums = ["Red", "1989", "Reputation"]

for album in albums {
    print("\(album) is on Apple Music")
}
```

If you don’t use the constant that for loops give you, you should use an underscore instead so that Swift doesn’t create needless values:

```Swift
print("Players gonna ")

for _ in 1...5 {
    print("play")
}
```

To use the index:

```Swift
let dwarfts = ["Doc", "Grumpy", "Happy"]

for (index, dwarf) in dwarfs.enumerated() {
  println("\(index + 1): \(dwarf)")
}
```