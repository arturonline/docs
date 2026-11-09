# Flow control

## For

Go has only one looping construct, the `for` loop. The Go `for` loop unifies `for` and `while`. There are three forms, only one of which has semicolons.

```go
// Like a C for
for init; condition; post { }

// Like a C while
for condition { }

// Like a C for(;;)
for { }
```

The init statement will often be a short variable declaration, and the variables declared there are visible only in the scope of the `for` statement. The loop will stop iterating once the boolean condition evaluates to false.

> No parentheses around the clauses, and the braces `{ }` are always required.

### Examples

```go
package main

import "fmt"

func main() {
    sum := 0
    for i := 0; i < 10; i++ {
        sum += i
    }
    fmt.Println(sum)
}
// 45
```

### for like a while

The init and post statements are optional. Drop the semicolons too and you get a C `while`:

```go
package main

import "fmt"

func main() {
    sum := 1
    for sum < 1000 {
        sum += sum
    }
    fmt.Println(sum)
}
// 1024
```

### Forever loop

If you omit the loop condition it loops forever, so an infinite loop is compactly expressed. Exit it with `break` or `return`:

```go
package main

import "fmt"

func main() {
    n := 0
    for {
        n++
        if n == 3 {
            break
        }
    }
    fmt.Println(n)
}
// 3
```

### For-each range loop

Looping over elements in slices, arrays, maps, channels or strings is often better done with a `range` loop.

```go
words := []string{"hello", "world"}
for i, s := range words {
    fmt.Println(i, s)
}
// 0 hello
// 1 world
```

What `range` returns depends on what you range over:

| Range expression        | 1st value     | 2nd value          |
| ----------------------- | ------------- | ------------------ |
| array, slice, `*array`  | index `int`   | element (a copy)   |
| string                  | byte index    | `rune` (code point)|
| map                     | key           | value              |
| channel                 | element       | -                  |
| integer `n` (Go 1.22+)  | `0 .. n-1`    | -                  |
| function iterator (1.23+) | `Seq`: value, `Seq2`: key | `Seq2`: value |

Either value can be skipped with `_`, and the second one can simply be omitted:

```go
for i := range words { }      // index only
for _, s := range words { }   // value only
for range words { }           // neither, just repeat len(words) times
```

Ranging over a string decodes UTF-8, so the index jumps over multi-byte characters:

```go
for i, r := range "héllo" {
    fmt.Println(i, string(r))
}
// 0 h
// 1 é
// 3 l
// 4 l
// 5 o
```

Map iteration order is **random** (see Maps notes) — never rely on it.

### Range over an integer (Go 1.22+)

```go
for i := range 3 {
    fmt.Println(i)
}
// 0
// 1
// 2
```

### Range over function iterators (Go 1.23+)

A function with the signature `func(yield func(V) bool)` (type `iter.Seq[V]`) or `func(yield func(K, V) bool)` (type `iter.Seq2[K, V]`) can be used directly in a `range` loop. The loop body runs each time the function calls `yield`; if the body `break`s, `yield` returns `false` and the iterator must stop.

```go
package main

import (
    "fmt"
    "iter"
)

func Countdown(n int) iter.Seq[int] {
    return func(yield func(int) bool) {
        for i := n; i > 0; i-- {
            if !yield(i) {
                return
            }
        }
    }
}

func main() {
    for v := range Countdown(5) {
        if v == 2 {
            break
        }
        fmt.Println(v)
    }
}
// 5
// 4
// 3
```

The standard library uses this a lot: `slices.All`, `slices.Values`, `maps.Keys`, `maps.Values`, `strings.SplitSeq` (1.24)...

### Loop variables are per-iteration (Go 1.22+)

Since Go 1.22 every iteration gets a **new** copy of the loop variable, so closures and goroutines capture the value of that iteration.

```go
package main

import "fmt"

func main() {
    var prints []func()
    for i := 0; i < 3; i++ {
        prints = append(prints, func() { fmt.Println(i) })
    }
    for _, p := range prints {
        p()
    }
}
// 0
// 1
// 2
// (before Go 1.22 this printed 3 3 3 — the classic `i := i` workaround is no longer needed)
```

The behaviour depends on the `go` version declared in `go.mod`.

### Exit a loop

The `break` and `continue` keywords work just as they do in C and Java.

```go
sum := 0
for i := 1; i < 5; i++ {
    if i%2 != 0 { // skip odd numbers
        continue
    }
    sum += i
}
fmt.Println(sum) // 6 (2+4)
```

- A `continue` statement begins the next iteration of the innermost `for` loop at its post statement (`i++`).
- A `break` statement leaves the innermost `for`, `switch` or `select` statement.

> Gotcha: a `break` inside a `switch` (or `select`) that is inside a `for` only exits the `switch`, not the loop. Use a label to exit the loop.

### Labeled break and continue

A label lets `break` / `continue` target an outer loop:

```go
package main

import "fmt"

func main() {
outer:
    for i := 0; i < 3; i++ {
        for j := 0; j < 3; j++ {
            if j == 2 {
                continue outer // next i
            }
            if i == 2 {
                break outer // leave both loops
            }
            fmt.Println(i, j)
        }
    }
}
// 0 0
// 0 1
// 1 0
// 1 1
```

### goto

Go has `goto label`, but it's rarely used (mostly in generated code). It cannot jump over variable declarations or into another block.

```go
package main

import "fmt"

func main() {
    i := 0
loop:
    if i < 3 {
        fmt.Println(i)
        i++
        goto loop
    }
}
// 0
// 1
// 2
```

## If statement

No parentheses around the condition; braces are mandatory. The condition must be a `bool` (no "truthy" values like `0` or `""`).

```go
package main

import (
    "fmt"
    "math"
)

func sqrt(x float64) string {
    if x < 0 {
        return sqrt(-x) + "i"
    }
    return fmt.Sprint(math.Sqrt(x))
}

func main() {
    fmt.Println(sqrt(2), sqrt(-4))
}
// 1.4142135623730951 2i
```

### If with a short statement

Like `for`, the `if` statement can start with a **short statement** to execute before the condition.

```go
package main

import (
    "fmt"
    "math"
)

func pow(x, n, lim float64) float64 {
    if v := math.Pow(x, n); v < lim {
        return v
    }
    return lim
}

func main() {
    fmt.Println(
        pow(3, 2, 10),
        pow(3, 3, 20),
    )
}
// 9 20
```

Variables declared by the statement are only in scope until the end of the `if` (including any `else` branches).

This is the idiomatic way to handle errors and comma-ok checks:

```go
if err := doSomething(); err != nil {
    return err
}

if v, ok := m["key"]; ok {
    fmt.Println(v)
}
```

### If and else

```go
package main

import (
    "fmt"
    "math"
)

func pow(x, n, lim float64) float64 {
    if v := math.Pow(x, n); v < lim {
        return v
    } else {
        fmt.Printf("%g >= %g\n", v, lim)
    }
    // can't use v here, though
    return lim
}

func main() {
    fmt.Println(
        pow(3, 2, 10),
        pow(3, 3, 20),
    )
}
// 27 >= 20
// 9 20
```

(Both `pow` calls run before `Println` prints, so the `Printf` line comes first.)

`else if` chains work as usual, but idiomatic Go prefers returning early over long `else` blocks.

## Switch

A `switch` statement is a shorter way to write a sequence of `if - else` statements. It evaluates cases from top to bottom, stopping when a case succeeds.

Go's switch only runs the selected case, not all the cases that follow (unlike C, C++, Java, JavaScript). In effect, the `break` statement that is needed at the end of each case in those languages is provided automatically in Go.

Another important difference is that Go's switch cases need not be constants, and the values involved need not be integers.

```go
package main

import (
    "fmt"
    "runtime"
)

func main() {
    fmt.Print("Go runs on ")
    switch os := runtime.GOOS; os {
    case "darwin":
        fmt.Println("macOS.")
    case "linux":
        fmt.Println("Linux.")
    default:
        // freebsd, openbsd,
        // plan9, windows...
        fmt.Printf("%s.\n", os)
    }
}
// Go runs on linux.   (depends on your OS)
```

### Several values in one case

```go
switch day {
case "sat", "sun":
    fmt.Println("weekend")
default:
    fmt.Println("weekday")
}
```

### Switch with no condition

A switch without a condition is the same as `switch true`. This construct can be a clean way to write long if-then-else chains.

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    t := time.Now()
    switch {
    case t.Hour() < 12:
        fmt.Println("Good morning!")
    case t.Hour() < 17:
        fmt.Println("Good afternoon.")
    default:
        fmt.Println("Good evening.")
    }
}
// Good evening.   (depends on the current time)
```

### fallthrough

`fallthrough` (must be the last statement of a case) transfers control to the **next** case body without evaluating its condition:

```go
package main

import "fmt"

func main() {
    switch n := 1; n {
    case 1:
        fmt.Println("one")
        fallthrough
    case 2:
        fmt.Println("two")
    case 3:
        fmt.Println("three")
    }
}
// one
// two
```

### Type switch

A type switch compares types instead of values (see interfaces notes). In each case `v` has the type of that case:

```go
package main

import "fmt"

func describe(i any) string {
    switch v := i.(type) {
    case int:
        return fmt.Sprintf("int %d", v*2)
    case string:
        return fmt.Sprintf("string %q", v)
    case nil:
        return "nil"
    default:
        return fmt.Sprintf("other %T", v)
    }
}

func main() {
    fmt.Println(describe(21))
    fmt.Println(describe("hi"))
    fmt.Println(describe(nil))
    fmt.Println(describe(3.5))
}
// int 42
// string "hi"
// nil
// other float64
```

## Defer

A `defer` statement defers the execution of a function until the surrounding function returns.

The deferred call's arguments are evaluated immediately, but the function call is not executed until the surrounding function returns.

```go
package main

import "fmt"

func main() {
    defer fmt.Println("world")

    fmt.Println("hello")
}
// hello
// world
```

Arguments are evaluated at the `defer` line, not when the call runs:

```go
package main

import "fmt"

func main() {
    x := 1
    defer fmt.Println("deferred:", x)
    x = 2
    fmt.Println("now:", x)
}
// now: 2
// deferred: 1
```

Typical use: release resources right after acquiring them.

```go
f, err := os.Open("data.txt")
if err != nil {
    return err
}
defer f.Close()
```

### Stacking defers

Deferred function calls are pushed onto a stack. When a function returns, its deferred calls are executed in last-in-first-out order.

```go
package main

import "fmt"

func main() {
    fmt.Println("counting")

    for i := range 10 {
        defer fmt.Println(i)
    }

    fmt.Println("done")
}
// counting
// done
// 9
// 8
// 7
// 6
// 5
// 4
// 3
// 2
// 1
// 0
```

> `defer` runs when the **function** returns, not at the end of a loop iteration or block. Deferring inside a long loop can pile up resources — wrap the body in a function if needed.

### Panic and recover

`panic` stops the normal flow; deferred calls still run while the stack unwinds. `recover`, called inside a deferred function, stops the panic and returns its value. Use it sparingly — normal errors should be returned as `error` values (see errors notes).

```go
package main

import "fmt"

func safeDivide(a, b int) (res int, err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("recovered: %v", r)
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

A deferred closure can modify **named** result values (`err` above), which is how the error gets returned.
