# Packages and Imports

## Packages

A package is a collection of Go source files that reside in the same directory and share the same `package` clause. Every `.go` file starts with it.

- `package main` + `func main()` builds an **executable**.
- Any other name builds a **library** package that can be imported.
- By convention the package name is the last element of its import path (`math/rand` → `package rand`), short, lowercase, no underscores.

```go
package main

import (
    "fmt"
    "math/rand"
)

func main() {
    fmt.Println("My favorite number is", rand.Intn(10))
}
```

> Since Go 1.20 `math/rand` is seeded randomly at startup (no need for `rand.Seed`). New code can use `math/rand/v2`.

## Modules

A Go Module is a collection of Go packages that are versioned together.

When we create a new module, a `go.mod` file is created in the root of the module. All packages in subdirectories are automatically recognized as part of the module.

To create a module create a folder, and inside that folder:

```bash
go mod init example.com/hello
```

### Project layout

```text
hello/
├── go.mod            // module example.com/hello
├── main.go           // package main
└── greet/
    └── greet.go      // package greet  -> import "example.com/hello/greet"
```

```go
// greet/greet.go
package greet

import "strings"

// Hello is exported (capital letter): usable from other packages.
func Hello(name string) string {
    return "Hello, " + capitalize(name) + "!"
}

// capitalize is unexported: only visible inside package greet.
func capitalize(s string) string {
    return strings.ToUpper(s[:1]) + s[1:]
}
```

```go
// main.go
package main

import (
    "fmt"

    "example.com/hello/greet"
)

func main() {
    fmt.Println(greet.Hello("gopher"))
    // greet.capitalize("x") // compile error: not exported
}
// Hello, Gopher!
```

Imports are always by **full module path + directory**, never relative (`./greet` is not allowed).

### `go.mod` anatomy

```text
module example.com/hello                 // module path (import prefix)

go 1.23                                  // minimum Go language version

toolchain go1.23.2                       // (optional) preferred toolchain

require (
    github.com/google/uuid v1.6.0        // direct dependency
    golang.org/x/text v0.14.0 // indirect  (needed by a dependency)
)

replace example.com/lib => ../lib        // use a local copy instead
exclude github.com/foo/bar v1.2.0        // never use this version
retract v1.0.1                           // (for authors) mark own bad version
```

### `go.sum`

`go.sum` stores the cryptographic hashes of every module version used. It guarantees that builds download exactly the same code. **Commit both `go.mod` and `go.sum`**; never edit `go.sum` by hand.

## Module commands

### `go get`: adding dependencies

While the standard library ships with many great and useful packages, they are intentionally designed to be general purpose and not specific in nature. This allows developers to build their own packages on top of the standard library for their own specific needs.

The `go get` command adds a third-party package to your module (it updates `go.mod`/`go.sum` and downloads the code to the module cache):

```bash
go get github.com/yourbasic/graph   # latest version
go get github.com/foo/bar@v1.2.3     # pin a version (or @commit, @branch, @latest)
```

Often you don't even need it: just add the `import` to your code and run `go mod tidy`.

The import path corresponds to the repository hosting the code. This reduces the likelihood of future name collisions.

### `go get -u`: updating dependencies

Packages are often being updated by the original authors to address bugs or add new features. To update a package, use the `-u` flag (there is no `go update` command):

```bash
go get -u github.com/gobuffalo/flect   # latest minor/patch
go get -u=patch ./...                  # only patch updates for everything
go get github.com/gobuffalo/flect@latest
```

Major versions ≥ 2 have a different import path: `github.com/foo/bar/v2`.

> To install **executables** use `go install pkg@version`, not `go get` (see [Tooling](0_tooling.md)).

### Other commands

```bash
go list -m all                 # print the current module's dependencies
go list -m -u all              # ... and show available updates
go mod tidy                    # add missing and remove unused dependencies
go mod download                # download dependencies to the module cache
go mod why github.com/foo/bar  # why is this module needed?
go mod graph                   # print the dependency graph
go mod vendor                  # copy dependencies into ./vendor
go mod edit -replace example.com/lib=../lib
```

### `replace`: using a local copy

Useful to test changes in a dependency before publishing them:

```text
replace github.com/foo/bar => ../bar
```

Remove it before publishing your module (or use a workspace instead).

### Workspaces (`go work`)

A workspace (Go 1.18+) lets you develop several modules together. The `go.work` file is usually **not** committed.

```bash
go work init ./app ./lib   # create go.work with two modules
go work use ./tools        # add another one
go work sync
```

```text
go 1.23

use (
    ./app
    ./lib
)
```

Now `app` uses the local `lib` without any `replace` directive.

## Exported names

Go does not have the concept of *public*, *private*, or *protected* modifiers like other languages do. External visibility is controlled by **capitalization**. Types, variables, constants, functions, struct fields and methods that start with a capital letter are available, publicly, outside the current package. A symbol that is visible outside its package is considered to be **exported**.

```go
package shapes

const MaxSides = 10 // exported
var count int       // unexported

type Circle struct {
    Radius float64 // exported field
    id     int     // unexported field
}
```

Visibility is per **package**, not per file: all files of the same package see each other's unexported identifiers.

## Internal packages

A package inside a directory named `internal` can only be imported by code rooted at the parent of `internal`:

```text
example.com/hello/
├── internal/db/      // importable by example.com/hello/...
└── api/              // can import example.com/hello/internal/db
```

Other modules cannot import `example.com/hello/internal/db` (compile error). Use it to hide implementation details.

## `init()` functions

Each file can declare one or more `func init()`. They run automatically, after all package-level variables are initialized and before `main`. Imported packages are initialized first.

```go
package main

import "fmt"

var x = initX()

func initX() int {
    fmt.Println("var init")
    return 1
}

func init() {
    fmt.Println("init()")
}

func main() {
    fmt.Println("main", x)
}
// var init
// init()
// main 1
```

## Import forms

```go
import (
    "fmt"                         // normal: use fmt.Println
    str "strings"                 // alias: use str.ToUpper
    _ "github.com/lib/pq"         // blank: only run the package's init() (e.g. register a driver)
    . "math"                      // dot: use Sqrt directly (avoid, hurts readability)
)
```

Unused imports are a **compile error**.

## Package name conflicts

You can customize the name under which you refer to an imported package.

```go
package main

import (
    csprng "crypto/rand"
    prng "math/rand"

    "fmt"
)

func main() {
    n := prng.Int() // pseudorandom number
    b := make([]byte, 8)
    csprng.Read(b) // cryptographically secure pseudorandom number
    fmt.Println(n, b)
}
```
