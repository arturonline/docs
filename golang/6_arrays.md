# Arrays

The type `[n]T` is an array of `n` values of type `T`.

Go's arrays are **values** (not references): assigning an array or passing it to a function copies all its elements.

In practice you'll use slices much more often, but slices are built on top of arrays, so it's worth understanding them.

## Declaration

```go
var a [3]int // [0 0 0] — elements get their zero value
```

An array literal can be specified like so:

```go
b := [2]string{"Penn", "Teller"}
```

Or, you can have the compiler count the array elements for you:

```go
b := [...]string{"Penn", "Teller"}
```

In both cases, the type of `b` is `[2]string`.

You can also set specific indexes; the rest get the zero value:

```go
x := [5]int{1: 10, 3: 30}
fmt.Println(x) // [0 10 0 30 0]

y := [...]string{2: "c"} // length is highest index + 1
fmt.Printf("%d %q\n", len(y), y) // 3 ["" "" "c"]
```

An array's length is part of its type, so arrays cannot be resized, and `[2]int` and `[3]int` are different, incompatible types. The length must be a constant.

## Example

```go
package main

import "fmt"

func main() {
    var a [2]string
    a[0] = "Hello"
    a[1] = "World"
    fmt.Println(a[0], a[1])
    fmt.Println(a)

    primes := [6]int{2, 3, 5, 7, 11, 13}
    fmt.Println(primes, len(primes))

    for i, p := range primes {
        if i < 2 {
            fmt.Println(i, p)
        }
    }
}
// Hello World
// [Hello World]
// [2 3 5 7 11 13] 6
// 0 2
// 1 3
```

Indexes are checked: a constant out-of-range index (`primes[6]`) is a compile error, a variable one panics at runtime (`index out of range`).

## Arrays are values

```go
package main

import "fmt"

func double(arr [3]int) { // receives a copy
    for i := range arr {
        arr[i] *= 2
    }
}

func doublePtr(arr *[3]int) { // receives a pointer to the original
    for i := range arr {
        arr[i] *= 2 // same as (*arr)[i]
    }
}

func main() {
    a := [3]int{1, 2, 3}

    b := a // full copy
    b[0] = 100
    fmt.Println(a, b)

    double(a)
    fmt.Println(a)

    doublePtr(&a)
    fmt.Println(a)
}
// [1 2 3] [100 2 3]
// [1 2 3]
// [2 4 6]
```

> Copying large arrays is expensive. Pass a pointer or (more idiomatic) a slice: `a[:]` gives a slice that shares the array's memory.

## Comparison

Array values are comparable if values of the array element type are comparable. Two array values are equal if their corresponding elements are equal.

```go
a := [2]int{1, 2}
b := [2]int{1, 3}
c := [2]int{1, 2}
fmt.Println(a == b, a == c) // false true
```

Because they are comparable, arrays can be used as map keys (slices cannot):

```go
grid := map[[2]int]string{{0, 0}: "origin"}
fmt.Println(grid[[2]int{0, 0}]) // origin
```

## Multidimensional arrays

It is possible to create multidimensional arrays (arrays of arrays).

```go
package main

import "fmt"

func printArray(a [3][2]string) {
    for _, row := range a {
        for _, v := range row {
            fmt.Printf("%s ", v)
        }
        fmt.Println()
    }
}

func main() {
    a := [3][2]string{
        {"lion", "tiger"},
        {"cat", "dog"},
        {"pigeon", "peacock"}, // this trailing comma is necessary
    }
    printArray(a)

    var b [3][2]string
    b[0][0] = "apple"
    b[0][1] = "samsung"
    b[1][0] = "microsoft"
    b[1][1] = "google"
    b[2][0] = "AT&T"
    b[2][1] = "T-Mobile"
    fmt.Println()
    printArray(b)

    fmt.Println(len(b), len(b[0]))
}
// lion tiger
// cat dog
// pigeon peacock
//
// apple samsung
// microsoft google
// AT&T T-Mobile
// 3 2
```

(Each printed row ends with a trailing space after the last word.)
