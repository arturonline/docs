# Error Handling

Error handling is the process of responding to and recovering from error conditions in your program. Some operations aren’t guaranteed to always complete execution or produce a useful output.

## Errors

In Swift, errors are represented by values of types that conform to the `Error protocol`. This empty protocol indicates that a type can be used for error handling.

Swift enumerations are particularly well suited to modeling a group of related error conditions, with associated values allowing for additional information about the nature of an error to be communicated.

```Swift
enum VendingMachineError: Error {
    case invalidSelection
    case insufficientFunds(coinsNeeded: Int)
    case outOfStock
}
```

## Throwing Errors

Throwing an error lets you indicate that something unexpected happened and the normal flow of execution can't continue.

```Swift
throw VendingMachineError.insufficientFunds(coinsNeeded)
```

## Handling Errors

When an error is thrown, some code must be responsible for handling that error. There are four ways to handle errors in Swift:

- Propagate errors using throwing functions.
- Handle the error using a `dot-catch` statement.
- Handle the error as an optional value.
- Assert that the error will not occur.

### Propagating Errors Using Throwing Functions

When a function `throw` an Error, any code that calls that function must either handle the error using a `do-catch` statement, `try?`, or `try! - or continue to propagate them.

```Swift
func vend(itemNamed name: String) throws {
  guard let item = inventory[name] else {
  throw VendingMachineError.invalidSelection
}
```

### Handling Errors Using Do-Catch

You use a `do-catch` statement to handle errors by running a block of code. If an error is thrown by the code in the do clause, it is matched against the catch clauses to determine which one of them can handle the error.

If an error is thrown, execution immediately transfers to the catch clauses, which decide whether to allow propagation to continue. If no pattern is matched, the error gets caught by the final `catch` clause and is bound to a local error constant. If no error is thrown, the remaining statements in the do statement are executed.

```Swift
do {
    try expression
    statements
} catch pattern 1 {
    statements
} catch pattern 2 where condition {
    statements
} catch {
    statements
}
```

The catch clauses don’t have to handle every possible error that the code in the do clause can throw. If none of the catch clauses handle the error, the error propagates to the surrounding scope. However, the propagated error must be handled by some surrounding scope.

### Converting Errors to Optional Values

You use `try?` to handle an error by converting it to an optional value. If an error is thrown while evaluating the try? expression, the value of the expression is nil.

```Swift
func someThrowingFunction() throws -> Int {
    // ...
}

let x = try? someThrowingFunction()

let y: Int?
do {
    y = try someThrowingFunction()
} catch {
    y = nil
}
```

If `someThrowingFunction()` throws an error, the value of x and y is nil.

### Disabling Error Propagation

Sometimes you know a throwing function or method won’t, in fact, throw an error at runtime. On those occasions, you can write try! before the expression to disable error propagation and wrap the call in a runtime assertion that no error will be thrown.

```Swift
let photo = try! loadImage(atPath: "./Resources/John Appleseed.jpg")
```
