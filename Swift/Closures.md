# Closures

```Swift
// Function syntax:
func sum(numbers: [Int]) -> Int {
  // Code that adds together the numbers array.
  return total
}
```

```Swift
// Closure syntax:
let sumClosure = { (numbers: [Int]) -> Int in
  // Code that adds together the numbers array.
  return total
}

let sum = sumClosure([1, 2, 3, 4])
print(sum)
```

## Syntax

```Swift
reversedNames = names.sorted(by: { (s1: String, s2: String) -> Bool in
    return s1 > s2
})
```

### Inferring Type From Context

```Swift
reversedNames = names.sorted(by: { s1, s2 in return s1 > s2 } )
```

### Implicit returns form Single-Expression Closures

```Swift
reversedNames = names.sorted(by: {s1, s2 in s1 > s2})
```

### Shorthand Argument Names

```Swift
reversedNames = names.sorted(by: { $0 > $1 })

reversedNames = names.sorted() { $0 > $1 }

reversedNames = names.sorted { $0 > $1 }

```

### Operator methods

```Swift
reversedNames = names.sorted(by: > )
```

## Scope

A closure can capture constants and variables from the `surrounding context` in which it is defined. In Swift, the simplest form of a closure that can capture values is a nested function, written within the body of another function. A nested function can capture any of its outer function’s arguments and can also capture any constants and variables defined within the outer function.

```Swift
func makeIncrementer(forIncrement amount: Int) -> () -> Int {
    var runningTotal = 0
    func incrementer() -> Int {
        runningTotal += amount
        return runningTotal
    }
    return incrementer
}
```

The `incrementer()` function doesn’t have any parameters, and yet it refers to runningTotal and amount from within its function body. It does this by capturing a reference to runningTotal and amount from the surrounding function and using them within its own function body.