# Interfaces

An interface is two things: it is a set of methods, but it is also a type.

Example:

```go
type Animal interface {
    Speak() string
}
```

Any type that defines the `Speak()` method is said to satisfy the Animal interface. There is no implements keyword in Go.

```go
type Dog struct {
}

func (d Dog) Speak() string {
    return "Woof!"
}

type Cat struct {
}

func (c Cat) Speak() string {
    return "Meow!"
}

type Llama struct {
}

func (l Llama) Speak() string {
    return "?????"
}

type JavaProgrammer struct {
}

func (j JavaProgrammer) Speak() string {
    return "Design patterns!"
}
```

We now have four different types of animals: A dog, a cat, a llama, and a Java programmer. In our `main()` function, we can create a slice of Animals, and put one of each type into that slice, and see what each animal says. Let’s do that now:

```go
func main() {
    animals := []Animal{Dog{}, Cat{}, Llama{}, JavaProgrammer{}}
    for _, animal := range animals {
        fmt.Println(animal.Speak())
    }
}
```

## Interfaces are implemented implicitly

A type implements an interface by implementing its methods. There is no explicit declaration of intent, no "implements" keyword.

Implicit interfaces decouple the definition of an interface from its implementation, which could then appear in any package without prearrangement.

```go
package main

import "fmt"

type I interface {
    M()
}

type T struct {
    S string
}

// This method means type T implements the interface I,
// but we don't need to explicitly declare that it does so.
func (t T) M() {
    fmt.Println(t.S)
}

func main() {
    var i I = T{"hello"}
    i.M()
}
```

## Interface values

An interface value is constructed of two words of data; one word is used to point to a method table for the value’s underlying type, and the other word is used to point to the actual data being held by that value:

```go
(type, value)
```

## The empty interface

The interface type that specifies zero methods is known as the empty interface:

```go
interface{}
```

The `interface{}` type is the interface that has no methods. Since there is no implements keyword, all types implement at least zero methods, and satisfying an interface is done automatically, all types satisfy the empty interface. That means that if you write a function that takes an `interface{}` value as a parameter, you can supply that function with any value.

Empty interfaces are used by code that handles values of unknown type. For example, `fmt.Print` takes any number of arguments of type `interface{}`.

```go
package main

import "fmt"

func main() {
    var i interface{}
    describe(i)

    i = 42
    describe(i)

    i = "hello"
    describe(i)
}

func describe(i interface{}) {
    fmt.Printf("(%v, %T)\n", i, i)
}
// (<nil>, <nil>)
// (42, int)
// (hello, string)
```

## Type assertions

A type assertion provides access to an interface value's underlying concrete value.

```go
t := i.(T)
```

This statement asserts that the interface value i holds the concrete type T and assigns the underlying T value to the variable t.

If i does not hold a T, the statement will trigger a panic.

To test whether an interface value holds a specific type, a type assertion can return two values: the underlying value and a boolean value that reports whether the assertion succeeded.

```go
t, ok := i.(T)
```

If i holds a T, then t will be the underlying value and ok will be true.

If not, ok will be false and t will be the zero value of type T, and no panic occurs.

Note the similarity between this syntax and that of reading from a map.

```go
package main

import "fmt"

func main() {
    var i interface{} = "hello"

    s := i.(string)
    fmt.Println(s)

    s, ok := i.(string)
    fmt.Println(s, ok)

    f, ok := i.(float64)
    fmt.Println(f, ok)

    f = i.(float64) // panic
    fmt.Println(f)
}
// hello
// hello true
// 0 false
// panic: interface conversion
```

## Stringers

A Stringer is a type that can describe itself as a string. The fmt package (and many others) look for this interface to print values.

```go
type Stringer interface {
    String() string
}
```

Example:

```go
package main

import "fmt"

type Person struct {
    Name string
    Age  int
}

func (p Person) String() string {
    return fmt.Sprintf("%v (%v years)", p.Name, p.Age)
}

func main() {
    a := Person{"Arthur Dent", 42}
    z := Person{"Zaphod Beeblebrox", 9001}
    fmt.Println(a, z)
}
```
