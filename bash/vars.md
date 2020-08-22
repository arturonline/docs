# Shell Scripting

## Create script

Create a file my_script.sh with:

```sh
#!/usr/bin/env sh

# comment
```

Permissions:

```sh
chmod +x my_script.sh
```

## Variables

To store data in a variable, we use the following assignment syntax:

```sh
varname=vardata
```

you cannot use spaces around the = sign in an assignment.

```sh
varname = vardata     # This is wrong!
```

To show the variable values:

```sh
echo "$HOME"
# or
echo ${prize}"
```

### Variables can be unset

```sh
TMPDIR=/tmp

unset TMPDIR
```

## Word Splitting

The shell's parser performs several operations on your commands before finally executing them: brace expansion, tilde expansion, parameter, variable and arithmetic expansion and command substitution (done in a left-to-right fashion), word splitting, and pathname expansion.

## Quotes

Single quotes will literally `echo` what you have between them, while double quotes will evaluate variables between them and output the value of the variable:

```sh
$ MYVAR=sometext
$ echo "double quotes gives you $MYVAR"
$ echo 'single quotes gives you $MYVAR'

double quotes gives you sometext
single quotes gives you $MYVAR
```

⚠️ Double quotes group everything inside them into a single argument:

```sh
The secret voice in your head.mp3           # a mp3 file
$ rm The secret voice in your head.mp3      # Executes rm with 6 arguments; not 1!
```

This is what we should have done:

```sh
rm "The secret voice in your head.mp3"
```

⚠️ Remember to put double quotes around every parameter expansion!

## Command substitution

The standard output of a command can be encapsulated, much like a value can be stored in a value, and then expanded by the shell. This is known as command substitution.

```sh
$ echo $(seq 1 5)
1 2 3 4 5
```

```sh
$ echo `seq 1 5`
1 2 3 4 5
```

With command substitution, we can encapsulate the result of a command (seq 1 5) into a variable by enclosing the command with **$( and )** or with **backsticks**.

## Positional parameters

| parameter | action                        |
| --------- | ----------------------------- |
| `$0`      | script name                   |
| `$1 - $9` | positional argument           |
| `$#`      | how many arguments            |
| `$*`      | to get all arguments          |
| `$?`      | result of the last execution  |
| `$$`      | PID of the process is running |

## Read Input

```sh
read -p "message" variable1 variable2 variableN
```

Example:

```sh
#!/bin/sh

read -p "Please give your name and last name: " name surname

echo "Your name is $name"
echo "Your surname is $surname"
```
