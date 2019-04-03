# Optional Binding

Use optional binding to find out whether an optional contains a value, and if so, to make that value available as a temporary constant or variable.

## If let

```swift
if let constantName = someOptional {
  // if the value of someOptional is succesfully unwrapped, it is assigned to constantName
  // so, we can use constantName within this block

} else {
// the value of someOptional is not set (or nil).
}
```

Example:

```swift
if let actualNumber = Int(possibleNumber) {
    print("The string \"\(possibleNumber)\" has an integer value of \(actualNumber)")
} else {
    print("The string \"\(possibleNumber)\" could not be converted to an integer")
}
// Prints "The string "123" has an integer value of 123"
```

## Guard Statement

The guard statement is the opposite of an if statement. If the condition evaluates to false, the else portion is executed:

```swift
guard true else {
  print("Condition not met")
}
print("Condition met")

// Condition met
```

```swift
guard false else {
  print("Condition not met")
}
print("Condition met")

// Condition not met
```

### Guard Scope

Any constants or variables assigned a value from an optional binding declaration in a guard statement condition can be used for the rest of the guard statement’s enclosing scope.

```swift
if let eggs = goose.eggs {
  print("The goose laid \(eggs.count) eggs.")
}
//`eggs` is not accessible here
```

```swift
guard let eggs = goose.eggs else { return }
//`eggs` is accessible hereafter
print("The goose laid \(eggs.count) eggs.")
```

### Guard with optional binding

```swift
guard constantName = someOptional else {
  // This block executes if the value of someOptional is NOT succesfully unwrapped
}
//true: someOptional is succesfully unwrapped to constantName.
// We can use outside the guard scope
```

## Unwrap multiple optionals at the same time

You can include as many optional bindings and Boolean conditions in a single `if` or `guard`  statement as you need to, separated by commas. If any of the values in the optional bindings are nil or any Boolean condition evaluates to false, the whole if statement’s condition is considered to be false. The following if statements are equivalent:

```swift
if let firstNumber = Int("4"), let secondNumber = Int("42"), firstNumber < secondNumber && secondNumber < 100 {
    print("\(firstNumber) < \(secondNumber) < 100")
}
// Prints "4 < 42 < 100"

if let firstNumber = Int("4") {
    if let secondNumber = Int("42") {
        if firstNumber < secondNumber && secondNumber < 100 {
            print("\(firstNumber) < \(secondNumber) < 100")
        }
    }
}
// Prints "4 < 42 < 100"
```

Example with guard:

```swift
func processBook(title: String?, price: Double?, pages: Int?) {
  if let theTitle = title, let thePrice = price, let thePages = 
  pages {
    print("\(theTitle) costs $\(thePrice) and has \(thePages) 
    pages.")
  }
}
```