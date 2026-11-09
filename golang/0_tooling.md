# Tooling

> [Install the Go tools](https://go.dev/doc/install)

Everything is driven by the single `go` command. Check your installation with:

```bash
go version          # go version go1.23.2 windows/amd64
go env              # show all Go environment variables
go env GOPATH GOOS  # show only some of them
go help build       # help for any subcommand
```

> Since Go modules (Go 1.11+, default since 1.16) you **don't** need to put your code inside `GOPATH`. A project can live in any folder. `GOPATH` (default `~/go`) is now only used to store the module cache (`$GOPATH/pkg/mod`) and installed binaries (`$GOPATH/bin`).

## Create a project

Create a folder, and inside that folder:

```bash
go mod init github.com/arturonline/name
```

This creates a `go.mod` file. The module path is usually the repository URL, but for local experiments any name works (`go mod init example/hello`).

```go
// main.go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}
```

## Running Code

`go run` compiles and runs the program without leaving a binary behind. It needs a package or files as argument:

```bash
go run .            # run the package in the current directory
go run main.go      # run a single file
go run ./cmd/server # run another package of the module
```

## Building Code

```bash
go build             # compile the package in the current dir; the binary is named after the module/folder
go build -o app.exe  # choose the output name
go build ./...       # compile every package of the module (checks that everything compiles)
```

Cross-compiling only needs two environment variables:

```bash
GOOS=linux GOARCH=amd64 go build -o app .   # bash
```

```powershell
$env:GOOS="linux"; $env:GOARCH="amd64"; go build -o app .   # PowerShell
```

## Installing binaries

`go install` compiles a program and puts the binary in `$GOPATH/bin` (or `$GOBIN`). Add that folder to your `PATH`.

```bash
go install                                            # install the current module's program
go install golang.org/x/tools/gopls@latest            # install a tool at its latest version
go install honnef.co/go/tools/cmd/staticcheck@v0.5.1  # or a specific version
```

> Using `go get` to install binaries is outdated: since Go 1.18 `go get` no longer builds or installs anything, it only edits `go.mod`. Use `go install pkg@version`.

## Fetching Dependencies

`go get` only manages the dependencies listed in your `go.mod`:

```bash
go get github.com/foo/bar           # add the latest version
go get github.com/foo/bar@v1.2.3    # a specific version
go get github.com/foo/bar@8e1b8d3   # a specific commit
go get -u ./...                     # upgrade all dependencies
go get github.com/foo/bar@none      # remove a dependency
go mod tidy                         # add missing / remove unused dependencies
```

See [Packages and modules](1_mod_&_pack.md) for more details.

## Formatting Code

```bash
go fmt ./...          # format all packages (runs gofmt -l -w on the files)
gofmt -w foo.go       # format foo.go in place
gofmt -d foo.go       # show the diff instead of writing
gofmt -s -w foo.go    # also simplify code (e.g. []T{T{}} -> []T{{}})
```

`goimports` (`go install golang.org/x/tools/cmd/goimports@latest`) does the same as `gofmt` and also adds/removes imports. Most editors (gopls) run it on save.

## Checking code

```bash
go vet ./...     # report suspicious constructs (wrong Printf verbs, unreachable code, copied locks...)
```

`go vet` is also run automatically (a subset of checks) by `go test`.

## Testing

```bash
go test ./...             # run all tests of the module
go test -v -run TestSum . # verbose, only tests matching the regex
go test -cover ./...      # show coverage
go test -race ./...       # enable the race detector
go test -bench . ./...    # run benchmarks
```

See [Tests](14_tests.md).

## Upgrading to a new Go release

The `go` line in `go.mod` sets the minimum language version. Since Go 1.21 the `go` command can download the required toolchain automatically (`toolchain` directive / `GOTOOLCHAIN` env var):

```bash
go get go@1.23          # bump the go directive in go.mod
go get toolchain@go1.23.2
go fix ./...            # rewrite code that uses old APIs
```

> Since Go 1.26 `go fix` was rebuilt on top of the `go vet` analysis framework and applies "modernizers" (e.g. replacing hand-written loops with `slices.Contains`, `min`/`max`, `for range n`...).

## Workspaces

`go work` lets you work on several modules at once without `replace` directives:

```bash
go work init ./app ./lib   # creates go.work
go work use ./other        # add another module
```

## Documentation

You can view documentation for the standard library packages via your terminal using the `go doc` tool. I often use this during development to quickly check something — like the name or signature of a specific function. It's faster than navigating the web-based documentation and it's always available offline too.

```bash
go doc strings            # View simplified documentation for the strings package
go doc -all strings       # View full documentation for the strings package
go doc strings.Replace    # View documentation for the strings.Replace function
go doc sql.DB             # View documentation for the database/sql.DB type
go doc sql.DB.Query       # View documentation for the database/sql.DB.Query method
```

You can also include the -src flag to display the relevant Go source code. For example:

```bash
go doc -src strings.Replace
```

The old `godoc -http` server is no longer bundled with Go. To browse documentation (including your own packages) in the browser:

```bash
go doc -http strings      # Go 1.25+: starts a local doc server and opens the browser

go install golang.org/x/pkgsite/cmd/pkgsite@latest
pkgsite -open .           # pkg.go.dev-like site at http://localhost:8080
```

Online, all public packages are documented at [pkg.go.dev](https://pkg.go.dev).

## Cleaning

```bash
go clean -cache       # remove the build cache
go clean -modcache    # remove all downloaded modules
```
