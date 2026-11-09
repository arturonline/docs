# Types

> Previous: [Variables](2_variables.md) | Next: [Functions](4_func.md)

Two data type subsets: scalar and compound.

## Scalar types

A scalar type represents a single value. Rust has four primary scalar types: integers, floating-point numbers, Booleans, and characters.

### Integer Types

An integer is a number without a fractional component.

| Length  | Signed | Unsigned |
| ------- | ------ | -------- |
| 8-bit   | i8     | u8       |
| 16-bit  | i16    | u16      |
| 32-bit  | i32    | u32      |
| 64-bit  | i64    | u64      |
| 128-bit | i128   | u128     |
| arch    | isize  | usize    |

Signed types store numbers from -(2<sup>n-1</sup>) to 2<sup>n-1</sup> - 1 (`i8`: -128 to 127); unsigned types from 0 to 2<sup>n</sup> - 1 (`u8`: 0 to 255). `isize`/`usize` are 64 bits on a 64-bit architecture and 32 bits on a 32-bit one.

| Number literals | Example     |
| --------------- | ----------- |
| Decimal         | 98_222      |
| Hex             | 0xff        |
| Octal           | 0o77        |
| Binary          | 0b1111_0000 |
| Byte (u8 only)  | b'A'        |

Literals can have a type suffix (`57u8`, `1_000i64`) and `_` is a visual separator (`1_000_000`).

So how do you know which type of integer to use? If you’re unsure, Rust’s defaults are generally good choices, and integer types default to `i32`. The primary situation in which you’d use `isize` or `usize` is when indexing some sort of collection.

```rust
fn main() {
    println!("{} {}", i8::MIN, i8::MAX);
    println!("{}", u32::MAX);
    println!("{} {} {} {}", 0xff, 0o77, 0b1111_0000, b'A');
}
// -128 127
// 4294967295
// 255 63 240 65
```

### Integer Overflow

In debug builds an overflow panics (`attempt to add with overflow`); in release builds (`--release`) it silently wraps around. To make the behaviour explicit use these methods:

```rust
fn main() {
    let x: u8 = 250;

    println!("{}", x.wrapping_add(10));    // wraps around
    println!("{:?}", x.checked_add(10));   // None on overflow
    println!("{:?}", x.overflowing_add(10)); // value + overflow flag
    println!("{}", x.saturating_add(10));  // clamps at the max value
}
// 4
// None
// (4, true)
// 255
```

### Floating-Point Types

Rust also has two primitive types for floating-point numbers, which are numbers with decimal points. Rust’s floating-point types are `f32` and `f64`, which are 32 bits and 64 bits in size, respectively. The default type is `f64` because on modern CPUs it’s roughly the same speed as `f32` but is capable of more precision.

```rust
fn main() {
    let x = 2.0; // f64

    let y: f32 = 3.0; // f32

    println!("{x} {y}");
    println!("{:.3}", 1.0_f64 / 3.0); // 3 decimals
}
// 2 3
// 0.333
```

### Numeric Operations

```rust
fn main() {
    let sum = 5 + 10;
    let difference = 95.5 - 4.3;
    let product = 4 * 30;
    let quotient = 56.7 / 32.2;
    let truncated = -5 / 3; // integer division truncates toward zero
    let remainder = 43 % 5;

    println!("{sum} {difference} {product} {quotient:.2} {truncated} {remainder}");
}
// 15 91.2 120 1.76 -1 3
```

Rust never converts between numeric types implicitly. Use `as` for primitive casts (it may truncate) or `From`/`TryFrom` for checked conversions:

```rust
fn main() {
    let a: i32 = 300;
    let b = a as u8;                // truncates: 300 % 256
    let c = 3.99_f64 as i32;        // drops the decimals
    let d: i64 = i64::from(a);      // lossless conversion
    let e = u8::try_from(a);        // fails because 300 > 255

    println!("{b} {c} {d} {e:?}");
}
// 44 3 300 Err(TryFromIntError(()))
```

### Booleans

```rust
fn main() {
    let t = true;

    let f: bool = false; // with explicit type annotation

    println!("{} {} {}", t && f, t || f, !t);
}
// false true false
```

### The Character Type

Rust’s `char` type is four bytes in size and represents a Unicode Scalar Value, which means it can represent a lot more than just ASCII. Accented letters; Chinese, Japanese, and Korean characters; emoji; and zero-width spaces are all valid `char` values in Rust. `char` literals use single quotes, string literals use double quotes.

```rust
fn main() {
    let c = 'z';
    let z = 'ℤ';
    let heart_eyed_cat = '😻';

    println!("{c} {z} {heart_eyed_cat}");
    println!("{}", 'a'.is_alphabetic());
    println!("{}", 'A' as u32);
    println!("{}", std::mem::size_of::<char>());
}
// z ℤ 😻
// true
// 65
// 4
```

## Compound types

Compound types can group multiple values into one type.

### Tuple Type

A tuple groups values of different types. It has a fixed length.

```rust
fn main() {
    let tup: (i32, f64, u8) = (500, 6.4, 1);

    println!("{tup:?}"); // tuples are printed with the Debug formatter {:?}
}
// (500, 6.4, 1)
```

To get the individual values out of a tuple, we can use pattern matching to destructure a tuple value, like this:

```rust
fn main() {
    let tup = (500, 6.4, 1);
    let (x, y, z) = tup;
    println!("The value of y is: {y}");
    println!("{x} {z}");
}
// The value of y is: 6.4
// 500 1
```

In addition to destructuring through pattern matching, we can access a tuple element directly by using a period (`.`) followed by the index of the value we want to access:

```rust
fn main() {
    let x: (i32, f64, u8) = (500, 6.4, 1);
    let five_hundred = x.0;
    let six_point_four = x.1;
    let one = x.2;

    println!("{five_hundred} {six_point_four} {one}");
}
// 500 6.4 1
```

The tuple without any values, `()`, is called *unit*. It represents an empty value or an empty return type; expressions that don’t return anything implicitly return `()`.

### Array Type

Unlike a tuple, every element of an array must have the same type. Arrays in Rust are different from arrays in some other languages because arrays in Rust have a fixed length, like tuples. They are allocated on the stack. If you need a collection that can grow, use a vector (`Vec<T>`).

```rust
fn main() {
    let a = [1, 2, 3, 4, 5];
    println!("{a:?} len={}", a.len());
}
// [1, 2, 3, 4, 5] len=5
```

You would write an array’s type like so, `[type; length]`:

```rust
let a: [i32; 5] = [1, 2, 3, 4, 5];
```

For initializing an array that contains the same value for each element:

```rust
let a = [3; 5]; // a = [3, 3, 3, 3, 3];
```

Elements are accessed by index, starting at 0:

```rust
fn main() {
    let months = ["January", "February", "March"];

    let first = months[0];
    let second = months[1];
    println!("{first} {second}");

    // `get` returns an Option instead of panicking
    println!("{:?} {:?}", months.get(2), months.get(10));
}
// January February
// Some("March") None
```

Accessing an index past the end is checked: if the index is known at compile time it is a compile error, otherwise the program panics at runtime (Rust never reads invalid memory):

```rust
fn main() {
    let a = [1, 2, 3, 4, 5];
    let index = "10".parse::<usize>().unwrap(); // value known only at runtime

    let element = a[index];
    println!("{element}");
}
// thread 'main' panicked at src/main.rs:5:19:
// index out of bounds: the len is 5 but the index is 10
```

See [Slices](7_slices.md) to borrow a part of an array.
