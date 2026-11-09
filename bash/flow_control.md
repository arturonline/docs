# Flow Control

⚡ [Source](http://linuxcommand.org/lc3_wss0080.php)

The shell provides several commands that we can use to control the flow of execution in our program. See also: [conditionals](conditionals.md), [loops](loops.md), [functions](functions.md).

## if

```bash
if commands; then
    commands
[elif commands; then
    commands...]
[else
    commands]
fi
```

`if` runs the command after it and checks its **exit status** (0 = true). The command is usually a test (`[ ]`, `[[ ]]`, `(( ))`), but it can be any command:

```bash
n=7
if (( n % 2 == 0 )); then
    echo "even"
elif [[ $n -gt 5 ]]; then
    echo "odd and > 5"
else
    echo "odd"
fi
# odd and > 5

if grep -q "root" /etc/passwd; then echo "root exists"; fi
```

## Short-circuit: `&&` and `||`

```bash
mkdir -p build && cd build        # cd only runs if mkdir succeeded
cd /nope 2>/dev/null || echo "cd failed"   # cd failed
true && echo ok || echo ko        # ok
```

⚠ `a && b || c` is not if/else: `c` runs if `a` **or** `b` fails.

## exit

Commands (including the scripts and shell functions we write) issue a value to the system when they terminate, called an exit status. This value, which is an integer in the range of 0 to 255, indicates the success or failure of the command's execution. By convention, a value of zero indicates success and any other value indicates failure. The shell provides a parameter that we can use to examine the exit status. Here we see it in action:

```bash
$ ls -d /usr/bin
/usr/bin
$ echo $?
0
$ ls -d /bin/usr
ls: cannot access '/bin/usr': No such file or directory
$ echo $?
2
```

⚠ `$?` is overwritten by every command (even `echo` or `[`). Save it right away if you need it later: `rc=$?`.

In order to be good script writers, we must set the exit status when our scripts finish. To do this, use the exit command. The exit command causes the script to terminate immediately and set the exit status to whatever value is given as an argument. For example:

```bash
exit 0
```

exits your script and sets the exit status to 0 (success), whereas

```bash
exit 1
```

exits your script and sets the exit status to 1 (failure). Without an argument, `exit` uses the status of the last command.

Common conventions: `1` generic error, `2` misuse/bad arguments, `126` not executable, `127` command not found, `128+N` killed by signal N (e.g. `130` = Ctrl-C).

## test

The test command is used most often with the if command to perform true/false decisions. The command is unusual in that it has two different syntactic forms:

First form:

```bash
test expression
```

Second form:

```bash
[ expression ]
```

The test command works simply. If the given expression is true, test exits with a status of zero; otherwise it exits with a status of 1.

```bash
if [ -f .bash_profile ]; then
    echo "You have a .bash_profile. Things are fine."
else
    echo "Yikes! You have no .bash_profile!"
fi
```

💡 In bash scripts prefer `[[ expression ]]`: no word splitting, supports `&&`, `||`, patterns and regex. See [conditionals](conditionals.md#testing-conditions-with---preferred-in-bash).

### Test Conditions

| Expression           | Description                                                        |
| -------------------- | ------------------------------------------------------------------ |
| `-d file`            | True if file is a directory.                                       |
| `-e file`            | True if file exists.                                               |
| `-f file`            | True if file exists and is a regular file.                         |
| `-L file`            | True if file is a symbolic link.                                   |
| `-r file`            | True if file is a file readable by you.                            |
| `-w file`            | True if file is a file writable by you.                            |
| `-x file`            | True if file is a file executable by you.                          |
| `-s file`            | True if file exists and is not empty.                              |
| `file1 -nt file2`    | True if file1 is newer than (according to modification time) file2 |
| `file1 -ot file2`    | True if file1 is older than file2                                  |
| `-z string`          | True if string is empty.                                           |
| `-n string`          | True if string is not empty.                                       |
| `string1 = string2`  | True if string1 equals string2.                                    |
| `string1 != string2` | True if string1 does not equal string2.                            |
| `int1 -eq int2`      | True if the integers are equal (also `-ne -lt -le -gt -ge`).       |

```bash
if [ -f .bash_profile ]
then
    echo "You have a .bash_profile. Things are fine."
else
    echo "Yikes! You have no .bash_profile!"
fi

# Another alternate form

if [ -f .bash_profile ]
then echo "You have a .bash_profile. Things are fine."
else echo "Yikes! You have no .bash_profile!"
fi
```

## case

The case command has the following form:

```bash
case word in
    pattern1 | pattern2 ) commands ;;
    * ) default commands ;;
esac
```

Patterns are globs (`*`, `?`, `[...]`), not regex. `|` separates alternatives.

Example:

```bash
read -rp "Enter a number between 1 and 3 inclusive > " character
case $character in
    1 ) echo "You entered one."
        ;;
    2 ) echo "You entered two."
        ;;
    3 ) echo "You entered three."
        ;;
    * ) echo "You did not enter a number between 1 and 3."
        ;;
esac
```

```bash
case "photo.JPG" in
    *.jpg | *.JPG) echo "image" ;;
    *)             echo "other" ;;
esac
# image

case "$answer" in
    [Yy] | [Yy]es) echo "yes" ;;
    [Nn]*)         echo "no" ;;
esac
```

Terminators:

| Terminator | Behaviour                                                 |
| ---------- | --------------------------------------------------------- |
| `;;`       | stop                                                      |
| `;&`       | fall through: run the next block without testing it       |
| `;;&`      | keep testing the following patterns                       |

```bash
case a in a) echo one ;& b) echo two ;; c) echo three ;; esac
# one
# two
```

## select (simple menus)

```bash
PS3="Choose an option: "
select opt in start stop quit; do
    case $opt in
        start|stop) echo "You chose $opt" ;;
        quit) break ;;
        *) echo "Invalid option $REPLY" ;;
    esac
done
# 1) start
# 2) stop
# 3) quit
# Choose an option:
```
