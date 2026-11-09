# Tooling

> Next: [Variables](2_variables.md)

## rustup

`rustup` is a command line tool for managing Rust versions (toolchains) and associated tools (components).

```bash
# install (Linux / macOS). On Windows download and run rustup-init.exe from https://rustup.rs
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

rustc --version          # rustc 1.xx.0 (...)
cargo --version          # cargo 1.xx.0 (...)
rustup show              # installed toolchains and the active one
```

### Toolchains and components

```bash
rustup toolchain list            # installed toolchains
rustup toolchain install nightly # install another toolchain
rustup default stable            # set the default toolchain
cargo +nightly build             # use a toolchain for a single command
rustup override set nightly      # use a toolchain only in the current directory

rustup component add clippy rustfmt rust-analyzer
rustup target add wasm32-unknown-unknown   # cross-compilation target
```

## Updating and Uninstalling

After you’ve installed Rust via `rustup`, updating to the latest version is easy. From your shell, run:

```bash
rustup update
```

To uninstall Rust and `rustup`, run the following from your shell:

```bash
rustup self uninstall
```

## #1: Creating a program **without** `Cargo`

```rust
// main.rs
fn main() {
    println!("Hello, world!");
}
// Hello, world!
```

```bash
# compile:
rustc main.rs

# run (Linux / macOS):
./main

# run (Windows):
.\main.exe
```

`rustc` is fine for a single file, but for anything bigger use Cargo.

## #2: Creating a program **with** `Cargo`

Cargo is Rust’s build system and package manager.

- We can create a new project using `cargo new hello_cargo` (binary) or `cargo new my_lib --lib` (library).
- We can build a project using `cargo build`, or just type-check it (faster, no binary) with `cargo check`.
- We can build and run a project in one step using `cargo run`.
- Instead of saving the result of the build in the same directory as our code, Cargo stores it in the `target/debug` directory.
- When your project is finally ready for release, you can use `cargo build --release` to compile it with optimizations. This command will create an executable in `target/release` instead of `target/debug`.

```bash
cargo new hello_cargo
cd hello_cargo
cargo build
cargo run
cargo check
cargo build --release
cargo run --release
cargo run -- arg1 arg2   # arguments after `--` are passed to your program
```

`cargo new` creates this layout (and initializes a Git repository):

```text
hello_cargo
├── Cargo.toml
├── .gitignore
└── src
    └── main.rs
```

```toml
# Cargo.toml
[package]
name = "hello_cargo"
version = "0.1.0"
edition = "2024"

[dependencies]
```

The `edition` field selects the Rust edition (`2015`, `2018`, `2021`, `2024`). New projects use the latest one; editions are opt-in and crates of different editions can depend on each other.

```bash
cargo run
#    Compiling hello_cargo v0.1.0 (/path/hello_cargo)
#     Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.50s
#      Running `target/debug/hello_cargo`
# Hello, world!
```

## Dependencies

Dependencies (crates) come from [crates.io](https://crates.io). `cargo add` edits `Cargo.toml` for you:

```bash
cargo add rand                      # latest compatible version
cargo add serde --features derive   # with features
cargo add tokio@1 --features full   # specific version
cargo add --dev pretty_assertions   # [dev-dependencies]
cargo remove rand
cargo update                        # update Cargo.lock to the newest compatible versions
cargo tree                          # show the dependency tree
```

```toml
[dependencies]
rand = "0.9"
serde = { version = "1", features = ["derive"] }
```

## Formatting, linting, testing and docs

```bash
cargo fmt               # format the code with rustfmt
cargo fmt --check       # only check (useful in CI)
cargo clippy            # linter with hundreds of extra lints
cargo clippy --fix      # apply the suggested fixes automatically
cargo fix --edition     # help migrating code to the next edition
cargo test              # run unit, integration and doc tests
cargo doc --open        # build the docs of your crate and dependencies
cargo install ripgrep   # install a binary crate into ~/.cargo/bin
```

## Cargo as Convention

To work on any existing project, you can use the following commands to check out the code using Git, change to that project’s directory, and build:

```bash
git clone someurl.com/someproject
cd someproject
cargo build
```

## Local Documentation

The installer also includes a copy of the book and the documentation locally, so you can read it offline:

```bash
# book:
rustup doc --book

# standard library API:
rustup doc --std

# all the local documentation:
rustup doc
```
