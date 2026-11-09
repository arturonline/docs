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

We now have four different types of animals: A dog, a cat, a llama, and a Java programmer. In our `main()` function, we can create a slice of Animals, and put one of each type into that slice, and see what each animal says. Let's do that now:

```go
func main() {
    animals := []Animal{Dog{}, Cat{}, Llama{}, JavaProgrammer{}}
    for _, animal := range animals {
        fmt.Println(animal.Speak())
    }
}
// Woof!
// Meow!
// ?????
// Design patterns!
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
// hello
```

Remember method sets: if `M` had a pointer receiver `(t *T)`, only `*T` would implement `I` (`var i I = &T{"hello"}`).

### Compile-time check

Since nothing says "T implements I", you can force the compiler to check it with a blank variable declaration (zero runtime cost):

```go
var _ I = T{}         // T implements I
var _ I = (*T)(nil)   // *T implements I (typical when methods have pointer receivers)
```

If the method set doesn't match, the build fails right there instead of somewhere far away.

## Interface values

An interface value is constructed of two words of data; one word points to the dynamic **type** information (plus the method table for that type), and the other points to the actual data being held by that value:

```go
(type, value)
```

```go
var a Animal = Dog{}
fmt.Printf("%v %T\n", a, a)
// {} main.Dog
```

## Nil interface vs interface holding a nil pointer

An interface is `nil` only if **both** type and value are nil. An interface holding a nil pointer has a type, so it is **not** nil. This is a classic gotcha with `error`:

```go
package main

import "fmt"

type MyErr struct{}

func (e *MyErr) Error() string { return "my error" }

func mayFail(fail bool) error {
    var p *MyErr // nil pointer
    if fail {
        p = &MyErr{}
    }
    return p // BUG: returns (type=*MyErr, value=nil), which is != nil
}

func mayFailFixed(fail bool) error {
    if fail {
        return &MyErr{}
    }
    return nil // return a literal nil interface
}

func main() {
    var i any
    fmt.Println(i == nil)

    var p *int
    i = p
    fmt.Println(i == nil)
    fmt.Printf("%T %v\n", i, i)

    fmt.Println(mayFail(false) == nil)
    fmt.Println(mayFailFixed(false) == nil)
}
// true
// false
// *int <nil>
// false
// true
```

>💡 Rule: functions returning an interface (especially `error`) should `return nil` explicitly, never a typed nil pointer variable.

Calling a method on a nil interface panics; calling a method on an interface holding a nil pointer works (the method gets a nil receiver) as long as the method doesn't dereference it.

## The empty interface (`any`)

The interface type that specifies zero methods is known as the empty interface. Since Go 1.18, `any` is a built-in alias for it, and it is the preferred spelling:

```go
interface{}
any // same type
```

The empty interface is the interface that has no methods. Since there is no implements keyword, all types implement at least zero methods, and satisfying an interface is done automatically, all types satisfy the empty interface. That means that if you write a function that takes an `any` value as a parameter, you can supply that function with any value.

Empty interfaces are used by code that handles values of unknown type. For example, `fmt.Print` takes any number of arguments of type `any`.

```go
package main

import "fmt"

func main() {
    var i any
    describe(i)

    i = 42
    describe(i)

    i = "hello"
    describe(i)
}

func describe(i any) {
    fmt.Printf("(%v, %T)\n", i, i)
}
// (<nil>, <nil>)
// (42, int)
// (hello, string)
```

>💡 `any` throws away static type safety. If you just need "a function that works for several types", prefer **generics** (`func Max[T cmp.Ordered](a, b T) T`).

## Type assertions

A type assertion provides access to an interface value's underlying concrete value.

```go
t := i.(T)
```

This statement asserts that the interface value i holds the concrete type T and assigns the underlying T value to the variable t.

If i does not hold a T, the statement will trigger a panic.

To test whether an interface value holds a specific type, a type assertion can return two values: the underlying value and a boolean value that reports whether the assertion succeeded ("comma-ok" idiom).

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
    var i any = "hello"

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
// panic: interface conversion: interface {} is string, not float64
```

`T` can also be an interface type: `w, ok := x.(io.Writer)` checks whether the dynamic value *also* implements `io.Writer` (used to detect optional capabilities).

## Type switches

A type switch runs several type assertions in a row. Inside each `case`, `v` has that case's type.

```go
package main

import (
    "fmt"
    "time"
)

func describe(i any) string {
    switch v := i.(type) {
    case int:
        return fmt.Sprintf("int doubled: %d", v*2)
    case string:
        return fmt.Sprintf("string of len %d", len(v))
    case nil:
        return "nil"
    case fmt.Stringer: // interface cases work too
        return "Stringer: " + v.String()
    default: // v has the same type as i (any)
        return fmt.Sprintf("unknown %T", v)
    }
}

func main() {
    fmt.Println(describe(21))
    fmt.Println(describe("hey"))
    fmt.Println(describe(nil))
    fmt.Println(describe(time.Second))
    fmt.Println(describe(3.5))
}
// int doubled: 42
// string of len 3
// nil
// Stringer: 1s
// unknown float64
```

Cases are checked in order, so put specific types before broad interfaces. A case listing several types (`case int, int64:`) leaves `v` as the original interface type.

## Interface embedding

Interfaces can be composed by embedding other interfaces:

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

type ReadWriter interface { // = io.ReadWriter
    Reader
    Writer
}
```

## Common standard interfaces

| Interface | Method(s) | Used by |
| --------- | --------- | ------- |
| `fmt.Stringer` | `String() string` | `fmt` printing |
| `error` | `Error() string` | everything (see errors notes) |
| `io.Reader` | `Read(p []byte) (n int, err error)` | files, network, `strings.NewReader`, `bufio` |
| `io.Writer` | `Write(p []byte) (n int, err error)` | files, `os.Stdout`, `bytes.Buffer`, HTTP responses |
| `sort.Interface` | `Len() int`, `Less(i, j int) bool`, `Swap(i, j int)` | `sort.Sort` |

### Stringers

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
// Arthur Dent (42 years) Zaphod Beeblebrox (9001 years)
```

>⚠️ Don't call `fmt.Sprintf("%v", p)` on the receiver itself inside `String()`: it calls `String()` again → infinite recursion.

### io.Reader / io.Writer

Anything that implements `Write` can be used with `fmt.Fprintf`, `io.Copy`, etc.

```go
package main

import (
    "fmt"
    "io"
    "os"
    "strings"
)

type CountingWriter struct {
    N int
}

func (c *CountingWriter) Write(p []byte) (int, error) {
    c.N += len(p)
    return len(p), nil
}

var _ io.Writer = (*CountingWriter)(nil) // compile-time check

func main() {
    cw := &CountingWriter{}
    fmt.Fprintf(cw, "hello %s", "gopher")
    fmt.Println(cw.N)

    r := strings.NewReader("copied to stdout\n")
    io.Copy(os.Stdout, r) // any Reader -> any Writer
}
// 12
// copied to stdout
```

### sort.Interface

```go
package main

import (
    "fmt"
    "sort"
)

type Person struct {
    Name string
    Age  int
}

type ByAge []Person

func (a ByAge) Len() int           { return len(a) }
func (a ByAge) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a ByAge) Less(i, j int) bool { return a[i].Age < a[j].Age }

func main() {
    people := []Person{{"Ana", 31}, {"Paco", 22}, {"Rafa", 45}}
    sort.Sort(ByAge(people))
    fmt.Println(people)
}
// [{Paco 22} {Ana 31} {Rafa 45}]
```

>💡 In modern Go (1.21+) the same is usually done without a new type: `slices.SortFunc(people, func(a, b Person) int { return cmp.Compare(a.Age, b.Age) })`.

## Interface design advice

- **Keep interfaces small**: one or two methods (`io.Reader`, `fmt.Stringer`). "The bigger the interface, the weaker the abstraction."
- Name single-method interfaces with the method + `-er`: `Reader`, `Writer`, `Closer`, `Stringer`.
- **Define interfaces where they are used** (consumer side), not next to the implementation.
- **Accept interfaces, return concrete types (structs)**.
- Don't create an interface until you actually need it (two implementations, or tests).
