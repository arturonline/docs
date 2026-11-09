# Errors

In other languages, you are uncertain if a function may throw an exception or not. Instead of throwing exceptions, Go functions support multiple return values, and by convention, this ability is commonly used to return the function's result along with an error variable (always the **last** return value). By convention, returning an error signals the caller there was a problem, and returning nil represents no error.

```go
i, err := strconv.Atoi("42")
if err != nil {
    fmt.Printf("couldn't convert number: %v\n", err)
    return
}
fmt.Println("Converted integer:", i)
```

**Errors are values**: they are ordinary values you can store, compare, wrap and pass around, not a special control-flow mechanism.

## The error Interface

The `error` type is a built-in interface similar to `fmt.Stringer`:

```go
type error interface {
    Error() string
}
```

Any type implementing this one method is a valid error value, and can be returned as such.

The most commonly used implementation of the error interface is the unexported `errorString` struct in the `errors` package (what `errors.New` returns):

```go
// errorString is a trivial implementation of error.
type errorString struct {
    s string
}

func (e *errorString) Error() string {
    return e.s
}
```

## 2 simple ways to create an error

### #1: `errors.New` and `fmt.Errorf`

`errors.New` just holds a string, and that string is returned by the Error method. Use `fmt.Errorf` when you need formatting (or wrapping, see below):

```go
// simple string
err1 := errors.New("math: square root of negative number")

// with formatting
err2 := fmt.Errorf("math: square root of negative number %g", x)
```

>💡 Convention: error strings are lowercase and without trailing punctuation, because they are usually concatenated: `open config: permission denied`.

### #2: Implement your own errors with data

To define a custom error type, you must satisfy the predeclared `error` interface. Custom types let callers get structured data (line numbers, status codes...) out of the error.

Here are two examples.

```go
type SyntaxError struct {
    Line int
    Col  int
}

func (e *SyntaxError) Error() string {
    return fmt.Sprintf("%d:%d: syntax error", e.Line, e.Col)
}
```

```go
type InternalError struct {
    Path string
}

func (e *InternalError) Error() string {
    return fmt.Sprintf("parse %v: internal error", e.Path)
}
```

If Foo is a function that can return a SyntaxError or an InternalError, you may handle the two cases like this.

```go
if err := Foo(); err != nil {
    switch e := err.(type) {
    case *SyntaxError:
        // Do something interesting with e.Line and e.Col.
    case *InternalError:
        // Abort and file an issue.
    default:
        log.Println(e)
    }
}
```

>⚠️ A type switch (or `err == X`) only looks at the outermost error. If the error was wrapped, it won't match: use `errors.Is` / `errors.As` (below).

>⚠️ When the function's return type is `error`, `return nil` explicitly — never return a nil `*SyntaxError` variable, or the caller's `err != nil` will be true (see "Nil interface vs interface holding a nil pointer" in the interfaces notes).

## Sentinel errors

A sentinel error is a package-level error value that callers can check for. By convention named `ErrXxx`: `io.EOF`, `sql.ErrNoRows`, `fs.ErrNotExist`.

```go
var ErrNotFound = errors.New("not found")
```

## Wrapping errors (`%w`)

Add context while keeping the original error inspectable by using the `%w` verb in `fmt.Errorf`. `%v` would only copy the text and **break** the chain.

```go
package main

import (
    "errors"
    "fmt"
    "io/fs"
    "os"
)

var ErrNotFound = errors.New("not found")

func findUser(id int) error {
    return fmt.Errorf("findUser %d: %w", id, ErrNotFound)
}

func main() {
    err := findUser(42)
    fmt.Println(err)
    fmt.Println(errors.Is(err, ErrNotFound)) // walks the chain
    fmt.Println(err == ErrNotFound)          // only compares the outer error
    fmt.Println(errors.Unwrap(err) == ErrNotFound)

    _, err = os.Open("missing.txt")
    fmt.Println(errors.Is(err, fs.ErrNotExist))
}
// findUser 42: not found
// true
// false
// true
// true
```

>💡 Wrapping makes the inner error part of your API. Use `%v` instead of `%w` when you deliberately want to hide an implementation detail.

## errors.Is and errors.As

- `errors.Is(err, target)`: is there an error in the chain **equal** to `target`? Use it for sentinel errors.
- `errors.As(err, &target)`: is there an error in the chain of **type** `target`? If so, it is assigned to `target`. Use it for custom error types.

```go
package main

import (
    "errors"
    "fmt"
)

type ValidationError struct {
    Field string
    Msg   string
}

func (e *ValidationError) Error() string {
    return e.Field + ": " + e.Msg
}

func validate(age int) error {
    if age < 0 {
        return &ValidationError{Field: "age", Msg: "must be >= 0"}
    }
    return nil
}

func main() {
    err := fmt.Errorf("create user: %w", validate(-1))

    var ve *ValidationError
    if errors.As(err, &ve) {
        fmt.Println("field:", ve.Field)
    }
    fmt.Println(err)
}
// field: age
// create user: age: must be >= 0
```

>💡 The second argument of `errors.As` must be a **pointer** to a variable of the error type (here `**ValidationError`), otherwise it panics. Go 1.26 adds the generic `errors.AsType[*ValidationError](err)`, which returns `(ve, ok)`.

## Multiple errors: errors.Join and multiple `%w`

Since Go 1.20 an error can wrap several errors, and `errors.Is`/`errors.As` check all of them.

```go
package main

import (
    "errors"
    "fmt"
)

func main() {
    errDisk := errors.New("disk full")
    errNet := errors.New("network down")

    joined := errors.Join(errDisk, errNet) // nil values are ignored
    fmt.Println(joined)                    // messages separated by newlines
    fmt.Println(errors.Is(joined, errNet))

    multi := fmt.Errorf("sync failed: %w; %w", errDisk, errNet)
    fmt.Println(multi)
    fmt.Println(errors.Is(multi, errDisk))
    fmt.Println(errors.Unwrap(multi) == nil)
}
// disk full
// network down
// true
// sync failed: disk full; network down
// true
// true
```

`errors.Unwrap` returns nil for these: multi-errors implement `Unwrap() []error` instead of `Unwrap() error`. `errors.Join` is handy to collect errors in a loop: `errs = errors.Join(errs, err)`.

## Handling patterns

```go
func loadConfig(path string) (*Config, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, fmt.Errorf("load config %q: %w", path, err) // add context, return early
    }

    var cfg Config
    if err := json.Unmarshal(data, &cfg); err != nil {
        return nil, fmt.Errorf("parse config %q: %w", path, err)
    }
    return &cfg, nil // happy path stays unindented
}
```

- Check errors immediately and **return early**; keep the happy path at the left margin.
- **Add context** when passing an error up (`fmt.Errorf("doing X: %w", err)`).
- **Handle an error once**: either log it or return it, not both (otherwise it is logged at every level).
- Compare with `errors.Is` / `errors.As`, never by matching `err.Error()` strings.
- Don't ignore errors silently with `_`; if you really mean to, leave a comment.
- `defer f.Close()` is fine for reads; for writes, check the `Close` error too.

## panic and recover

`panic` stops normal execution, runs deferred functions, and crashes the program with a stack trace. It is for **programmer bugs and impossible states** (index out of range, nil map write, broken invariants), not for normal errors like "file not found" or bad user input. Those are returned as `error`.

`recover`, called **inside a deferred function**, stops the panic and returns the value passed to `panic` (or `nil` if there is no panic). It's typically used at boundaries (an HTTP server recovering per request, a worker goroutine) to turn a panic into an error.

```go
package main

import "fmt"

func safeDivide(a, b int) (result int, err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("recovered: %v", r) // named result lets us set the error
        }
    }()
    return a / b, nil
}

func main() {
    fmt.Println(safeDivide(10, 2))
    fmt.Println(safeDivide(1, 0))
}
// 5 <nil>
// 0 recovered: runtime error: integer divide by zero
```

- `recover` only works in the same goroutine that panicked; a panic in another goroutine with no recover crashes the whole program.
- `Must` helpers (`regexp.MustCompile`, `template.Must`) panic on error: use them only with constant inputs at init time.
