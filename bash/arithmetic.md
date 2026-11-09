# Arithmetic Operations

⚠ There are *three* different ways of writing arithmetic operations in bash, but it is recommended to use `$((...))` / `((...))` over **expr** or **let** for legibility (and speed: they are builtins, `expr` is an external program).

⚠ Bash arithmetic is **integer only** (64-bit signed). For decimals use `bc` or `awk` (see [below](#decimals)).

## #1 arithmetic expansion

```bash
$(( expression ))       # expands to the result
(( expression ))        # arithmetic command: no output, only exit status

res=$(( n1 + n2 ))
```

⚠ Spaces don't matter here, and variables don't need `$` inside `(( ))`.

Examples:

```bash
a=$(( 4 + 5 ))
echo "$a"       # 9

a=$((3+5))
echo "$a"       # 8

b=$(( a + 3 ))
echo "$b"       # 11

b=$(( $a + 4 ))
echo "$b"       # 12

(( b++ ))
echo "$b"       # 13

(( b += 3 ))
echo "$b"       # 16

a=$(( 4 * 5 ))
echo "$a"       # 20
```

### Operators

| Operator                      | Meaning                                  | Example                     |
| ----------------------------- | ---------------------------------------- | --------------------------- |
| `+ - * /`                     | add, subtract, multiply, integer divide  | `$((5 / 2))` → `2`          |
| `%`                           | remainder (modulo)                       | `$((5 % 2))` → `1`          |
| `**`                          | power                                    | `$((2 ** 10))` → `1024`     |
| `++ --`                       | increment / decrement (pre and post)     | `((i++))`                   |
| `+= -= *= /= %=`              | compound assignment                      | `((total += n))`            |
| `< <= > >= == !=`             | comparison (1 = true, 0 = false)         | `$((7 > 3))` → `1`          |
| `&& \|\| !`                   | logical                                  | `(( a > 0 && b > 0 ))`      |
| `& \| ^ ~ << >>`              | bitwise                                  | `$((1 << 4))` → `16`        |
| `cond ? a : b`                | ternary                                  | `$((7 > 3 ? 1 : 0))` → `1`  |

### Numeric bases

```bash
echo $((16#ff))     # 255   (base#number)
echo $((2#1010))    # 10
echo $((010))       # 8     ⚠ a leading 0 means octal!
echo $((10#010))    # 10    force base 10 (useful with values like "08", "09")
```

### `(( ))` as a condition

`(( expr ))` returns exit status 0 if the result is non-zero, and 1 if it is zero. See [conditionals](conditionals.md).

```bash
a=5 b=10
if (( a < b )); then echo "a is smaller"; fi   # a is smaller

echo $(( RANDOM % 10 ))                        # random number 0-9
```

⚠ With `set -e`, `(( i++ ))` **aborts the script when `i` is 0**, because the expression evaluates to 0 (exit status 1). Use `(( ++i ))`, `i=$(( i + 1 ))` or `(( i++ )) || true`.

```bash
i=0; (( i++ )); echo "rc=$? i=$i"   # rc=1 i=1
```

### Integer variables

```bash
declare -i n=5
n+=3          # arithmetic, not string concatenation
echo "$n"     # 8
n="2*4"
echo "$n"     # 8
```

## #2: expr

Old POSIX external command. Operands and operators must be separate arguments, and `*` must be escaped.

```bash
$(expr expression)

res=$(expr "$n1" + "$n2")
expr 3 + 4      # 7
expr 3 \* 4     # 12
```

## #3: let

```bash
let "a=(4+3)*7"     # quote it if it contains spaces or special chars
echo "$a"           # 49
let res=n1+n2
```

## Decimals

```bash
echo "scale=2; 5/2" | bc            # 2.50
awk 'BEGIN { printf "%.2f\n", 5/2 }' # 2.50
printf '%.2f\n' 3.14159             # 3.14  (printf only formats, it doesn't compute)
```
