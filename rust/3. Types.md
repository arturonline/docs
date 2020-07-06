# Types

Two data type subsets: scalar and compound:

## Scalar types

A scalar type represents a single value. Rust has four primary scalar types:

### Integer Types

An integer is a number without a fractional component.

| Length  | Signe | Unsigned |
| ------- | ----- | -------- |
| 8-bit   | i8    | u8       |
| 16-bit  | i16   | u16      |
| 32-bit  | i32   | u32      |
| 64-bit  | i64   | u64      |
| 128-bit | i128  | u128     |
| arch    | isize | usize    |

| Number literals | Example     |
| --------------- | ----------- |
| Decimal         | 98_222      |
| Hex             | 0xff        |
| Octal           | 0o77        |
| Binary          | 0b1111_0000 |
| Byte (u8 only)  | b'A'        |

So how do you know which type of integer to use? If you’re unsure, Rust’s defaults are generally good choices, and integer types default to `i32`: this type is generally the fastest, even on 64-bit systems. The primary situation in which you’d use `isize` or `usize` is when indexing some sort of collection.

### Floating-Point Types

Rust also has two primitive types for floating-point numbers, which are numbers with decimal points. Rust’s floating-point types are f32 and f64, which are 32 bits and 64 bits in size, respectively. The default type is f64 because on modern CPUs it’s roughly the same speed as f32 but is capable of more precision.

```rust
fn main() {
    let x = 2.0; // f64

    let y: f32 = 3.0; // f32
}
```

### Booleans

```rust
fn main() {
    let t = true;

    let f: bool = false; // with explicit type annotation
}
```

### The Character Type

Rust’s char type is four bytes in size and represents a Unicode Scalar Value, which means it can represent a lot more than just ASCII. Accented letters; Chinese, Japanese, and Korean characters; emoji; and zero-width spaces are all valid char values in Rust.

```rust
fn main() {
  let c = 'z';
  let z = 'ℤ';
  let heart_eyed_cat = '😻';
}
```

## Compound types

### Tuple Type

```rust
fn main() {
    let tup: (i32, f64, u8) = (500, 6.4, 1);
}
```

To get the individual values out of a tuple, we can use pattern matching to destructure a tuple value, like this:

```rust
fn main() {
    let tup = (500, 6.4, 1);
    let (x, y, z) = tup;
    println!("The value of y is: {}", y);
}
```

In addition to destructuring through pattern matching, we can access a tuple element directly by using a period (.) followed by the index of the value we want to access:

```rust
fn main() {
    let x: (i32, f64, u8) = (500, 6.4, 1);
    let five_hundred = x.0;
    let six_point_four = x.1;
    let one = x.2;
}
```

### Array Type

Unlike a tuple, every element of an array must have the same type. Arrays in Rust are different from arrays in some other languages because arrays in Rust have a fixed length, like tuples.

```rust
fn main() {
    let a = [1, 2, 3, 4, 5];
}
```

You would write an array’s type like so:

```rust
let a: [i32; 5] = [1, 2, 3, 4, 5];
```

for initializing an array hat contains the same value for each element:

```rust
let a = [3; 5]; // a = [3, 3, 3, 3, 3];
```
