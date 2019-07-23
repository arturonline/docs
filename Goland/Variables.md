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

## initializers

A var declaration can include initializers, one per variable.

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

Inside a function, the `:=` short assignment statement can be used in place of a var declaration with implicit type. Outside a function the `:=` construct is not available.

```go
package main

import "fmt"

func main() {
    var i, j int = 1, 2
    k := 3
    c, python, java := true, false, "no!"

    fmt.Println(i, j, k, c, python, java)
}
```

## Default values

Variables declared without an explicit initial value are given their zero value.

The zero value is:

- 0 for numeric types,
- false for the boolean type, and
- "" (the empty string) for strings.

```go
package main

import "fmt"

func main() {
    var i int
    var f float64
    var b bool
    var s string
    fmt.Printf("%v %v %v %q\n", i, f, b, s)
}
// 0 0 false ""
```

## Type inference

When declaring a variable without specifying an explicit type (either by using the `:=` syntax or var = expression syntax), the variable's type is inferred from the value on the right hand side.

But when the right hand side contains an untyped numeric constant, the new variable may be an `int`, `float64`, or `complex128` depending on the precision of the constant:

```go
i := 42           // int
f := 3.142        // float64
g := 0.867 + 0.5i // complex128
```

## Constants

Constants can be character, string, boolean, or numeric values. Constants cannot be declared using the `:=` syntax.

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

Numeric constants are high-precision values:

```go
package main

import "fmt"

const (
    Big = 1 << 100 // the binary number that is 1 followed by 100 zeroes.
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
}
// 21
// 0.2
// 1.2676506002282295e+29
```
