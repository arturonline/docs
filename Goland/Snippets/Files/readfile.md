# os utilities

> [DevDungeon](https://www.devdungeon.com/content/working-files-go)

## Reading an entire file into memory

One of the most basic file operations is reading an entire file into memory. This is done with the help of the `ReadFile` function of the `ioutil` package:

```go
package main

import (
    "fmt"
    "io/ioutil"
)

func main() {
    data, err := ioutil.ReadFile("test.txt") // data is a []byte
    if err != nil {
        fmt.Println("File reading error", err)
        return
    }
    fmt.Println("Contents of file:", string(data))
}
```

## Reading a file line by line

1. Open the file
1. Create a new scanner from the file
1. Scan the file and read it line by line.

```go
package main

import (
    "bufio"
    "flag"
    "fmt"
    "log"
    "os"
)

func main() {

    f, err := os.Open("text.txt") // open file in path
    if err != nil {
        log.Fatal(err)
    }
    defer func() {
        if err = f.Close(); err != nil {
            log.Fatal(err)
        }
    }()
    s := bufio.NewScanner(f) // create buffer
    for s.Scan() {
        fmt.Println(s.Text())
    }
    err = s.Err()
    if err != nil {
        log.Fatal(err)
    }
}
```

## Reading a file in small chunks

In the last section, we learned how to load an entire file into memory. When the size of the file is extremely large it doesn't make sense to read the entire file into memory especially if you are running low on RAM. A more optimal way is to read the file in small chunks. This can be done with the help of the bufio package.

```go
package main

import (
    "bufio"
    "flag"
    "fmt"
    "log"
    "os"
)

func main() {
    f, err := os.Open("text.txt") // open file in path
    if err != nil {
        log.Fatal(err)
    }
    defer func() {
        if err = f.Close(); err != nil {
            log.Fatal(err)
        }
    }()
    r := bufio.NewReader(f)
    b := make([]byte, 3)
    for {
        n, err := r.Read(b)
        if err != nil {
            fmt.Println("Error reading file:", err)
            break
        }
        fmt.Println(string(b[0:n]))
    }
}
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