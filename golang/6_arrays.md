# Arrays

Go's arrays are values. An array variable denotes the entire array; it is not a pointer to the first array element (as would be the case in C). This means that when you assign or pass around an array value you will make a copy of its contents. (To avoid the copy you could pass a pointer to the array, but then that's a pointer to an array, not an array.) One way to think about arrays is as a sort of struct but with indexed rather than named fields: a fixed-size composite value.

The type `[n]T` is an array of n values of type `T`.

## Declaration

An array literal can be specified like so:

```go
b := [2]string{"Penn", "Teller"}
```

Or, you can have the compiler count the array elements for you:

```go
b := [...]string{"Penn", "Teller"}
```

In both cases, the type of b is `[2]string`.

An array's length is part of its type, so arrays cannot be resized.

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
    fmt.Println(primes)
}
// Hello World
// [Hello World]
// [2 3 5 7 11 13]
```

## Comparation

Array values are comparable if values of the array element type are comparable. Two array values are equal if their corresponding elements are equal.

```go
a := [2]int{1, 2}
b := [2]int{1, 3}
fmt.Println(a == b) // false
```

## Multidimensional arrays

The arrays we created so far are all single dimension. It is possible to create multidimensional arrays.

```go
package main

import (
    "fmt"
)

func printarray(a [3][2]string) {
    for _, v1 := range a {
        for _, v2 := range v1 {
            fmt.Printf("%s ", v2)
        }
        fmt.Printf("\n")
    }
}

func main() {
    a := [3][2]string{
        {"lion", "tiger"},
        {"cat", "dog"},
        {"pigeon", "peacock"}, //this comma is necessary
    }
    printarray(a)
    var b [3][2]string
    b[0][0] = "apple"
    b[0][1] = "samsung"
    b[1][0] = "microsoft"
    b[1][1] = "google"
    b[2][0] = "AT&T"
    b[2][1] = "T-Mobile"
    fmt.Printf("\n")
    printarray(b)
}
// lion tiger
// cat dog
// pigeon peacock

// apple samsung
// microsoft google
// AT&T T-Mobile
```