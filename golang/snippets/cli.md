# How To Create Your Own CLI

>[link](https://itnext.io/how-to-create-your-own-cli-with-golang-3c50727ac608)
>[link2++](https://blog.rapid7.com/2016/08/04/build-a-simple-cli-tool-with-golang/)
>[pkg flag](https://pkg.go.dev/flag) · [urfave/cli v3](https://cli.urfave.org/v3/getting-started/) · [cobra](https://github.com/spf13/cobra)

For small tools the standard library (`os.Args` + `flag`) is enough. Reach for `urfave/cli` or `cobra` when you need many subcommands, nested help, shell completion, etc.

## Raw arguments: os.Args

`os.Args[0]` is the program path, the rest are the arguments as typed (no parsing).

```go
package main

import (
	"fmt"
	"os"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Fprintln(os.Stderr, "usage: greet <name>...")
		os.Exit(2) // 2 = usage error (convention)
	}
	for _, name := range os.Args[1:] {
		fmt.Println("Hello,", name)
	}
}
```

```bash
go run . Ana Luis
# Hello, Ana
# Hello, Luis
```

## Flags: the flag package

```go
package main

import (
	"flag"
	"fmt"
	"strings"
)

func main() {
	name := flag.String("name", "World", "who to greet")
	times := flag.Int("n", 1, "how many times")
	upper := flag.Bool("upper", false, "print in upper case")
	flag.Parse() // must be called before reading the flags

	msg := fmt.Sprintf("Hello, %s!", *name)
	if *upper {
		msg = strings.ToUpper(msg)
	}
	for range *times { // range over int: Go 1.22+
		fmt.Println(msg)
	}
	fmt.Println("rest:", flag.Args()) // positional args left after the flags
}
```

```bash
go run . -name Artur -n 2 -upper extra
# HELLO, ARTUR!
# HELLO, ARTUR!
# rest: [extra]

go run . -h
# Usage of /tmp/go-build.../exe/main:
#   -n int
#     	how many times (default 1)
#   -name string
#     	who to greet (default "World")
#   -upper
#     	print in upper case
```

Notes:

- `-name x`, `-name=x`, `--name=x` all work. Boolean flags must use `-upper=false` (not `-upper false`).
- Parsing stops at the first non-flag argument: `go run . extra -n 2` leaves `-n 2` in `flag.Args()`.
- `flag.StringVar(&cfg.Name, ...)` binds to an existing variable; `flag.Duration`, `flag.Func` and `flag.TextVar` cover other types.

## Subcommands with flag.NewFlagSet

```go
package main

import (
	"flag"
	"fmt"
	"os"
	"strings"
)

func main() {
	orderCmd := flag.NewFlagSet("order", flag.ExitOnError)
	size := orderCmd.String("size", "medium", "pizza size")

	if len(os.Args) < 2 {
		fmt.Fprintln(os.Stderr, "usage: pizza <order|list> [flags]")
		os.Exit(2)
	}

	switch os.Args[1] {
	case "order", "o":
		orderCmd.Parse(os.Args[2:]) // ExitOnError: exits by itself on bad flags
		if orderCmd.NArg() == 0 {
			fmt.Fprintln(os.Stderr, "order: at least one topping is required")
			os.Exit(2)
		}
		fmt.Printf("Ordering a %s pizza with %s\n", *size, strings.Join(orderCmd.Args(), ", "))
	case "list":
		fmt.Println("peppers, pineapple, cheese")
	default:
		fmt.Fprintf(os.Stderr, "unknown command %q\n", os.Args[1])
		os.Exit(2)
	}
}
```

```bash
go build -o pizza .
./pizza order -size large peppers cheese
# Ordering a large pizza with peppers, cheese
```

## Using urfave/cli (v3)

The original article used `github.com/urfave/cli` v1 (old API: `cli.NewApp()`, `Action: func(c *cli.Context)`). The current major version is v3.

### Prerequisites

Create a folder with a file named `main.go`, and run in the command line:

```bash
go mod init pizza
go get github.com/urfave/cli/v3@latest
```

### Code

```go
package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/urfave/cli/v3"
)

const pizza = "Enjoy your pizza with some delicious"

// topping returns an action that prints the chosen topping.
func topping(name string) cli.ActionFunc {
	return func(ctx context.Context, cmd *cli.Command) error {
		fmt.Println(pizza, name)
		return nil
	}
}

func main() {
	cmd := &cli.Command{
		Name:    "pizza",
		Usage:   "An example CLI for ordering pizzas",
		Version: "1.0.0",
		Commands: []*cli.Command{
			{Name: "peppers", Aliases: []string{"p"}, Usage: "Add peppers to your pizza", Action: topping("peppers")},
			{Name: "pineapple", Aliases: []string{"pa"}, Usage: "Add pineapple to your pizza", Action: topping("pineapple")},
			{Name: "cheese", Aliases: []string{"c"}, Usage: "Add cheese to your pizza", Action: topping("cheese")},
		},
	}

	if err := cmd.Run(context.Background(), os.Args); err != nil {
		log.Fatal(err)
	}
}
```

### Local usage

To build our CLI, please run:

```bash
go build -o pizza .     # on Windows: go build -o pizza.exe .
```

After this, the generated help and version flags are available:

```bash
./pizza --help      # lists NAME, USAGE, VERSION, COMMANDS and GLOBAL OPTIONS
./pizza --version   # pizza version 1.0.0
```

Our custom commands can be called with the full name or with the alias:

```bash
./pizza pineapple
./pizza pa
# Enjoy your pizza with some delicious pineapple
```

## Global usage

Prefer `go install` over copying binaries by hand:

```bash
go install .            # builds and copies the binary to $(go env GOPATH)/bin (or $GOBIN)
pizza peppers           # works if that folder is in your PATH
```

Manual alternative (Unix): `go build -o pizza . && sudo cp pizza /usr/local/bin`.

## Tips

- Write errors to `os.Stderr` and results to `os.Stdout` so the tool can be piped.
- Exit codes: `0` ok, `1` generic error, `2` usage error. `log.Fatal` exits with `1`.
- Inject the version at build time:

```go
var version = "dev" // overridden by -ldflags
```

```bash
go build -ldflags "-X main.version=1.2.3" -o pizza .
```
