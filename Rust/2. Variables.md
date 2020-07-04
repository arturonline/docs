# Variables

By default variables are immutable. When a variable is immutable, once a value is bound to a name, you can’t change that value.

```rust
fn main() {
    let x = 5;
    println!("The value of x is: {}", x);
    x = 6;
    println!("The value of x is: {}", x);
}

// error: cannot assign twice to immutable variable `x`
```

You can make variables mutable by adding `mut` in front of the variable name.

```rust
fn main() {
    let mut x = 5;
    println!("The value of x is: {}", x);
    x = 6;
    println!("The value of x is: {}", x);
}
// The value of x is: 5
// The value of x is: 6
```

## Variables vs Constants

You declare constants using the `const` keyword instead of the `let` keyword, and the type of the value must be annotated:

```rust
const MAX_POINTS: u32 = 100_000;
```

Constants are not allowed to use `mut`.

## Shadowing

We can shadow a variable by using the same variable’s name and repeating the use of the `let` keyword as follows:

```rust
fn main() {
    let x = 5;
    let x = x + 1;
    let x = x * 2;

    println!("The value of x is: {}", x);
}
// The value of x is: 12
```

Shadowing is different from marking a variable as `mut`, because we’ll get a compile-time error if we accidentally try to reassign to this variable without using the `let` keyword.

Because we’re effectively creating a new variable when we use the `let` keyword again, we can change the type of the value but reuse the same name:

```rust
let spaces = "   ";
let spaces = spaces.len();

println!("{}", spaces);
// 3
```

```rust
let mut spaces = "   ";
spaces = spaces.len();

println!("{}", spaces);
// error: mismatched types
```
