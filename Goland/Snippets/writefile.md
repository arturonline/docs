# Writefiles

## #1: write a string to a file

```go
func WriteString(w Writer, s string) (n int, err error)
```

`WriteString` writes the contents of the string `s` to `w`, which accepts a slice of bytes. This method returns the number of bytes written and error if any.

Example:

```go
package main

import (
    "fmt"
    "os"
)

func main() {
    f, err := os.Create("test.txt")
    if err != nil {
        fmt.Println(err)
        return
    }
    l, err := f.WriteString("Hello World")
    if err != nil {
        fmt.Println(err)
        f.Close()
        return
    }
    fmt.Println(l, "bytes written successfully")
    err = f.Close()
    if err != nil {
        fmt.Println(err)
        return
    }
}
```

## #2 Write a file with WriteFile

```go
func WriteFile(filename string, data []byte, perm os.FileMode) error
```

`WriteFile` writes data to a file named by `filename`. If the file does not exist, `WriteFile` creates it with permissions `perm`; otherwise `WriteFile` truncates it before writing.

```go
func main() {
	d1 := []byte("Hello, Gophers!")
	err := ioutil.WriteFile("/home/file/data", d1, 0644)
		if err != nil {
		log.Fatal(err)
	}

}
```

## #3 Appending to a file with WriteFile

The following way will allow you to append to an existing file if it already exists, or creates a new file if it doesn't exist:

```go
package main

import (
    "os"
    "log"
)


func main() {
    // If the file doesn't exist, create it, or append to the file
    f, err := os.OpenFile("access.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
    if err != nil {
        log.Fatal(err)
    }

    _, err = f.Write([]byte("Hello"))
    if err != nil {
        log.Fatal(err)
    }

    f.Close()
}
```

## #4 Writing bytes to a file

```go
func (f *File) Write(b []byte) (n int, err error)
```

`Write` writes `len(b)` bytes to the File. It returns the number of bytes written and an error, if any. Write returns a non-nil error when `n != len(b)`.

```go
package main

import (
    "fmt"
    "os"
)

func main() {
    f, err := os.Create("/home/naveen/bytes")
    if err != nil {
        fmt.Println(err)
        return
    }

    d2 := []byte{104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100}
    n2, err := f.Write(d2)
    if err != nil {
        fmt.Println(err)
        f.Close()
        return
    }
    fmt.Println(n2, "bytes written successfully")
    err = f.Close()
    if err != nil {
        fmt.Println(err)
        return
    }
}
```

## #5 Write strings line by line

```go
func Fprintln(w io.Writer, a ...interface{}) (n int, err error)
```

`Fprintln` formats using the default formats for its operands and writes to `w`. Spaces are always added between operands and a newline is appended. It returns the number of bytes written and any write error encountered.

```go
package main

import (
    "fmt"
    "os"
)

func main() {
    f, err := os.Create("lines")
    if err != nil {
        fmt.Println(err)
                f.Close()
        return
    }
    d := []string{"Welcome to the world of Go1.", "Go is a compiled language.", "It is easy to learn Go."}

    for _, v := range d {
        fmt.Fprintln(f, v)
        if err != nil {
            fmt.Println(err)
            return
        }
    }
    err = f.Close()
    if err != nil {
        fmt.Println(err)
        return
    }
    fmt.Println("file written successfully")
}
```