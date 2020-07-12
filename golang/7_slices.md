# Slices

A slice just describes a section of an underlying array. Slices have no specified length.

## Declaration

A slice literal is declared just like an array literal, except you leave out the element count:

```go
letters := []string{"a", "b", "c", "d"}
// does not allocate memory and s points to nil
```

A slice can be created with the built-in function called **make**, which has the signature:

```go
func make([]T, len, cap) []T
```

where **T** stands for the element type of the slice to be created. The `make` function takes a **type**, a **length**, and an optional **capacity**. When called, `make` allocates an array and returns a slice that refers to that array.

```go
var s []byte
s = make([]byte, 5, 5)
// s == []byte{0, 0, 0, 0, 0}
```

When the capacity argument is omitted, it defaults to the specified length. Here's a more succinct version of the same code:

```go
s := make([]byte, 5)
```

## Slice length and capacity

A slice has both a length and a capacity.

- The length of a slice is the number of elements it contains.
- The capacity of a slice is the number of elements in the underlying array, counting from the first element in the slice.

The length and capacity of a slice s can be obtained using the expressions `len(s)` and `cap(s)`.

```go
package main

import "fmt"

func main() {
	s := []int{2, 3, 5, 7, 11, 13}
	printSlice(s)

	// Slice the slice to give it zero length.
	s = s[:0]
	printSlice(s)

	// Extend its length.
	s = s[:4]
	printSlice(s)

	// Drop its first two values.
	s = s[2:]
	printSlice(s)
}

func printSlice(s []int) {
	fmt.Printf("len=%d cap=%d %v\n", len(s), cap(s), s)
}
// len=6 cap=6 [2 3 5 7 11 13]
// len=0 cap=6 []
// len=4 cap=6 [2 3 5 7]
// len=2 cap=4 [5 7]
```

## Slicing

A slice can also be formed by "slicing" an existing slice or array. Slicing is done by specifying a half-open range with two indices separated by a colon:

```go
a[low : high]
```

This selects a half-open range which includes the first element, but excludes the last one.

The following expression creates a slice which includes elements 1 through 3 of a:

```go
a[1:4]
```

When slicing, you may omit the high or low bounds to use their defaults instead. The default is zero for the low bound and the length of the slice for the high bound. These slice expressions are equivalent:

```go
var a [10]int
a[0:10]
a[:10]
a[0:]
a[:]
```

## Slices are references

A slicing does not copy any data, it creates a new slice value that points to the original array. Changing the elements of a slice modifies the corresponding elements of its underlying array.

```go
package main

import "fmt"

func main() {
    names := [4]string{
        "John",
        "Paul",
        "George",
        "Ringo",
    }
    fmt.Println(names)

    a := names[0:2]
    b := names[1:3]
    fmt.Println(a, b)

    b[0] = "XXX"
    fmt.Println(a, b)
    fmt.Println(names)
}
// [John Paul George Ringo]
// [John Paul] [Paul George]
// [John XXX] [XXX George]
// [John XXX George Ringo]
```

## Default values

The zero value of a slice is nil.

A nil slice has a length and capacity of 0 and has no underlying array.

```go
package main

import "fmt"

func main() {
	var s []int
	fmt.Println(s, len(s), cap(s))
	if s == nil {
		fmt.Println("nil!")
	}
}
```

## Appending to a slice

It is common to append new elements to a slice, and so Go provides a built-in append function.

```go
func append(s []T, vs ...T) []T

slice = append(slice, elem1, elem2)
slice = append(slice, anotherSlice...)
```

The first parameter `s` of append is a slice of type `T`, and the rest are `T` values to append to the slice.

```go
package main

import "fmt"

func main() {
	var s []int
	printSlice(s)

	// append works on nil slices.
	s = append(s, 0)
	printSlice(s)

	// The slice grows as needed.
	s = append(s, 1)
	printSlice(s)

	// We can add more than one element at a time.
	s = append(s, 2, 3, 4)
	printSlice(s)
}

func printSlice(s []int) {
	fmt.Printf("len=%d cap=%d %v\n", len(s), cap(s), s)
}
// len=0 cap=0 []
// len=1 cap=2 [0]
// len=2 cap=2 [0 1]
// len=5 cap=8 [0 1 2 3 4]
```

## Iteration

The **range** form of the for loop iterates over a slice or map. When ranging over a slice, two values are returned for each iteration,

- the index
- and a copy of the element at that index.

```go
package main

import "fmt"

var pow = []int{1, 2, 4, 8, 16, 32, 64, 128}

func main() {
	for index, value := range pow {
		fmt.Printf("2**%d = %d\n", index, value)
	}
}
// 2**0 = 1
// 2**1 = 2
// 2**2 = 4
// 2**3 = 8
// 2**4 = 16
// 2**5 = 32
// 2**6 = 64
// 2**7 = 128
```

You can skip the index or value by assigning to _.

```go
for i, _ := range pow
for _, value := range pow
```

If you only want the index, you can omit the second variable.

```go
for i := range pow
```

## Clear a slice

### Remove all elements

To remove all elements, simply set the slice to nil.

```go
a := []string{"A", "B", "C", "D", "E"}
a = nil
fmt.Println(a, len(a), cap(a)) // [] 0 0
```

This will release the underlying array to the garbage collector (assuming there are no other references).

### Keep allocated memory

To keep the underlying array, slice the slice to zero length.

```go
a := []string{"A", "B", "C", "D", "E"}
a = a[:0]
fmt.Println(a, len(a), cap(a)) // [] 0 5
```

If the slice is extended again, the original data reappears.

```go
fmt.Println(a[:2]) // [A B]
```

The official Go wiki recommends using nil slices over empty slices.
