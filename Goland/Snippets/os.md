# os utilities

## Read entire file

The most basic file reading task is slurping a file’s entire contents into memory:

```go
dat, err := ioutil.ReadFile("/tmp/dat")
```

## Open the file to start reading

You’ll often want more control over how and what parts of a file are read. For these tasks, start by Opening a file to obtain an `os.File` value.

```go
f, err := os.Open("/tmp/dat")
```

## Read with bufio

```go
f := bufio.NewReader(f)
    b, err := f.Peek(5)
    check(err)
    fmt.Printf("5 bytes: %s\n", string(b))
```

## Close after reading

```go
func closeFile(f *os.File) {
    fmt.Println("closing")
    err := f.Close()
    if err != nil {
        fmt.Fprintf(os.Stderr, "error: %v\n", err)
        os.Exit(1)
    }
defer closeFile(f)
```

## Example

```go
package main

import (
    "bufio"
    "encoding/csv"
    "encoding/json"
    "fmt"
    "io"
    "log"
    "os"
)

type Person struct {
    Firstname string   `json:"firstname"`
    Lastname  string   `json:"lastname"`
    Address   *Address `json:"address,omitempty"`
}

type Address struct {
    City  string `json:"city"`
    State string `json:"state"`
}

func main() {
    csvFile, _ := os.Open("people.csv")
    reader := csv.NewReader(bufio.NewReader(csvFile))
    var people []Person
    for {
        line, error := reader.Read()
        if error == io.EOF {
            break
        } else if error != nil {
            log.Fatal(error)
        }
        people = append(people, Person{
            Firstname: line[0],
            Lastname:  line[1],
            Address: &Address{
                City:  line[2],
                State: line[3],
            },
        })
    }
    peopleJson, _ := json.Marshal(people)
    fmt.Println(string(peopleJson))
}
```