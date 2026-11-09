# Run shell commands

Package `os/exec` runs external commands. It wraps `os.StartProcess` to make it easier to remap *stdin* and *stdout*, connect I/O with pipes, and do other adjustments.

> `exec.Command` does **not** use a shell: no pipes, globs (`*.go`), `~` or `$VAR` expansion. Arguments are passed as-is, which also means no shell injection.

## func Command

```go
func Command(name string, arg ...string) *Cmd
func CommandContext(ctx context.Context, name string, arg ...string) *Cmd
```

`name` is looked up in `PATH` (`exec.LookPath`). Since Go 1.19 a program found in the *current directory* is not run (error `exec.ErrDot`); use `./prog` explicitly.

Examples:

```go
// we define the command, it is not executed
cmd := exec.Command("ls", "-lah")

// here we redirect the command output to our own stdout/stderr
cmd.Stdout = os.Stdout
cmd.Stderr = os.Stderr

// here we run the command (Start + Wait) and catch any error
if err := cmd.Run(); err != nil {
	log.Fatalf("cmd.Run() failed: %v", err)
}
```

Another way, capturing the output:

```go
// Output runs the command and returns its stdout as []byte
out, err := exec.Command("ls").Output()
if err != nil {
	log.Fatal(err) // if the command failed, err is *exec.ExitError (stderr in err.(*exec.ExitError).Stderr)
}
// out is a []byte, convert it to a string to print it
fmt.Println("Command Successfully Executed")
fmt.Println(string(out))
```

> On Windows `ls`, `dir`, `echo`... are shell built-ins, not executables: use `exec.Command("cmd", "/C", "dir")` or `exec.Command("powershell", "-NoProfile", "-Command", "Get-ChildItem")`.

## Output vs CombinedOutput

| Method | Returns |
|---|---|
| `Run()` | only the error; set `cmd.Stdout`/`cmd.Stderr` yourself |
| `Output()` | stdout; stderr goes to `ExitError.Stderr` (if `cmd.Stderr` is nil) |
| `CombinedOutput()` | stdout + stderr interleaved, like in a terminal |

Complete example with a timeout:

```go
package main

import (
	"context"
	"fmt"
	"log"
	"os/exec"
	"time"
)

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	out, err := exec.CommandContext(ctx, "git", "--version").CombinedOutput()
	if err != nil {
		log.Fatalf("git failed: %v\n%s", err, out)
	}
	fmt.Printf("%s", out)
}
// git version 2.47.0 (depends on your installation)
```

## Exit codes

A command that runs but exits with a code other than 0 returns `*exec.ExitError`. Any other error (not found, permission denied...) means it didn't run.

```go
package main

import (
	"errors"
	"fmt"
	"log"
	"os"
	"os/exec"
)

func main() {
	cmd := exec.Command("git", "status")
	cmd.Dir = os.TempDir() // not a git repository

	out, err := cmd.CombinedOutput()
	var exitErr *exec.ExitError
	switch {
	case errors.As(err, &exitErr):
		fmt.Println("exit code:", exitErr.ExitCode())
	case err != nil:
		log.Fatal(err) // e.g. exec: "git": executable file not found in $PATH
	}
	fmt.Printf("%s", out)
}
// exit code: 128
// fatal: not a git repository (or any of the parent directories): .git
```

## Timeouts and cancellation

When the context expires the process is killed (`cmd.Cancel`, default `Process.Kill`). Check the context to tell a timeout from a normal failure:

```go
ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
defer cancel()

cmd := exec.CommandContext(ctx, "sleep", "10")
cmd.WaitDelay = time.Second // Go 1.20+: don't hang if a child keeps the pipes open
err := cmd.Run()
if errors.Is(ctx.Err(), context.DeadlineExceeded) {
	fmt.Println("timed out:", err)
}
// timed out: signal: killed
```

## Run a command in a specific folder

`cmd.Dir` specifies the working directory of the command. If `Dir` is the empty string, the command runs in the calling process's current directory.

```go
cmd := exec.Command("git", "log", "--oneline", "-n", "3")
cmd.Dir = "your/intended/working/directory"
out, err := cmd.Output()
if err != nil {
	log.Fatal(err)
}
fmt.Print(string(out))
```

## Environment variables and stdin

```go
cmd := exec.Command("sort")
cmd.Env = append(os.Environ(), "LC_ALL=C") // nil Env = inherit the parent environment
cmd.Stdin = strings.NewReader("banana\napple\ncherry\n")
out, err := cmd.Output()
if err != nil {
	log.Fatal(err)
}
fmt.Print(string(out))
// apple
// banana
// cherry
```

## Stream output line by line

Read from the pipe **before** calling `Wait` (Wait closes the pipe):

```go
cmd := exec.Command("ping", "-c", "3", "localhost") // Windows: "-n", "3"
stdout, err := cmd.StdoutPipe()
if err != nil {
	log.Fatal(err)
}
if err := cmd.Start(); err != nil {
	log.Fatal(err)
}
sc := bufio.NewScanner(stdout)
for sc.Scan() {
	fmt.Println("line:", sc.Text())
}
if err := cmd.Wait(); err != nil {
	log.Fatal(err)
}
```

## When you really need a shell

Pipes, redirections, globs... Never concatenate user input into the command string (shell injection); pass it as separate arguments instead.

```go
var cmd *exec.Cmd
if runtime.GOOS == "windows" {
	cmd = exec.Command("cmd", "/C", "dir /b | find /c /v \"\"")
} else {
	cmd = exec.Command("sh", "-c", "ls | wc -l")
}
out, err := cmd.CombinedOutput()
```
