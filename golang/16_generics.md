# Generics

Generics in Go, introduced in Go **1.18**, allow you to write functions and data structures that work with many types, provided by the calling code. This improves code reuse and type safety (no `interface{}` + type assertions) without sacrificing simplicity.

## Key Concepts

Functions and types can have **type parameters** (in square brackets), placeholders for a type chosen by the caller. For example:

```go
func Print[T any](item T) {
    fmt.Println(item)
}
```

`any` is an alias for `interface{}`: any type is allowed.

A **constraint** restricts the types that can be used with a type parameter. For example, `cmp.Ordered` (Go 1.21, standard library) allows any type supporting `< <= > >=`:

```go
func Min[T cmp.Ordered](a, b T) T {
    if a < b {
        return a
    }
    return b
}
```

When calling a generic function, you can specify the type argument (**instantiation**):

```go
x := Min[int](2, 3)
```

Go can usually **infer** the type arguments from the function arguments, so you don't need to specify them:

```go
x := Min(2, 3) // T = int
```

## Example

```go
package main

import (
    "cmp"
    "fmt"
)

// Generic function to find the minimum value
func Min[T cmp.Ordered](a, b T) T {
    if a < b {
        return a
    }
    return b
}

func main() {
    fmt.Println(Min[int](2, 3))     // 2
    fmt.Println(Min(2.71, 3.14))    // 2.71 (T inferred as float64)
    fmt.Println(Min("go", "ab"))    // ab
}
```

> Old code used `golang.org/x/exp/constraints.Ordered`; since Go 1.21 use `cmp.Ordered` from the standard library. Go 1.21 also added the built-ins `min` and `max`: `min(2, 3)`, `max(1.5, 2, 0.5)`.

## Constraints

| Constraint | Allows | Operations |
| --- | --- | --- |
| `any` | every type | assign, pass, `fmt` |
| `comparable` | types supporting `==` / `!=` (also usable as map keys) | `==`, `!=` |
| `cmp.Ordered` | integers, floats, strings (and types derived from them) | `<`, `>`, `==`, ... |
| custom interface | the types / methods you list | the operations common to all of them |

### comparable

```go
func Index[T comparable](s []T, v T) int {
    for i, x := range s {
        if x == v {
            return i
        }
    }
    return -1
}

// Index([]string{"a", "b", "c"}, "b") == 1
// Index([]int{1, 2}, 5) == -1
```

### Custom constraints and ~

A constraint is an interface. It can list a **union** of types with `|`. `~T` means "any type whose underlying type is T" (includes named types like `type Celsius float64`).

```go
package main

import "fmt"

type Number interface {
    ~int | ~int64 | ~float64
}

func Sum[T Number](nums []T) T {
    var total T // zero value of T
    for _, n := range nums {
        total += n
    }
    return total
}

type Celsius float64

func main() {
    fmt.Println(Sum([]int{1, 2, 3}))          // 6
    fmt.Println(Sum([]float64{1.5, 2.25}))    // 3.75
    fmt.Println(Sum([]Celsius{20.5, 1.5}))    // 22 (works thanks to ~float64)
}
```

Without the `~`, `Sum([]Celsius{...})` would not compile: `Celsius does not satisfy Number`.

Constraints can also require methods, mixing both:

```go
type StringableInt interface {
    ~int
    String() string
}
```

Interfaces with type unions (`~int | ~float64`) can **only** be used as constraints, not as regular variable/parameter types.

### Multiple type parameters

```go
func Keys[K comparable, V any](m map[K]V) []K {
    keys := make([]K, 0, len(m))
    for k := range m {
        keys = append(keys, k)
    }
    return keys
}
```

## Type inference

```go
func Zero[T any]() T {
    var zero T
    return zero
}

func Convert[To, From Number](v From) To {
    return To(v)
}

// Zero()                 // error: cannot infer T (only appears in the result)
z := Zero[string]()       // "" - must be explicit
f := Convert[float64](3)  // partial: To = float64 given, From = int inferred
```

Inference works from the function arguments (not from the result type nor the assigned variable). Explicit type arguments are given left to right, so put the non-inferable parameters first.

## Generic types

Structs (and other types) can have type parameters too. Methods use the type's parameters.

```go
package main

import "fmt"

type Stack[T any] struct {
    items []T
}

func (s *Stack[T]) Push(v T) {
    s.items = append(s.items, v)
}

func (s *Stack[T]) Pop() (T, bool) {
    var zero T
    if len(s.items) == 0 {
        return zero, false
    }
    v := s.items[len(s.items)-1]
    s.items = s.items[:len(s.items)-1]
    return v, true
}

func (s *Stack[T]) Len() int {
    return len(s.items)
}

func main() {
    var s Stack[int] // the type argument is required for types
    s.Push(1)
    s.Push(2)
    s.Push(3)

    for s.Len() > 0 {
        v, _ := s.Pop()
        fmt.Println(v)
    }

    words := &Stack[string]{}
    words.Push("go")
    w, ok := words.Pop()
    fmt.Println(w, ok)
    _, ok = words.Pop()
    fmt.Println(ok)
}
// 3
// 2
// 1
// go true
// false
```

Other examples:

```go
type Pair[K comparable, V any] struct {
    Key   K
    Value V
}

type List[T any] struct {
    head *node[T]
}

type node[T any] struct {
    val  T
    next *node[T]
}

p := Pair[string, int]{Key: "age", Value: 30}
```

## Limitation: no type parameters on methods

Methods can use the type parameters of their receiver, but **cannot declare new ones**:

```go
// does NOT compile: methods cannot have type parameters
func (s *Stack[T]) Map[U any](f func(T) U) *Stack[U] { ... }
```

Workaround: use a top-level function:

```go
func MapStack[T, U any](s *Stack[T], f func(T) U) *Stack[U] {
    out := &Stack[U]{}
    for _, v := range s.items {
        out.Push(f(v))
    }
    return out
}
```

Other limitations:

- You can't type-switch on `T` directly; convert to `any` first: `switch any(v).(type) { ... }`.
- No specialization or default type arguments.
- A generic type can't embed its type parameter (`struct{ T }` is invalid).

## Map / Filter / Reduce

```go
package main

import (
    "fmt"
    "strconv"
)

func Map[T, U any](s []T, f func(T) U) []U {
    out := make([]U, 0, len(s))
    for _, v := range s {
        out = append(out, f(v))
    }
    return out
}

func Filter[T any](s []T, keep func(T) bool) []T {
    var out []T
    for _, v := range s {
        if keep(v) {
            out = append(out, v)
        }
    }
    return out
}

func Reduce[T, A any](s []T, init A, f func(A, T) A) A {
    acc := init
    for _, v := range s {
        acc = f(acc, v)
    }
    return acc
}

func main() {
    nums := []int{1, 2, 3, 4, 5}

    squares := Map(nums, func(n int) int { return n * n })
    evens := Filter(nums, func(n int) bool { return n%2 == 0 })
    sum := Reduce(nums, 0, func(acc, n int) int { return acc + n })
    strs := Map(nums, strconv.Itoa) // []int -> []string

    fmt.Println(squares)        // [1 4 9 16 25]
    fmt.Println(evens)          // [2 4]
    fmt.Println(sum)            // 15
    fmt.Printf("%q\n", strs)    // ["1" "2" "3" "4" "5"]
}
```

These are not in the standard library (Go prefers plain `for` loops), but they are easy to write when useful.

## slices, maps and cmp std packages

Since Go 1.21 the standard library includes generic helpers, so check them before writing your own.

```go
package main

import (
    "cmp"
    "fmt"
    "maps"
    "slices"
)

type Person struct {
    Name string
    Age  int
}

func main() {
    nums := []int{3, 1, 2}
    slices.Sort(nums)
    fmt.Println(nums)                     // [1 2 3]
    fmt.Println(slices.Contains(nums, 2)) // true
    fmt.Println(slices.Index(nums, 3))    // 2
    fmt.Println(slices.Max(nums))         // 3

    people := []Person{{"Bob", 31}, {"Alice", 25}}
    slices.SortFunc(people, func(a, b Person) int {
        return cmp.Compare(a.Age, b.Age)
    })
    fmt.Println(people) // [{Alice 25} {Bob 31}]

    ages := map[string]int{"bob": 31, "alice": 25}
    keys := slices.Sorted(maps.Keys(ages)) // maps.Keys returns an iterator (Go 1.23)
    fmt.Println(keys)                      // [alice bob]

    clone := maps.Clone(ages)
    fmt.Println(maps.Equal(ages, clone)) // true
}
```

Useful functions: `slices.Sort`, `SortFunc`, `BinarySearch`, `Contains`, `Index`, `IndexFunc`, `Equal`, `Compact`, `Reverse`, `Max`, `Min`, `Insert`, `Delete`, `Collect`, `Sorted`; `maps.Keys`, `Values`, `Clone`, `Copy`, `DeleteFunc`, `Collect`; `cmp.Compare`, `cmp.Or`.

### Generic iterators (Go 1.23)

`iter.Seq[T]` is a generic function type usable with `for range`:

```go
func (s *Stack[T]) All() iter.Seq[T] { // needs import "iter"
    return func(yield func(T) bool) {
        for i := len(s.items) - 1; i >= 0; i-- {
            if !yield(s.items[i]) {
                return
            }
        }
    }
}

// for v := range s.All() { fmt.Println(v) }   // top to bottom
// all := slices.Collect(s.All())              // []T
```

## Generic type aliases (Go 1.24)

Type aliases can have type parameters (fully supported since Go 1.24).

```go
package main

import "fmt"

type Set[T comparable] = map[T]struct{}

func main() {
    s := Set[string]{"a": {}, "b": {}}
    var m map[string]struct{} = s // same type: Set[string] IS map[string]struct{}
    fmt.Println(len(m))           // 2
}
```

An alias does not create a new type (unlike `type Set[T comparable] map[T]struct{}`), so you can't add methods to it. Useful for refactoring/moving types between packages.

## When not to use generics

- When an interface already expresses the behavior: `func Process(r io.Reader)` is better than `func Process[R io.Reader](r R)`.
- When the implementation differs per type (use interface methods instead).
- When there is only one concrete type: write plain code first and add generics when you repeat the same code for several types.
- Just to avoid writing a short `for` loop.

Good fits: containers (stacks, sets, trees, caches), functions on slices/maps/channels of any element type, and removing `interface{}` + type assertions.
