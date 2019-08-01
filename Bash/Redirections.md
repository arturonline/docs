# Redirections

> [link](https://catonmat.net/bash-one-liners-explained-part-three)

When bash starts it opens the three standard file descriptors:

- stdin (FD 0)
- stdout (FD 1)
- stderr(FD 2)

File descriptors always point to some file. Usually when bash starts all three file descriptors, stdin, stdout, and stderr, point to your terminal (`/dev/tty0`).

You can open more file descriptors (such as 3, 4, 5, ...), and you can close them. You can also copy file descriptors. And you can write to them and read from them.

## 1. Redirect the standard output of a command to a file

```bash
command >file # command 1>file
```

## 2. Redirect the standard error of a command to a file

```bash
command 2> file
```

## 3. Redirect both standard output and standard error to a file

```bash
command &>file # command >file 2>&1
```

## Send the output from multiple commands to a file

```bash
(command1; command2) >file
```

commands `command1` and `command2` get executed in the sub-shell, and bash redirects their output to `file`.

## Order

When bash sees several redirections it processes them from left to right. Be careful here! Writing:

```bash
command >file 2>&1
```

Is not the same as writing:

```bash
command 2>&1 >file
```

Also note that in bash, writing this:

```bash
command &>file
```

Is exactly the same as:

```bash
command >&file
```

The first form is preferred however.

## Discard the standard output of a command

```bash
command > /dev/null
```

## Give file descriptors names

```bash
exec {filew}>output_file
```

Named file descriptors is a feature of bash 4.1. Named file descriptors look like `{varname}`. You can use them just like regular, numeric, file descriptors. Bash internally chooses a free file descriptor and assigns it a name.

## Open a file for writing using a custom file descriptor

Open file for writing and assign it number 4:

```bash
exec 4>file
```

Now we can simply write to the file descriptor 4:

```bash
echo "foo" >&4
```

And we can close the file descriptor 4:

```bash
exec 4>&-
```

## Open a file both for writing and reading

```bash
exec 3<>file
```

Here we use bash's diamond operator `<>`. The diamond operator opens a file descriptor for both reading and writing.

So for example, if you do this:

```bash
echo "foo bar" > file   # write string "foo bar" to file "file".
exec 5<> file           # open "file" for rw and assign it fd 5.
read -n 3 var <&5       # read the first 3 characters from fd 5.
echo $var
```

This will output foo as we just read the first 3 chars from the file.

Now we can write some stuff to the file:

```bash
echo -n + >&5           # write "+" at 4th position.
exec 5>&-               # close fd 5.
cat file
```

This will output foo+bar as we wrote the + char at 4th position in the file.