# Functions

> Previous: [Types](3_types.md) | Next: [Control Flow](5_flow.md)

Functions are declared with `fn`. By convention, function and variable names use `snake_case`.

```rust
fn main() {
    println!("Hello, world!");

    another_function(); // Rust doesn’t care where you define your functions
}

fn another_function() {
    println!("Another function.");
}
// Hello, world!
// Another function.
```

## Parameters

In function signatures, you must declare the type of each parameter.

```rust
fn main() {
    another_function(5, 'h');
}

fn another_function(value: i32, unit_label: char) {
    println!("The measurement is: {value}{unit_label}");
}
// The measurement is: 5h
```

Parameters are immutable by default too; use `mut` to modify the local copy: `fn inc(mut x: i32) -> i32 { x += 1; x }`.

## Function Bodies Contain Statements and Expressions

Function bodies are made up of a series of statements optionally ending in an expression.

- **Statements** are instructions that perform some action and do not return a value (`let y = 6;`, function definitions).
- **Expressions** evaluate to a resulting value (`5 + 6`, a function call, a macro call, a block `{}`, `if`, `match`…).

`let` is a statement, so it can’t be assigned to another variable:

```rust,compile_fail
fn main() {
    let x = (let y = 6);
}
// error: expected expression, found `let` statement
```

A block is an expression. Its value is the last expression inside it. Note that the last line has **no semicolon**: adding one turns it into a statement and the block returns `()`.

```rust
fn main() {
    let y = {
        let x = 3;
        x + 1
    };

    println!("The value of y is: {y}");
}
// The value of y is: 4
```

## Functions with Return Values

In Rust, the return value of the function is synonymous with the value of the final expression in the block of the body of a function. You can return early from a function by using the `return` keyword and specifying a value, but most functions return the last expression implicitly.

We declare their type after an arrow (`->`).

```rust
fn five() -> i32 {
    5
}

fn plus_one(x: i32) -> i32 {
    x + 1
}

fn main() {
    let x = five();

    println!("The value of x is: {x}");
    println!("plus_one: {}", plus_one(x));
}
// The value of x is: 5
// plus_one: 6
```

Adding a semicolon at the end of `x + 1` changes it from an expression to a statement, so the function returns `()` instead of `i32`:

```rust,compile_fail
fn plus_one(x: i32) -> i32 {
    x + 1;
}

fn main() {
    println!("{}", plus_one(5));
}
// error[E0308]: mismatched types
//   |
//   | fn plus_one(x: i32) -> i32 {
//   |    --------            ^^^ expected `i32`, found `()`
//   |    |
//   |    implicitly returns `()` as its body has no tail or `return` expression
//   |     x + 1;
//   |          - help: remove this semicolon to return this value
```

## Early return

```rust
fn safe_div(a: i32, b: i32) -> Option<i32> {
    if b == 0 {
        return None; // early return
    }
    Some(a / b)
}

fn main() {
    println!("{:?}", safe_div(10, 2));
    println!("{:?}", safe_div(10, 0));
}
// Some(5)
// None
```

## Returning multiple values

Return a tuple and destructure it on the caller side:

```rust
fn min_max(values: &[i32]) -> (i32, i32) {
    let mut min = values[0];
    let mut max = values[0];
    for &v in values {
        if v < min {
            min = v;
        }
        if v > max {
            max = v;
        }
    }
    (min, max)
}

fn main() {
    let (min, max) = min_max(&[3, 9, -2, 7]);
    println!("min={min} max={max}");
}
// min=-2 max=9
```

`&[i32]` is a slice, see [Slices](7_slices.md). Functions without `->` return `()` (unit).

## Closures

Closures are anonymous functions that can capture variables from their environment. Parameter and return types are usually inferred:

```rust
fn main() {
    let factor = 3;
    let multiply = |x| x * factor; // captures `factor`
    let add = |a: i32, b: i32| -> i32 { a + b };

    println!("{} {}", multiply(5), add(2, 3));
}
// 15 5
```
