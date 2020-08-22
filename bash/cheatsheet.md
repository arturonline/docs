# Bash cheatsheat

A shell is an interface between you (or your script) and the kernel. It allows you to execute commands translating its syntax into system call.

This call needs three pieces of information:

- The _file_ to execute: This can be a binary program or a script.
- An array of _arguments_: A list of strings that tell the program what to do.
- An array of _environment variables_

## Script creation

```sh
#!/usr/bin/env bash

# comment

chmod u+x my_script.sh
```

## Variables

```sh
# declaration:
name=data
```

## Double quotes vs Single quotes

```sh
$ myvar=sometext

# double quotes vs single quotes:

$ echo "double quotes gives you $myvar"
double quotes gives you sometext

$ echo 'double quotes gives you $myvar'
single quotes gives you $myvar
```

⚠ You should double-quote your variables if you aren't sure whether they could contain white space or wildcards.

## Variable expansion

The shell takes your line of code and cuts it up into bits wherever there are sequences of syntactical whitespace:

```sh
rm myfile myotherfile
  ^      ^

[rm]
[myfile]
[myotherfile]
```

There is no more whitespace left after word splitting is done, only three completely separate chunks of characters: `rm`, `myfile`, and `myotherfile`. The shell now uses these chunks to build its system call.

We usually do not want to let word splitting occur when filenames are involved. Double quoting suppresses word splitting:

```sh
echo "$name"
echo ${name}

$ rm The secret voice in your head.mp3   # executes rm with 6 arguments
$ rm "The secret voice in your head.mp3"   # ERROR: executes rm with 1 argument
```

⚠ Double quotes don't work with the special cases of "$@" and "${array[@]}".

## Command substitution

We can encapsulate the result of a command (seq 1 5) into a variable by enclosing the command with **$( and )** or with **backsticks**..

```sh
$ echo $(seq 1 5)
1 2 3 4 5
```

```sh
$ echo `seq 1 5`
1 2 3 4 5
```

---

## Arithmetic Expansion

```sh
$(( expression ))
res=$(( n1+n2 ))

a=$(( 4 + 5 ))
echo $a # 9

a=$((3+5))
echo $a # 8

b=$(( a + 3 ))
echo $b # 11

b=$(( $a + 4 ))
echo $b # 12

(( b++ ))
echo $b # 13

(( b += 3 ))
echo $b # 16

a=$(( 4 * 5 ))
echo $a # 20
```

---

## Passing Arguments

| parameter | action                        |
| :-------: | ----------------------------- |
|   `$0`    | script name                   |
| `$1 - $9` | positional argument           |
|   `$#`    | how many arguments            |
|   `$*`    | to get all arguments          |
|   `$?`    | result of the last execution  |
|   `$$`    | PID of the process is running |

---

## Conditionals

| Operator | Meaning               |
| :------: | --------------------- |
|  `-lt`   | Less than             |
|  `-gt`   | Greater than          |
|  `-le`   | Less than or equal    |
|  `-ge`   | Greater than or equal |
|  `-eq`   | Equal to              |
|  `-ne`   | Not equal             |

## Comparing Strings

| Operator | Meaning                               |
| :------: | ------------------------------------- |
|   `=`    | The strings are equal                 |
|   `!=`   | The strings are not equal             |
|   `<`    | Less than (alphabetic order ASCII)    |
|   `>`    | Greater than (alphabetic order ASCII) |
|   `-n`   | String is not empty                   |
|   `-z`   | String is empty                       |

## Comparing Files

| Operator          | Result                                                                 |
| ----------------- | ---------------------------------------------------------------------- |
| `-e name`         | File name exists                                                       |
| `-n name`         | File name is empty                                                     |
| `-f name`         | name is a regular file (not directory)                                 |
| `-s name`         | name exists, and the size is not 0                                     |
| `-d name`         | name is a directory                                                    |
| `-r name`         | has read permission in name                                            |
| `-w name`         | has write permission in name                                           |
| `-x name`         | has execution permission in name                                       |
| `file1 -nt file2` | True if `file1` is newer than (according to modification time) `file2` |
| `file1 -ot file2` | True if `file1` is older than `file2`                                  |

When they are not quoted, `$*` and `$@` are the same. You shouldn't use either of these, because they can break unexpectedly as soon as you have arguments containing spaces or wildcards.

`"$@"` expands to separate words, `"$1"` `"$2"`, which makes it perfect for taking command line or function arguments in and then passing them on to another command or function. And because it expands using double quotes, it means things don't break if, say, `"$1"` contains a space or an asterisk `*`.

---

## Conditions

In the shell, every command is a conditional command: every command has a return status which is either 0 indicating success or an integer between 1 and 255 (and potentially more in some shells) indicating failure.

### Old test `[ ]`

```sh
[ condition  ]

[ ! condition  ]

[ condition  ] && true-command

[ condition  ] || false-command

[ condition  ] && true-command || false-command
```

⚠ Note that you need a space around each operator.

### New test `[[ ]]`

- Word splitting and pathname expansion are not performed on the words between the [[ and ]].
- Tilde expansion, parameter and variable expansion, arithmetic expansion, command substitution, process substitution, and quote removal are performed.
- ksh/bash/zsh only.

```sh
[[ condition ]]

[[ a = a && b = b ]]
```

### If test

```sh
NAME=$1

if [ "$NAME" = "Dave" ]; then
    echo "Hi Dave!"
fi
```

```sh
NAME=$1
GREETING="Hi there"
HAT_TIP="tip of the hat"
HEAD_SHAKE="slow head shake"

# if your name is "Dave"
if [ "$NAME" = "Dave" ]; then
    echo $GREETING
# if your name is "steve"
elif [ "$NAME" = "Steve" ]; then
    echo $HAT_TIP
# everybody else
else
    echo $HEAD_SHAKE
fi
```
