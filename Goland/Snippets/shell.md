# Run shell commands

Package exec runs external commands. It wraps os.StartProcess to make it easier to remap stdin and stdout, connect I/O with pipes, and do other adjustments.

## func Command

```go
func Command(name string, arg ...string) *Cmd
```

Examples:

```go
// we define the command, it is not executed
cmd := exec.Command("ls", "-lah")

// here we redirect the command output
cmd.Stdout = os.Stdout
cmd.Stderr = os.Stderr

// Here we run the command and catch any error
err := cmd.Run()
if err != nil {
	log.Fatalf("cmd.Run() failed with %s\n", err)
}
```

Another way:

```go
// here we perform the pwd command.
// we store the output of this in our out variable
// and catch any errors in err
out, err := exec.Command("ls").Output()

// if there is an error with our execution
// handle it here
if err != nil {
    fmt.Printf("%s", err)
}
// as the out variable defined above is of type []byte we need to convert
// this to a string or else we will see garbage printed out in our console
// this is how we convert it to a string
fmt.Println("Command Successfully Executed")
output := string(out[:])
fmt.Println(output)
```

## Run a commmand in a specific folder

```go
// Dir specifies the working directory of the command.
// If Dir is the empty string, Run runs the command in the
// calling process's current directory.
Dir string
cmd:= exec.Command("git", "log")
cmd.Dir = "your/intended/working/directory"
out, err := cmd.Output()
```