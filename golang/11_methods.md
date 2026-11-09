# Methods

A method is just a function with a special **receiver** argument between the `func` keyword and the method name. The receiver can be any named type defined in the same package: a struct type or a non-struct type.

```go
package main

import "fmt"

type Rectangle struct {
    length, width int
}

func (r Rectangle) Area() int {
    return r.length * r.width
}

func main() {
    r1 := Rectangle{4, 3}
    fmt.Println("Rectangle is:", r1)
    fmt.Println("Rectangle area is:", r1.Area())
}
// Rectangle is: {4 3}
// Rectangle area is: 12
```

>💡 Go doesn't allow you to define a method on a receiver type that is defined in some other package (this includes built-in types such as `int` as well). Define your own type instead: `type MyInt int`.

## Pointer Receivers

With a value receiver, the method operates on a copy of the value passed to it. Therefore, any modifications done to the receiver inside the method are not visible to the caller. Methods with pointer receivers can modify the value to which the receiver points. Such modifications are visible to the caller of the method as well:

```go
package main

import (
    "fmt"
)

type Employee struct {
    name string
    age  int
}

/*
Method with value receiver
*/
func (e Employee) changeName(newName string) {
    e.name = newName
}

/*
Method with pointer receiver
*/
func (e *Employee) changeAge(newAge int) {
    e.age = newAge
}

func main() {
    e := Employee{
        name: "Mark Andrew",
        age:  50,
    }
    fmt.Printf("Employee name before change: %s", e.name)
    e.changeName("Michael Andrew")
    fmt.Printf("\nEmployee name after change: %s", e.name)

    fmt.Printf("\n\nEmployee age before change: %d", e.age)
    (&e).changeAge(51) // e.changeAge(51) also works, see below
    fmt.Printf("\nEmployee age after change: %d\n", e.age)
}
// Employee name before change: Mark Andrew
// Employee name after change: Mark Andrew
//
// Employee age before change: 50
// Employee age after change: 51
```

In the program above, the `changeName` method has a value receiver `(e Employee)` whereas the `changeAge` method has a pointer receiver `(e *Employee)`. Changes made to Employee struct's name field inside `changeName` will not be visible to the caller and hence the program prints the same name before and after the method `e.changeName("Michael Andrew")` is called. Since `changeAge` method has a pointer receiver `(e *Employee)`, changes made to age field after the method call `(&e).changeAge(51)` will be visible to the caller.

## Methods and pointer indirection

The examples below use these definitions:

```go
type Vertex struct {
    X, Y float64
}

func (v Vertex) Abs() float64 { return math.Sqrt(v.X*v.X + v.Y*v.Y) } // value receiver
func (v *Vertex) Scale(f float64) { v.X *= f; v.Y *= f }              // pointer receiver

func AbsFunc(v Vertex) float64 { return math.Sqrt(v.X*v.X + v.Y*v.Y) } // value argument
func ScaleFunc(v *Vertex, f float64) { v.X *= f; v.Y *= f }            // pointer argument
```

Functions with a pointer argument must take a pointer:

```go
var v Vertex
ScaleFunc(v, 5)  // Compile error!
ScaleFunc(&v, 5) // OK
```

while methods with pointer receivers take either a value or a pointer as the receiver when they are called:

```go
var v Vertex
v.Scale(5)  // OK
p := &v
p.Scale(10) // OK
```

For the statement `v.Scale(5)`, even though `v` is a value and not a pointer, the method with the pointer receiver is called automatically. That is, as a convenience, Go interprets the statement `v.Scale(5)` as `(&v).Scale(5)` since the `Scale` method has a pointer receiver.

>⚠️ This only works if `v` is **addressable** (a variable, a field of an addressable struct, a slice element). `Vertex{3, 4}.Scale(2)` or `m["k"].Scale(2)` (map element) are compile errors.

## Methods and pointer indirection (2)

The equivalent thing happens in the reverse direction.

Functions that take a value argument must take a value of that specific type:

```go
var v Vertex
fmt.Println(AbsFunc(v))  // OK
fmt.Println(AbsFunc(&v)) // Compile error!
```

while methods with value receivers take either a value or a pointer as the receiver when they are called:

```go
var v Vertex
fmt.Println(v.Abs()) // OK
p := &v
fmt.Println(p.Abs()) // OK
```

In this case, the method call `p.Abs()` is interpreted as `(*p).Abs()`. (If `p` is `nil`, this panics.)

## Choosing a value or pointer receiver

There are two reasons to use a pointer receiver:

1. The first is so that the method can modify the value that its receiver points to.
2. The second is to avoid copying the value on each method call. This can be more efficient if the receiver is a large struct, for example.

Rules of thumb:

- The struct contains a `sync.Mutex` or similar non-copyable field → **pointer** (copying a mutex is a bug).
- Small, immutable-ish values (`time.Time`, a `Point`), or maps/funcs/chans → **value** is fine.
- **Be consistent**: if some methods of a type need a pointer receiver, give all of them pointer receivers.
- When in doubt, use a pointer receiver.

## Method sets

The method set of a type decides which interfaces it satisfies:

| Type | Method set |
| ---- | ---------- |
| `T`  | methods with receiver `T` |
| `*T` | methods with receiver `T` **and** `*T` |

So if a method has a pointer receiver, only `*T` (not `T`) implements the interface. The automatic `&v` from above does not apply to interface assignment.

```go
package main

import "fmt"

type Shape interface {
    Area() float64
}

type Square struct {
    side float64
}

func (s *Square) Area() float64 {
    return s.side * s.side
}

func main() {
    var s Shape = &Square{2} // OK: *Square has Area
    // var s2 Shape = Square{2} // Compile error: Square does not implement Shape (method Area has pointer receiver)
    fmt.Println(s.Area())
}
// 4
```

## Defining Methods on non-struct types

Go allows you to define methods on non-struct types too. To define a method on a type, the definition of the receiver type and the definition of the method should be present in the same package. In the following example, I've defined a method called `reverse()` on the type `MyString`.

```go
package main

import (
    "fmt"
)

type MyString string

func (myStr MyString) reverse() string {
    s := string(myStr)
    runes := []rune(s)

    for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
        runes[i], runes[j] = runes[j], runes[i]
    }
    return string(runes)
}

func main() {
    myStr := MyString("OLLEH")
    fmt.Println(myStr.reverse())
}
// HELLO
```

It works with any named type, e.g. slices or funcs (`http.HandlerFunc` is a func type with a `ServeHTTP` method):

```go
type IntList []int

func (l IntList) Sum() int {
    total := 0
    for _, n := range l {
        total += n
    }
    return total
}

fmt.Println(IntList{1, 2, 3}.Sum()) // 6
```

>💡 A type **alias** (`type Text = string`) is the same type as the original, so you can't add methods to it. Use a type definition (`type Text string`).

## Method values and method expressions

A **method value** (`x.M`) is a function bound to a specific receiver. A **method expression** (`T.M`) is a function that takes the receiver as its first argument.

```go
package main

import "fmt"

type Counter struct {
    n int
}

func (c *Counter) Inc()   { c.n++ }
func (c Counter) Get() int { return c.n }

func main() {
    c := &Counter{}

    inc := c.Inc // method value: bound to c
    inc()
    inc()
    fmt.Println(c.Get())

    get := Counter.Get        // method expression: func(Counter) int
    incExpr := (*Counter).Inc // method expression: func(*Counter)
    incExpr(c)
    fmt.Println(get(*c))
}
// 2
// 3
```

Method values are handy as callbacks: `http.HandleFunc("/", srv.handleIndex)`, `time.AfterFunc(time.Second, c.Inc)`. The receiver is evaluated when the method value is created (a value receiver is copied at that moment).
