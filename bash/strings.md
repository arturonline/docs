# String Operations

## Select substring

```bash
${string:position:size}
```

Example

```bash
# String=abcABC123ABCabc

echo ${string:0}        # ⇒ abcABC123ABCabc
echo ${string:0:1}      # ⇒ a
echo ${string:7}:       # ⇒ 23ABCabc
echo ${string:7:3}      # ⇒ 23A
echo ${string: -4}      # ⇒ Cabc (pay attention: there is a space between 􏰁:􏰂 and 􏰁-4)􏰂
echo ${string: -4:2}    # ⇒ a (pay attention: there is a space between 􏰁:􏰂 and 􏰁-4)􏰂
```

## Delete substring

```bash
${string#substring} # -> first coincidence
${string##substring} # -> all coincifirst coincidences
```

Example:

```bash
# string=abcABC123ABCabc

echo ${string#a*C} # 123ABCabc
echo ${string##a*C} # abc
```

## Replacing substring

```bash
${string/search/replace} # first coincidence
${string//search/replace} # all coincidences
```

Example:

```bash
# string=abcABC123ABCabc
echo ${string/abc/xyz} # xyzABC123ABCabc
echo ${string/abc/xyz} # xyzABC123ABCxyz
```

## check strings

Expression | Description
-|-
`-z string` | True if `string` is empty.
`-n string` | True if `string` is not empty.
`string1 = string2` | True if `string1` equals `string2`
`string1 != string2` | True if `string1` does not equal `string2`