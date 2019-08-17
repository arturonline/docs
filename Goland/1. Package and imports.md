# Packages and Imports

>[More about packages](https://www.digitalocean.com/community/tutorials/how-to-write-packages-in-go)

## Packages

- Every Go program is made up of packages.
- A package represents all the files in a single directory on disk.
- Programs start running in package main.

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

## Writing Packages

Packages can contain definitions of functions, types, and variables that can then be used in other Go programs. Writing a Go package is the same as writing any other Go file but placing it in another directory.

## Exported Code

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

## Installing Packages

While the standard library ships with many great and useful packages, they are intentionally designed to be general purpose and not specific in nature. This allows developers to build their own packages on top of the standard library for their own specific needs.

The Go tool chain ships with the go get command. This command allows you to install third party packages to your local development environment and use them in your program.

```bash
go get github.com/yourbasic/graph
```

### Updating packages

Packages are often being updated by the original authors to address bugs or add new features. When this happens, you may want to use the latest version of that package to take advantage of the new features or resolved bug. To update a package, you can use the `-u` flag with the go get command:

```bash
go get -u github.com/gobuffalo/flect
```

This command will also have Go install the package if it is not found locally. If it is already installed, Go will attempt to update the package to the latest version.

The import path corresponds to the repository hosting the code. This reduces the likelihood of future name collisions.

## Package documentation

The godoc command extracts and generates documentation for all locally installed Go programs. The following command starts a web server that presents the documentation at http://localhost:6060/.

```bash
godoc -http=:6060 &
```
