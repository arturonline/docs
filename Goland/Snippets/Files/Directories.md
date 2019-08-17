# Files and File Path

## Join

Return a string with a file path using the correct path separators.

```go
println(path.Join("usr", "bin", "spam"))
// usr/bin/spam
```

> [Package "path"](https://golang.org/pkg/path/#Join)

## Current Working Directory

```go
dir, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}
  fmt.Println(dir)
```

>[Package "os"](https://golang.org/pkg/os/)

## Change Directory

```go
os.Chdir("/Users/artur/Repos")
```

## Make directory

```go
os.Mkdir("pruebas", 0700)
```

## Base and Dir

Base returns the last element of path.

```go
fmt.Println(path.Base("/a/b"))
// b
```

Dir returns the path's directory.

```go
fmt.Println(path.Dir("/a/b/c"))
// /a/b
```

## File Extension

```go
fmt.Println(path.Ext("/a/b/c/bar.css"))
// .css
```

## Split

Split splits path immediately following the final slash, separating it into a directory and file name component as strings

```go
dir, file := path.Split("static/myfile.css")
fmt.Println("dir: ", dir)
fmt.Println("file: ", file)
```

## SplitList

SplitList splits a list of paths joined by the OS-specific ListSeparator, usually found in PATH or GOPATH environment variables. Unlike strings.Split, SplitList returns an empty slice when passed an empty string.

```go
fmt.Println("On Unix:", filepath.SplitList("/a/b/c:/usr/bin"))
// [/a/b/c /usr/bin]
```

## Match

```go
func Match(pattern, name string) (matched bool, err error)
```

Match reports whether name matches the shell file name pattern. The pattern syntax is:

```bash
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

## List files in a folder

### #0: using Glob (dangerous)

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
    files, err := filepath.Glob("*")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(files) // contains a list of all files in the current directory
}
```

⚠️ `Glob` ignores file system errors such as I/O errors reading directories. The only possible returned error is `ErrBadPattern`, when pattern is malformed.

### #1: using ioutil.ReadDir (Prefered)

```go
func ReadDir(dirname string) ([]os.FileInfo, error)
```

ReadDir reads the directory named by dirname and returns a list of directory entries sorted by filename:

```go
package main

import (
    "fmt"
    "io/ioutil"
    "log"
)

func main() {
    files, err := ioutil.ReadDir(".")
    if err != nil {
        log.Fatal(err)
    }

    for _, file := range files {
        fmt.Println(file.Name())
    }
}

```

### #2: using os.File.Readdir

If you don’t need sorting you can as well ``use File.Readdir`:

```go
package main

import (
    "fmt"
    "log"
    "os"
)

func main() {
    dirname := "."

    f, err := os.Open(dirname)
    if err != nil {
        log.Fatal(err)
    }
    files, err := f.Readdir(-1)
    f.Close()
    if err != nil {
        log.Fatal(err)
    }

    for _, file := range files {
        fmt.Println(file.Name())
    }
}
```

### #3: Visit all files and subfolders in a directory tree with Walk and WalkFunc

```go
func Walk(root string, walkFn WalkFunc) error
```

`Walk` walks the file tree rooted at root, calling `walkFn` for each file or directory in the tree, including root. All errors that arise visiting files and directories are filtered by `walkFn`. Walk does not follow symbolic links.

> `filepath.Walk` is handy but scans subfolders too, by default, which might not be what you want.

```go
type WalkFunc func(path string, info os.FileInfo, err error) error
```

`WalkFunc` is the type of the function called for each file or directory visited by `Walk`. The path argument contains the argument to Walk as a prefix; that is, if Walk is called with "dir", which is a directory containing the file "a", the walk function will be called with argument "dir/a". The info argument is the `os.FileInfo` for the named path.

If there was a problem walking to the file or directory named by path, the incoming error will describe the problem and the function can decide how to handle that error (and Walk will not descend into that directory). In the case of an error, the info argument will be nil. If an error is returned, processing stops. The sole exception is when the function returns the special value `SkipDir`. If the function returns SkipDir when invoked on a directory, Walk skips the directory's contents entirely. If the function returns SkipDir when invoked on a non-directory file, Walk skips the remaining files in the containing directory.

Example1:

```go
err := filepath.Walk(".",
    func(path string, info os.FileInfo, err error) error {
    if err != nil {
        return err
    }
    fmt.Println(path, info.Size())
    return nil
})
if err != nil {
    log.Println(err)
}
// . 1644
// dev 1644
// dev/null 0
// dev/random 0
// dev/urandom 0
// dev/zero 0
// etc 1644
```

example2:

```go
package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
)

func prepareTestDirTree(tree string) (string, error) {
	tmpDir, err := ioutil.TempDir("", "")
	if err != nil {
		return "", fmt.Errorf("error creating temp directory: %v\n", err)
	}

	err = os.MkdirAll(filepath.Join(tmpDir, tree), 0755)
	if err != nil {
		os.RemoveAll(tmpDir)
		return "", err
	}

	return tmpDir, nil
}

func main() {
	tmpDir, err := prepareTestDirTree("dir/to/walk/skip")
	if err != nil {
		fmt.Printf("unable to create test dir tree: %v\n", err)
		return
	}
	defer os.RemoveAll(tmpDir)
	os.Chdir(tmpDir)

	subDirToSkip := "skip"

	err = filepath.Walk(".", func(path string, info os.FileInfo, err error) error {
		if err != nil {
			fmt.Printf("prevent panic by handling failure accessing a path %q: %v\n", path, err)
			return err
		}
		if info.IsDir() && info.Name() == subDirToSkip {
			fmt.Printf("skipping a dir without errors: %+v \n", info.Name())
			return filepath.SkipDir
		}
		fmt.Printf("visited file or dir: %q\n", path)
		return nil
	})
	if err != nil {
		fmt.Printf("error walking the path %q: %v\n", tmpDir, err)
		return
	}
}
// visited file or dir: "."
// visited file or dir: "dir"
// visited file or dir: "dir/to"
// visited file or dir: "dir/to/walk"
// skipping a dir without errors: skip
// ```