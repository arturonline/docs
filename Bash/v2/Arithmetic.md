# Arithmetic Operations

There are three different ways of writing arithmetic operations:

## #1 expansion

```bash
$(( expression ))

res=$(( n1+n2 ))
```

## #2: expr

```bash
$(expr expression)

res=$(expr $n1 +$n2)
```

## #3: let

```bash
let "a=(4+3)*7"
let res=$n1+$n2
```
