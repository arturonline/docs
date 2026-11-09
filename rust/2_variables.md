# Variables

> Previous: [Tooling](1_tooling.md) | Next: [Types](3_types.md)

By default variables are immutable. When a variable is immutable, once a value is bound to a name, you can’t change that value.

```rust,compile_fail
fn main() {
    let x = 5;
    println!("The value of x is: {x}");
    x = 6;
    println!("The value of x is: {x}");
}

// error[E0384]: cannot assign twice to immutable variable `x`
```

You can make variables mutable by adding `mut` in front of the variable name.

```rust
fn main() {
    let mut x = 5;
    println!("The value of x is: {x}");
    x = 6;
    println!("The value of x is: {x}");
}
// The value of x is: 5
// The value of x is: 6
```

> `println!("{x}")` (inline format args) is the same as `println!("{}", x)`. Only plain variable names can be inlined; expressions still need positional arguments: `println!("{}", x + 1)`.

## Type annotations

Rust is statically typed, but the compiler usually infers the type. You can annotate it with `: Type`:

```rust
fn main() {
    let a = 5;          // i32 (default integer type)
    let b: u64 = 5;     // explicit type
    let c = 5u8;        // type suffix on the literal
    let guess: u32 = "42".parse().expect("Not a number!"); // annotation needed here

    println!("{a} {b} {c} {guess}");
}
// 5 5 5 42
```

A variable can be declared first and initialized later, but it must be initialized before it is used:

```rust
fn main() {
    let x;
    if true { x = 1 } else { x = 2 }
    println!("{x}");
}
// 1
```

Unused variables produce a warning; prefix the name with `_` to silence it: `let _unused = 3;`.

## Variables vs Constants

You declare constants using the `const` keyword instead of the `let` keyword, and the type of the value must be annotated:

```rust
const MAX_POINTS: u32 = 100_000;
const THREE_HOURS_IN_SECONDS: u32 = 60 * 60 * 3; // evaluated at compile time

fn main() {
    println!("{MAX_POINTS} {THREE_HOURS_IN_SECONDS}");
}
// 100000 10800
```

- Constants are not allowed to use `mut`: they are always immutable.
- They can be declared in any scope, including the global scope.
- They must be set to a constant expression, not to a value computed at runtime.
- By convention they are named in `SCREAMING_SNAKE_CASE`.

A `static` is similar, but it has a fixed memory address for the whole program (`static GREETING: &str = "hi";`). Prefer `const` unless you need that.

## Shadowing

We can shadow a variable by using the same variable’s name and repeating the use of the `let` keyword as follows:

```rust
fn main() {
    let x = 5;
    let x = x + 1;

    {
        let x = x * 2; // shadowing only lasts until the end of the inner scope
        println!("The value of x in the inner scope is: {x}");
    }

    println!("The value of x is: {x}");
}
// The value of x in the inner scope is: 12
// The value of x is: 6
```

Shadowing is different from marking a variable as `mut`, because we’ll get a compile-time error if we accidentally try to reassign to this variable without using the `let` keyword.

Because we’re effectively creating a new variable when we use the `let` keyword again, we can change the type of the value but reuse the same name:

```rust
fn main() {
    let spaces = "   ";          // &str
    let spaces = spaces.len();   // usize

    println!("{spaces}");
}
// 3
```

With `mut` we can change the value, but not the type:

```rust,compile_fail
fn main() {
    let mut spaces = "   ";
    spaces = spaces.len();

    println!("{spaces}");
}
// error[E0308]: mismatched types: expected `&str`, found `usize`
```

## Destructuring

`let` accepts patterns, so several variables can be bound at once:

```rust
fn main() {
    let (x, y) = (1, 2);
    let [first, .., last] = [10, 20, 30, 40];
    let (mut a, b) = (1, "one"); // `mut` applies per binding
    a += 1;

    println!("{x} {y} {first} {last} {a} {b}");
}
// 1 2 10 40 2 one
```

See also [let-else](5_flow.md#let-else) to bind or return early.
