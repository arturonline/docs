# Generics

Generics in Go, introduced in Go **1.18**, are a powerful feature that allows you to write functions and data structures that can work with any type, provided by the calling code. This enhances code reusability and type safety without sacrificing simplicity.

## Key Concepts

Functions and types can have type parameters, which are placeholders for any type. For example:

```go
func Print[T any](item T) {
    fmt.Println(item)
}
```

You can define constraints to restrict the types that can be used with a type parameter. For example:

```go
func Min[T constraints.Ordered](a, b T) T {
    if a < b {
        return a
    }
    return b
}
```

When calling a generic function, you can specify the type argument. For example:

```go
x := Min[int](2, 3)
```

Go can often infer the type arguments, so you don't always need to specify them explicitly.

## Example

```go
package main

import (
    "fmt"
    "golang.org/x/exp/constraints"
)

// Generic function to find the minimum value
func Min[T constraints.Ordered](a, b T) T {
    if a < b {
        return a
    }
    return b
}

func main() {
    fmt.Println(Min[int](2, 3)) // Output: 2
    fmt.Println(Min[float64](2.71, 3.14)) // Output: 2.71
}
```