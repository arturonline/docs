# Control Flow

> Previous: [Functions](4_func.md) | Next: [Ownership](6_ownership.md)

## if Expressions

```rust
fn main() {
    let number = 3;

    if number < 5 {
        println!("condition was true");
    } else {
        println!("condition was false");
    }
}
// condition was true
```

The condition **must** be a `bool`. Unlike other languages, Rust will not convert numbers to booleans:

```rust,compile_fail
fn main() {
    let number = 3;

    if number {
        println!("number was three");
    }
}
// error[E0308]: mismatched types: expected `bool`, found integer
```

Because `if` is an expression, we can use it on the right side of a `let` statement:

```rust
fn main() {
    let condition = true;
    let number = if condition { 5 } else { 6 };

    println!("The value of number is: {number}");
}
// The value of number is: 5
```

Both arms must have the same type: `if condition { 5 } else { "six" }` fails with `error[E0308]: if and else have incompatible types`.

## Handling Multiple Conditions with else if

```rust
fn main() {
    let number = 6;

    if number % 4 == 0 {
        println!("number is divisible by 4");
    } else if number % 3 == 0 {
        println!("number is divisible by 3");
    } else if number % 2 == 0 {
        println!("number is divisible by 2");
    } else {
        println!("number is not divisible by 4, 3, or 2");
    }
}
// number is divisible by 3
```

Only the first matching branch runs. Too many `else if` usually means a `match` is clearer.

## Repeating Code with loop

```rust
fn main() {
    loop {
        println!("again!");
    }
}
// again!
// again!
// ... (forever, stop it with Ctrl+C)
```

The `loop` keyword tells Rust to execute a block of code over and over again forever or until you explicitly tell it to stop. You can place the `break` keyword within the loop to tell the program when to stop executing the loop, and `continue` to skip to the next iteration.

`loop` is an expression: the value after `break` is returned from the loop.

```rust
fn main() {
    let mut counter = 0;

    let result = loop {
        counter += 1;

        if counter == 10 {
            break counter * 2;
        }
    };

    println!("The result is {result}");
}
// The result is 20
```

### Loop labels

`break` and `continue` apply to the innermost loop. Use a label (`'name:`) to target an outer loop:

```rust
fn main() {
    let mut count = 0;
    'counting_up: loop {
        println!("count = {count}");
        let mut remaining = 10;

        loop {
            println!("remaining = {remaining}");
            if remaining == 9 {
                break;
            }
            if count == 2 {
                break 'counting_up;
            }
            remaining -= 1;
        }

        count += 1;
    }
    println!("End count = {count}");
}
// count = 0
// remaining = 10
// remaining = 9
// count = 1
// remaining = 10
// remaining = 9
// count = 2
// remaining = 10
// End count = 2
```

## while

```rust
fn main() {
    let mut number = 3;

    while number != 0 {
        println!("{number}!");

        number -= 1;
    }

    println!("LIFTOFF!!!");
}
// 3!
// 2!
// 1!
// LIFTOFF!!!
```

## Looping through a collection with for

`for` is the safest and most common loop: no index, so no out-of-bounds bugs.

```rust
fn main() {
    let a = [10, 20, 30, 40, 50];

    for element in a {
        println!("the value is: {element}");
    }
}
// the value is: 10
// the value is: 20
// the value is: 30
// the value is: 40
// the value is: 50
```

`for x in a` iterates by value, `for x in &a` (or `a.iter()`) by reference, and `for x in &mut v` (or `v.iter_mut()`) by mutable reference.

Ranges, reverse order and indexes:

```rust
fn main() {
    for number in (1..4).rev() {   // 1..4 excludes 4, 1..=4 includes it
        print!("{number} ");
    }
    println!("LIFTOFF!!!");

    for (i, letter) in ['a', 'b', 'c'].iter().enumerate() {
        print!("{i}:{letter} ");
    }
    println!();

    for n in (0..=10).step_by(5) {
        print!("{n} ");
    }
    println!();
}
// 3 2 1 LIFTOFF!!!
// 0:a 1:b 2:c
// 0 5 10
```

## match

`match` compares a value against a series of patterns and runs the first arm that matches. It must be **exhaustive** (every possible value covered); `_` matches anything.

```rust
fn main() {
    for n in [1, 4, 7, 15, 42] {
        let description = match n {
            1 => "one",
            2 | 3 => "two or three",            // several patterns
            4..=9 => "between four and nine",   // inclusive range
            x if x % 5 == 0 => "multiple of 5", // match guard
            _ => "something else",              // catch-all
        };
        println!("{n}: {description}");
    }
}
// 1: one
// 4: between four and nine
// 7: between four and nine
// 15: multiple of 5
// 42: something else
```

`match` also destructures tuples, structs and enums such as `Option`:

```rust
fn main() {
    let point = (0, 7);
    match point {
        (0, y) => println!("on the y axis at {y}"),
        (x, 0) => println!("on the x axis at {x}"),
        (x, y) => println!("at ({x}, {y})"),
    }

    let maybe: Option<i32> = Some(3);
    match maybe {
        Some(n) => println!("got {n}"),
        None => println!("nothing"),
    }
}
// on the y axis at 7
// got 3
```

## if let and while let

`if let` is a shorter `match` when you only care about one pattern:

```rust
fn main() {
    let config_max: Option<u8> = Some(3);

    if let Some(max) = config_max {
        println!("The maximum is configured to be {max}");
    } else {
        println!("No maximum");
    }

    let mut stack = vec![1, 2, 3];
    while let Some(top) = stack.pop() { // loops while the pattern matches
        print!("{top} ");
    }
    println!();
}
// The maximum is configured to be 3
// 3 2 1
```

Since Rust 1.88 (edition 2024) `if let` conditions can be chained with `&&` (*let chains*):

```rust
fn main() {
    let name: Option<&str> = Some("Ferris");

    if let Some(n) = name && n.starts_with('F') {
        println!("Hello, {n}!");
    }
}
// Hello, Ferris!
```

## let-else

`let PATTERN = expr else { ... };` binds the variables if the pattern matches; otherwise the `else` block runs, and it **must** diverge (`return`, `break`, `continue` or `panic!`). It avoids nesting the happy path inside `if let`:

```rust
fn parse_age(input: &str) -> Option<u32> {
    let Ok(age) = input.trim().parse::<u32>() else {
        println!("'{input}' is not a valid age");
        return None;
    };

    // `age` is available here, without extra indentation
    Some(age)
}

fn main() {
    println!("{:?}", parse_age("42"));
    println!("{:?}", parse_age("abc"));
}
// Some(42)
// 'abc' is not a valid age
// None
```
