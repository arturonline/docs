# Conditionals

See also: [flow control](flow_control.md) (`if`, `case`), [regex](regex.md), [arithmetic](arithmetic.md).

## Comparing Numbers

Use inside `[ ]` / `[[ ]]`. Inside `(( ))` use the C-style operators (`<`, `>`, `==`...).

| Operator | `(( ))` | Meaning               |
| -------- | ------- | --------------------- |
| `-lt`    | `<`     | Less than             |
| `-gt`    | `>`     | Greater than          |
| `-le`    | `<=`    | Less than or equal    |
| `-ge`    | `>=`    | Greater than or equal |
| `-eq`    | `==`    | Equal to              |
| `-ne`    | `!=`    | Not equal             |

```bash
a=5 b=10
[ "$a" -lt "$b" ] && echo "lt"      # lt
(( a < b )) && echo "arith"         # arith
```

## Comparing Strings

| Operator         | Meaning                                                     |
| ---------------- | ----------------------------------------------------------- |
| `=` / `==`       | The strings are equal (`==` is bash-only; in `[[ ]]` the right side is a glob pattern unless quoted) |
| `!=`             | The strings are not equal                                   |
| `<`              | Less than (alphabetic/locale order). In `[ ]` it must be escaped: `\<` |
| `>`              | Greater than (alphabetic/locale order). In `[ ]`: `\>`      |
| `=~`             | Matches an extended regex (only in `[[ ]]`), see [regex](regex.md) |
| `-n`             | String is not empty                                         |
| `-z`             | String is empty                                             |

```bash
[[ "10" < "9" ]] && echo "string: 10 < 9"   # string: 10 < 9   ⚠ text comparison!
(( 10 < 9 )) || echo "numeric: 10 >= 9"     # numeric: 10 >= 9

f=report.txt
[[ $f == *.txt ]] && echo "txt"             # txt      (glob pattern)
[[ $f == "*.txt" ]] || echo "literal"       # literal  (quoted = literal string)
```

## Operations on Files

| Operator          | Result                                                                 |
| ----------------- | ---------------------------------------------------------------------- |
| `-e name`         | name exists                                                            |
| `-f name`         | name is a regular file (not directory)                                 |
| `-s name`         | name exists, and the size is not 0                                     |
| `-d name`         | name is a directory                                                    |
| `-L name`         | name is a symbolic link                                                |
| `-r name`         | has read permission in name                                            |
| `-w name`         | has write permission in name                                           |
| `-x name`         | has execution permission in name                                       |
| `file1 -nt file2` | True if `file1` is newer than (according to modification time) `file2` |
| `file1 -ot file2` | True if `file1` is older than `file2`                                  |

## Other tests

| Operator   | Result                                              |
| ---------- | --------------------------------------------------- |
| `-v name`  | variable `name` is set (even if empty). Bash 4.2+   |
| `-t 0`     | file descriptor 0 (stdin) is a terminal             |
| `! expr`   | negation                                            |

```bash
unset u; [[ -v u ]] || echo "u unset"         # u unset
e="";    [[ -v e ]] && echo "e set (empty)"   # e set (empty)
```

## Positional parameters

| parameter    | action                                                       |
| ------------ | ------------------------------------------------------------ |
| `$0`         | script name                                                  |
| `$1 - $9`    | positional argument (`${10}` and up need braces)             |
| `$#`         | arguments number                                             |
| `$*`         | all arguments; `"$*"` joins them into one string             |
| `$@`         | all arguments; `"$@"` keeps each one as a separate word      |
| `$?`         | exit status of the last command                              |
| `$$`         | PID of the current shell                                     |
| `$!`         | PID of the last background command                           |

When they are not quoted, `$*` and `$@` are the same. You shouldn't use either of these unquoted, because they can break unexpectedly as soon as you have arguments containing spaces or wildcards.

`"$@"` expands to separate words: `"$1"` `"$2"` ... This is almost always what you want. It expands each positional parameter to a separate word, which makes it perfect for taking command line or function arguments in and then passing them on to another command or function. And because it expands using double quotes, it means things don't break if, say, `"$1"` contains a space or an asterisk `*`.

## Testing Conditions with `[ ]`

💡Tip: `man test` / `help test`

`[` is a command (same as `test`), so **spaces around brackets and operators are mandatory**, and variables **must be quoted**.

```bash
[ condition ]

[ ! condition ]

[ condition ] && true-command

[ condition ] || false-command

[ condition ] && true-command || false-command
```

⚠ `a && b || c` is not a real if/else: `c` also runs if `b` fails. Use `if` when it matters.

```bash
x="a b"
[ $x = "a b" ]      # bash: [: too many arguments   (unquoted → split into 2 words)
[ "$x" = "a b" ] && echo "quoted ok"   # quoted ok
```

## Testing Conditions with `[[ ]]` (preferred in bash)

- No word splitting or pathname expansion: quoting variables is optional (except on the right side of `==`/`=~` when you want a literal match).
- Supports `&&`, `||`, `( )` inside, glob patterns with `==` and regex with `=~`.
- `<` / `>` do not need escaping.
- bash/ksh/zsh only (not POSIX `sh`).

```bash
x="a b"
[[ $x = "a b" ]] && echo "no split in [["                 # no split in [[
[[ $a -lt $b && $b -eq 10 ]] && echo "both"              # both
[[ $f =~ ^([a-z]+)\.([a-z]+)$ ]] && echo "${BASH_REMATCH[1]} ${BASH_REMATCH[2]}"   # report txt
```

## Testing commands

Any command can be a condition: exit status 0 is true, anything else is false.

```bash
if grep -q "error" app.log; then echo "found errors"; fi
if ! mkdir -p "$dir"; then echo "cannot create $dir" >&2; exit 1; fi
```
