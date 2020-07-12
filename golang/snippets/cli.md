# How To Create Your Own CLI

>[link](https://itnext.io/how-to-create-your-own-cli-with-golang-3c50727ac608)
>[link2++](https://blog.rapid7.com/2016/08/04/build-a-simple-cli-tool-with-golang/)

## Prerequisites

Create a folder with a file named `main.go` , and run in the command line:

```bash
go get github.com/urfave/cli
```

## Code

```go
package main
import (
    "fmt"
    "log"
    "os"
    "github.com/urfave/cli"
)
var app = cli.NewApp()

var pizza = []string{"Enjoy your pizza with some delicious"}

func info() {
  app.Name = "Simple pizza CLI"
  app.Usage = "An example CLI for ordering pizza's"
  app.Author = "Jeroenouw"
  app.Version = "1.0.0"
}

func commands() {
  app.Commands = []cli.Command{
    {
      Name:    "peppers",
      Aliases: []string{"p"},
      Usage:   "Add peppers to your pizza",
      Action: func(c *cli.Context) {
        pe := "peppers"
        peppers := append(pizza, pe)
        m := strings.Join(peppers, " ")
        fmt.Println(m)
      },
    },
    {
      Name:    "pineapple",
      Aliases: []string{"pa"},
      Usage:   "Add pineapple to your pizza",
      Action: func(c *cli.Context) {
        pa := "pineapple"
        pineapple := append(pizza, pa)
        m := strings.Join(pineapple, " ")
        fmt.Println(m)
      },
    },
    {
      Name:    "cheese",
      Aliases: []string{"c"},
      Usage:   "Add cheese to your pizza",
      Action: func(c *cli.Context) {
        ch := "cheese"
        cheese := append(pizza, ch)
        m := strings.Join(cheese, " ")
        fmt.Println(m)
      },
    },
  }
}

func main() {
    info()
    commands()

    err := app.Run(os.Args)
    if err != nil {
        log.Fatal(err)
    }
}
```

## Local usage

To build our CLI, please run:

```bash
go build main.go
```

After this, you can run the following two existing commands:

```bash
./main --help
./main --version
```

Our output by running `./main — help` will now look like this:

```bash
NAME:
   Simple pizza CLI - An example CLI for ordering pizzas
USAGE:
   main [global options] command [command options] [arguments...]
VERSION:
   1.0.0
AUTHOR:
   Jeroenouw
COMMANDS:
     peppers, p     Add peppers to your pizza
     pineapple, pa  Add pineapple to your pizza
     cheese, c      Add cheese to your pizza
     help, h        Shows a list of commands or help for one command
GLOBAL OPTIONS:
   --help, -h     show help
   --version, -v  print the version
```

Our custom options can be called with a full name:

```bash
./main peppers
./main cheese
./main pineapple
```

or with the shorten alias:

```bash
./main p
./main c
./main pa
```

The output of `./main` pa will be looking like this:

```bash
Enjoy your pizza with some delicious pineapple
```

This is just a very basic CLI, you can do way more than this. But now you know the basics.

## Global usage

1. after running `go build main.go` the executable file ‘main’ is made
2. run `cp main /usr/local/bin`
3. To test: `main peppers`
