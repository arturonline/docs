# Variables

The var statement declares a list of variables; as in function argument lists, the type is last.

```go
package main

import "fmt"

var c, python, java bool

func main() {
    var i int
    fmt.Println(i, c, python, java)
}
// 0 false false false
```

Variables can also be declared in a block:

```go
var (
    name    string = "gopher"
    age     int    = 13
    enabled bool
)
```

## Initializers

A var declaration can include initializers, one per variable. If an initializer is present, the type can be omitted.

```go
package main

import "fmt"

var i, j int = 1, 2

func main() {
    var c, python, java = true, false, "no!"
    fmt.Println(i, j, c, python, java)
}
// 1 2 true false no!
```

## Short variable declarations

Inside a function, the `:=` short assignment statement can be used in place of a var declaration with implicit type. Outside a function the `:=` construct is not available (every statement at package level begins with a keyword: `var`, `func`, `const`, `type`, `import`).

```go
package main

import "fmt"

func main() {
    var i, j int = 1, 2
    k := 3
    c, python, java := true, false, "no!"

    fmt.Println(i, j, k, c, python, java)
}
// 1 2 3 true false no!
```

`:=` needs **at least one new variable** on the left; the others are just assigned. This is why `err` can be reused:

```go
a, err := strconv.Atoi("1")
b, err := strconv.Atoi("2") // ok: b is new, err is reassigned
// a, err := strconv.Atoi("3") // error: no new variables on left side of :=
```

## Assignment

```go
package main

import "fmt"

func main() {
    a, b := 1, 2
    a, b = b, a // swap: right side is evaluated first
    fmt.Println(a, b)

    x := 10
    x += 5 // also -=, *=, /=, %=, <<=, &=, ...
    x++    // ++ and -- are statements, not expressions (no y := x++)
    fmt.Println(x)
}
// 2 1
// 16
```

## Unused variables and the blank identifier

An unused **local** variable is a compile error (`declared and not used`). Use the blank identifier `_` to discard values you don't need:

```go
package main

import (
    "fmt"
    "strconv"
)

func main() {
    n, _ := strconv.Atoi("42") // ignore the error
    fmt.Println(n)
}
// 42
```

Unused package-level variables and unused function parameters are allowed.

## Default values (zero values)

Variables declared without an explicit initial value are given their zero value. There are no uninitialized variables in Go.

The zero value is:

- `0` for numeric types,
- `false` for the boolean type,
- `""` (the empty string) for strings,
- `nil` for pointers, slices, maps, channels, functions and interfaces,
- for structs and arrays: every field/element set to its own zero value.

```go
package main

import "fmt"

func main() {
    var i int
    var f float64
    var b bool
    var s string
    fmt.Printf("%v %v %v %q\n", i, f, b, s)

    var p *int
    var sl []int
    var m map[string]int
    var err error
    var pt struct {
        X int
        Y string
    }
    fmt.Println(p == nil, sl == nil, m == nil, err == nil)
    fmt.Println(p, sl, m, err, pt)
    fmt.Println(len(sl), m["missing"]) // reading a nil slice/map is safe (writing to a nil map panics)
}
// 0 0 false ""
// true true true true
// <nil> [] map[] <nil> {0 }
// 0 0
```

## Type inference

When declaring a variable without specifying an explicit type (either by using the `:=` syntax or var = expression syntax), the variable's type is inferred from the value on the right hand side.

But when the right hand side contains an untyped numeric constant, the new variable may be an `int`, `float64`, or `complex128` depending on the precision of the constant:

```go
package main

import "fmt"

func main() {
    i := 42           // int
    f := 3.142        // float64
    g := 0.867 + 0.5i // complex128
    r := 'a'          // rune (int32)
    fmt.Printf("%T %T %T %T\n", i, f, g, r)
}
// int float64 complex128 int32
```

## Scope and shadowing

Go is block scoped: a variable lives in the `{ }` block where it is declared (`if`, `for` and `switch` statements also open an implicit block). An inner declaration with the same name **shadows** the outer one:

```go
package main

import "fmt"

var x = 1 // package scope

func main() {
    fmt.Println(x) // 1
    x := 2         // new local x shadows the package-level one
    fmt.Println(x) // 2
    if x := 3; x > 0 {
        fmt.Println(x) // 3 (only exists inside the if/else)
    }
    fmt.Println(x) // 2
}
```

A classic bug: `:=` inside a block creates new variables instead of assigning the outer ones.

```go
package main

import (
    "fmt"
    "strconv"
)

func main() {
    n, err := strconv.Atoi("12")
    if n > 0 {
        n, err := strconv.Atoi("x") // new n and err, only inside this block
        fmt.Println(n, err)
    }
    fmt.Println(n, err) // outer ones are untouched
}
// 0 strconv.Atoi: parsing "x": invalid syntax
// 12 <nil>
```

`go vet` with the `shadow` analyzer can detect this.

### Loop variables (Go 1.22+)

Since Go 1.22 each iteration of a `for` loop gets its **own** copy of the loop variable, so closures and goroutines capture the expected value (requires `go 1.22` or later in `go.mod`):

```go
package main

import "fmt"

func main() {
    var prints []func()
    for i := 0; i < 3; i++ {
        prints = append(prints, func() { fmt.Print(i, " ") })
    }
    for _, p := range prints {
        p()
    }
}
// Go 1.22+: 0 1 2
// Before 1.22: 3 3 3  (all closures shared the same i; the old fix was i := i)
```

## Constants

Constants can be character, string, boolean, or numeric values. Constants cannot be declared using the `:=` syntax. Their value must be known at compile time (`const x = math.Sqrt(2)` doesn't compile, `const n = len("abc")` does).

```go
package main

import "fmt"

const Pi = 3.14

func main() {
    const World = "世界"
    fmt.Println("Hello", World)
    fmt.Println("Happy", Pi, "Day")

    const Truth = true
    fmt.Println("Go rules?", Truth)
}

// Hello 世界
// Happy 3.14 Day
// Go rules? true
```

Constants can be **typed** (`const a int = 1`) or **untyped** (`const b = 1`). An untyped constant has no fixed type until it is used, so it can be mixed with any compatible type:

```go
const b = 2
var f float64 = 1.5 * b // ok: b acts as a float64 here
var i int32 = b         // ok: b acts as an int32 here

const a int = 2
// var g float64 = a    // error: cannot use a (constant 2 of type int) as float64 value
```

Numeric constants are high-precision values:

```go
package main

import "fmt"

const (
    Big   = 1 << 100  // the binary number that is 1 followed by 100 zeroes.
    Small = Big >> 99 // Shift it right again 99 places
)

func needInt(x int) int { return x*10 + 1 }
func needFloat(x float64) float64 {
    return x * 0.1
}

func main() {
    fmt.Println(needInt(Small))
    fmt.Println(needFloat(Small))
    fmt.Println(needFloat(Big))
    // fmt.Println(needInt(Big)) // error: cannot use Big (untyped int constant ...) as int value (overflows)
}
// 21
// 0.2
// 1.2676506002282295e+29
```

### `iota`

Inside a `const` block, `iota` is a counter that starts at 0 and increments on each line. An expression is repeated implicitly for the following lines. It is Go's way to build enumerations:

```go
package main

import "fmt"

type Weekday int

const (
    Sunday Weekday = iota // 0
    Monday                // 1
    Tuesday               // 2
)

const (
    _  = iota             // skip 0
    KB = 1 << (10 * iota) // 1 << 10
    MB                    // 1 << 20
    GB                    // 1 << 30
)

func main() {
    fmt.Println(Sunday, Monday, Tuesday)
    fmt.Println(KB, MB, GB)
}
// 0 1 2
// 1024 1048576 1073741824
```

## Access (exported names)

In go all variables, constants, functions, types and struct fields which start with an upper case are **public** (exported). All those which start with lowercase are package **private** (unexported). See [Exported names](1_mod_&_pack.md#exported-names).

```go
package greet

import "fmt"

// public function
func SayHi(person string) string {
    return fmt.Sprintf("Hi %s", person)
}

// private function
func sayHi(person string) string {
    return fmt.Sprintf("Hi %s", person)
}
```
