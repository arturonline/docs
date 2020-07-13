# Pipes

Pipes connect the standard output of one command to the standard input of another. You do this by separating the two commands with the pipe symbol (|). Here’s an example:

```sh
    $ echo "hello there"
    hello there
    $ echo "hello there" | sed "s/hello/hi/"
    hi there
```

What does this | do? Among other things, it connects the standard output of the command on the left to the standard input of the command on the right. That is, it creates a special file, a pipe, which is opened as a write destinaton for the left command, and as a read source for the right command.

           echo foo               |                cat

 ---       +--------------+               ---       +--------------+
( 0 ) ---->| /dev/pts/5   |     ------>  ( 0 ) ---->|pipe (read)   |
 ---       +--------------+    /          ---       +--------------+
                              /
 ---       +--------------+  /            ---       +--------------+
( 1 ) ---->| pipe (write) | /            ( 1 ) ---->| /dev/pts     |
 ---       +--------------+               ---       +--------------+

 ---       +--------------+               ---       +--------------+
( 2 ) ---->| /dev/pts/5   |              ( 2 ) ---->| /dev/pts/    |
 ---       +--------------+               ---       +--------------+

## File descriptors

A file descriptor, or FD, is a positive integer that refers to an input/output source. When sh starts it opens the three standard file descriptors:

- stdin (0)
- stdout (1)
- stderr(2)

You can close, you can copy, write and read from them.

## Redirect the standard output of a command to a file

```sh
    command > file # command 1> file
```

## Redirect the standard error of a command to a file

```sh
    command 2> file
```

## Redirect both standard output and standard error to a file

```sh
    command &>file # command >file 2>&1
```

## Send the output from multiple commands to a file

```sh
    (command1; command2) > file
```

commands `command1` and `command2` get executed in the sub-shell, and sh redirects their output to `file`.

## Order

When sh sees several redirections it processes them from left to right. Be careful here! Writing:

```sh
    command > file 2>&1
```

Is not the same as writing:

```sh
    command 2>&1 > file
```

Also note that in sh, writing this:

```sh
    command &> file
```

Is exactly the same as:

```sh
    command >&file
```

The first form is preferred however.

## Discard the standard output of a command

```sh
    command > /dev/null
```

## Give file descriptors names

```sh
    exec {filew} > output_file
```

Named file descriptors is a feature of sh 4.1. Named file descriptors look like `{varname}`. You can use them just like regular, numeric, file descriptors. Bash internally chooses a free file descriptor and assigns it a name.

## Open a file for reading using a custom file descriptor

```sh
    exec 3< file
```

Here opens the file for reading and assigns the opened file-descriptor to the shell's file descriptor number 3.

Now you can read from the file descriptor 3, like this:

```sh
    read -u 3 line
```

This reads a line from the file that we just opened as fd 3.

Or you can use regular shell commands such as grep and operate on file descriptor 3:

```sh
    grep "foo" <&3
```

After you're done using fd 3, you can close it this way:

```sh
    exec 3>&-
```

Here the file descriptor 3 is duped to `-`, which is sh's special way to say "close this fd".

## Open a file for writing using a custom file descriptor

Open file for writing and assign it number 4:

```sh
    exec 4> file
```

Now we can simply write to the file descriptor 4:

```sh
    echo "foo" >&4
```

And we can close the file descriptor 4:

```sh
    exec 4>&-
```

## Open a file both for writing and reading

```sh
    exec 3<>file
```

Here we use sh's diamond operator `<>`. The diamond operator opens a file descriptor for both reading and writing.

So for example, if you do this:

```sh
    echo "foo bar" > file   # write string "foo bar" to file "file".
    exec 5<> file           # open "file" for rw and assign it fd 5.
    read -n 3 var <&5       # read the first 3 characters from fd 5.
    echo $var
```

This will output foo as we just read the first 3 chars from the file.

Now we can write some stuff to the file:

```sh
    echo -n + >&5           # write "+" at 4th position.
    exec 5>&-               # close fd 5.
    cat file
```

This will output foo+bar as we wrote the + char at 4th position in the file.
