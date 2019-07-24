# The Slice Type

Slices let you reference a contiguous sequence of elements in a collection rather than the whole collection.

## String Slices

```rust
let s = String::from("hello world");

let hello = &s[0..5];
let world = &s[6..11];
```

We can create slices using a range within brackets by specifying `[starting_index..ending_index]`, where:

- starting_index is the first position in the slice and
- ending_index is one more than the last position in the slice.

Internally, the slice data structure stores the starting position and the length of the slice.

<img src="resources/slices.svg" width="400" height="400">

## Range syntax

These pairs are equal:

```rust
let s = String::from("hello");
let len = s.len();

// from start
let slice = &s[0..2];
let slice = &s[..2];

//to the end
let slice = &s[3..len];
let slice = &s[3..];

// Entire string
let slice = &s[0..len];
let slice = &s[..];
```

## Other Slices

String slices, as you might imagine, are specific to strings. But there’s a more general slice type, too. Consider this array:

```rust
let a = [1, 2, 3, 4, 5]
```

Just as we might want to refer to a part of a string, we might want to refer to part of an array. We’d do so like this:

```rust
let a = [1, 2, 3, 4, 5];

let slice = &a[1..3];
```

This slice has the type `&[i32]`. It works the same way as string slices do, by storing a reference to the first element and a length. You’ll use this kind of slice for all sorts of other collections.

## Slice methods

> [Rust official doc](https://doc.rust-lang.org/std/primitive.slice.html)

```rust
use std::mem;

// This function borrows a slice
fn analyze_slice(slice: &[i32]) {
    println!("first element of the slice: {}", slice[0]);
    println!("the slice has {} elements", slice.len());
}

fn main() {
    // Fixed-size array (type signature is superfluous)
    let xs: [i32; 5] = [1, 2, 3, 4, 5];

    // All elements can be initialized to the same value
    let ys: [i32; 500] = [0; 500];

    // Indexing starts at 0
    println!("first element of the array: {}", xs[0]);
    println!("second element of the array: {}", xs[1]);

    // `len` returns the size of the array
    println!("array size: {}", xs.len());

    // Arrays are stack allocated
    println!("array occupies {} bytes", mem::size_of_val(&xs));

    // Arrays can be automatically borrowed as slices
    println!("borrow the whole array as a slice");
    analyze_slice(&xs);

    // Slices can point to a section of an array
    println!("borrow a section of the array as a slice");
    analyze_slice(&ys[1 .. 4]);

    // Out of bound indexing causes compile error
    println!("{}", xs[4]);
}
// first element of the array: 1
// second element of the array: 2
// array size: 5
// array occupies 20 bytes
// borrow the whole array as a slice
// first element of the slice: 1
// the slice has 5 elements
// borrow a section of the array as a slice
// first element of the slice: 0
// the slice has 3 elements
// 5
```
