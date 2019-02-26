# Error Handling

Error handling is the process of responding to and recovering from error conditions in your program. Some operations aren’t guaranteed to always complete execution or produce a useful output.

In practical iOS development, not all errors are bad. Some errors are part of an app’s lifecycle, such as an “Insufficient funds” message when you try to pay with your credit card.

These kinds of errors are recoverable. They can be caught, handled, and responded to appropriately.

## Errors

In Swift, errors are represented by values of types that conform to the `Error protocol`. This empty protocol indicates that a type can be used for error handling.

Swift enumerations are particularly well suited to modeling a group of related error conditions, with associated values allowing for additional information about the nature of an error to be communicated.

```Swift
enum RocketError: Error {
    case insufficientFuel
    case insufficientAstronauts(needed: Int)
    case unknownError
}
```

This enumeration extends Error and defines three types of errors: `.insufficientFuel`, `insufficientAstronauts(needed)` and `.unknownError`. Defining your own error types is super useful, because you can be very clear about what these errors mean in your code.

## Throwing Errors

When a scenario that should result in an error occurs in your code, you can throw an error.

```Swift
throw VendingMachineError.insufficientFunds(coinsNeeded)
```

## Handling Errors

When an error is thrown, some code must be responsible for handling that error.

### Propagating Errors Using Throwing Functions

When a function `throw` an Error, any code that calls that function must either handle the error using a `do-catch` statement, `try?`, or `try!` - or continue to propagate them.

```Swift
func vend(itemNamed name: String) throws {
  guard let item = inventory[name] else {
    throw VendingMachineError.invalidSelection
}
```

### Handling Errors Using Do-Catch

Error handling in Swift is done with a so-called `do-try-catch` block:

```swift
do {
    try igniteRockets(fuel: 5000, astronauts: 1)
} catch {
    print(error)
}
```

Handling errors with do-try-catch has three important aspects:

* The function or expression that can produce an error is prepended with the try keyword
* The block of code that includes the try keyword is wrapped within do { ... }
* One or more catch { ... } blocks can be attached to the do { ... } block, to handle all or individual error cases

Interestingly, in most other programming languages this error handling mechanism is called try/catch, and the error-producing expression isn’t marked with try. Swift makes this explicit.

#### Multiple catch clauses

```swift
do {
    try igniteRockets(fuel: 5000, astronauts: 1)
} catch RocketError.insufficientFuel {
    print("The rocket needs more fuel to take off!")
} catch RocketError.insufficientAstronauts(let needed) {
    print("You need at least \(needed) astronauts...")
}
```

If an error is thrown by the code in the `do` clause, execution immediately transfers to the `catch` clauses. If no pattern is matched, the error gets caught by the final `catch` clause and is bound to a local error constant. If no error is thrown, the remaining statements in the do statement are executed.

The catch clauses don’t have to handle every possible error that the code in the do clause can throw. However, the propagated error must be handled by some surrounding `catch`.

### Converting Errors to Optional Values

You use `try?` to handle an error by converting it to an optional value. If an error is thrown while evaluating the `try?` expression, the value of the expression is `nil`. When you use `try?`, you don’t have to use the complete `do-try-catch block`.

```Swift
let result = try? calculateValue(for: 42)
```

Imagine the `calculateValue(for:)` function can throw errors, for example if its parameter is invalid. Instead of handling this error with `do-try-catch`, we’re converting the returned value to an optional.

One of two things will now happen:

* The function does not throw an error, returns a value, which is assigned to result
* The function throws an error, and does not return a value, which means that nil is assigned to result

Handling errors this way means you can benefit from syntax specific to optionals, such as `??` and `optional binding`. Like this:

```swift
if let result = try? calculateValue(for: 99) {
    // Do something with non-optional value "result"
}
```

And using nil-coalescing operator ?? to provide a default value:

```swift
let result = try? calculateValue(for: 123) ?? 101
```

### Disabling Error Propagation

Sometimes you know a throwing function or method won’t, in fact, throw an error at runtime. On those occasions, you can write try! before the expression to disable error propagation and wrap the call in a runtime assertion that no error will be thrown. When you use `try!`, you don’t have to use the complete `do-try-catch block`.

```Swift
let photo = try! loadImage(atPath: "./Resources/John Appleseed.jpg")
```

There are two distinct scenarios in which `try!` is useful:

* Use `try!` when your code could impossibly lead to an error, i.e. when it’s 100% certain that an error will not occur.
* Use `try!` when you can’t recover from an error, and it’s impossible to continue execution beyond that point.