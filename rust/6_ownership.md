# The Borrow checker

The borrow checker is the component in the Rust compiler that enforces this data ownership rules:

1. Each value in Rust has a variable that is called its owner.
1. There can only be one owner at a time.
1. When the owner goes out of scope, the value will be dropped.
1. If we have an immutable reference to something, we cannot also take a mutable reference.

## Variable Scope

A variable is valid from the point at which it’s declared until the end of the current scope.

```rust
fn main() {
{
// s is not valid here, it’s not yet declared
    let s = "hello";   // s is valid from this point forward
}
// this scope is now over, and s is no longer valid
}
```

## Move

Integers are simple values with a known fixed size. They can be copied:

```rust
let x = 5; // x = 5
let y = x; // y = 5
```

In this example the second line makes a copy of the value in `x` into `y`. Both variables then are equal to 5.

But with complex data types are different:

```rust
let s1 = String::from("hello");
let s2 = s1; // s1 was moved into s2
```

This looks very similar to the previous code, so we might assume that the way it works would be the same: that is, the second line would make a copy of the value in `s1` and bind it to `s2`. But this isn’t true.

Complex data types are allocated on the heap, like the `String` type. A String is made up of three parts: a *pointer* to the memory that holds the contents of the string, a *length*, and a *capacity*. When we assign `s1` to `s2`, we copy the *pointer*, the *length*, and the *capacity* that are on the stack. We do not copy the data on the heap that the pointer refers to. Instead Rust considers `s1` to no longer be valid. Rust invalidation of the first variable it’s known as a **move**. In this example, we would say that `s1` was moved into `s2`.

![after](resources/ownership2.svg)

## Clone

If we do want to deeply copy the heap data of the String, not just the stack data, we can use a common method called clone.

```rust
let s1 = String::from("hello");
let s2 = s1.clone();

println!("s1 = {}, s2 = {}", s1, s2);
```

>⚠ If you’ve heard the terms *shallow copy* and deep copy while working with other languages, the concept of copying the pointer, length, and capacity without copying the data probably sounds like making a *shallow copy*. But because Rust also invalidates the first variable, instead of being called a *shallow copy*, it’s known as a **move**.

## Ownership and Functions

The semantics for passing a value to a function are similar to those for assigning a value to a variable:

- Simple values -> Are copied.
- Complex types -> Are moved.

```rust
fn main() {
    let s = String::from("hello");  // s comes into scope

    takes_ownership(s);             // s's value moves into the function...
                                    // ... and so is no longer valid here

    let x = 5;                      // x comes into scope

    makes_copy(x);                  // x would move into the function,
                                    // but i32 is a stack value, so it’s okay to still
                                    // use x afterward

} // Here, x goes out of scope, then s. But because s's value was moved, nothing
  // special happens.

fn takes_ownership(some_string: String) { // some_string comes into scope
    println!("{}", some_string);
} // Here, some_string goes out of scope and `drop` is called. The backing
  // memory is freed.

fn makes_copy(some_integer: i32) { // some_integer comes into scope
    println!("{}", some_integer);
} // Here, some_integer goes out of scope. Nothing special happens.
```

If we tried to use `s` after the call to `takes_ownership`, Rust would throw a compile-time error. These static checks protect us from mistakes.

## Return values and Scope

```rust
fn main() {
    let s1 = gives_ownership();         // gives_ownership moves its return
                                        // value into s1

    let s2 = String::from("hello");     // s2 comes into scope

    let s3 = takes_and_gives_back(s2);  // s2 is moved into
                                        // takes_and_gives_back, which also
                                        // moves its return value into s3
} // Here, s3 goes out of scope and is dropped. s2 goes out of scope but was
  // moved, so nothing happens. s1 goes out of scope and is dropped.

fn gives_ownership() -> String {             // gives_ownership will move its
                                             // return value into the function
                                             // that calls it

    let some_string = String::from("hello"); // some_string comes into scope

    some_string                              // some_string is returned and
                                             // moves out to the calling
                                             // function
}

// takes_and_gives_back will take a String and return one
fn takes_and_gives_back(a_string: String) -> String { // a_string comes into
                                                      // scope

    a_string  // a_string is returned and moves out to the calling function
}
```

## References and Borrowing

Taking ownership and then returning ownership with every function is a bit tedious. What if we want to let a function use a value but not take ownership? It’s quite annoying that anything we pass in also needs to be passed back if we want to use it again, in addition to any data resulting from the body of the function that we might want to return as well.

In rust a `&` is called a *reference*. A reference is like a pointer in c++ but pass-by-value. We call having references as function parameters **borrowing**. As in real life, if a person owns something, you can borrow it from them. When you’re done, you have to give it back.

```rust
let s1 = String::from("hello");
let len = calculate_length(&s1);

fn calculate_length(s: &String) -> usize { // s is a reference to a String
    s.len()
} // Here, s goes out of scope. But because it does not have ownership of what
  // it refers to, nothing happens.
```

The `&s1` syntax lets us create a reference that refers to the value of `s1` but does not own it. Because it does not own it, the value it points to will not be dropped when the reference goes out of scope.

Just as variables are immutable by default, so are references. We’re not allowed to modify something we have borrow.

## Mutable References

Just as variables are immutable by default, so are references. We’re not allowed to modify something we have a reference to. To do so, you have to create a mutable reference `&mut`:

```rust
fn main() {
    let mut s = String::from("hello");

    change(&mut s);
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
```

But mutable references have one big restriction: you can have only one mutable reference to a particular piece of data in a particular scope. This code will fail:

```rust
let mut s = String::from("hello");

let r1 = &mut s;
let r2 = &mut s;

println!("{}, {}", r1, r2);
// error[E0499]: cannot borrow `s` as mutable more than once at a time
```

The benefit of having this restriction is that Rust can prevent data races at compile time.

We can use curly brackets to create a new scope, allowing for multiple mutable references, just not simultaneous ones:

```rust
let mut s = String::from("hello");

{
    let r1 = &mut s;

} // r1 goes out of scope here, so we can make a new reference with no problems.

let r2 = &mut s;
```

A similar rule exists for combining mutable and immutable references. This code results in an error:

```rust
let mut s = String::from("hello");

let r1 = &s; // no problem
let r2 = &s; // no problem
let r3 = &mut s; // BIG PROBLEM

println!("{}, {}, and {}", r1, r2, r3);
// error[E0502]: cannot borrow `s` as mutable because it is also borrowed as immutable

```

Multiple immutable references are okay because no one who is just reading the data has the ability to affect anyone else’s reading of the data.

Note that a reference's scope starts from where it is introduced and continues through the last time that reference is used. For instance, this code will compile because the last usage of the immutable references occurs before the mutable reference is introduced:

```rust
let mut s = String::from("hello");

let r1 = &s; // no problem
let r2 = &s; // no problem
println!("{} and {}", r1, r2);
// r1 and r2 are no longer used after this point

let r3 = &mut s; // no problem
println!("{}", r3);
```

## The Rules of References

Let’s recap what we’ve discussed about references:

1. At any given time, you can have either one mutable reference or any number of immutable references.
2. References must always be valid.