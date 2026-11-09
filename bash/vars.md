# Shell Scripting: Variables

See also: [strings](strings.md), [special variables / environment](utils/env.md), [scripts](scripting/1.md).

## Create script

Create a file my_script.sh with:

```bash
#!/usr/bin/env bash

# comment
```

💡 Use `#!/usr/bin/env sh` only if the script is pure POSIX; arrays, `[[ ]]`, `${var^^}`, etc. need bash.

Permissions:

```bash
chmod +x my_script.sh
```

## Variables

To store data in a variable, we use the following assignment syntax:

```bash
varname=vardata
```

you cannot use spaces around the = sign in an assignment.

```bash
varname = vardata     # This is wrong! Runs the command "varname" with args "=" and "vardata"
```

Names: letters, digits and `_`, not starting with a digit. Convention: `UPPER_CASE` for environment/exported variables, `lower_case` for script variables (avoids clobbering `PATH`, `HOME`, `USER`...).

To show the variable values:

```bash
echo "$HOME"
# or
echo "${prize}"
echo "${name}s"     # braces are needed when text follows the name
```

### Variables can be unset

```bash
TMPDIR=/tmp

unset TMPDIR
```

### Scope and attributes

```bash
local v=1               # only inside a function (see functions.md)
export API_URL=http://localhost   # visible to child processes
readonly PI=3.14        # PI=3 → bash: PI: readonly variable
declare -i n=5          # integer: n+=3 → 8
declare -l lower="ABC"  # always lowercase → abc  (-u for uppercase)
declare -p n            # declare -i n="5"  (show type and value)
MYVAR=hi some_command   # set a variable only for that command
```

```bash
MYVAR=hi bash -c 'echo "child sees: $MYVAR"'   # child sees: hi
echo "parent: ${MYVAR:-unset}"                 # parent: unset
```

### Default values

```bash
unset u
echo "${u:-default}"    # default   (u is still unset)
echo "${u:=set}"        # set       (and now u=set)
echo "${u:+alt}"        # alt       (because u has a value)
: "${CONFIG:?CONFIG must be set}"   # exits with an error if unset or empty
```

### Indirection

```bash
name=Ana; ref=name
echo "${!ref}"          # Ana
APP_ONE=1 APP_TWO=2
echo "${!APP_@}"        # APP_ONE APP_TWO  (names starting with APP_)
```

## Arrays

Indexed arrays:

```bash
arr=(one "two three" four)
echo "${arr[0]}"          # one
echo "${arr[-1]}"         # four
echo "${#arr[@]}"         # 3            (number of elements)
arr+=(five)               # append
echo "${arr[@]:1:2}"      # two three four   (slice: 2 elements from index 1)
unset 'arr[0]'            # delete an element (indexes are not renumbered)
echo "${!arr[@]}"         # 1 2 3        (indexes)
for x in "${arr[@]}"; do echo "$x"; done
```

Associative arrays (bash 4+), they must be declared:

```bash
declare -A user=([name]=ana [role]=dev)
user[age]=30
echo "${user[name]} ${#user[@]}"   # ana 3
[[ -v user[role] ]] && echo "has role"
for k in "${!user[@]}"; do echo "$k=${user[$k]}"; done   # order not guaranteed
```

Fill an array from a command or file:

```bash
mapfile -t lines < file.txt              # one element per line (readarray = same)
mapfile -t files < <(find . -name '*.md')
IFS=, read -ra parts <<< "a,b,c"         # split a string → (a b c)
```

## Word Splitting

The shell's parser performs several operations on your commands before finally executing them: brace expansion, tilde expansion, parameter, variable and arithmetic expansion and command substitution (done in a left-to-right fashion), word splitting, and pathname expansion.

Word splitting and pathname expansion are applied to the result of **unquoted** expansions. Quoting prevents both.

```bash
x="a   *"
echo $x      # a file1 file2 ...   (split and glob-expanded!)
echo "$x"    # a   *
```

## Quotes

Single quotes will literally `echo` what you have between them, while double quotes will evaluate variables between them and output the value of the variable:

```bash
$ MYVAR=sometext
$ echo "double quotes gives you $MYVAR"
double quotes gives you sometext
$ echo 'single quotes gives you $MYVAR'
single quotes gives you $MYVAR
```

⚠️ Double quotes group everything inside them into a single argument:

```bash
The secret voice in your head.mp3           # a mp3 file
$ rm The secret voice in your head.mp3      # Executes rm with 6 arguments; not 1!
```

This is what we should have done:

```bash
rm "The secret voice in your head.mp3"
```

⚠️ Remember to put double quotes around every parameter expansion!

💡 `${var@Q}` prints the value quoted so it can be reused as shell input:

```bash
s="it's a test"
echo "${s@Q}"     # 'it'\''s a test'
```

## Command substitution

The standard output of a command can be encapsulated, much like a value can be stored in a variable, and then expanded by the shell. This is known as command substitution.

```bash
$ echo $(seq 1 5)
1 2 3 4 5
```

```bash
$ echo `seq 1 5`
1 2 3 4 5
```

With command substitution, we can encapsulate the result of a command (seq 1 5) into a variable by enclosing the command with **$( and )** or with **backticks**. Prefer `$( )`: it nests and is easier to read.

```bash
today=$(date +%F)
files=$(ls "$(dirname "$0")")      # nesting
out=$(printf 'a\n\n\n'); echo "[$out]"   # [a]   (trailing newlines are removed)
```

## Positional parameters

| parameter | action                                       |
| --------- | -------------------------------------------- |
| `$0`      | script name                                  |
| `$1 - $9` | positional argument (`${10}` for 10 and up)  |
| `$#`      | how many arguments                           |
| `"$@"`    | all arguments, each one a separate word      |
| `$*`      | all arguments as a single string (`"$*"`)    |
| `$?`      | result of the last execution                 |
| `$$`      | PID of the process is running                |
| `$!`      | PID of the last background process           |

## Read Input

```bash
read -p "message" variable1 variable2 variableN
```

| Option     | Effect                                         |
| ---------- | ---------------------------------------------- |
| `-r`       | don't treat backslashes as escapes (always use it) |
| `-p text`  | prompt                                         |
| `-s`       | silent (passwords)                             |
| `-n N`     | read N characters                              |
| `-t secs`  | timeout                                        |
| `-a arr`   | split words into an array                      |

If there are more words than variables, the last variable gets the rest of the line.

Example:

```bash
#!/usr/bin/env bash

read -rp "Please give your name and last name: " name surname

echo "Your name is $name"
echo "Your surname is $surname"
```

```text
Please give your name and last name: Ana Garcia Lopez
Your name is Ana
Your surname is Garcia Lopez
```
