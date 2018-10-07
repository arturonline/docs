# Array iteration with index

```Swift
let dwarfts = ["Doc", "Grumpy", "Happy"]

for (index, dwarf) in dwarfs.enumerated() {
  println("\(index + 1): \(dwarf)")
}