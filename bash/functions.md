# Functions

```bash
name () {
    # commands
}
```

```bash
function name {
    # commands
}
```

A function returns only numerical values representing the result of the evaluation of the function. But you can echo to stdin.

```bash
function myfunc() {
    read -p "Tell me your name" name
    echo name
}
```

## Passing parameters to functions

```bash
function myfunc {
    echo $(( $1 + $2 ))
}

myfunc 5 6
```
