# Bash cheatsheet

A shell is an interface between you (or your script) and the kernel. It allows you to execute commands translating its syntax into system calls.

This call needs three pieces of information:

- The _file_ to execute: This can be a binary program or a script.
- An array of _arguments_: A list of strings that tell the program what to do.
- An array of _environment variables_

Detailed notes: [variables](vars.md) · [strings](strings.md) · [arithmetic](arithmetic.md) · [conditionals](conditionals.md) · [flow control](flow_control.md) · [loops](loops.md) · [functions](functions.md) · [pipes & redirections](pipes.md) · [wildcards](wildcards.md) · [regex](regex.md) · [scripts](scripting/1.md) · [special chars](utils/chars.md) · [env](utils/env.md)

## Script creation

```bash
#!/usr/bin/env bash
set -euo pipefail     # strict mode (read the caveats in scripting/1.md)

# comment
```

```bash
chmod u+x my_script.sh
./my_script.sh
```

## Variables

```bash
# declaration (no spaces around =):
name=data
readonly PI=3.14
local v=1             # only inside functions
export EDITOR=vim     # visible to child processes

echo "$name" "${name}_suffix"
```

## Double quotes vs Single quotes

```bash
$ myvar=sometext

# double quotes vs single quotes:

$ echo "double quotes gives you $myvar"
double quotes gives you sometext

$ echo 'single quotes gives you $myvar'
single quotes gives you $myvar

$ echo $'tab:\there'      # ANSI-C quoting: \t \n \e ... are interpreted
tab:	here
```

⚠ You should double-quote your variables if you aren't sure whether they could contain white space or wildcards.

## Variable expansion

The shell takes your line of code and cuts it up into bits wherever there are sequences of syntactical whitespace:

```text
rm myfile myotherfile
  ^      ^

[rm]
[myfile]
[myotherfile]
```

There is no more whitespace left after word splitting is done, only three completely separate chunks of characters: `rm`, `myfile`, and `myotherfile`. The shell now uses these chunks to build its system call.

Word splitting also happens on the *result* of unquoted expansions (`$var`, `$(cmd)`). We usually do not want to let word splitting occur when filenames are involved. Double quoting suppresses word splitting:

```bash
file="The secret voice in your head.mp3"
rm $file      # WRONG: executes rm with 6 arguments
rm "$file"    # OK: executes rm with 1 argument
```

💡 `"$@"` and `"${array[@]}"` are special: inside double quotes they expand to **one word per element**, which is exactly what you want.

## Command substitution

We can encapsulate the result of a command (seq 1 5) into a variable by enclosing the command with **$( and )** or with **backticks** (legacy, avoid them: they don't nest well).

```bash
$ echo $(seq 1 5)
1 2 3 4 5
```

```bash
$ echo `seq 1 5`
1 2 3 4 5
```

```bash
today=$(date +%F)     # trailing newlines are removed
```

## Parameter expansion (quick reference)

| Syntax              | Result                          | Example (`f=dir/file.tar.gz`)  |
| ------------------- | ------------------------------- | ------------------------------ |
| `${#f}`             | length                          | `15`                           |
| `${f:0:3}`          | substring                       | `dir`                          |
| `${f##*/}`          | remove longest prefix match     | `file.tar.gz`                  |
| `${f%/*}`           | remove shortest suffix match    | `dir`                          |
| `${f%%.*}`          | remove longest suffix match     | `dir/file`                     |
| `${f/tar/zip}`      | replace first                   | `dir/file.zip.gz`              |
| `${f//[.\/]/_}`     | replace all                     | `dir_file_tar_gz`              |
| `${f^^}` / `${f,,}` | upper / lower case              | `DIR/FILE.TAR.GZ`              |
| `${x:-def}`         | default if unset/empty          | `def`                          |
| `${x:?msg}`         | error if unset/empty            |                                |
| `${f@Q}`            | quoted for reuse                | `'dir/file.tar.gz'`            |

More: [strings](strings.md).

---

## Arithmetic Expansion

```bash
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

echo $(( 7 / 2 ))  # 3  (integers only)
```

---

## Arrays

```bash
arr=(one "two three" four)
echo "${arr[0]}"        # one
echo "${arr[-1]}"       # four
echo "${#arr[@]}"       # 3
arr+=(five)             # append
echo "${arr[@]:1:2}"    # two three four   (2 elements from index 1)
for x in "${arr[@]}"; do echo "$x"; done

declare -A user=([name]=ana [role]=dev)   # associative array (bash 4+)
user[age]=30
echo "${user[name]}"    # ana
echo "${!user[@]}"      # keys (unordered)

mapfile -t lines < file.txt    # file → array, one line per element
```

---

## Passing Arguments

| parameter | action                                    |
| :-------: | ----------------------------------------- |
|   `$0`    | script name                               |
| `$1 - $9` | positional argument                       |
|   `$#`    | how many arguments                        |
|  `"$@"`   | all arguments, one word each (use this)   |
|   `$*`    | all arguments as a single string (quoted) |
|   `$?`    | result of the last execution              |
|   `$$`    | PID of the process is running             |
|   `$!`    | PID of the last background process        |

When they are not quoted, `$*` and `$@` are the same. You shouldn't use either of these unquoted, because they can break unexpectedly as soon as you have arguments containing spaces or wildcards.

`"$@"` expands to separate words, `"$1"` `"$2"`, which makes it perfect for taking command line or function arguments in and then passing them on to another command or function. And because it expands using double quotes, it means things don't break if, say, `"$1"` contains a space or an asterisk `*`.

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
|   `<`    | Less than (alphabetic order)          |
|   `>`    | Greater than (alphabetic order)       |
|   `-n`   | String is not empty                   |
|   `-z`   | String is empty                       |
|   `=~`   | Matches regex (only in `[[ ]]`)       |

## Comparing Files

| Operator          | Result                                                                 |
| ----------------- | ---------------------------------------------------------------------- |
| `-e name`         | File name exists                                                       |
| `-f name`         | name is a regular file (not directory)                                 |
| `-s name`         | name exists, and the size is not 0                                     |
| `-d name`         | name is a directory                                                    |
| `-L name`         | name is a symbolic link                                                |
| `-r name`         | has read permission in name                                            |
| `-w name`         | has write permission in name                                           |
| `-x name`         | has execution permission in name                                       |
| `file1 -nt file2` | True if `file1` is newer than (according to modification time) `file2` |
| `file1 -ot file2` | True if `file1` is older than `file2`                                  |

---

## Conditions

In the shell, every command is a conditional command: every command has a return status which is either 0 indicating success or an integer between 1 and 255 indicating failure.

### Old test `[ ]`

```bash
[ condition ]

[ ! condition ]

[ condition ] && true-command

[ condition ] || false-command

[ condition ] && true-command || false-command
```

⚠ Note that you need a space around each operator and bracket, and you must quote variables: `[ "$a" = "$b" ]`.

### New test `[[ ]]`

- Word splitting and pathname expansion are not performed on the words between the `[[` and `]]`.
- Tilde expansion, parameter and variable expansion, arithmetic expansion, command substitution, process substitution, and quote removal are performed.
- Supports `&&`, `||`, glob patterns (`==`) and regex (`=~`).
- ksh/bash/zsh only.

```bash
[[ condition ]]

[[ a = a && b = b ]]
[[ $file == *.txt ]]
[[ $ver =~ ^[0-9]+\.[0-9]+$ ]]
```

### Arithmetic test `(( ))`

```bash
(( count > 10 )) && echo "many"
```

### If test

```bash
NAME=$1

if [[ $NAME == "Dave" ]]; then
    echo "Hi Dave!"
fi
```

```bash
NAME=$1
GREETING="Hi there"
HAT_TIP="tip of the hat"
HEAD_SHAKE="slow head shake"

# if your name is "Dave"
if [ "$NAME" = "Dave" ]; then
    echo "$GREETING"
# if your name is "steve"
elif [ "$NAME" = "Steve" ]; then
    echo "$HAT_TIP"
# everybody else
else
    echo "$HEAD_SHAKE"
fi
```

### case

```bash
case $1 in
    start|up) echo "starting" ;;
    stop)     echo "stopping" ;;
    *)        echo "usage: $0 start|stop"; exit 2 ;;
esac
```

---

## Loops

```bash
for i in {1..5}; do echo "$i"; done
for ((i = 0; i < 5; i++)); do echo "$i"; done
for f in *.txt; do echo "$f"; done
while IFS= read -r line; do echo "$line"; done < file.txt
while true; do sleep 1; done
```

## Functions

```bash
greet() {
    local name=${1:-world}
    echo "Hello, $name"
}
msg=$(greet Ana)   # Hello, Ana
```

## Redirections

```bash
cmd > out.txt          # stdout to file (overwrite)
cmd >> out.txt         # append
cmd 2> err.txt         # stderr
cmd &> all.txt         # stdout + stderr
cmd 2>&1 | less        # stderr through the pipe too
cmd < in.txt           # stdin from file
cmd <<< "text"         # here-string
diff <(sort a) <(sort b)   # process substitution
```

## Debugging

```bash
bash -n script.sh      # syntax check
bash -x script.sh      # trace each command
set -x; ...; set +x    # trace a section
```
