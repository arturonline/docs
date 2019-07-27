# Tooling

## rustup

`rustup` is a command line tool for managing Rust versions and associated tools.

## Updating and Uninstalling

After you’ve installed Rust via `rustup`, updating to the latest version is easy. From your shell, run the following update script:

```bash
rustup update
```

To uninstall Rust and `rustup`, run the following uninstall script from your shell:

```bash
rustup self uninstall
```

## #1: Creating a program **without** `Cargo`

```bash
# compile:
rustc main.rs

# run:
./main.rs
```

## #2: Creating a program **with** `Cargo`

- We can create a new project using `cargo new hello_cargo`
- We can build a project using `cargo build` or `cargo check`.
- We can build and run a project in one step using `cargo run`.
- Instead of saving the result of the build in the same directory as our code, Cargo stores it in the `target/debug` directory.
- When your project is finally ready for release, you can use `cargo build --release` to compile it with optimizations. This command will create an executable in `target/release` instead of `target/debug`.

```bash
cargo new hello_cargo
cargo build
cargo run
cargo check
```

## Cargo as Convention

To work on any existing projects, you can use the following commands to check out the code using Git, change to that project’s directory, and build:

```bash
git clone someurl.com/someproject
cd someproject
cargo build
```

## Local Documentation

The installer also includes a copy of the book and the documentation locally, so you can read it offline:

```bash
# book:
rustup docs --book

# API:
Run rustup doc
```
