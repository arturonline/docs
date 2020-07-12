# Errors

In other languages, you are uncertain if a function may throw an exception or not. Instead of throwing exceptions, Go functions support multiple return values, and by convention, this ability is commonly used to return the function’s result along with an error variable. By convention, returning an error signals the caller there was a problem, and returning nil represents no error.

```go
i, err := strconv.Atoi("42")
if err != nil {
    fmt.Printf("couldn't convert number: %v\n", err)
    return
}
fmt.Println("Converted integer:", i)
```

## The error Interface

The `error` type is a built-in interface similar to `fmt.Stringer`:

```go
type error interface {
    Error() string
}
```

Any struct implementing this one method is considered a valid error value, and can be returned as such.

The most commonly used and widespread implementation of the error interface is the built-in errorString struct.

```go
// errorString is a trivial implementation of error.
type errorString struct {
    s string
}
```

## 2 simple ways to create an error

### #1: The built-in `errorString` struct

All it does is hold a string, and that string is returned by the Error method. You can use the built-in `errors.New` or `Errorf`:

```go
// simple string
err1 := errors.New("math: square root of negative number")

// with formatting
err2 := fmt.Errorf("math: square root of negative number %g", x)
```

### #2: Implement your own errors with data

To define a custom error type, you must satisfy the predeclared error interface.

```go
type error interface {
    Error() string
}
```

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
