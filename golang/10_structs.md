# Structs

A struct is a user-defined type that contains a collection of named fields/properties.
It is used to group related data together to form a single unit.

## Defining a struct type

```go
type Person struct {
    FirstName string
    LastName  string
    Age       int
}
```

Fields starting with an uppercase letter are **exported** (visible from other packages); lowercase fields are private to the package.

## Initialize a struct

```go
var ana Person                       // zero value: {"" "" 0}

artur := Person{}                    // empty literal, same as the zero value

paco := Person{"Paco", "Pérez", 22}  // positional: ALL fields, in declaration order

rafa := Person{                      // named fields: any subset, any order
    FirstName: "Rafa",
    Age:       22,                   // trailing comma is required on multi-line literals
}

jr := new(Person)                    // *Person pointing to a zero-value Person

toni := &Person{FirstName: "Toni"}   // *Person from a literal (the most common way to get a pointer)
```

### Naming syntax

```go
// Naming fields:
p1 := Person{FirstName: "Rajeev", LastName: "Singh", Age: 25}

// The name: value syntax allows you to initialize only a subset of fields.
p2 := Person{FirstName: "Alien"} // LastName: "", Age: 0

p3 := Person{"Rajeev"} // Compile error: too few values in struct literal
```

>💡 Prefer named fields: positional literals break when someone adds or reorders fields (`go vet` warns about unkeyed literals of structs from other packages).

## Zero value

Every field of an uninitialized struct gets its type's zero value, so a struct is always usable. Design types so the zero value is useful when possible (e.g. `sync.Mutex`, `bytes.Buffer`).

```go
var p Person
fmt.Printf("%+v\n", p) // %+v prints field names
// {FirstName: LastName: Age:0}
```

## Accessing fields of a struct

2 ways, dot notation, or pointers.

### #1: Dot notation

You can access individual fields of a struct using the dot (.) operator:

```go
type Car struct {
    Name, Model, Color string
    WeightInKg         float64
}

c := Car{
    Name:       "Ferrari",
    Model:      "GTC4",
    Color:      "Red",
    WeightInKg: 1920,
}

// Accessing struct fields using the dot operator
fmt.Println("Car Name: ", c.Name)
fmt.Println("Car Color: ", c.Color)

// Assigning a new value to a struct field
c.Color = "Black"
fmt.Println("Car: ", c)

// Car Name:  Ferrari
// Car Color:  Red
// Car:  {Ferrari GTC4 Black 1920}
```

### #2: Pointer to a struct

Go lets you directly access the fields of a struct through the pointer without explicit dereference.

```go
type Student struct {
    RollNumber int
    Name       string
}

// instance of student struct type
s := Student{11, "Jack"}

// Pointer to the student struct
ps := &s
fmt.Println(ps)

// Accessing struct fields via pointer
fmt.Println((*ps).Name)
fmt.Println(ps.Name) // Same as above: No need to explicitly dereference the pointer

ps.RollNumber = 31
fmt.Println(ps)
// &{11 Jack}
// Jack
// Jack
// &{31 Jack}
```

## Constructors (`NewX`)

Go has no constructors. By convention, a function `NewX` builds a valid `X` (defaults, validation) and usually returns a pointer:

```go
type Server struct {
    host    string
    port    int
    timeout time.Duration
}

func NewServer(host string, port int) *Server {
    return &Server{
        host:    host,
        port:    port,
        timeout: 30 * time.Second, // sensible default
    }
}

srv := NewServer("localhost", 8080)
```

If construction can fail, return an error too: `func NewServer(...) (*Server, error)`.

## Anonymous structs

A struct type without a name, declared and used in place. Handy for one-off values, table-driven tests and ad-hoc JSON.

```go
point := struct {
    X, Y int
}{1, 2}
fmt.Println(point) // {1 2}

tests := []struct {
    in   string
    want int
}{
    {"1", 1},
    {"42", 42},
}
for _, tt := range tests {
    fmt.Println(tt.in, tt.want)
}
// 1 1
// 42 42
```

## Embedding and promotion

A field declared with only a type (no name) is **embedded**. Its fields and methods are **promoted** to the outer struct. This is composition, not inheritance: the outer type is not an `Address`.

```go
package main

import "fmt"

type Address struct {
    City    string
    Country string
}

func (a Address) Full() string {
    return a.City + ", " + a.Country
}

type Employee struct {
    Name    string
    Address // embedded: the field name is the type name, "Address"
}

func main() {
    e := Employee{
        Name:    "Ana",
        Address: Address{City: "Valencia", Country: "Spain"},
    }
    fmt.Println(e.City)         // promoted field
    fmt.Println(e.Address.City) // explicit access still works
    fmt.Println(e.Full())       // promoted method
}
// Valencia
// Valencia
// Valencia, Spain
```

- If the outer struct declares a field/method with the same name, it **shadows** the promoted one.
- If two embedded types promote the same name at the same depth, using it is a compile error (ambiguous selector); access it explicitly.
- Promoted methods count for interface satisfaction (see methods and interfaces notes).

## Struct tags

A tag is a string literal after a field, read via reflection by packages like `encoding/json`, `encoding/xml`, database and validation libraries.

```go
package main

import (
    "encoding/json"
    "fmt"
)

type User struct {
    ID       int    `json:"id"`
    Name     string `json:"name"`
    Email    string `json:"email,omitempty"` // omitted when empty
    Password string `json:"-"`               // never encoded
    age      int    // unexported: ignored by encoding/json
}

func main() {
    u := User{ID: 1, Name: "Ana", Password: "secret", age: 30}
    b, err := json.Marshal(u)
    if err != nil {
        panic(err)
    }
    fmt.Println(string(b))

    var u2 User
    err = json.Unmarshal([]byte(`{"id":2,"name":"Paco","email":"p@x.com"}`), &u2)
    if err != nil {
        panic(err)
    }
    fmt.Printf("%+v\n", u2)
}
// {"id":1,"name":"Ana"}
// {ID:2 Name:Paco Email:p@x.com Password: age:0}
```

>💡 Only exported fields are (un)marshaled. Since Go 1.24 there is also `omitzero`, which omits zero values (works for structs like `time.Time`, unlike `omitempty`).

## Structs are value types

When you assign one struct variable to another, a new copy of the struct is created and assigned. Similarly, when you pass a struct to another function, the function gets its own copy of the struct (pass a pointer if the function must modify it).

```go
type Point struct {
    X float64
    Y float64
}

// Structs are value types.
p1 := Point{10, 20}
p2 := p1 // A copy of the struct `p1` is assigned to `p2`
fmt.Println("p1 = ", p1)
fmt.Println("p2 = ", p2)

p2.X = 15
fmt.Println("\nAfter modifying p2:")
fmt.Println("p1 = ", p1)
fmt.Println("p2 = ", p2)

// p1 =  {10 20}
// p2 =  {10 20}
//
// After modifying p2:
// p1 =  {10 20}
// p2 =  {15 20}
```

>⚠️ The copy is shallow: slices, maps and pointers inside the struct still share the same underlying data.

## Struct Equality

Two struct values are equal if all their corresponding fields are equal. `==` only works if **all fields are comparable**.

```go
type Point struct {
    X float64
    Y float64
}

// Two structs are equal if all their corresponding fields are equal.
p1 := Point{3.4, 5.2}
p2 := Point{3.4, 5.2}

if p1 == p2 {
    fmt.Println("Point p1 and p2 are equal.")
} else {
    fmt.Println("Point p1 and p2 are not equal.")
}

// Point p1 and p2 are equal.
```

- Comparable structs can be used as **map keys**: `map[Point]string`.
- A struct containing a slice, map or func field is not comparable: `==` is a compile error (compare manually or use `reflect.DeepEqual`, mainly in tests).
- Comparing pointers (`&p1 == &p2`) compares addresses, not contents.
