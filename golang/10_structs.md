# Structs

A struct is a user-defined type that contains a collection of named fields/properties. It is used to group related data together to form a single unit.

## Defining a struct type

```go
type Person struct {
	FirstName string
	LastName  string
	Age       int
}
```

## Declaring and initializing a struct

```go
// Declares a variable of type 'Person'
var p Person // All the struct fields are initialized with their zero value

// Initialize a struct by supplying the value of all the struct fields.
var p = Person{"Rajeev", "Singh", 26}

var p = Person{"Rajeev"} // Compiler Error: you can’t initialize only a subset of fields with the above syntax
```

### Naming syntax

```go
// Naming fields:
var p = Person{FirstName: "Rajeev", LastName: "Singh", Age: 25}


// The name: value syntax allows you to initialize only a subset of fields.
var p = Person{FirstName: "Alien"} // LastName: "", Age: 0
```

## Accessing fields of a struct

2 ways, dot notation, or pointers.

### #1: Dot notation

You can access individual fields of a struct using the dot (.) operator:

```go
package main

import (
	"fmt"
)

type Car struct {
	Name, Model, Color string
	WeightInKg         float64
}

func main() {
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
}
// Car Name:  Ferrari
// Car Color:  Red
// Car:  {Ferrari GTC4 Black 1920}
```

### #2: Pointer to a struct

Go lets you directly access the fields of a struct through the pointer without explicit dereference.

```go
package main

import (
	"fmt"
)

type Student struct {
	RollNumber int
	Name       string
}

func main() {
	// instance of student struct type
	s := Student{11, "Jack"}

	// Pointer to the student struct
	ps := &s
	fmt.Println(ps)

	// Accessing struct fields via pointer
	fmt.Println((*ps).Name)

	ps.RollNumber = 31
	fmt.Println(ps)
}

// &{11 Jack}
// Jack
// Jack
// &{31 Jack}
```

## Structs are value types

When you assign one struct variable to another, a new copy of the struct is created and assigned. Similarly, when you pass a struct to another function, the function gets its own copy of the struct.

```go
package main

import "fmt"

type Point struct {
	X float64
	Y float64
}

func main() {
	// Structs are value types.
	p1 := Point{10, 20}
	p2 := p1 // A copy of the struct `p1` is assigned to `p2`
	fmt.Println("p1 = ", p1)
	fmt.Println("p2 = ", p2)

	p2.X = 15
	fmt.Println("\nAfter modifying p2:")
	fmt.Println("p1 = ", p1)
	fmt.Println("p2 = ", p2)
}
// p1 =  {10 20}
// p2 =  {10 20}

// After modifying p2:
// p1 =  {10 20}
// p2 =  {15 20}
```

## Struct Equality

Two struct variables are equal if all their corresponding fields are equal.

```go
package main

import "fmt"

type Point struct {
	X float64
	Y float64
}

func main() {
	// Two structs are equal if all their corresponding fields are equal.
	p1 := Point{3.4, 5.2}
	p2 := Point{3.4, 5.2}

	if p1 == p2 {
		fmt.Println("Point p1 and p2 are equal.")
	} else {
		fmt.Println("Point p1 and p2 are not equal.")
	}
}

// Point p1 and p2 are equal.
```
