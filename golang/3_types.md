# Types

## Basic types

```go
bool
string
int  int8  int16  int32  int64
uint uint8 uint16 uint32 uint64 uintptr
byte // alias for uint8
rune // alias for int32
     // represents a Unicode code point
float32 float64
complex64 complex128
```

The `int`, `uint`, and `uintptr` types are usually 32 bits wide on 32-bit systems and 64 bits wide on 64-bit systems. When you need an integer value you should use int unless you have a specific reason to use a sized or unsigned integer type. For floating point, use `float64` by default.

| Type | Zero value | Range / notes |
| --- | --- | --- |
| `bool` | `false` | `true`, `false` |
| `string` | `""` | immutable sequence of bytes (UTF-8 by convention) |
| `int8` / `uint8` | `0` | -128..127 / 0..255 |
| `int32` / `rune` | `0` | ±2.1e9 |
| `int64` | `0` | ±9.2e18 |
| `float64` | `0` | ~15 significant digits |

The limits are available as constants in the `math` package: `math.MaxInt`, `math.MinInt64`, `math.MaxUint8`, `math.MaxFloat64`...

Composite types (arrays, slices, maps, structs, pointers, functions, interfaces, channels) are covered in their own notes. `any` is an alias for `interface{}` (Go 1.18+).

Use `%T` to print the type of a value:

```go
fmt.Printf("%T %T %T\n", 1, 1.0, "x") // int float64 string
```

## Numbers

```go
package main

import "fmt"

func main() {
    fmt.Println(7/2, 7%2, 7.0/2) // integer division truncates
    fmt.Println(-7/2, -7%2)      // truncates towards zero

    var u uint8 = 255
    u++ // integer overflow wraps around silently
    fmt.Println(u)

    fmt.Println(0b1010, 0o17, 0xFF, 1_000_000) // binary, octal, hex, digit separators
    fmt.Println(min(3, 1, 2), max(2.5, 1))     // built-in min/max (Go 1.21+)

    c := complex(1, 2)
    fmt.Println(c, real(c), imag(c))
}
// 3 1 3.5
// -3 -1
// 0
// 10 15 255 1000000
// 1 2.5
// (1+2i) 1 2
```

## Strings, bytes and runes

A `string` is an immutable sequence of **bytes**. Go source is UTF-8, so non-ASCII characters take more than one byte. A `rune` is a Unicode code point (`int32`), a `byte` is a single byte (`uint8`).

- `len(s)` returns the number of **bytes**, not characters.
- `s[i]` returns a **byte**.
- `for i, r := range s` iterates over **runes** (`i` is the byte offset).

```go
package main

import (
    "fmt"
    "unicode/utf8"
)

func main() {
    s := "héllo"
    fmt.Println(len(s), utf8.RuneCountInString(s)) // é takes 2 bytes
    fmt.Println(s[0], s[1], string(s[0]))          // bytes
    fmt.Println(s[1:])                             // slicing works on bytes too

    for i, r := range s {
        fmt.Printf("%d:%c ", i, r)
    }
    fmt.Println()

    runes := []rune(s) // convert to runes to index characters
    fmt.Println(len(runes), string(runes[1]))

    b := []byte("abc") // strings are immutable; copy to []byte to modify
    b[0] = 'A'
    fmt.Println(string(b))

    raw := `C:\path\n` // raw string literal: no escapes, can span lines
    fmt.Println(raw)
}
// 6 5
// 104 195 h
// éllo
// 0:h 1:é 3:l 4:l 5:o
// 5 é
// Abc
// C:\path\n
```

String literals: `"..."` interpreted (`\n`, `\t`, `\u00e9`...), `` `...` `` raw. Rune literals use single quotes: `'a'`, `'\n'`, `'世'`.

To build strings efficiently in a loop use `strings.Builder` instead of `+=`. The `strings` package has the usual helpers (`Contains`, `Split`, `Join`, `ToUpper`, `TrimSpace`, `Fields`, `Replace`...).

## Type conversions

In Go assignment between items of different type requires an explicit conversion. There are no implicit conversions, not even `int` → `int64` or `int` → `float64`:

```go
var i int = 42
var f float64 = float64(i)
var u uint = uint(f)
```

Or, put more simply:

```go
i := 42
f := float64(i)
u := uint(f)
```

Things to keep in mind:

```go
package main

import "fmt"

func main() {
    f := 3.99
    fmt.Println(int(f), int(-f)) // float -> int truncates towards zero

    var big int64 = 300
    fmt.Println(int8(big)) // narrowing keeps the low bits: 300 - 256

    fmt.Println(string(rune(65))) // int -> string gives the character, not "65"!
}
// 3 -3
// 44
// A
```

### Example

```go
package main

import (
    "fmt"
    "math"
)

func main() {
    var x, y int = 3, 4
    var f float64 = math.Sqrt(float64(x*x + y*y))
    var z uint = uint(f)
    fmt.Println(x, y, z)
}
// 3 4 5
```

## Strings ⇄ numbers: `strconv`

To convert between strings and numbers use the `strconv` package (not a type conversion):

```go
package main

import (
    "fmt"
    "strconv"
)

func main() {
    n, err := strconv.Atoi("123") // string -> int
    fmt.Println(n+1, err)

    s := strconv.Itoa(42) + "!" // int -> string
    fmt.Println(s)

    f, _ := strconv.ParseFloat("3.14", 64)
    b, _ := strconv.ParseBool("true")
    i64, _ := strconv.ParseInt("ff", 16, 64) // base 16, result fits in 64 bits
    fmt.Println(f, b, i64)

    fmt.Println(strconv.FormatInt(255, 2))          // int -> string in base 2
    fmt.Println(strconv.FormatFloat(1.5, 'f', 2, 64)) // 2 decimals
    fmt.Println(strconv.Quote("hi\n"))

    _, err = strconv.Atoi("12a")
    fmt.Println(err)

    fmt.Println(fmt.Sprint(3.5) + fmt.Sprintf("|%05d", 42)) // fmt also formats anything
}
// 124 <nil>
// 42!
// 3.14 true 255
// 11111111
// 1.50
// "hi\n"
// strconv.Atoi: parsing "12a": invalid syntax
// 3.5|00042
```

## Untyped constants

Constants without an explicit type (`const x = 10`, or literals like `3.5`) are **untyped**: they get their type from the context, which avoids conversions. See [Constants](2_variables.md#constants).

```go
const k = 2
var a float64 = 1.5 * k // ok, k is used as float64
var b int64 = k         // ok, k is used as int64
// var c int8 = 300     // error: cannot use 300 (untyped int constant) as int8 value (overflows)
```

## Type definitions vs type aliases

```go
type Celsius float64 // type definition: a NEW, distinct type with float64 as underlying type
type Number = int    // type alias: just another name for int
```

A defined type needs explicit conversions and can have its own methods; an alias is completely interchangeable with the original type (`byte` and `rune` are aliases).

```go
package main

import "fmt"

type Celsius float64 // definition
type Number = int    // alias

func (c Celsius) String() string { return fmt.Sprintf("%.1f°C", float64(c)) }

func main() {
    var c Celsius = 36.6
    // var f float64 = c // error: cannot use c (variable of type Celsius) as float64 value
    f := float64(c) // explicit conversion needed
    fmt.Println(c, f)

    var n Number = 5
    var i int = n // ok: same type
    fmt.Printf("%T %T %d\n", c, n, i)
}
// 36.6°C 36.6
// main.Celsius int 5
```

> Aliases are mostly used for refactoring (moving a type between packages). Since Go 1.24 aliases can also be generic: `type Set[T comparable] = map[T]struct{}`.
