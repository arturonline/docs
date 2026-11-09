# Read files

> [DevDungeon](https://www.devdungeon.com/content/working-files-go)

The examples read `text.txt`. Create it with:

```bash
printf 'hello world\nsecond line\n' > text.txt
```

## Quick read whole file to memory

`os.ReadFile` (Go 1.16) replaces the deprecated `ioutil.ReadFile`. It opens, reads and closes the file. Fine for small/medium files.

```go
package main

import (
	"fmt"
	"log"
	"os"
)

func main() {
	data, err := os.ReadFile("text.txt") // data is a []byte
	if err != nil {
		log.Fatal(err) // e.g. open text.txt: no such file or directory
	}

	fmt.Printf("Data read (%d bytes):\n%s", len(data), data)
}
// Data read (24 bytes):
// hello world
// second line
```

From an already opened `io.Reader` (file, HTTP body...) use `io.ReadAll(r)`.

## Reading a file line by line

1. Open the file
1. Create a new scanner from the file
1. Scan the file and read it line by line.

```go
package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
)

func main() {
	f, err := os.Open("text.txt") // open file in path (read only)
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close() // for read-only files the Close error can be ignored

	s := bufio.NewScanner(f) // create buffer
	lineNo := 0
	for s.Scan() {
		lineNo++
		fmt.Printf("%d: %s\n", lineNo, s.Text())
	}
	if err := s.Err(); err != nil {
		log.Fatal(err)
	}
}
// 1: hello world
// 2: second line
```

⚠️ A line longer than **64 KiB** makes the scanner stop with `bufio.ErrTooLong`. For big lines (minified JSON, logs) increase the buffer before scanning:

```go
s.Buffer(make([]byte, 0, 1024*1024), 16*1024*1024) // initial 1 MiB, max 16 MiB per line
```

or use `bufio.Reader.ReadString('\n')`, which has no limit.

## Reading a file in small chunks

In the first section, we learned how to load an entire file into memory. When the size of the file is extremely large it doesn't make sense to read the entire file into memory especially if you are running low on RAM. A more optimal way is to read the file in small chunks.

Rules for `Read`: process the `n` bytes **before** looking at the error, and `io.EOF` means "finished", not a failure.

```go
package main

import (
	"bufio"
	"errors"
	"fmt"
	"io"
	"log"
	"os"
)

func main() {
	f, err := os.Open("text.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	r := bufio.NewReader(f)
	b := make([]byte, 4) // use something like 32*1024 in real code
	for {
		n, err := r.Read(b)
		if n > 0 {
			fmt.Printf("%q\n", b[:n])
		}
		if errors.Is(err, io.EOF) {
			break
		}
		if err != nil {
			log.Fatal(err)
		}
	}
}
// "hell"
// "o wo"
// "rld\n"
// "seco"
// "nd l"
// "ine\n"
```

To process a file without loading it, stream it: `io.Copy(dst, f)` (e.g. to hash it with `sha256.New()` or send it in an HTTP response).

## Read a JSON file into a struct

```go
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
)

type Config struct {
	Port  int      `json:"port"`
	Debug bool     `json:"debug"`
	Hosts []string `json:"hosts"`
}

func main() {
	f, err := os.Open("config.json") // {"port": 8080, "debug": true, "hosts": ["a", "b"]}
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	var cfg Config
	if err := json.NewDecoder(f).Decode(&cfg); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%+v\n", cfg)
}
// {Port:8080 Debug:true Hosts:[a b]}
```

## Example: CSV to JSON

`people.csv`:

```text
firstname,lastname,city,state
John,Doe,Austin,TX
Jane,Roe,Denver,CO
```

```go
package main

import (
	"encoding/csv"
	"encoding/json"
	"errors"
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
	csvFile, err := os.Open("people.csv")
	if err != nil {
		log.Fatal(err)
	}
	defer csvFile.Close()

	reader := csv.NewReader(csvFile) // csv.Reader is already buffered
	reader.FieldsPerRecord = 4       // error if a row has a different number of fields

	if _, err := reader.Read(); err != nil { // skip the header
		log.Fatal(err)
	}

	var people []Person
	for {
		line, err := reader.Read()
		if errors.Is(err, io.EOF) {
			break
		}
		if err != nil {
			log.Fatal(err) // e.g. record on line 3: wrong number of fields
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

	peopleJSON, err := json.Marshal(people) // json.MarshalIndent(people, "", "  ") for pretty output
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(string(peopleJSON))
}
// [{"firstname":"John","lastname":"Doe","address":{"city":"Austin","state":"TX"}},{"firstname":"Jane","lastname":"Roe","address":{"city":"Denver","state":"CO"}}]
```

## Embed files in the binary

Files known at build time can be compiled into the executable with `embed` (Go 1.16):

```go
package main

import (
	_ "embed"
	"fmt"
)

//go:embed text.txt
var text string // also []byte, or embed.FS for whole directories

func main() {
	fmt.Print(text)
}
// hello world
// second line
```
