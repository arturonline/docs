# Bash

>⚡ [The bash guide](https://guide.bash.academy/)

BASH reads commands from its input and divides each line into words that are demarcated by a whitespace character (spaces and tabs):

- The first word of the line is the name of the command to be executed.
- All the remaining words become arguments to that command (options, filenames, etc.).

## Bash execution

- When bash starts, if it is a login shell it executes the `/etc/profile` file
followed by the `.bash_profile` file located in the user's home directory
- The the `.bashrc` file is executed (even for non-login shells)
- When a login shell exits, the `.bash_logout` file is executed

### Executing commands

- Bash first creates a fork : the current bash process creates a copy of itself and both processes execute concurrently (in the same process group)
- The original bash process waits for an interruption of the new process
(background)
- The new bash process transforms itself (exec) into the called program
(foreground)
- Ctrl-C sends a TERM signal to the process in the foreground, asking the
process to terminate
- Ctrl-Z stops the running process, and the background process comes to the
foreground

## Comments

```bash
rm *    # Remove all files in the current directory.
```

## echo

`echo` is a command that prints its arguments to standard output (which in our case is the terminal).

```bash
$ echo This is a test.
This is a test.

$ echo This    is    a    test.
This is a test.

$ echo "This    is    a    test."
This    is    a    test.
```

## Quotes

Single quotes will literally `echo` what you have between them, while double quotes will evaluate variables between them and output the value of the variable:

```bash
$ MYVAR=sometext
$ echo "double quotes gives you $MYVAR"
$ echo 'single quotes gives you $MYVAR'

double quotes gives you sometext
single quotes gives you $MYVAR
```

⚠️ Double quotes group everything inside them into a single argument:

```bash
The secret voice in your head.mp3    # a mp3 file
$ rm The secret voice in your head.mp3    # Executes rm with 6 arguments; not 1!
```

This is what we should have done:

```bash
mysong="The secret void in your head.mp3"

rm $mysong

# or

rm "The secret voice in your head.mp3"
```

## Arguments

Arguments are separated from the command name and from each other by a whitespace. This is important to remember. For example, the following is wrong:

```bash
[-f file]     # wrong: We want the command [ (a synonym for test) to be separated from the arguments: -f, file, and ]

[ -f file ]    # correct
```

## Variables

To store data in a variable, we use the following assignment syntax:

```bash
varname=vardata
```

you cannot use spaces around the = sign in an assignment.

```bash
varname = vardata     # This is wrong!
```

### Parameter expansion

To access the data stored in a variable:

```bash
foo=bar
echo "Foo is $foo"
```

When Bash is about to execute your code, it first changes the command by taking your parameter expansion (the `$foo`), and replacing it by the contents of `foo`, which is `bar`. The command becomes:

```bash
$ echo "Foo is bar"
Foo is bar
```

This is called **parameter expansion**. It is important to understand that parameter expansion causes the `$parameter` to be **replaced** by its contents.

Example:

```bash
song=My song.mp3
rm $song
rm: My: No such file or directory
rm: song.mp3: No such file or directory
```

Why did this not work? Because Bash replaced your `$song` by its contents, being `My song.mp3`; then it performed word splitting; and only THEN executed the command. It was as if you had typed this:

```bash
rm My song.mp3
```

And according to the rules of word splitting, `Bash` thought you meant for `My` and `song.mp3` to mean two different files, because there is white space between them and it wasn't quoted. How do we fix this?

```bash
song="My song.mp3"
rm $song
```

⚠️ Remember to put double quotes around every parameter expansion!

## Variables can be unset

```bash
TMPDIR=/tmp

unset TMPDIR
```