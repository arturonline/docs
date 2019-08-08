# Pointers

When we call a function that takes an argument, that argument is copied to the function:

```go
func zero(x int) {
  x = 0
}
func main() {
  x := 5
  zero(x)
  fmt.Println(x) // x is still 5
}
```

In this program the zero function will not modify the original x variable in the main function. But what if we wanted to? One way to do this is to use a special data type known as a pointer:

```go
func zero(xPtr *int) {
  *xPtr = 0
}
func main() {
  x := 5
  zero(&x)
  fmt.Println(x) // x is 0
}
```

Pointers reference a location in memory where a value is stored rather than the value itself. By using a pointer (`*int`) the zero function is able to modify the original variable.

## The `*` and `&` operators

In Go a pointer is represented using the `*` character followed by the type of the stored value. In the zero function `xPtr` is a pointer to an `int`.

`*` is also used to gives us access to the value the pointer points to.

```go
*xPtr = 0 // store 0 in the memory location `xPtr` refers to.
xPtr = 0 // Error: `xPtr` is not an int it's a `*int`
```

The `&` operator is used to assign the memory address to a variable. `&x` returns a pointer to x memory adress.

## Example

```go
package main

import "fmt"

func main() {
    i, j := 42, 2701

    p := &i         // point to i
    fmt.Println(*p) // read i through the pointer
    *p = 21         // set i through the pointer
    fmt.Println(i)  // see the new value of i

    p = &j         // point to j
    *p = *p / 37   // divide j through the pointer
    fmt.Println(j) // see the new value of j
}
// 42
// 21
// 73
```

## new

Another way to get a pointer is to use the built-in new function:

```go
func one(xPtr *int) {
  *xPtr = 1
}
func main() {
  xPtr := new(int)
  one(xPtr)
  fmt.Println(*xPtr) // x is 1
}
```

`new` takes a type as an argument, allocates enough memory to fit a value of that type and returns a pointer to it.

In some programming languages there is a significant difference between using `new` and `&`, with great care being needed to eventually delete anything created with new. Go is not like this, it's a garbage collected programming language which means memory is cleaned up automatically when nothing refers to it anymore.

Pointers are rarely used with Go's built-in types, but as we will see in the next chapter, they are extremely useful when paired with structs.
