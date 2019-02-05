# Optional Binding

Use optional binding to find out whether an optional contains a value, and if so, to make that value available as a temporary constant or variable.

```swift
if let constantName = someOptional {
     // if the value of someOptional is succesfully unwrapped, it is assigned to constantName
  // so, we can use constantName within this block

} else {
// the value of someOptional is not set (or nil).
}
```

## Guard Statement

The guard statement is the opposite of an if statement. If the condition evaluates to false, the else portion is executed:

```swift
guard constantName = someOptional else {
  // This block executes if the value of someOptional is NOT succesfully unwrapped
}
//true: someOptional is succesfully unwrapped to constantName.
// We can use outside the guard scope
```

## Scope

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

## Unwrap multiple optionals at the same time

Using guard let, you can unwrap multiple optionals at the same time. This approach will make all constants available throughout the rest of the function, rather than only within the control flow braces.

```swift
func processBook(title: String?, price: Double?, pages: Int?) {
  if let theTitle = title, let thePrice = price, let thePages = 
  pages {
    print("\(theTitle) costs $\(thePrice) and has \(thePages) 
    pages.")
  }
}
```