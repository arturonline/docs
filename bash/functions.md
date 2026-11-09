# Functions

[More about functions](https://linuxhandbook.com/bash-functions/#passing-arguments-to-bash-function)

```bash
name() {
    # commands
}
```

```bash
function name {     # bash-only keyword form (the `()` is optional here)
    # commands
}
```

💡 Prefer `name() { ...; }`: it is POSIX and works in any shell. A function must be defined before it is called.

## Return values

`return N` only sets the **exit status** (0-255; 0 = success). Without `return`, the status is that of the last command. To "return" data, print it to **stdout** and capture it with `$(...)`.

```bash
myfunc() {
    read -rp "Tell me your name: " name
    echo "$name"
}
result=$(myfunc)
```

```bash
greet() {
    local name=${1:-world}      # default value if $1 is empty/unset
    echo "Hello, $name"
}
greet               # Hello, world
greet Ana           # Hello, Ana
msg=$(greet Bob)
echo "$msg"         # Hello, Bob
```

Using the exit status as a boolean:

```bash
is_even() { (( $1 % 2 == 0 )); }

is_even 4 && echo "4 even"     # 4 even
is_even 3 || echo "3 odd"      # 3 odd

fail() { return 3; }
fail; echo "rc=$?"             # rc=3
```

## Passing parameters to functions

You can pass arguments to a function just like you can pass arguments to a bash script. Inside the function `$1`, `$2`..., `$#` and `"$@"` refer to the function's arguments (`$0` is still the script name).

```bash
myfunc() {
    echo $(( $1 + $2 ))
}

myfunc 5 6     # 11
```

```bash
sum() {
    local total=0 n
    for n in "$@"; do (( total += n )); done
    echo "$total"
}
sum 1 2 3      # 6
```

⚠ Always pass arrays/lists as `"$@"` / `"${arr[@]}"`:

```bash
count_args() { echo "$# args"; }
a=("one two" three)
count_args "${a[@]}"    # 2 args
count_args ${a[@]}      # 3 args   (word splitting!)
count_args "${a[*]}"    # 1 args
```

## Scope: `local`

Variables are **global by default**, even when created inside a function. Use `local` for function-scoped variables.

```bash
x=1
f() { x=2; local y=3; }
f
echo "x=$x y=${y:-unset}"   # x=2 y=unset
```

⚠ `local v=$(cmd)` hides the exit status of `cmd` (you get the status of `local`). Declare and assign separately if you need it:

```bash
local v
v=$(cmd) || return
```

## Return by reference (nameref, bash 4.3+)

```bash
to_upper() {
    local -n ref=$1     # ref is an alias of the variable whose name is in $1
    ref=${ref^^}
}
v=abc
to_upper v
echo "$v"     # ABC
```

## Recursion

```bash
fact() {
    (( $1 <= 1 )) && { echo 1; return; }
    echo $(( $1 * $(fact $(( $1 - 1 ))) ))
}
fact 5     # 120
```

## Useful bits

```bash
f() { echo "$FUNCNAME"; }; f      # f   (name of the current function)
declare -f greet                  # print a function definition
declare -F                        # list function names
unset -f greet                    # delete a function
export -f greet                   # make it available to child bash processes
type greet                        # greet is a function ...
```
