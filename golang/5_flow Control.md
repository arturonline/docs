# Flow control

## For

Go has only one looping construct, the for loop. The Go for loop unifies for and while. There are three forms, only one of which has semicolons.

```go
// Like a C for
for init; condition; post { }

// Like a C while
for condition { }

// Like a C for(;;)
for { }
```

The init statement will often be a short variable declaration, and the variables declared there are visible only in the scope of the for statement. The loop will stop iterating once the boolean condition evaluates to false.

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

The init and post statements are optional:

```go
package main

import "fmt"

func main() {
    sum := 1
    for sum < 1000; {
        sum += sum
    }
    fmt.Println(sum)
}
// 1024
```

### Forever loop

If you omit the loop condition it loops forever, so an infinite loop is compactly expressed:

```go
package main

func main() {
    for {
    }
}
```

### For-each range loop

Looping over elements in slices, arrays, maps, channels or strings is often better done with a range loop.

```go
strings := []string{"hello", "world"}
for i, s := range strings {
    fmt.Println(i, s)
}
// 0 hello
// 1 world
```

### Exit a loop

The break and continue keywords work just as they do in C and Java.

```go
sum := 0
for i := 1; i < 5; i++ {
    if i % 2 != 0 { // skip odd numbers
        continue
    }
    sum += i
}
fmt.Println(sum) // 6 (2+4)
```

- A continue statement begins the next iteration of the innermost for loop at its post statement (i++).
- A break statement leaves the innermost for, switch or select statement.

## If statement

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

Like for, the if statement can start with a **short statement** to execute before the condition.

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

Variables declared by the statement are only in scope until the end of the if.

## If and else

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

## Switch

A switch statement is a shorter way to write a sequence of `if - else` statements. It evaluates cases from top to bottom, stopping when a case succeeds.

Go's switch only runs the selected case, not all the cases that follow. In effect, the break statement that is needed at the end of each case in those languages is provided automatically in Go.

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
        fmt.Println("OS X.")
    case "linux":
        fmt.Println("Linux.")
    default:
        // freebsd, openbsd,
        // plan9, windows...
        fmt.Printf("%s.\n", os)
    }
}
```

### Switch with no condition

A switch without a condition is the same as switch true. This construct can be a clean way to write long if-then-else chains.

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
// Good evening.
```

## Defer

A defer statement defers the execution of a function until the surrounding function returns.

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

### Stacking defers

Deferred function calls are pushed onto a stack. When a function returns, its deferred calls are executed in last-in-first-out order.

```go
package main

import "fmt"

func main() {
    fmt.Println("counting")

    for i := 0; i < 10; i++ {
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

