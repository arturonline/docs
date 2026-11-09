# Maps

A map (or dictionary) is an unordered collection of key-value pairs, where each key is unique. Maps are backed by hash tables (Swiss tables since Go 1.24).

The type is `map[K]V`. The key type `K` must be **comparable** (`==` works): numbers, strings, bools, pointers, channels, interfaces, arrays and structs made of comparable fields. Slices, maps and functions cannot be keys.

## Create a new map

You create a new map with a `make` statement or a map literal.

```go
var m map[string]int                // nil map of string-int pairs

m1 := make(map[string]float64)      // Empty map of string-float64 pairs
m2 := make(map[string]float64, 100) // Preallocate room for 100 entries

m3 := map[string]float64{           // Map literal
    "e":  2.71828,
    "pi": 3.1416,                   // trailing comma required
}
fmt.Println(len(m3))                // Size of map: 2
```

## nil maps

The zero value of a map is `nil`. A nil map behaves like an empty map for **reads** (`len`, lookups, `range`, `delete`), but **writing to it panics**:

```go
var m map[string]int
fmt.Println(m == nil, len(m), m["x"]) // true 0 0
m["x"] = 1 // panic: assignment to entry in nil map
```

Always initialize with `make` or a literal before writing (a common bug with map fields in structs).

## Add, update, get and delete keys/values

```go
package main

import "fmt"

func main() {
    m := make(map[string]float64)

    m["pi"] = 3.14   // Add a new key-value pair
    m["pi"] = 3.1416 // Update value
    fmt.Println(m)   // Print map

    v := m["pi"] // Get value
    fmt.Println(v)

    v = m["pie"] // Not found: zero value
    fmt.Println(v)

    _, found := m["pi"]
    fmt.Println(found)
    _, found = m["pie"]
    fmt.Println(found)

    if x, ok := m["pi"]; ok { // comma-ok idiom
        fmt.Println("found", x)
    }

    delete(m, "pi")  // Delete a key-value pair
    delete(m, "pie") // Deleting a missing key is a no-op
    fmt.Println(m, len(m))
}
// map[pi:3.1416]
// 3.1416
// 0
// true
// false
// found 3.1416
// map[] 0
```

- When you index a map you can get two return values; the second one (which is optional) is a boolean that indicates if the key exists ("comma ok").
- If the key doesn't exist, the first value will be the zero value of the value type. Use comma-ok when the zero value is also a valid value.

Handy consequence of the zero value: counters don't need initialization.

```go
counts := map[string]int{}
for _, w := range []string{"go", "is", "go"} {
    counts[w]++
}
fmt.Println(counts) // map[go:2 is:1]
```

## Maps are references

A map value is a pointer to the internal data structure. Assigning a map or passing it to a function does **not** copy the entries — both see the same map.

```go
a := map[string]int{"x": 1}
b := a
b["x"] = 100
fmt.Println(a["x"]) // 100
```

Use `maps.Clone` for an independent (shallow) copy.

## For-each range loop

```go
m := map[string]float64{
    "pi": 3.1416,
    "e":  2.71828,
}
fmt.Println(m) // map[e:2.71828 pi:3.1416]

for key, value := range m { // Order not specified
    fmt.Println(key, value)
}
```

Iteration order is not specified and is deliberately **randomized** — it may change from one loop to the next. (`fmt.Println` sorts the keys when printing a map, which is why the printed map above is stable.)

Deleting entries during a `range` is safe; entries added during the loop may or may not be visited.

### Iterate in sorted order

Collect and sort the keys (Go 1.23+):

```go
package main

import (
    "fmt"
    "maps"
    "slices"
)

func main() {
    ages := map[string]int{"bob": 31, "alice": 28, "carol": 35}

    for _, name := range slices.Sorted(maps.Keys(ages)) {
        fmt.Println(name, ages[name])
    }
}
// alice 28
// bob 31
// carol 35
```

`maps.Keys` and `maps.Values` return **iterators** (`iter.Seq`), not slices. Use `slices.Collect(maps.Keys(m))` to get an (unsorted) slice, or `slices.Sorted(...)` to get a sorted one.

## Maps of structs

Map elements are not addressable, so you can't modify a field of a struct value in place:

```go
package main

import "fmt"

type Point struct{ X, Y int }

func main() {
    pts := map[string]Point{"a": {1, 2}}
    // pts["a"].X = 10 // compile error: cannot assign to struct field pts["a"].X in map

    p := pts["a"] // copy out, modify, store back
    p.X = 10
    pts["a"] = p
    fmt.Println(pts["a"])

    ptrs := map[string]*Point{"a": {1, 2}} // or store pointers
    ptrs["a"].X = 10
    fmt.Println(*ptrs["a"])
}
// {10 2}
// {10 2}
```

Structs can also be **keys** when all their fields are comparable — a clean alternative to concatenated string keys:

```go
type key struct{ city, product string }
sales := map[key]int{}
sales[key{"Madrid", "pen"}] += 3
fmt.Println(sales[key{"Madrid", "pen"}]) // 3
```

## Sets

Go has no set type; use a map with empty-struct values (`struct{}` takes zero bytes):

```go
package main

import "fmt"

func main() {
    set := map[string]struct{}{}
    for _, w := range []string{"go", "is", "go", "fun"} {
        set[w] = struct{}{}
    }

    _, ok := set["go"]
    fmt.Println(len(set), ok)

    delete(set, "go")
    _, ok = set["go"]
    fmt.Println(len(set), ok)
}
// 3 true
// 2 false
```

`map[string]bool` also works and reads nicer (`if set[w] {...}`) at the cost of one byte per entry.

## The `maps` package (Go 1.21+) and `clear`

```go
package main

import (
    "fmt"
    "maps"
)

func main() {
    m := map[string]int{"a": 1, "b": 2}

    c := maps.Clone(m) // shallow copy
    c["c"] = 3
    fmt.Println(len(m), len(c))
    fmt.Println(maps.Equal(m, c))

    maps.DeleteFunc(c, func(k string, v int) bool { return v%2 == 1 })
    fmt.Println(c)

    maps.Copy(c, map[string]int{"z": 26}) // copy all entries into c
    fmt.Println(c)

    clear(c) // built-in (Go 1.21+): removes all entries
    fmt.Println(c, len(c))
}
// 2 3
// false
// map[b:2]
// map[b:2 z:26]
// map[] 0
```

Other iterator helpers (Go 1.23+): `maps.All(m)` (key, value), `maps.Keys(m)`, `maps.Values(m)`, `maps.Collect(seq2)` to build a map from an iterator, `maps.Insert(m, seq2)`.

## Concurrency

Maps are **not safe for concurrent use**. If one goroutine writes while others read or write, the runtime may crash with `fatal error: concurrent map writes` (this cannot be recovered). Protect the map with a `sync.Mutex` / `sync.RWMutex`, or use `sync.Map` for specific cases (keys written once and read many times).

```go
type Counter struct {
    mu sync.Mutex
    m  map[string]int
}

func (c *Counter) Inc(key string) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.m[key]++
}
```

Concurrent **reads** only (no writers) are fine.
