# Closures

## Function vs Closure

### Function

```Swift
// Function syntax:
func sum(numbers: [Int]) -> Int {
  // Code that adds together the numbers array.
  return total
}
```

### Closure

```Swift
// Closure syntax:
let sumClosure = { (numbers: [Int]) -> Int in
  // Code that adds together the numbers array.
  return total
}

let sum = sumClosure([1, 2, 3, 4])
print(sum)
```

## Closure Syntax

```Swift
{ (params) -> returnType in
statements
}

// Example:
reversedNames = names.sorted(by: { (s1: String, s2: String) -> Bool in
    return s1 > s2
})
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

## Escaping closures

When you pass a closure into a function, swift considers it `non-Escaping` by default. It means that the closure must be use inmediatly and can not store for later.

A closure is said to escape a function when the closure is passed as an argument to the function, but is called after the function returns.

When you declare a function that takes a closure as one of its parameters, you can write `@escaping` before the parameter’s type to indicate that the closure is allowed to escape.

```Swift
var queuedClosures [() -> Void] = [] // Arrar of closures

func queueClosure(_ closure: @escaping () -> Void) {
    queuedClosures.append(closure)
}

queuedClosure({ print("Running Closure 1") })
queuedClosure({ print("Running Closure 2") })
queuedClosure({ print("Running Closure 3") })

func executreQueuedClosures() {
    for closure in queuedClosures {
        closure()
    }
}

executreQueuedClosures() // you can not use this without @escaping
```