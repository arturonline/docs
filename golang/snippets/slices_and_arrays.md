# Slice and Arrays snippets

> Since Go 1.21 the standard [`slices`](https://pkg.go.dev/slices) package covers most everyday operations (index, insert, delete, sort...). Prefer it over hand-written helpers.

## Arrays vs slices

An array has a fixed length that is part of its type (`[3]int`) and is **copied** on assignment. A slice (`[]int`) is a view (pointer, len, cap) over an array: copies **share** the same elements.

```go
a := [3]int{1, 2, 3}
b := a // full copy
b[0] = 99
fmt.Println(a, b) // [1 2 3] [99 2 3]

s := []int{1, 2, 3}
t := s // same backing array
t[0] = 99
fmt.Println(s, t) // [99 2 3] [99 2 3]

fmt.Println(a == [3]int{1, 2, 3}) // true: arrays are comparable
// s == t does not compile: use slices.Equal(s, t)
```

Create slices:

```go
var nilSlice []int            // nil, len 0: fine for append, range, len
empty := []int{}               // not nil, len 0 (marshals to [] in JSON, nil marshals to null)
buf := make([]int, 0, 100)     // len 0, cap 100: avoids reallocations when appending
fmt.Println(nilSlice == nil, empty == nil) // true false
fmt.Println(len(buf), cap(buf))            // 0 100
```

## Remove an element by index

```go
// Keeps the order. Modifies the underlying array of s.
func removeIndex(s []int, i int) []int {
	return append(s[:i], s[i+1:]...)
}

// Faster (O(1)) but does not keep the order.
func removeUnordered(s []int, i int) []int {
	s[i] = s[len(s)-1]
	return s[:len(s)-1]
}

fmt.Println(removeIndex([]int{10, 20, 30, 40}, 1))     // [10 30 40]
fmt.Println(removeUnordered([]int{10, 20, 30, 40}, 1)) // [10 40 30]
```

With the `slices` package: `s = slices.Delete(s, i, i+1)` (removes `s[i:j]`, panics if out of range).

## Python list methods in Go

Python's `spam.index('hello')`, `spam.insert(1, 'chicken')`, `x in spam`, `sorted()`... Complete program:

```go
package main

import (
	"fmt"
	"slices"
	"strings"
)

func main() {
	spam := []string{"hello", "hi", "howdy", "heyas"}
	fmt.Println(slices.Index(spam, "hello"))    // 0
	fmt.Println(slices.Index(spam, "nope"))     // -1 (Python raises ValueError)
	fmt.Println(slices.Contains(spam, "howdy")) // true

	// The insert() equivalent: insert a value at any index
	pets := []string{"cat", "dog", "bat"}
	pets = slices.Insert(pets, 1, "chicken")
	fmt.Println(pets) // [cat chicken dog bat]

	pets = slices.Delete(pets, 2, 3) // removes "dog"
	fmt.Println(pets) // [cat chicken bat]

	pets = append(pets, "ant") // Python append()
	slices.Sort(pets)          // in place
	fmt.Println(pets)          // [ant bat cat chicken]
	slices.Reverse(pets)
	fmt.Println(pets) // [chicken cat bat ant]

	// Index of the first element matching a condition
	i := slices.IndexFunc(pets, func(p string) bool { return strings.HasPrefix(p, "b") })
	fmt.Println(i) // 2

	nums := []int{3, 1, 4, 1, 5, 9, 2, 6}
	fmt.Println(slices.Max(nums), slices.Min(nums)) // 9 1

	sorted := slices.Sorted(slices.Values(nums)) // Go 1.23: new sorted slice, nums untouched
	fmt.Println(sorted)                          // [1 1 2 3 4 5 6 9]
	fmt.Println(slices.Compact(sorted))          // [1 2 3 4 5 6 9] (removes consecutive duplicates)

	// Filter: remove the even numbers (on a clone, DeleteFunc modifies its argument)
	odd := slices.DeleteFunc(slices.Clone(nums), func(n int) bool { return n%2 == 0 })
	fmt.Println(odd)  // [3 1 1 5 9]
	fmt.Println(nums) // [3 1 4 1 5 9 2 6]

	// Binary search on a sorted slice
	pos, found := slices.BinarySearch([]int{10, 20, 30}, 20)
	fmt.Println(pos, found) // 1 true
}
```

## Copy a slice

```go
src := []int{1, 2, 3}

dst := make([]int, len(src))
n := copy(dst, src) // copies min(len(dst), len(src)) elements
fmt.Println(n, dst) // 3 [1 2 3]

clone := slices.Clone(src) // same thing in one line
clone[0] = 99
fmt.Println(src, clone) // [1 2 3] [99 2 3]
```

## Gotcha: append and shared backing arrays

`append` writes into the existing array if there is capacity, so two appends to the same slice can overwrite each other:

```go
base := make([]int, 3, 10)
x := append(base, 1)
y := append(base, 2)
fmt.Println(x[3], y[3]) // 2 2  -> x was overwritten

// Fix: limit the capacity so append must allocate a new array
base = slices.Clip(base) // or base[:len(base):len(base)]
x = append(base, 1)
y = append(base, 2)
fmt.Println(x[3], y[3]) // 1 2
```

The same applies to sub-slices: `part := s[:2]` and then `append(part, ...)` overwrites `s[2]`.

## Filter in place (no allocation)

```go
func filter(s []int, keep func(int) bool) []int {
	out := s[:0] // reuses the same backing array
	for _, v := range s {
		if keep(v) {
			out = append(out, v)
		}
	}
	return out
}

fmt.Println(filter([]int{1, 2, 3, 4, 5}, func(n int) bool { return n > 2 })) // [3 4 5]
```

## 2D slices

```go
rows, cols := 2, 3
grid := make([][]int, rows)
for i := range grid {
	grid[i] = make([]int, cols)
}
grid[1][2] = 7
fmt.Println(grid) // [[0 0 0] [0 0 7]]
```

## Iterate

```go
for i, v := range []string{"a", "b"} {
	fmt.Println(i, v)
}
// 0 a
// 1 b

for i := range 3 { // Go 1.22: range over an int
	fmt.Print(i, " ")
}
// 0 1 2
```
