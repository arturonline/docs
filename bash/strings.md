# String Operations

See also: [variables](vars.md), [conditionals](conditionals.md), [regex](regex.md), full parameter expansion table in [old/parameters](old/parameters.md#list-of-operators).

```bash
string=abcABC123ABCabc
s="hello world"
```

## Length

```bash
echo "${#s}"        # 11
```

## Select substring

```bash
${string:position:size}
```

Example

```bash
echo "${string:0}"        # → abcABC123ABCabc
echo "${string:0:1}"      # → a
echo "${string:7}"        # → 23ABCabc
echo "${string:7:3}"      # → 23A
echo "${string: -4}"      # → Cabc (pay attention: there is a space between ':' and '-4')
echo "${string: -4:2}"    # → Ca
echo "${string:(-4)}"     # → Cabc (parentheses also work)
```

## Delete substring

The pattern is a glob (`*`, `?`, `[...]`), not a regex.

```bash
${string#pattern}    # from the start, shortest match
${string##pattern}   # from the start, longest match
${string%pattern}    # from the end, shortest match
${string%%pattern}   # from the end, longest match
```

Example:

```bash
echo "${string#a*C}"     # 123ABCabc
echo "${string##a*C}"    # abc
echo "${string%C*c}"     # abcABC123AB
echo "${string%%C*c}"    # abcAB

path=/home/ana/file.tar.gz
echo "${path##*/}"       # file.tar.gz   (basename)
echo "${path%/*}"        # /home/ana     (dirname)
echo "${path##*.}"       # gz            (extension)
echo "${path%.*}"        # /home/ana/file.tar
```

## Replacing substring

```bash
${string/search/replace}    # first coincidence
${string//search/replace}   # all coincidences
${string/#search/replace}   # only at the start
${string/%search/replace}   # only at the end
```

Example:

```bash
echo "${string/abc/xyz}"    # xyzABC123ABCabc
echo "${string//abc/xyz}"   # xyzABC123ABCxyz
echo "${string/#abc/X}"     # XABC123ABCabc
echo "${string/%abc/X}"     # abcABC123ABCX
echo "${string//[0-9]/}"    # abcABCABCabc   (delete all digits)
```

## Case conversion (bash 4+)

```bash
echo "${s^^}"     # HELLO WORLD   (all upper)
echo "${s^}"      # Hello world   (first char upper)
echo "${s,,}"     # hello world   (all lower)
echo "${s~~}"     # HELLO WORLD   (toggle case)
echo "${s@U}"     # HELLO WORLD   (bash 5.1+, also @u @L)
```

## Quoting for reuse: `${var@Q}`

```bash
q="it's"
echo "${q@Q}"     # 'it'\''s'   (safe to paste in a shell / eval)
```

## Default values

```bash
echo "${name:-guest}"     # "guest" if name is unset or empty
echo "${name:=guest}"     # same, and also assigns it
echo "${name:+set}"       # "set" only if name has a value
echo "${name:?required}"  # error and exit if unset or empty
```

## Concatenation, padding and formatting

```bash
a=foo b=bar
c="$a-$b"; c+="!"; echo "$c"     # foo-bar!

printf '%-6s|\n' ab               # ab    |   (left-aligned, width 6)
printf '%05d\n' 42                # 00042
printf '%.2f\n' 3.14159           # 3.14
printf -v out '%s=%s' key val     # store result in $out instead of printing
echo "$out"                       # key=val
```

## Split and join

```bash
IFS=, read -ra parts <<< "a,b,c"
echo "${#parts[@]} ${parts[1]}"   # 3 b

arr=(a b c)
(IFS=,; echo "${arr[*]}")         # a,b,c   ("${arr[*]}" joins with the first char of IFS)
```

## Trim whitespace

```bash
t="   trim me   "
t="${t#"${t%%[![:space:]]*}"}"    # remove leading
t="${t%"${t##*[![:space:]]}"}"    # remove trailing
echo "[$t]"                       # [trim me]
```

## Check strings

| Expression           | Description                                |
| -------------------- | ------------------------------------------ |
| `-z string`          | True if `string` is empty.                 |
| `-n string`          | True if `string` is not empty.             |
| `string1 = string2`  | True if `string1` equals `string2`         |
| `string1 != string2` | True if `string1` does not equal `string2` |

```bash
[[ $s == *wor* ]] && echo "contains"       # contains
[[ $s == hello* ]] && echo "starts with"   # starts with
[[ $s =~ ^[a-z\ ]+$ ]] && echo "only lowercase letters and spaces"
```

## Comparing Strings

| Operator | Meaning                               |
| -------- | ------------------------------------- |
| `=`      | The strings are equal                 |
| `!=`     | The strings are not equal             |
| `<`      | Less than (alphabetic order)          |
| `>`      | Greater than (alphabetic order)       |
| `-n`     | String is not empty                   |
| `-z`     | String is empty                       |

```bash
[[ "abc" < "abd" ]] && echo "lt"    # lt
[ "abc" \< "abd" ] && echo "lt"     # with [ ] the < must be escaped
```

⚠ Double parentheses compare **numbers**, not strings:

```bash
if (( int1 == int2 )); then
    echo "${int1} is equal to ${int2}."
fi
```
