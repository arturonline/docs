# Files and File Path

> Two packages: [`path/filepath`](https://pkg.go.dev/path/filepath) for **OS file paths** (uses `\` on Windows) and [`path`](https://pkg.go.dev/path) for **slash-separated paths** only (URLs, `embed`/`io/fs` paths). For files on disk always use `filepath`.

## Join

Returns a string with a file path using the correct path separators (and cleans `..`, `//`).

```go
fmt.Println(filepath.Join("usr", "bin", "spam"))
// usr/bin/spam       (Windows: usr\bin\spam)
fmt.Println(filepath.Join("a/b", "../c", "file.txt"))
// a/c/file.txt
```

## Current Working Directory

```go
dir, err := os.Getwd()
if err != nil {
	log.Fatal(err)
}
fmt.Println(dir)
```

Other useful locations:

```go
home, err := os.UserHomeDir()   // /home/artur, C:\Users\artur
exe, err := os.Executable()     // path of the running binary
tmp := os.TempDir()             // /tmp, %TEMP%
abs, err := filepath.Abs("x.txt") // absolute path relative to the cwd
```

>[Package "os"](https://pkg.go.dev/os)

## Change Directory

```go
if err := os.Chdir("/Users/artur/Repos"); err != nil {
	log.Fatal(err)
}
```

> It changes the cwd of the **whole process** (all goroutines). Prefer building absolute paths with `filepath.Join`; for child processes set `cmd.Dir`.

## Make directory

```go
// One level; fails if it already exists (errors.Is(err, fs.ErrExist))
if err := os.Mkdir("pruebas", 0o755); err != nil {
	log.Fatal(err)
}

// With parents, like mkdir -p; no error if it already exists
if err := os.MkdirAll("pruebas/a/b", 0o755); err != nil {
	log.Fatal(err)
}

// Temporary directory with a unique name (replaces ioutil.TempDir)
tmp, err := os.MkdirTemp("", "myapp-*")
if err != nil {
	log.Fatal(err)
}
defer os.RemoveAll(tmp)
```

The mode is filtered by the umask (see [Permission Bits](Permission%20Bits.md)).

## Remove, rename, exists

```go
err := os.Remove("file.txt")     // a file or an empty directory
err = os.RemoveAll("pruebas")    // recursive, like rm -rf; nil if it doesn't exist
err = os.Rename("old.txt", "new.txt")
```

Check if a file exists:

```go
_, err := os.Stat("file.txt")
switch {
case err == nil:
	fmt.Println("exists")
case errors.Is(err, fs.ErrNotExist):
	fmt.Println("does not exist")
default:
	log.Fatal(err) // permission denied, etc.: we don't know
}
```

## Base and Dir

**Base** returns the last element of path.

```go
fmt.Println(filepath.Base("/a/b"))
// b
```

**Dir** returns the path's directory.

```go
fmt.Println(filepath.Dir("/a/b/c"))
// /a/b
```

## File Extension

```go
fmt.Println(filepath.Ext("/a/b/c/bar.css"))
// .css

name := filepath.Base("/a/b/c/bar.css")
fmt.Println(strings.TrimSuffix(name, filepath.Ext(name)))
// bar
```

## Split

Split splits path immediately following the final separator, separating it into a directory and file name component.

```go
dir, file := filepath.Split("static/myfile.css")
fmt.Println(dir, file)
// static/ myfile.css
```

## Rel

```go
rel, err := filepath.Rel("/a/b", "/a/b/c/d.txt")
fmt.Println(rel, err)
// c/d.txt <nil>
```

## SplitList

**SplitList** splits a list of paths joined by the OS-specific ListSeparator (`:` on Unix, `;` on Windows), as in `PATH`. Unlike `strings.Split`, `SplitList` returns an empty slice when passed an empty string.

```go
fmt.Println("On Unix:", filepath.SplitList("/a/b/c:/usr/bin"))
// On Unix: [/a/b/c /usr/bin]
```

## Match

```go
func Match(pattern, name string) (matched bool, err error)
```

Match reports whether name matches the shell file name pattern. The pattern syntax is:

```text
pattern:
	{ term }
term:
	'*'         matches any sequence of non-Separator characters
	'?'         matches any single non-Separator character
	'[' [ '^' ] { character-range } ']'
	            character class (must be non-empty)
	c           matches character c (c != '*', '?', '\\', '[')
	'\\' c      matches character c

character-range:
	c           matches character c (c != '\\', '-', ']')
	'\\' c      matches character c
	lo '-' hi   matches character c for lo <= c <= hi
```

```go
fmt.Println(filepath.Match("/home/catch/*", "/home/catch/foo"))
fmt.Println(filepath.Match("/home/catch/*", "/home/catch/foo/bar"))
fmt.Println(filepath.Match("/home/?opher", "/home/gopher"))
fmt.Println(filepath.Match("/home/\\*", "/home/*"))
// true <nil>
// false <nil>
// true <nil>
// true <nil>
```

> On Windows `\` is the separator, so escaping with `\\` is not available. There is no `**` (recursive) support: use `WalkDir`.

## List files in a folder

### #0: using Glob (ignores I/O errors)

```go
func Glob(pattern string) (matches []string, err error)
```

Glob returns the **names** of all files matching pattern or nil if there is no matching file. The syntax of patterns is the same as in **Match**. The pattern may describe hierarchical names such as `/usr/*/bin/ed` (assuming the Separator is '/').

```go
package main

import (
	"fmt"
	"log"
	"path/filepath"
)

func main() {
	files, err := filepath.Glob("*.go")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(files) // e.g. [main.go util.go]
}
```

⚠️ `Glob` ignores file system errors such as I/O errors reading directories. The only possible returned error is `ErrBadPattern`, when pattern is malformed.

### #1: using os.ReadDir (preferred)

```go
func ReadDir(name string) ([]os.DirEntry, error)
```

`os.ReadDir` reads the directory and returns its entries **sorted by filename**. It replaces the deprecated `ioutil.ReadDir`, and is cheaper because `DirEntry` doesn't call `stat` for every file (call `Info()` only when you need size/mode/time).

```go
package main

import (
	"fmt"
	"log"
	"os"
)

func main() {
	entries, err := os.ReadDir(".")
	if err != nil {
		log.Fatal(err)
	}

	for _, e := range entries {
		if e.IsDir() {
			fmt.Println(e.Name() + "/")
			continue
		}
		info, err := e.Info()
		if err != nil {
			log.Fatal(err)
		}
		fmt.Printf("%-20s %8d bytes\n", e.Name(), info.Size())
	}
}
// docs/
// go.mod                     23 bytes
// main.go                   412 bytes
```

### #2: using os.File.ReadDir

If you don't need sorting, or the directory is huge, read it in batches with `File.ReadDir(n)`:

```go
package main

import (
	"errors"
	"fmt"
	"io"
	"log"
	"os"
)

func main() {
	f, err := os.Open(".")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	for {
		entries, err := f.ReadDir(100) // n > 0: at most 100 entries per call
		for _, e := range entries {
			fmt.Println(e.Name())
		}
		if errors.Is(err, io.EOF) {
			break
		}
		if err != nil {
			log.Fatal(err)
		}
	}
}
```

`f.ReadDir(-1)` returns everything at once (unsorted). The old `f.Readdir` returns `[]os.FileInfo` and is slower.

### #3: Visit all files and subfolders in a directory tree with WalkDir

```go
func WalkDir(root string, fn fs.WalkDirFunc) error
type WalkDirFunc func(path string, d fs.DirEntry, err error) error
```

`WalkDir` (Go 1.16) walks the file tree rooted at root, calling `fn` for each file or directory in the tree, including root, in **lexical order**. It is more efficient than the older `filepath.Walk` because it doesn't `stat` every file. It does not follow symbolic links.

- The `path` argument contains `root` as a prefix: with root `"dir"` and a file `a`, `fn` is called with `"dir/a"`.
- If there was a problem reading a directory, `fn` is called with a non-nil `err`. Return it to stop the walk, or return `nil` to skip and continue.
- Returning `filepath.SkipDir` on a directory skips its contents; on a file it skips the rest of the files in the same directory. `filepath.SkipAll` (Go 1.20) stops the walk without error.

Example (self-contained: creates a temporary tree first):

```go
package main

import (
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"
)

func main() {
	root, err := os.MkdirTemp("", "walkdemo")
	if err != nil {
		log.Fatal(err)
	}
	defer os.RemoveAll(root)

	// root/dir/to/walk/skip + some files
	if err := os.MkdirAll(filepath.Join(root, "dir", "to", "walk", "skip"), 0o755); err != nil {
		log.Fatal(err)
	}
	for _, name := range []string{"dir/a.txt", "dir/to/b.go", "dir/to/walk/skip/hidden.txt"} {
		if err := os.WriteFile(filepath.Join(root, filepath.FromSlash(name)), nil, 0o644); err != nil {
			log.Fatal(err)
		}
	}

	err = filepath.WalkDir(root, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err // e.g. permission denied; return nil to ignore it and keep walking
		}
		if d.IsDir() && d.Name() == "skip" {
			fmt.Println("skipping:", d.Name())
			return filepath.SkipDir
		}
		rel, err := filepath.Rel(root, path)
		if err != nil {
			return err
		}
		fmt.Println("visited:", filepath.ToSlash(rel))
		return nil
	})
	if err != nil {
		log.Fatal(err)
	}
}
// visited: .
// visited: dir
// visited: dir/a.txt
// visited: dir/to
// visited: dir/to/b.go
// visited: dir/to/walk
// skipping: skip
```

Find all files with an extension (recursive `**/*.go`):

```go
var goFiles []string
err := filepath.WalkDir(".", func(path string, d fs.DirEntry, err error) error {
	if err != nil {
		return err
	}
	if d.IsDir() && (d.Name() == ".git" || d.Name() == "node_modules") {
		return filepath.SkipDir
	}
	if !d.IsDir() && filepath.Ext(path) == ".go" {
		goFiles = append(goFiles, path)
	}
	return nil
})
```

### #4: io/fs and os.DirFS

`os.DirFS(dir)` returns an `fs.FS` rooted at `dir`. Code written against `fs.FS` also works with `embed.FS`, zip files and `fstest.MapFS` in tests. Paths inside an `fs.FS` always use `/` and have no leading slash.

```go
fsys := os.DirFS("snippets")

matches, err := fs.Glob(fsys, "*.md")
if err != nil {
	log.Fatal(err)
}
fmt.Println(matches) // [cli.md io.md ...]

err = fs.WalkDir(fsys, ".", func(p string, d fs.DirEntry, err error) error {
	if err != nil {
		return err
	}
	fmt.Println(p) // ".", "cli.md", "files", "files/dir.md", ...
	return nil
})

data, err := fs.ReadFile(fsys, "files/dir.md")
```

Copy a whole tree (Go 1.23, does not overwrite existing files):

```go
err := os.CopyFS("backup", os.DirFS("snippets"))
```
