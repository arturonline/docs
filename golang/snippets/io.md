# Console input and output

## Read input from console

> Rule of thumb: `fmt.Scan*` is fine for quick tests; for real programs read lines with `bufio.Scanner` and parse them (`strconv`, `strings.Fields`). Always check the returned error.

### Using scanf

`Scanf` scans text read from standard input, storing successive **space-separated values** into successive arguments as **determined by the format**. It returns the number of items successfully scanned. If that is less than the number of arguments, err will report why. Newlines in the input must match newlines in the format. The one exception: the verb %c always scans the next rune in the input, even if it is a space (or tab etc.) or newline.

Read integer:

```go
var i int
if _, err := fmt.Scanf("%d\n", &i); err != nil { // input: 1
	log.Fatal(err)
}
fmt.Println(i)
// 1
```

Read string:

```go
var str string
if _, err := fmt.Scanf("%s\n", &str); err != nil { // input: hola
	log.Fatal(err)
}
fmt.Println(str)
// hola
```

⚠️ Without the `\n` in the format the newline stays unread, and the **next** `Scanf("%d", ...)` fails with `unexpected newline`. `%s` stops at the first space: `hola mundo` gives `hola`.

> Use `fmt.Println`, not the builtin `print`/`println`: those write to stderr and are meant for debugging the runtime.

### Using scan

`Scan` scans text read from standard input, storing successive **space-separated** values into successive arguments. **Newlines count as space**. It returns the number of items successfully scanned. If that is less than the number of arguments, err will report why.

Read integer:

```go
var i int
_, err := fmt.Scan(&i)
```

Read several values (on one line or on several lines):

```go
var name string
var age int
n, err := fmt.Scan(&name, &age) // input: artur 40
fmt.Println(n, err, name, age)
// 2 <nil> artur 40
```

### Using scanln

`Scanln` is similar to `Scan`, but stops scanning at a newline and after the final item there must be a newline or *EOF*.

Read string:

```go
var input string
_, err := fmt.Scanln(&input)
```

### Using bufio

`bufio.Scanner` reads line by line (the `\n` and a trailing `\r` are removed, so Windows `\r\n` is handled). Complete program:

```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	scanner := bufio.NewScanner(os.Stdin)

	fmt.Print("Give first number: ")
	if !scanner.Scan() {
		if err := scanner.Err(); err != nil {
			fmt.Fprintln(os.Stderr, "read error:", err)
		} else {
			fmt.Fprintln(os.Stderr, "no input") // EOF (Ctrl+D / Ctrl+Z)
		}
		os.Exit(1)
	}

	n, err := strconv.Atoi(strings.TrimSpace(scanner.Text()))
	if err != nil {
		fmt.Fprintln(os.Stderr, "not a number:", err)
		os.Exit(1)
	}
	fmt.Println("Result:", n*2)
}
// Give first number: 21
// Result: 42
```

Read string with `bufio.Reader` (the result **includes** the delimiter):

```go
reader := bufio.NewReader(os.Stdin)
text, err := reader.ReadString('\n') // "artur\n" ("artur\r\n" on Windows)
if err != nil && err != io.EOF {
	log.Fatal(err)
}
text = strings.TrimSpace(text) // "artur"
```

### Read all lines until EOF

Typical for tools used in a pipe:

```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

// Sums one integer per line from stdin.
func main() {
	sc := bufio.NewScanner(os.Stdin)
	sum := 0
	for sc.Scan() {
		line := strings.TrimSpace(sc.Text())
		if line == "" {
			continue
		}
		n, err := strconv.Atoi(line)
		if err != nil {
			fmt.Fprintf(os.Stderr, "skip %q: %v\n", line, err)
			continue
		}
		sum += n
	}
	if err := sc.Err(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	fmt.Println("sum:", sum)
}
```

```bash
printf "1\n2\n3\n" | go run .
# sum: 6
```

### Scanner limits and modes

By default a token (line) can be at most **64 KiB** (`bufio.MaxScanTokenSize`). Longer lines stop the scan and `sc.Err()` returns `bufio.ErrTooLong` (`bufio.Scanner: token too long`). Raise the limit before the first `Scan`:

```go
sc := bufio.NewScanner(os.Stdin)
sc.Buffer(make([]byte, 0, 64*1024), 10*1024*1024) // allow lines up to 10 MiB
```

Split by words instead of lines:

```go
sc := bufio.NewScanner(strings.NewReader("one two\nthree"))
sc.Split(bufio.ScanWords) // also: bufio.ScanRunes, bufio.ScanBytes
for sc.Scan() {
	fmt.Println(sc.Text())
}
// one
// two
// three
```

### Read everything at once

```go
data, err := io.ReadAll(os.Stdin) // io.ReadAll replaces the deprecated ioutil.ReadAll
if err != nil {
	log.Fatal(err)
}
fmt.Printf("read %d bytes\n", len(data))
```

## Write output

```go
fmt.Println("to stdout")              // results
fmt.Fprintln(os.Stderr, "to stderr")  // errors, logs, prompts you don't want piped
fmt.Fprintf(os.Stdout, "%-5s|%5d|\n", "id", 42)
// id   |   42|
```

Many small writes: buffer them and remember to `Flush`:

```go
w := bufio.NewWriter(os.Stdout)
defer w.Flush() // without Flush the last chunk is lost
for i := range 3 {
	fmt.Fprintln(w, "line", i)
}
// line 0
// line 1
// line 2
```

Copy stdin to stdout (like `cat`):

```go
if _, err := io.Copy(os.Stdout, os.Stdin); err != nil {
	log.Fatal(err)
}
```
