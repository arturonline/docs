# Pointers

A pointer holds the memory address of a value. The type `*T` is a pointer to a `T` value.

- `&` => We use the `&` ampersand operator to get a variable's memory address (create a pointer).
- `*` => We use the `*` operator to access the underlying value at that memory address (dereference).

The zero value of a pointer is `nil`.

## Example

```go
// Declaring a pointer
var p *int // nil

// Getting the address of a variable:
var a int = 42
p = &a

// Dereferencing a pointer:
fmt.Println(*p) // 42
*p = 21         // Changes the value of a to 21
fmt.Println(a)  // 21

var q *int = &a
fmt.Println("address of a is", q)
// address of a is 0xc00000a0b8   (the actual address varies on each run)
```

```go
package main

import "fmt"

func main() {
    i, j := 42, 2701

    p := &i         // point to i
    fmt.Println(*p) // read i through the pointer

    *p = 21        // set i through the pointer
    fmt.Println(i) // see the new value of i

    p = &j         // point to j
    *p = *p / 37   // divide j through the pointer
    fmt.Println(j) // see the new value of j
}
// 42
// 21
// 73
```

## nil pointers

Dereferencing a nil pointer panics, so check before using a pointer that may be nil:

```go
var p *int
fmt.Println(p == nil) // true
// fmt.Println(*p)    // panic: runtime error: invalid memory address or nil pointer dereference

if p != nil {
    fmt.Println(*p)
}
```

## Pointers to mutate values

When we call a function that takes an argument, that argument is copied to the function (Go is always pass-by-value):

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

In this program the `zero` function will not modify the original `x` variable in the `main` function. But what if we wanted to? One way to do this is to use pointers:

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

> By using the `&` operator we get the address of a variable (`&x`).
>
> By using the `*` operator we read or change the value stored at that address (`*xPtr`).

The pointer itself is also copied, but the copy points to the same variable.

## Creating pointers using the new function

Another way to get a pointer is to use the built-in `new` function:

```go
func one(xPtr *int) {
    *xPtr = 1
}

func main() {
    xPtr := new(int) // *int pointing to a zeroed int
    fmt.Println(*xPtr) // 0
    one(xPtr)
    fmt.Println(*xPtr) // 1
}
```

`new(T)` takes a type as an argument, allocates enough memory to fit a zero value of that type and returns a pointer to it (`*T`).

> Since Go 1.26, `new` also accepts an expression and uses it as the initial value: `p := new(42)` or `Age: new(30)` for optional `*int` fields.

In some programming languages there is a significant difference between using `new` and `&`, with great care being needed to eventually delete anything created with new. Go is not like this, it's a garbage collected programming language which means memory is cleaned up automatically when nothing refers to it anymore.

For structs, `&T{...}` is more common than `new(T)` because it lets you set fields at the same time.

## Pointers to structs

Pointers are rarely used with Go's built-in types, but they are extremely useful when paired with structs.

Struct fields can be accessed through a pointer without explicit dereference: `p.X` is shorthand for `(*p).X`.

```go
package main

import "fmt"

type Person struct {
    Name string
    Age  int
}

func birthday(p *Person) {
    p.Age++ // same as (*p).Age++
}

func main() {
    alice := Person{Name: "Alice", Age: 30}
    birthday(&alice)
    fmt.Println(alice.Age)

    bob := &Person{Name: "Bob"} // pointer to a new struct
    bob.Age = 40
    fmt.Println(*bob)
    fmt.Println(bob)
}
// 31
// {Bob 40}
// &{Bob 40}
```

The same auto-dereference applies to method calls with pointer receivers (see methods notes) and to indexing a pointer to an array (`p[i]`).

## No pointer arithmetic

Unlike C, Go has no pointer arithmetic: `p++` or `p + 1` on a pointer doesn't compile. (The `unsafe` package allows it, but you should almost never need it.)

Pointers are comparable: two pointers are equal if they point to the same variable (or are both `nil`).

```go
a, b := 1, 1
pa, pb := &a, &b
fmt.Println(pa == pb, *pa == *pb, pa == &a) // false true true
```

## Returning pointers to local variables

It is perfectly safe to return the address of a local variable — the variable survives as long as something references it:

```go
package main

import "fmt"

func newCounter() *int {
    c := 0
    return &c
}

func main() {
    p := newCounter()
    *p++
    *p++
    fmt.Println(*p)
}
// 2
```

The compiler's **escape analysis** decides where variables live: values that don't outlive the function stay on the (cheap) stack, values that "escape" (like `c` above) are moved to the heap and managed by the garbage collector. You can see the decisions with:

```bash
go build -gcflags=-m
# ./main.go:6:2: moved to heap: c
```

So a pointer isn't automatically "faster": heap allocations add GC work, and small values are often cheaper to copy.

## Pointers in go

Pointers can be used to:

- Allow a function to directly mutate a value that is passed to it
- To increase performance in edge cases. Sometimes passing a large struct of data results in inefficient copying of data
- To signify the lack of a value. For example, when unmarshalling JSON data into a struct it can be useful to know if a key was absent (`nil`) rather than it being present with the zero value.
- To share one value between several owners (e.g. a struct holding a `sync.Mutex` must not be copied, so it is passed around as a pointer).

When **not** to use them:

- Slices, maps, channels and functions already contain references internally — you rarely need `*[]T` or `*map[K]V`.
- Small structs and basic types: just pass the value.
- Be consistent per type: if some methods of a type need a pointer receiver, give all of them pointer receivers.
