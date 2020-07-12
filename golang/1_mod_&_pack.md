# Packages and Imports

## Packages

Packages are a collection of Go sources files that reside in the same directory. Packages provide code compartmentalization.

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

## Modules

A Go Module is nothing but a collection of Go packages.

When we create a new module, a `go.mod` file is created in the root of the module. All packages in subdirectories are automatically recognized as part of the module.

⚠ Modules allow for the deprecation of the **GOPATH**. There is no longer a need to set it explicitly as a **go.mod** files defines the root of a Module, and allows the Go toolchain to know where everything is that it needs to work with.

To create a module create a folder, and inside that folder:

```bash
    go mod init custom/package
```

## Module commands

### `go get`: installing Packages

While the standard library ships with many great and useful packages, they are intentionally designed to be general purpose and not specific in nature. This allows developers to build their own packages on top of the standard library for their own specific needs.

The Go tool chain ships with the go get command. This command allows you to install third party packages to your local development environment and use them in your program.

```bash
    go get github.com/yourbasic/graph
```

### `go update`: Updating packages

Packages are often being updated by the original authors to address bugs or add new features. When this happens, you may want to use the latest version of that package to take advantage of the new features or resolved bug. To update a package, you can use the `-u` flag with the go get command:

```bash
    go get -u github.com/gobuffalo/flect
```

This command will also have Go install the package if it is not found locally. If it is already installed, Go will attempt to update the package to the latest version.

The import path corresponds to the repository hosting the code. This reduces the likelihood of future name collisions.

### `go list -m all`

Prints the current module’s dependencies.

### `go mod tidy`

Removes unused dependencies.

## Exported names

Go does not have the concept of *public*, *private*, or *protected* modifiers like other languages do. External visibility is controlled by **capitalization**. Types, variables, functions, and so on, that start with a capital letter are available, publicly, outside the current package. A symbol that is visible outside its package is considered to be **exported**.

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

