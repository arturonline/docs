# Write files

> When **writing**, always check the error returned by `Close()`: data may still be in OS buffers and a full disk / network FS error can show up there. For read-only files `defer f.Close()` is enough.

## #1: write a string to a file

```go
func (f *File) WriteString(s string) (n int, err error)
```

`WriteString` writes the contents of the string `s` to the file. It returns the number of bytes written and an error, if any. (For any `io.Writer` there is also `io.WriteString(w, s)`.)

Example:

```go
package main

import (
	"fmt"
	"log"
	"os"
)

func main() {
	f, err := os.Create("test.txt") // creates or truncates, mode 0666 (before umask)
	if err != nil {
		log.Fatal(err)
	}
	l, err := f.WriteString("Hello World")
	if err != nil {
		f.Close()
		log.Fatal(err)
	}
	if err := f.Close(); err != nil {
		log.Fatal(err)
	}
	fmt.Println(l, "bytes written successfully")
}
// 11 bytes written successfully
```

## #2 Write a file with WriteFile

```go
func WriteFile(name string, data []byte, perm os.FileMode) error
```

`os.WriteFile` (replaces the deprecated `ioutil.WriteFile`) writes data to the named file. If the file does not exist, `WriteFile` creates it with permissions `perm` (before umask); otherwise `WriteFile` truncates it before writing, **without changing its permissions**.

```go
package main

import (
	"log"
	"os"
)

func main() {
	d1 := []byte("Hello, Gophers!")
	if err := os.WriteFile("data.txt", d1, 0o644); err != nil {
		log.Fatal(err)
	}
}
```

Use `0o600` for files with secrets. See [Permission Bits](Permission%20Bits.md).

## #3 Appending to a file with OpenFile

The following way will allow you to append to an existing file if it already exists, or creates a new file if it doesn't exist:

```go
package main

import (
	"log"
	"os"
)

func main() {
	// If the file doesn't exist, create it, or append to the file
	f, err := os.OpenFile("access.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
	if err != nil {
		log.Fatal(err)
	}

	if _, err := f.Write([]byte("Hello\n")); err != nil {
		f.Close()
		log.Fatal(err)
	}

	if err := f.Close(); err != nil {
		log.Fatal(err)
	}
}
```

Use these attributes individually or combined with an OR for second arg of `OpenFile()`. Exactly one of the first three is required:

```go
os.O_RDONLY // Read only
os.O_WRONLY // Write only
os.O_RDWR   // Read and write
os.O_APPEND // Append to end of file
os.O_CREATE // Create if none exists
os.O_EXCL   // With O_CREATE: fail if the file already exists
os.O_TRUNC  // Truncate file when opening
os.O_SYNC   // Synchronous I/O
```

`os.Open(name)` = `OpenFile(name, O_RDONLY, 0)` and `os.Create(name)` = `OpenFile(name, O_RDWR|O_CREATE|O_TRUNC, 0666)`.

Create only if it doesn't exist:

```go
f, err := os.OpenFile("lock", os.O_WRONLY|os.O_CREATE|os.O_EXCL, 0o644)
if errors.Is(err, fs.ErrExist) {
	fmt.Println("already exists")
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
	"log"
	"os"
)

func main() {
	// Open a new file for writing only
	file, err := os.OpenFile(
		"test.txt",
		os.O_WRONLY|os.O_TRUNC|os.O_CREATE,
		0o666,
	)
	if err != nil {
		log.Fatal(err)
	}

	// Write bytes to file
	byteSlice := []byte("Bytes!\n")
	bytesWritten, err := file.Write(byteSlice)
	if err != nil {
		file.Close()
		log.Fatal(err)
	}
	if err := file.Close(); err != nil {
		log.Fatal(err)
	}
	log.Printf("Wrote %d bytes.\n", bytesWritten)
}
// 2025/01/01 10:00:00 Wrote 7 bytes.
```

## #5 Write strings line by line

```go
func Fprintln(w io.Writer, a ...any) (n int, err error)
```

`Fprintln` formats using the default formats for its operands and writes to `w`. Spaces are always added between operands and a newline is appended. It returns the number of bytes written and any write error encountered.

With many small writes use a `bufio.Writer` (and don't forget `Flush`). Reusable function that also reports the `Close` error through a named return:

```go
package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
)

func writeLines(path string, lines []string) (err error) {
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer func() {
		if cerr := f.Close(); cerr != nil && err == nil {
			err = cerr
		}
	}()

	w := bufio.NewWriter(f)
	for _, v := range lines {
		if _, err := fmt.Fprintln(w, v); err != nil {
			return err
		}
	}
	return w.Flush() // without Flush the buffered data is lost
}

func main() {
	d := []string{"Welcome to the world of Go1.", "Go is a compiled language.", "It is easy to learn Go."}
	if err := writeLines("lines", d); err != nil {
		log.Fatal(err)
	}
	fmt.Println("file written successfully")
}
// file written successfully
```

## Write a file atomically

`os.WriteFile` truncates first, so a crash midway leaves a broken file. Write to a temp file in the **same directory** and rename it (rename is atomic on the same filesystem; on Windows `os.Rename` replaces the target too):

```go
func writeFileAtomic(path string, data []byte, perm os.FileMode) error {
	tmp, err := os.CreateTemp(filepath.Dir(path), ".tmp-*")
	if err != nil {
		return err
	}
	defer os.Remove(tmp.Name()) // cleanup on error; fails harmlessly after the rename

	if _, err := tmp.Write(data); err != nil {
		tmp.Close()
		return err
	}
	if err := tmp.Sync(); err != nil { // flush to disk before renaming
		tmp.Close()
		return err
	}
	if err := tmp.Close(); err != nil {
		return err
	}
	if err := os.Chmod(tmp.Name(), perm); err != nil { // CreateTemp uses 0600
		return err
	}
	return os.Rename(tmp.Name(), path)
}
```

## Copy a File

```go
package main

import (
	"io"
	"log"
	"os"
)

// Copy a file
func main() {
	// Open original file
	originalFile, err := os.Open("test.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer originalFile.Close()

	// Create new file
	newFile, err := os.Create("test_copy.txt")
	if err != nil {
		log.Fatal(err)
	}

	// Copy the bytes to destination from source (streams, doesn't load the whole file)
	bytesWritten, err := io.Copy(newFile, originalFile)
	if err != nil {
		newFile.Close()
		log.Fatal(err)
	}

	// Commit the file contents: flushes OS buffers to disk
	if err := newFile.Sync(); err != nil {
		newFile.Close()
		log.Fatal(err)
	}
	if err := newFile.Close(); err != nil {
		log.Fatal(err)
	}
	log.Printf("Copied %d bytes.", bytesWritten)
}
```

To copy a whole directory tree (Go 1.23): `os.CopyFS("dst", os.DirFS("src"))` (it doesn't overwrite existing files).
