# Functions

A function takes zero or more parameters (type goes after the name) and returns zero or more results. When consecutive parameters share a type, the type can be written only once.

```go
package main

import "fmt"

func add(x int, y int) int {
    return x + y
}

func subtract(x, y int) int { // same as (x int, y int)
    return x - y
}

func main() {
    fmt.Println(add(42, 13), subtract(42, 13))
}
// 55 29
```

Go has **no** default parameter values, no named arguments and no function overloading (each name is unique within a package).

## Arguments are passed by value

Arguments are always copied. To let a function modify a variable, pass a pointer (slices, maps and channels already contain a reference to their underlying data, so changes to their *elements* are visible to the caller).

```go
package main

import "fmt"

func inc(x int)     { x++ }  // modifies a copy
func incPtr(x *int) { *x++ } // modifies the original

func main() {
    n := 1
    inc(n)
    fmt.Println(n)
    incPtr(&n)
    fmt.Println(n)
}
// 1
// 2
```

## Multiple results

A function can return any number of results:

```go
package main

import "fmt"

func swap(x, y string) (string, string) {
    return y, x
}

func main() {
    a, b := swap("hello", "world")
    fmt.Println(a, b)
}
// world hello
```

The most common use is returning a value **and an error** (the error is always the last result):

```go
package main

import (
    "errors"
    "fmt"
)

func div(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

func main() {
    if r, err := div(1, 0); err != nil {
        fmt.Println("error:", err)
    } else {
        fmt.Println(r)
    }
    r, _ := div(10, 4) // discard a result with _
    fmt.Println(r)
}
// error: division by zero
// 2.5
```

## Named return values

Go's return values may be named. If so, they are treated as variables defined at the top of the function (initialized to their zero values).

These names should be used to document the meaning of the return values.

A return statement without arguments returns the named return values. This is known as a "naked" return.

Naked return statements should be used only in short functions, as with the example shown here. They can harm readability in longer functions.

```go
package main

import "fmt"

func split(sum int) (x, y int) { // x, y are the named return parameters
    x = sum * 4 / 9
    y = sum - x
    return // same as "return x, y"
}

func main() {
    fmt.Println(split(17))
}
// 7 10
```

## Variadic functions

The last parameter can be `...T`: the function accepts any number of arguments of type `T`, received as a `[]T`. Pass an existing slice with `slice...`.

```go
package main

import "fmt"

func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}

func main() {
    fmt.Println(sum())
    fmt.Println(sum(1, 2, 3))

    s := []int{4, 5}
    fmt.Println(sum(s...))
}
// 0
// 6
// 9
```

`fmt.Println(a ...any)` and `append(s []T, elems ...T)` are variadic.

## Function values

Functions are values too (first-class). They can be assigned to variables, passed as arguments and returned from other functions. The zero value of a function type is `nil` (calling it panics).

### As variables

```go
package main

import (
    "fmt"
    "math"
)

func main() {
    hypot := func(x, y float64) float64 { // anonymous function (function literal)
        return math.Sqrt(x*x + y*y)
    }
    fmt.Println(hypot(5, 12))
}
// 13
```

An anonymous function can also be called immediately:

```go
func() {
    fmt.Println("run once")
}()
```

### As arguments

```go
package main

import (
    "fmt"
    "math"
)

func compute(fn func(float64, float64) float64) float64 {
    return fn(3, 4)
}

func main() {
    hypot := func(x, y float64) float64 {
        return math.Sqrt(x*x + y*y)
    }
    fmt.Println(compute(hypot))
    fmt.Println(compute(math.Pow)) // any function with the right signature works
}
// 5
// 81
```

### As return values

```go
package main

import "fmt"

func multiplier(n int) func(int) int {
    return func(x int) int {
        return x * n
    }
}

func main() {
    double := multiplier(2)
    triple := multiplier(3)
    fmt.Println(double(5), triple(5))
}
// 10 15
```

### Function types

A function signature can be given a name, which makes signatures easier to read:

```go
package main

import "fmt"

type op func(int, int) int

func main() {
    ops := map[string]op{
        "+": func(a, b int) int { return a + b },
        "-": func(a, b int) int { return a - b },
    }
    fmt.Println(ops["+"](2, 3), ops["-"](2, 3))
}
// 5 -1
```

## Function closures

Go functions may be closures. A closure is a function value that references variables from outside its body. The function may access and assign to the referenced variables; in this sense the function is "bound" to the variables.

For example, the adder function returns a closure. Each closure is bound to its own sum variable.

```go
package main

import "fmt"

func adder() func(int) int {
    sum := 0
    return func(x int) int {
        sum += x
        return sum
    }
}

func main() {
    pos, neg := adder(), adder()
    for i := range 10 { // range over int (Go 1.22+): 0..9
        fmt.Println(
            pos(i),
            neg(-2*i),
        )
    }
}
// 0 0
// 1 -2
// 3 -6
// 6 -12
// 10 -20
// 15 -30
// 21 -42
// 28 -56
// 36 -72
// 45 -90
```

> Since Go 1.22 every loop iteration has its own loop variable, so closures created inside a loop capture the value of that iteration (see [Loop variables](2_variables.md#loop-variables-go-122)).

## Recursion

```go
package main

import "fmt"

func fact(n int) int {
    if n <= 1 {
        return 1
    }
    return n * fact(n-1)
}

func main() {
    fmt.Println(fact(5))

    // a recursive closure must be declared before it is assigned
    var fib func(n int) int
    fib = func(n int) int {
        if n < 2 {
            return n
        }
        return fib(n-1) + fib(n-2)
    }
    fmt.Println(fib(10))
}
// 120
// 55
```

## Defer

`defer` schedules a function call to run when the surrounding function **returns** (normally or by panic). It is used for cleanup: closing files, unlocking mutexes, etc.

- Deferred calls run in **LIFO** order (last deferred, first executed).
- The arguments are evaluated **immediately**, when the `defer` statement runs, not when the call executes.

```go
package main

import "fmt"

func main() {
    defer fmt.Println("world")

    x := 1
    defer fmt.Println("deferred x =", x) // x is evaluated now: 1
    x = 2

    for i := range 3 {
        defer fmt.Print(i, " ")
    }
    fmt.Println("hello, x =", x)
}
// hello, x = 2
// 2 1 0 deferred x = 1
// world
```

Typical use:

```go
f, err := os.Open("file.txt")
if err != nil {
    return err
}
defer f.Close() // runs when the function returns, whatever path it takes
```

A deferred closure can read and **modify named results**, which together with `recover` lets a function turn a panic into an error:

```go
package main

import "fmt"

func safeDiv(a, b int) (res int, err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("recovered: %v", r)
        }
    }()
    return a / b, nil
}

func main() {
    fmt.Println(safeDiv(6, 3))
    fmt.Println(safeDiv(1, 0))
}
// 2 <nil>
// 0 recovered: runtime error: integer divide by zero
```

> Avoid `defer` inside long loops: the calls only run when the function returns, not at the end of each iteration.
