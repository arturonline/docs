# Slices

A slice just describes a section of an underlying array. A slice is a small struct (a "slice header") with three fields:

- a **pointer** to the first element it can see in the underlying array,
- its **length**,
- its **capacity**.

The header is copied by value, but the elements live in the shared array — so copies of a slice see (and modify) the same data.

The type `[]T` is a slice with elements of type `T` (no length in the type, unlike arrays).

## Declaration

A slice literal is declared just like an array literal, except you leave out the element count:

```go
letters := []string{"a", "b", "c", "d"}
// creates an underlying [4]string array and a slice pointing to it
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

A common pattern is `make([]T, 0, n)` when you know roughly how many elements you will `append` — it avoids reallocations.

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

A slice can be re-extended up to its capacity, but not beyond (`s[:cap(s)+1]` panics). Dropping elements from the front (`s[2:]`) loses them for good.

## Slicing

A slice can also be formed by "slicing" an existing slice or array. Slicing is done by specifying a half-open range with two indices separated by a colon:

```go
a[low : high]
```

This selects a half-open range which includes the first element, but excludes the last one. The result has `len = high - low`.

Example: the following expression creates a slice which includes elements 1 through 3 of a:

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

### Full slice expression `a[low:high:max]`

A third index limits the capacity of the result: `cap = max - low`. This is the way to hand out a sub-slice that cannot overwrite the rest of the original array when someone appends to it (see the gotcha below).

```go
a := []int{1, 2, 3, 4, 5}
t := a[1:3:3]
fmt.Println(t, len(t), cap(t)) // [2 3] 2 2
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

### Passing slices to functions

The function gets a copy of the header: it can change the **elements**, but an `append` inside it is not visible to the caller (the caller's length doesn't change). Return the new slice instead.

```go
package main

import "fmt"

func setFirst(s []int) {
    s[0] = 100 // visible to caller
}

func addLost(s []int) {
    s = append(s, 4) // only the local copy of the header changes
}

func add(s []int) []int {
    return append(s, 4)
}

func main() {
    s := []int{1, 2, 3}
    setFirst(s)
    addLost(s)
    fmt.Println(s)

    s = add(s)
    fmt.Println(s)
}
// [100 2 3]
// [100 2 3 4]
```

## Default values: nil vs empty slice

The zero value of a slice is `nil`.

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

    e := []int{} // empty, but not nil
    fmt.Println(e, len(e), e == nil)
}
// [] 0 0
// nil!
// [] 0 false
```

Both behave the same with `len`, `range` and `append`, so check emptiness with `len(s) == 0`, not `s == nil`. One visible difference: `encoding/json` encodes a nil slice as `null` and an empty slice as `[]`.

Slices are not comparable with `==` (only against `nil`). Use `slices.Equal`.

## Appending to a slice

It is common to append new elements to a slice, and so Go provides a built-in `append` function.

```go
func append(s []T, vs ...T) []T

slice = append(slice, elem1, elem2)
slice = append(slice, anotherSlice...)
```

The first parameter `s` of append is a slice of type `T`, and the rest are `T` values to append to the slice. Always assign the result back: if the capacity is not enough, `append` allocates a new, bigger array and returns a slice pointing to it.

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
// len=1 cap=1 [0]
// len=2 cap=2 [0 1]
// len=5 cap=6 [0 1 2 3 4]
```

The exact capacities are an implementation detail (roughly: double while small, ~1.25x for big slices, then rounded up to memory size classes). Don't depend on them.

### Gotcha: append and shared arrays

If there is spare capacity, `append` writes into the **existing** array — which may be shared with other slices:

```go
package main

import "fmt"

func main() {
    a := []int{1, 2, 3, 4, 5}
    s := a[1:3]       // [2 3], len 2, cap 4
    s = append(s, 99) // fits in capacity: overwrites a[3]!
    fmt.Println(a, s)

    b := []int{1, 2, 3, 4, 5}
    t := b[1:3:3]     // [2 3], len 2, cap 2
    t = append(t, 99) // no room: copies to a new array
    fmt.Println(b, t)
}
// [1 2 3 99 5] [2 3 99]
// [1 2 3 4 5] [2 3 99]
```

## Copying a slice

`copy(dst, src)` copies `min(len(dst), len(src))` elements and returns how many it copied. `dst` must already have the length you need.

```go
package main

import (
    "fmt"
    "slices"
)

func main() {
    src := []int{1, 2, 3}

    dst := make([]int, 2)
    n := copy(dst, src)
    fmt.Println(n, dst)

    full := slices.Clone(src) // independent copy (Go 1.21+)
    full[0] = 100
    fmt.Println(src, full)
}
// 2 [1 2]
// [1 2 3] [100 2 3]
```

Before `slices.Clone` the idiom was `append([]int(nil), src...)`.

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
for _, value := range pow
```

If you only want the index, you can omit the second variable (`for i, _ := range` works too, but `gofmt -s` simplifies it).

```go
for i := range pow
```

Because the value is a copy, modifying it doesn't change the slice. Use the index:

```go
nums := []int{1, 2, 3}
for _, v := range nums {
    v *= 10 // modifies the copy only
}
fmt.Println(nums) // [1 2 3]

for i := range nums {
    nums[i] *= 10
}
fmt.Println(nums) // [10 20 30]
```

## Removing elements

```go
s := []string{"a", "b", "c", "d"}
i := 1
s = append(s[:i], s[i+1:]...) // remove s[i], keeps order
fmt.Println(s) // [a c d]
```

Or with the `slices` package: `s = slices.Delete(s, i, i+1)`.

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

### clear (Go 1.21+)

The built-in `clear` sets every element to its zero value but does **not** change the length:

```go
a := []int{1, 2, 3}
clear(a)
fmt.Println(a, len(a)) // [0 0 0] 3
```

The Go code review guidelines recommend declaring empty slices as nil slices (`var t []string`) rather than `t := []string{}`.

## 2D slices (slices of slices)

Each inner slice is independent and must be created separately (rows can have different lengths):

```go
package main

import "fmt"

func main() {
    grid := make([][]int, 3)
    for i := range grid {
        grid[i] = make([]int, 4)
    }
    grid[1][2] = 5
    fmt.Println(grid)

    jagged := [][]string{
        {"a"},
        {"b", "c"},
    }
    fmt.Println(len(jagged[0]), len(jagged[1]))
}
// [[0 0 0 0] [0 0 5 0] [0 0 0 0]]
// 1 2
```

## The `slices` package (Go 1.21+)

Generic helpers in the standard library — prefer them over hand-written loops.

```go
package main

import (
    "fmt"
    "slices"
)

func main() {
    s := []int{3, 1, 4, 1, 5, 9, 2, 6}

    slices.Sort(s)
    fmt.Println(s)
    fmt.Println(slices.Contains(s, 4))
    fmt.Println(slices.Index(s, 5)) // -1 if not found
    i, found := slices.BinarySearch(s, 6)
    fmt.Println(i, found)
    fmt.Println(slices.Min(s), slices.Max(s))

    s = slices.Compact(s) // removes consecutive duplicates
    fmt.Println(s)

    s = slices.Delete(s, 1, 3) // removes s[1:3]
    fmt.Println(s)

    s = slices.Insert(s, 1, 2, 3) // inserts 2, 3 at index 1
    fmt.Println(s)

    fmt.Println(slices.Equal(s, []int{1, 2, 3, 4, 5, 6, 9}))

    r := slices.Clone(s)
    slices.Reverse(r)
    fmt.Println(r)
}
// [1 1 2 3 4 5 6 9]
// true
// 5
// 6 true
// 1 9
// [1 2 3 4 5 6 9]
// [1 4 5 6 9]
// [1 2 3 4 5 6 9]
// true
// [9 6 5 4 3 2 1]
```

Custom ordering with `slices.SortFunc` and `cmp.Compare`:

```go
package main

import (
    "cmp"
    "fmt"
    "slices"
)

type Person struct {
    Name string
    Age  int
}

func main() {
    people := []Person{{"Ana", 30}, {"Bob", 25}, {"Cid", 35}}
    slices.SortFunc(people, func(a, b Person) int {
        return cmp.Compare(a.Age, b.Age)
    })
    fmt.Println(people)

    idx := slices.IndexFunc(people, func(p Person) bool { return p.Name == "Cid" })
    fmt.Println(idx)
}
// [{Bob 25} {Ana 30} {Cid 35}]
// 2
```

Iterator helpers (Go 1.23+): `slices.All(s)` (index, value), `slices.Values(s)`, `slices.Backward(s)`, and `slices.Collect(seq)` / `slices.Sorted(seq)` to build a slice from any iterator (e.g. `slices.Sorted(maps.Keys(m))`).
