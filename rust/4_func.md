# Functions

```rust
fn main() {
    println!("Hello, world!");

    another_function(); // Rust doesn’t care where you define your functions
}

fn another_function() {
    println!("Another function.");
}
```

## Parameters

In function signatures, you must declare the type of each parameter.

```rust
fn main() {
    another_function(5, 6);
}

fn another_function(x: i32, y: i32) {
    println!("The value of x is: {}", x);
    println!("The value of y is: {}", y);
}
```

## Function Bodies Contain Statements and Expressions

Function bodies are made up of a series of statements optionally ending in an expression. Statements are instructions that perform some action and do not return a value. Expressions evaluate to a resulting value

## Functions with Return Values

In Rust, the return value of the function is synonymous with the value of the final expression in the block of the body of a function. You can return early from a function by using the return keyword and specifying a value, but most functions return the last expression implicitly.

We declare their type after an arrow (->).

```rust
fn five() -> i32 {
    5
}

fn main() {
    let x = five();

    println!("The value of x is: {}", x);
}
```
