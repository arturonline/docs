# Methods

A method is just a function with a special **receiver** type between the func keyword and the method name. The receiver can either be a struct type or non-struct type.

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
    fmt.Println("Rectangle is: ", r1)
    fmt.Println("Rectangle area is: ", r1.Area())
}
// Rectangle is: {4 3}
// Rectangle area is: 12
```

>💡 Go doesn’t allow you to define a method on a receiver type that is defined in some other package (this includes built-in types such as int as well).

## Pointer Receivers

With a value receiver, the method operates on a copy of the value passed to it. Therefore, any modifications done to the receiver inside the method is not visible to the caller. Methods with pointer receivers can modify the value to which the receiver points. Such modifications are visible to the caller of the method as well:

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
    (&e).changeAge(51)
    fmt.Printf("\nEmployee age after change: %d", e.age)
}
// Employee name before change: Mark Andrew
// Employee name after change: Mark Andrew

// Employee age before change: 50
// Employee age after change: 51
```

In the program above, the `changeName` method has a value receiver `(e Employee)` whereas the `changeAge` method has a pointer receiver `(e *Employee)`. Changes made to Employee struct's name field inside `changeName` will not be visible to the caller and hence the program prints the same name before and after the method `e.changeName("Michael Andrew")` is called. Since `changeAge` method has a pointer receiver `(e *Employee)`, changes made to age field after the method call `(&e).changeAge(51)` will be visible to the caller.

## Methods and pointer indirection

Comparing the previous two programs, you might notice that functions with a pointer argument must take a pointer:

```go
type Vertex struct {
    X, Y float64
}

var v Vertex
ScaleFunc(v, 5)  // Compile error!
ScaleFunc(&v, 5) // OK
```

while methods with pointer receivers take either a value or a pointer as the receiver when they are called:

```go
type Vertex struct {
    X, Y float64
}

var v Vertex
v.Scale(5)  // OK
p := &v
p.Scale(10) // OK
```

For the statement `v.Scale(5)`, even though v is a value and not a pointer, the method with the pointer receiver is called automatically. That is, as a convenience, Go interprets the statement `v.Scale(5)` as `(&v).Scale(5)` since the Scale method has a pointer receiver.

## Methods and pointer indirection (2)

The equivalent thing happens in the reverse direction.

Functions that take a value argument must take a value of that specific type:

```go
type Vertex struct {
    X, Y float64
}

var v Vertex
fmt.Println(AbsFunc(v))  // OK
fmt.Println(AbsFunc(&v)) // Compile error!
```

while methods with value receivers take either a value or a pointer as the receiver when they are called:

```go
type Vertex struct {
    X, Y float64
}

var v Vertex
fmt.Println(v.Abs()) // OK
p := &v
fmt.Println(p.Abs()) // OK
```

In this case, the method call p.Abs() is interpreted as (*p).Abs().

## Choosing a value or pointer receiver

There are two reasons to use a pointer receiver:

1. The first is so that the method can modify the value that its receiver points to.
2. The second is to avoid copying the value on each method call. This can be more efficient if the receiver is a large struct, for example.

## Defining Methods on non-struct types

Go allows you to define methods on non-struct types too. To define a method on a type, the definition of the receiver type and the definition of the method should be present in the same package. In the following example, I’ve defined a method called `reverse()` on the type `MyString`.

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
