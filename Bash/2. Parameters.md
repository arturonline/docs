# Parameters

```bash
$ # Some parameters that aren't variables:
$ echo "My shell is $0, and has these options set: $-"
My shell is -bash, and has these options set: himB
```

## Special Parameters

Here's a summary of most of the Special Parameters:

| Parameter Name | Usage            | Description                                                                                                                                                                                          |
| -------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `0`            | `"$0"`           | Contains the name, or the path, of the script. This is not always reliable.                                                                                                                          |
| `1 2 etc.`     | `"$1" "$2" etc`. | Positional Parameters contain the arguments that were passed to the current script or function.                                                                                                      |
| `*`            | `"$*"`           | Expands to all the words of all the positional parameters. Double quoted, it expands to a single string containing them all, separated by the first character of the IFS variable (discussed later). |
| `@`            | `"$@"`           | Expands to all the words of all the positional parameters. Double quoted, it expands to a list of them all as individual words.                                                                      |
| `#`            | `$#`             | Expands to the number of positional parameters that are currently set.                                                                                                                               |
| `?`            | `$?`             | Expands to the exit code of the most recently completed foreground command.                                                                                                                          |
| `$`            | `$$`             | Expands to the PID (process ID number) of the current shell.                                                                                                                                         |
| `!`            | `$!`             | Expands to the PID of the command most recently executed in the background.                                                                                                                          |
| `_`            | `"$_"`           | Expands to the last argument of the last command that was executed.                                                                                                                                  |

## Types

Although Bash is not a typed language, it does have a few different types of variables. These types define the kind of content they are allowed to have.

Variables can be declared using the `declare` keyword:

- `declare -a`: The variable is an array of strings.
- `declare -A`: The variable is an associative array of strings (bash 4.0 or higher).
- `declare -i`: The variable holds an integer. Assigning values to this variable automatically triggers Arithmetic Evaluation.
- `declare -r`: The variable can no longer be modified or unset.
- `declare -x`: The variable is marked for export which means it will be inherited by any child process.

Examples:

```bash
$ declare -i int_var=1
$ text_var=1
$ text_var+=2 ; int_var+=2
$ echo $text_var $int_var
12 3
$ declare -u upper_var="This is an Upper Case example"
$ echo $upper_var
THIS IS AN UPPER CASE EXAMPLE
$ declare -r read_only_var="Unchangeable"
$ read_only_var="Modified"
bash: read_only_var: readonly variable
```

## Parameter expansion

In bash parameters do NOT start with a `$-sign`. The `$-sign` you see in the examples merely causes the parameter that follows it to be **expanded**. Expansion basically means that the shell replaces the parameter by its content. As such, `LOGNAME` is the parameter (variable) that contains your username. `$LOGNAME` is an expression that will be replaced with the content of that variable, which in my case is _lhunath_.

> ⚠️ Good Practice: You should always keep parameter expansions properly quoted. This prevents the whitespace or the possible globs inside of them from giving you gray hair or unexpectedly wiping stuff off your computer. The only good PE, is a quoted PE.

### Command expansion

`$(command)` or `'command'` : Substitute by the output of the command

```bash
$ CURRENT_DATE=$(date)
$ echo $CURRENT_DATE
Mon Apr 1 23:29:34 CEST 2013
```

### Parameter expansion Tricks

| Syntax                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `${parameter:-word}`         | Use Default Value. If `'parameter'` is unset or null, `'word'` (which may be an expansion) is substituted. Otherwise, the value of `'parameter'` is substituted.                                                                                                                                                                                                                                                                                                                                                              |
| `${parameter:=word}`         | Assign Default Value. If `'parameter'` is unset or null, `'word'` (which may be an expansion) is assigned to `'parameter'`. The value of `'parameter'` is then substituted.                                                                                                                                                                                                                                                                                                                                                   |
| `${parameter:+word}`         | Use Alternate Value. If `'parameter'` is null or unset, nothing is substituted, otherwise `'word'` (which may be an expansion) is substituted.                                                                                                                                                                                                                                                                                                                                                                                |
| `${parameter:offset:length}` | Substring Expansion. Expands to up to `'length'` characters of `'parameter'` starting at the character specified by `'offset'` (0-indexed). If `':length'` is omitted, go all the way to the end. If `'offset'` is negative (use parentheses!), count backward from the end of `'parameter'` instead of forward from the beginning. If 'parameter' is `@` or an indexed array name subscripted by `@` or `*`, the result is `'length'` positional parameters or members of the array, respectively, starting from `'offset'`. |
| `${#parameter}`              | The length in characters of the value of `'parameter'` is substituted. If `'parameter'` is an array name subscripted by `@` or `*`, return the number of elements.                                                                                                                                                                                                                                                                                                                                                            |
| `${parameter#pattern}`       | The `'pattern'` is matched against the beginning of `'parameter'`. The result is the expanded value of `'parameter'` with the shortest match deleted. If `'parameter'` is an array name subscripted by `@` or `*`, this will be done on each element. Same for all following items.                                                                                                                                                                                                                                           |
| `${parameter##pattern}`      | As above, but the longest match is deleted.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `${parameter%pattern}`       | The `'pattern'` is matched against the end of `'parameter'`. The result is the expanded value of `'parameter'` with the shortest match deleted.                                                                                                                                                                                                                                                                                                                                                                               |
| `${parameter%%pattern}`      | As above, but the longest match is deleted.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `${parameter/pat/string}`    | Results in the expanded value of `'parameter'` with the first (unanchored) match of `'pat'` replaced by `'string'`. Assume null string when the `'/string'` part is absent.                                                                                                                                                                                                                                                                                                                                                   |
| `${parameter//pat/string}`   | As above, but every match of `'pat'` is replaced.                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `${parameter/#pat/string}`   | As above, but matched against the beginning. Useful for adding a common prefix with a null pattern: `"${array[@]/#/prefix}"`.                                                                                                                                                                                                                                                                                                                                                                                                 |
| `${parameter/%pat/string}`   | As above, but matched against the end. Useful for adding a common suffix with a null pattern.                                                                                                                                                                                                                                                                                                                                                                                                                                 |

Example:

```bash
$ for file in *.JPG *.jpeg
do mv -- "$file" "${file%.*}.jpg"
done
```

The code above can be used to rename all JPEG files with a `.JPG` or a `.jpeg` extension to have a normal `.jpg` extension. The expression `${file%.*}` cuts off everything from the end starting with the last period `(.)`. Then, in the same quotes, a new extension is appended to the expansion result.

You will learn them through experience. They come in handy far more often than you think they might. Here are a few examples to kickstart you:

```bash
$ file="$HOME/.secrets/007"; \
echo "File location: $file"; \
echo "Filename: ${file##*/}"; \
echo "Directory of file: ${file%/*}"; \
echo "Non-secret file: ${file/secrets/not_secret}"; \
echo; \
echo "Other file location: ${other:-There is no other file}"; \
echo "Using file if there is no other file: ${other:=$file}"; \
echo "Other filename: ${other##*/}"; \
echo "Other file location length: ${#other}"
File location: /home/lhunath/.secrets/007
Filename: 007
Directory of file: /home/lhunath/.secrets
Non-secret file: /home/lhunath/.not_secret/007

Other file location: There is no other file
Using file if there is no other file: /home/lhunath/.secrets/007
Other filename: 007
Other file location length: 26
```

Remember the difference between `${v#p}` and `${v##p}`. The doubling of the `#` character means patterns will become greedy. The same goes for `%`:

```bash
$ version=1.5.9; echo "MAJOR: ${version%%.*}, MINOR: ${version#*.}."
MAJOR: 1, MINOR: 5.9.
$ echo "Dash: ${version/./-}, Dashes: ${version//./-}."
Dash: 1-5.9, Dashes: 1-5-9.
```

Note: You cannot use multiple PEs together. If you need to execute multiple PEs on a parameter, you will need to use multiple statements:

```bash
$ file=$HOME/image.jpg; file=${file##*/}; echo "${file%.*}"
image
```
