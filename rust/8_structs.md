# Structs

> Previous: [Slices](7_slices.md)

A *struct* is a custom data type that groups related values under a name. Unlike a [tuple](3_types.md#tuple-type), each piece of data (*field*) has a name, so the order doesn’t matter.

## Defining and Instantiating

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

fn main() {
    let user1 = User {
        active: true,
        username: String::from("someusername123"),
        email: String::from("someone@example.com"),
        sign_in_count: 1,
    };

    println!("{} <{}> active={} count={}", user1.username, user1.email, user1.active, user1.sign_in_count);
}
// someusername123 <someone@example.com> active=true count=1
```

- Struct names use `PascalCase`, field names `snake_case`.
- Fields are accessed with dot notation: `user1.email`.
- All fields must be initialized.

To change a field, the **whole instance** must be mutable. Rust doesn’t allow marking only certain fields as mutable:

```rust
struct User {
    username: String,
    email: String,
}

fn main() {
    let mut user1 = User {
        username: String::from("someusername123"),
        email: String::from("someone@example.com"),
    };

    user1.email = String::from("anotheremail@example.com");

    println!("{} {}", user1.username, user1.email);
}
// someusername123 anotheremail@example.com
```

## Field Init Shorthand

When a variable has the same name as the field, you can write `email` instead of `email: email`:

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

fn build_user(email: String, username: String) -> User {
    User {
        active: true,
        username, // same as `username: username`
        email,
        sign_in_count: 1,
    }
}

fn main() {
    let user = build_user(String::from("ann@example.com"), String::from("ann"));
    println!("{} {} {} {}", user.username, user.email, user.active, user.sign_in_count);
}
// ann ann@example.com true 1
```

## Struct Update Syntax

`..other` fills the remaining fields from another instance. It must come last:

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

fn main() {
    let user1 = User {
        active: true,
        username: String::from("someusername123"),
        email: String::from("someone@example.com"),
        sign_in_count: 1,
    };

    let user2 = User {
        email: String::from("another@example.com"),
        ..user1
    };

    println!("{} {} {}", user2.username, user2.email, user2.sign_in_count);

    // `active` and `sign_in_count` are Copy, so they are still usable in user1:
    println!("{} {}", user1.active, user1.sign_in_count);
}
// someusername123 another@example.com 1
// true 1
```

> ⚠ The update syntax works like an assignment (`=`): it **moves** the data. Above, `user1.username` (a `String`) was moved into `user2`, so `user1` as a whole and `user1.username` can’t be used anymore. `user1.email` is still valid because `user2` got a new `email`. If only `Copy` fields had been taken, `user1` would still be fully valid. See [Ownership](6_ownership.md#move).

```rust,compile_fail
struct User {
    username: String,
    email: String,
}

fn main() {
    let user1 = User {
        username: String::from("someusername123"),
        email: String::from("someone@example.com"),
    };

    let user2 = User {
        email: String::from("another@example.com"),
        ..user1
    };

    println!("{} {}", user2.email, user1.username);
}
// error[E0382]: borrow of moved value: `user1.username`
```

## Tuple Structs

Tuple structs have a name but their fields don’t. They are useful to give a tuple a distinct type (*newtype* pattern):

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);

    println!("{} {} {}", black.0, black.1, black.2);

    let Point(x, y, z) = origin; // destructuring needs the type name
    println!("{x} {y} {z}");
}
// 0 0 0
// 0 0 0
```

`Color` and `Point` are different types even though they have the same fields: a function taking a `Color` won’t accept a `Point`.

## Unit-Like Structs

Structs without any fields behave like the unit type `()`. They are useful to implement a trait on a type that has no data:

```rust
#[derive(Debug)]
struct AlwaysEqual;

fn main() {
    let subject = AlwaysEqual;
    println!("{subject:?}");
}
// AlwaysEqual
```

## Ownership of Struct Data

In `User` we used the owned `String` type rather than `&str`, so each instance owns all of its data, and that data is valid for as long as the struct is valid.

A struct can store references, but then it needs *lifetimes* to guarantee that the referenced data lives at least as long as the struct:

```rust,compile_fail
struct User {
    username: &str,
    email: &str,
}

fn main() {}
// error[E0106]: missing lifetime specifier
```

```rust
struct User<'a> {
    username: &'a str, // must not outlive the data it points to
}

fn main() {
    let name = String::from("ann");
    let user = User { username: &name };
    println!("{}", user.username);
}
// ann
```

> As a rule of thumb, start with owned types (`String`, `Vec<T>`) in structs.

## Deriving Traits

Structs don’t implement any behavior by default (you can’t print them, compare them or copy them). The `#[derive]` attribute generates common trait implementations:

| Trait       | Gives you                                              |
| ----------- | ------------------------------------------------------ |
| `Debug`     | Printing with `{:?}` / `{:#?}` and `dbg!`              |
| `Clone`     | `.clone()` deep copy                                   |
| `Copy`      | Implicit copy instead of move (only if all fields are `Copy`; requires `Clone`) |
| `PartialEq` | `==` and `!=`                                          |
| `Default`   | `Type::default()` with the default value of each field (0, `false`, `""`…) |

```rust
#[derive(Debug, Clone, PartialEq, Default)]
struct Config {
    name: String,
    verbose: bool,
    retries: u32,
}

#[derive(Debug, Clone, Copy, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let default = Config::default();
    println!("{default:?}");

    // Default + update syntax: set some fields, default the rest
    let custom = Config { name: String::from("app"), ..Default::default() };
    let copy = custom.clone();
    println!("{}", custom == copy);
    println!("{}", custom == default);

    let p1 = Point { x: 1, y: 2 };
    let p2 = p1; // Copy: p1 is still valid
    println!("{p1:?} {p2:?} {}", p1 == p2);
}
// Config { name: "", verbose: false, retries: 0 }
// true
// false
// Point { x: 1, y: 2 } Point { x: 1, y: 2 } true
```

## Printing: {:?}, {:#?} and dbg!

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let scale = 2;
    let rect = Rectangle {
        width: dbg!(30 * scale), // dbg! returns ownership of the value
        height: 50,
    };

    println!("{rect:?}");   // compact
    println!("{rect:#?}");  // pretty-printed
    dbg!(&rect);            // borrow it, so `rect` is not moved
    println!("area: {}", rect.width * rect.height);
}
// stdout:
// Rectangle { width: 60, height: 50 }
// Rectangle {
//     width: 60,
//     height: 50,
// }
// area: 3000
// stderr:
// [src/main.rs:10:16] 30 * scale = 60
// [src/main.rs:16:5] &rect = Rectangle {
//     width: 60,
//     height: 50,
// }
```

- `dbg!` prints to **stderr** with the file and line, and returns the value it receives.
- Printing with `{}` requires implementing the `Display` trait yourself:

```rust
use std::fmt;

struct Point {
    x: i32,
    y: i32,
}

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

fn main() {
    let p = Point { x: 3, y: -1 };
    println!("{p}");
    println!("as string: {}", p.to_string());
}
// (3, -1)
// as string: (3, -1)
```

## Methods

Methods are functions defined inside an `impl` block. Their first parameter is always `self`, the instance the method is called on:

| First parameter | Meaning                             | Typical use                        |
| --------------- | ----------------------------------- | ---------------------------------- |
| `&self`         | Immutable borrow (`self: &Self`)    | Read data (getters, calculations)  |
| `&mut self`     | Mutable borrow (`self: &mut Self`)  | Modify the instance                |
| `self`          | Takes ownership (`self: Self`)      | Transform/consume the instance     |

`Self` is an alias for the type the `impl` block is for.

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }

    fn width(&self) -> bool { // a method can have the same name as a field
        self.width > 0
    }

    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }

    fn scale(&mut self, factor: u32) {
        self.width *= factor;
        self.height *= factor;
    }

    fn into_square(self) -> Rectangle { // consumes `self`
        let side = self.width.max(self.height);
        Rectangle { width: side, height: side }
    }
}

fn main() {
    let mut rect1 = Rectangle { width: 30, height: 50 };
    let rect2 = Rectangle { width: 10, height: 40 };

    println!("area: {}", rect1.area());
    println!("has width: {} ({})", rect1.width(), rect1.width); // method vs field
    println!("can hold rect2: {}", rect1.can_hold(&rect2));

    rect1.scale(2); // Rust borrows `&mut rect1` automatically
    println!("{rect1:?}");

    let square = rect1.into_square();
    println!("{square:?}");
    // rect1 can’t be used anymore: it was moved into `into_square`
}
// area: 1500
// has width: true (30)
// can hold rect2: true
// Rectangle { width: 60, height: 100 }
// Rectangle { width: 100, height: 100 }
```

Rust has **automatic referencing and dereferencing**: `rect1.area()` is the same as `(&rect1).area()` and `Rectangle::area(&rect1)`. You don’t need C++’s `->` operator.

Calling a `&mut self` method on an immutable variable fails:

```rust,compile_fail
struct Counter {
    count: u32,
}

impl Counter {
    fn increment(&mut self) {
        self.count += 1;
    }
}

fn main() {
    let c = Counter { count: 0 };
    c.increment();
}
// error[E0596]: cannot borrow `c` as mutable, as it is not declared as mutable
```

## Associated Functions

Functions in an `impl` block without `self` are *associated functions*. They are called with `::` and are often used as constructors. `new` is a convention, not a keyword:

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn new(width: u32, height: u32) -> Self {
        Self { width, height }
    }

    fn square(size: u32) -> Self {
        Self::new(size, size)
    }
}

fn main() {
    let r = Rectangle::new(3, 4);
    let sq = Rectangle::square(5);
    println!("{r:?} {sq:?}");
    println!("{}", r.width * sq.height);
}
// Rectangle { width: 3, height: 4 } Rectangle { width: 5, height: 5 }
// 15
```

`String::from` and `Vec::new` are associated functions too.

## Multiple impl Blocks

A struct can have several `impl` blocks. It’s the same as having one, but it’s useful to group methods (and it’s needed for trait implementations like `impl fmt::Display for Point`):

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

impl Rectangle {
    fn perimeter(&self) -> u32 {
        2 * (self.width + self.height)
    }
}

fn main() {
    let r = Rectangle { width: 2, height: 3 };
    println!("{} {}", r.area(), r.perimeter());
}
// 6 10
```

## Full Example

A small bank account program that puts everything together:

```rust
use std::fmt;

#[derive(Debug, Clone, PartialEq)]
enum Kind {
    Deposit,
    Withdrawal,
}

#[derive(Debug, Clone, PartialEq)]
struct Transaction {
    kind: Kind,
    amount: u64,
}

#[derive(Debug, Default)]
struct Account {
    owner: String,
    balance: u64, // in cents
    history: Vec<Transaction>,
}

impl Account {
    // associated function (constructor)
    fn new(owner: &str) -> Self {
        Self {
            owner: owner.to_string(),
            ..Default::default()
        }
    }
}

impl Account {
    // &mut self: modifies the account
    fn deposit(&mut self, amount: u64) {
        self.balance += amount;
        self.history.push(Transaction { kind: Kind::Deposit, amount });
    }

    fn withdraw(&mut self, amount: u64) -> Result<(), String> {
        if amount > self.balance {
            return Err(format!("insufficient funds: balance {}, requested {amount}", self.balance));
        }
        self.balance -= amount;
        self.history.push(Transaction { kind: Kind::Withdrawal, amount });
        Ok(())
    }

    // &self: only reads
    fn count(&self, kind: Kind) -> usize {
        self.history.iter().filter(|t| t.kind == kind).count()
    }

    // self: consumes the account and returns its history
    fn close(self) -> Vec<Transaction> {
        println!("closing account of {}", self.owner);
        self.history
    }
}

impl fmt::Display for Account {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}: {}.{:02} €", self.owner, self.balance / 100, self.balance % 100)
    }
}

fn main() {
    let mut account = Account::new("Ann");

    account.deposit(10_000);
    account.deposit(2_550);

    if let Err(e) = account.withdraw(50_000) {
        println!("error: {e}");
    }
    account.withdraw(1_000).unwrap();

    println!("{account}");
    println!("deposits: {}, withdrawals: {}", account.count(Kind::Deposit), account.count(Kind::Withdrawal));
    println!("{:?}", account.history.last());

    let history = account.close();
    // `account` was moved by `close`, it can’t be used anymore
    println!("{} transactions", history.len());
    println!("{history:#?}");
}
// error: insufficient funds: balance 12550, requested 50000
// Ann: 115.50 €
// deposits: 2, withdrawals: 1
// Some(Transaction { kind: Withdrawal, amount: 1000 })
// closing account of Ann
// 3 transactions
// [
//     Transaction {
//         kind: Deposit,
//         amount: 10000,
//     },
//     Transaction {
//         kind: Deposit,
//         amount: 2550,
//     },
//     Transaction {
//         kind: Withdrawal,
//         amount: 1000,
//     },
// ]
```
