# Functions

[More about functions](https://linuxhandbook.com/bash-functions/#passing-arguments-to-bash-function)

```sh
name() {
    # commands
}
```

```sh
function name() {
    # commands
}
```

A function returns only numerical values representing the result of the evaluation of the function. But you can echo to `stdin`.

```sh
function myfunc() {
    read -p "Tell me your name" name
    echo name
}
```

## Passing parameters to functions

You can pass arguments to a function just like you can pass arguments to a bash script. You just include the arguments when you do the function call.

```sh
function myfunc {
    echo $(( $1 + $2 ))
}

myfunc 5 6
```
