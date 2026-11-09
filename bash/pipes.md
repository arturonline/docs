# Pipes

Pipes connect the standard output of one command to the standard input of another. You do this by separating the two commands with the pipe symbol (|). Here’s an example:

```bash
$ echo "hello there"
hello there
$ echo "hello there" | sed "s/hello/hi/"
hi there
```

What does this | do? Among other things, it connects the standard output of the command on the left to the standard input of the command on the right. That is, it creates a special file, a pipe, which is opened as a write destination for the left command, and as a read source for the right command.

```text
           echo foo               |                cat

 ---       +--------------+               ---       +--------------+
( 0 ) ---->| /dev/pts/5   |     ------>  ( 0 ) ---->| pipe (read)  |
 ---       +--------------+    /          ---       +--------------+
                              /
 ---       +--------------+  /            ---       +--------------+
( 1 ) ---->| pipe (write) | /            ( 1 ) ---->| /dev/pts/5   |
 ---       +--------------+               ---       +--------------+

 ---       +--------------+               ---       +--------------+
( 2 ) ---->| /dev/pts/5   |              ( 2 ) ---->| /dev/pts/5   |
 ---       +--------------+               ---       +--------------+
```

⚠ Each command of a pipeline runs in its own **subshell**: variables set in `cmd | while read ...` are lost after the pipe (see [loops](loops.md#reading-a-file-line-by-line)).

## Pipeline exit status

The status of a pipeline is the status of its **last** command. `PIPESTATUS` keeps all of them, and `set -o pipefail` makes the pipeline fail if any command fails.

```bash
true | false | true
echo "rc=$? all=${PIPESTATUS[*]}"     # rc=0 all=0 1 0

set -o pipefail
false | true; echo "rc=$?"            # rc=1
```

## File descriptors

A file descriptor, or FD, is a positive integer that refers to an input/output source. When bash starts it opens the three standard file descriptors:

- stdin (0)
- stdout (1)
- stderr (2)

You can close, you can copy, write and read from them.

## Redirect the standard output of a command to a file

```bash
command > file     # command 1> file  (overwrites)
command >> file    # appends
```

💡 `set -o noclobber` makes `>` refuse to overwrite existing files; `>|` forces it.

## Redirect the standard error of a command to a file

```bash
command 2> file
command 2>> file   # append
```

## Redirect both standard output and standard error to a file

```bash
command &> file    # command > file 2>&1
command &>> file   # append both
```

## Pipe both stdout and stderr

```bash
command 2>&1 | grep error
command |& grep error      # bash shorthand for 2>&1 |
```

## Send the output from multiple commands to a file

```bash
(command1; command2) > file     # in a subshell
{ command1; command2; } > file  # in the current shell (note the spaces and the final ;)
```

commands `command1` and `command2` get executed, and bash redirects their output to `file`.

## Order

When bash sees several redirections it processes them from left to right. Be careful here! Writing:

```bash
command > file 2>&1      # stdout → file, then stderr → where stdout points (file)
```

Is not the same as writing:

```bash
command 2>&1 > file      # stderr → terminal (old stdout), then stdout → file
```

```bash
{ echo out; echo err >&2; } > both.txt 2>&1; cat both.txt
# out
# err
{ echo out; echo err >&2; } 2>&1 > /dev/null
# err
```

Also note that in bash, writing this:

```bash
command &> file
```

Is exactly the same as:

```bash
command >& file
```

The first form is preferred however.

## Discard the standard output of a command

```bash
command > /dev/null
command &> /dev/null     # discard everything
```

## Send a message to stderr

```bash
echo "error: file not found" >&2
```

## Read from a file / here-documents / here-strings

```bash
wc -l < file.txt                 # stdin from a file

cat <<EOF                        # here-document: variables are expanded
user: $USER
EOF

cat <<'EOF'                      # quoted delimiter: no expansion
raw: $HOME
EOF
# raw: $HOME

cat <<-EOF                       # <<- strips leading TABs (not spaces)
	indented with tabs
	EOF

tr a-z A-Z <<< "here string"     # HERE STRING
```

## Process substitution

`<(cmd)` behaves like a file containing the output of `cmd`; `>(cmd)` like a file whose content is sent to `cmd`.

```bash
diff <(printf 'a\nb\n') <(printf 'a\nc\n')
# 2c2
# < b
# ---
# > c

while read -r l; do ...; done < <(find . -name '*.md')   # loop without subshell
cmd | tee >(gzip > out.gz) > out.txt                     # write plain and compressed copies
```

## tee: write to a file and keep the pipe

```bash
echo hello | tee out.txt | wc -c     # 6   (and out.txt contains "hello")
echo hello | tee -a out.txt          # append
echo "line" | sudo tee /etc/x.conf   # write a root-owned file (sudo echo > file does not work)
```

## Give file descriptors names

```bash
exec {filew}> output_file     # no space between {filew} and >
echo "hi" >&"$filew"
exec {filew}>&-               # close it
```

Named file descriptors are a feature of bash 4.1. Named file descriptors look like `{varname}`. You can use them just like regular, numeric, file descriptors. Bash internally chooses a free file descriptor (10 or higher) and stores its number in the variable.

## Open a file for reading using a custom file descriptor

```bash
exec 3< file
```

Here opens the file for reading and assigns the opened file-descriptor to the shell's file descriptor number 3.

Now you can read from the file descriptor 3, like this:

```bash
read -u 3 line
```

This reads a line from the file that we just opened as fd 3.

Or you can use regular shell commands such as grep and operate on file descriptor 3:

```bash
grep "foo" <&3
```

After you're done using fd 3, you can close it this way:

```bash
exec 3<&-
```

Here the file descriptor 3 is duped to `-`, which is bash's special way to say "close this fd" (`3>&-` also works).

## Open a file for writing using a custom file descriptor

Open file for writing and assign it number 4:

```bash
exec 4> file
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
echo "$var"             # foo
```

This will output foo as we just read the first 3 chars from the file.

Now we can write some stuff to the file:

```bash
echo -n + >&5           # write "+" at 4th position.
exec 5>&-               # close fd 5.
cat file                # foo+bar
```

This will output foo+bar as we wrote the + char at 4th position in the file.
