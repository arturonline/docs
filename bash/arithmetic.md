# Arithmetic Operations

⚠ There are *three* different ways of writing arithmetic operations in bash, but it is recommended to use `$((...))` to do arithmetic over **expr** or **let** for legibility.

## #1 arithmetic expansion

```sh
$(( expression ))

res=$(( n1+n2 ))
```

⚠ spaces doesn't matter here.

Examples:

Basic arithmetic using double parentheses

```sh
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

## #2: expr

```sh
$(expr expression)

res=$(expr $n1 +$n2)
```

## #3: let

```sh
let "a=(4+3)*7"
let res=$n1+$n2
```
