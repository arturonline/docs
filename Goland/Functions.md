# Functions

```go
package main

import "fmt"

func add(x int, y int) int {
    return x + y
}

func substract(x, y int) int {
    eturn x - y
}

func main() {
    fmt.Println(add(42, 13))
}
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
```

## Named return values

Go's return values may be named. If so, they are treated as variables defined at the top of the function.

These names should be used to document the meaning of the return values.

A return statement without arguments returns the named return values. This is known as a "naked" return.

Naked return statements should be used only in short functions, as with the example shown here. They can harm readability in longer functions.

```go
package main

import "fmt"

func split(sum int) (x, y int) { // x, y are the return paramenters
    x = sum * 4 / 9
    y = sum - x
    return // same as return x, y
}

func main() {
    fmt.Println(split(17))
}
// 7 10
```
