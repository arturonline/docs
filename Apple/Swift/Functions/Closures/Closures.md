# Closures

## Syntax

```Swift
{ (params) -> returnType in
statements
}
```

Example:

```swift
reversedNames = names.sorted(by: { (s1: String, s2: String) -> Bool in
    return s1 > s2
})
```

## Function vs Closure

Function syntax:

```Swift
func sum(numbers: [Int]) -> Int {
  // Code that adds together the numbers array.
  return total
}
```

Closure syntax:

```Swift
let sumClosure = { (numbers: [Int]) -> Int in
  // Code that adds together the numbers array.
  return total
}

let sum = sumClosure([1, 2, 3, 4])
print(sum)
```

## Types of Closures

1. A closure with no parameters and no return value:

    ```Swift
    let printClosure = { () -> Void in
    print("This closure does not take any parameters and does not
    return a value.")
    }
    ```

2. A closure with parameters and no return value:

    ```Swift
    let printClosure = { (string: String) -> Void in
    print(string)
    }
    ```

3. A closure with no parameters and a return value:

    ```Swift
    let randomNumberClosure = { () -> Int in
    // Code that returns a random number.
    }
    ```

4. A closure with parameters and a return value (as in the earlier example):

    ```Swift
    let randomNumberClosure = { (minValue: Int, maxValue: Int) 
    -> Int in
    // Code that returns a random number between `minValue` and
    `maxValue`.
    }
    ```

One of the differences between functions and closures is that you don’t use parameter labels when running closures. 

Example:

```swift
let driving = { (place: String) in
    print("I'm going to \(place) in my car")
}

driving("London")
```

## Syntactic Sugar

```swift
reversedNames = names.sorted(by: { (s1: String, s2: String) -> Bool in
    return s1 > s2
})
```

Because the body of the closure is so short, it can even be written on a single line:

```swift
reversedNames = names.sorted(by: { (s1: String, s2: String) -> Bool in return s1 > s2 } )
```

### Inferring Type from Context

Because all of the types can be inferred, the return arrow `(->)` and the parentheses around the names of the parameters can also be omitted:

```swift
reversedNames = names.sorted(by: { s1, s2 in return s1 > s2 } )
```

### Implicit Returns from Single-Expression Closures

Single-expression closures can implicitly return the result of their single expression by omitting the return keyword from their declaration, as in this version of the previous example:

```swift
reversedNames = names.sorted(by: { s1, s2 in s1 > s2 } )
```

### Shorthand Argument Names

Swift automatically provides shorthand argument names to inline closures, which can be used to refer to the values of the closure’s arguments by the names $0, $1, $2, and so on.

```swift
reversedNames = names.sorted(by: { $0 > $1 } )
```

Here, $0 and $1 refer to the closure’s first and second String arguments.

### Operator Methods

There’s actually an even shorter way to write the closure expression above. Swift’s String type defines its string-specific implementation of the greater-than operator (>) as a method that has two parameters of type String, and returns a value of type Bool. This exactly matches the method type needed by the sorted(by:) method. Therefore, you can simply pass in the greater-than operator, and Swift will infer that you want to use its string-specific implementation:

```swift
reversedNames = names.sorted(by: >)
```

### Trailing Closure

If you need to pass a closure expression to a function as the function’s final argument and the closure expression is long, it can be useful to write it as a trailing closure instead. A trailing closure is written after the function call’s parentheses, even though it is still an argument to the function. When you use the trailing closure syntax, you don’t write the argument label for the closure as part of the function call.

```swift
func someFunctionThatTakesAClosure(closure: () -> ()) {
    // function body goes here
}

// Instead of calling like this:
someFunctionThatTakesAClosure({
    // closure's body goes here
})

// You can use trailing closure like this:
someFunctionThatTakesAClosure() {
    // trailing closure's body goes here
}
```