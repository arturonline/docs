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
