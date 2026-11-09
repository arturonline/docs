# Special characters

Some characters are evaluated by Bash to have a *non-literal* meaning. Instead, these characters carry out a special instruction, or have an alternate meaning; they are called "special characters", or "meta-characters".

Here are some of the more common special characters uses:

| Char.                | Description |
| -------------------- | ----------- |
| `" "`                | *Whitespace* — this is a tab, newline, vertical tab, form feed, carriage return, or space. Bash uses whitespace to determine where words begin and end. The first word is the command name and additional words become arguments to that command. |
| `$`                  | *Expansion* — introduces various types of expansion: parameter expansion (e.g. `$var` or `${var}`), command substitution (e.g. `$(command)`), or arithmetic expansion (e.g. `$((expression))`). See [variables](../vars.md). |
| `''`                 | *Single quotes* — protect the text inside them so that it has a *literal* meaning. With them, generally any kind of interpretation by Bash is ignored: special characters are passed over and multiple words are prevented from being split. |
| `""`                 | *Double quotes* — protect the text inside them from being split into multiple words or arguments, yet allow substitutions to occur (`$`, `` ` ``, `\`); the meaning of most other special characters is usually prevented. |
| `$'...'`             | *ANSI-C quoting* — like single quotes, but escapes such as `\n`, `\t`, `\e`, `\'` are interpreted. |
| `\`                  | *Escape* — (backslash) prevents the next character from being interpreted as a special character. This works outside of quoting, inside double quotes, and is ignored in single quotes. |
| `#`                  | *Comment* — the `#` character begins a commentary that extends to the end of the line. Comments are notes of explanation and are not processed by the shell. |
| `=`                  | *Assignment* — assign a value to a variable (e.g. `logdir=/var/log/myprog`). Whitespace is *not* allowed on either side of the `=` character. |
| `[[ ]]`              | *Test* — an evaluation of a conditional expression to determine whether it is "true" or "false". Tests are used in Bash to compare strings, check the existence of a file, etc. See [conditionals](../conditionals.md). |
| `!`                  | *Negate* — used to negate or reverse a test or exit status. For example: `! grep text file; exit $?`. In interactive shells it also triggers history expansion (`!!`, `!$`). |
| `>`, `>>`, `<`       | *Redirection* — redirect a command's *output* or *input* to a file. See [pipes](../pipes.md). |
| `<<`, `<<<`          | *Here-document* / *here-string* — feed text as stdin. |
| `\|`                 | *Pipe* — send the output from one command to the input of another command. This is a method of chaining commands together. Example: `echo "Hello beautiful." \| grep -o beautiful`. |
| `;`                  | *Command separator* — used to separate multiple commands that are on the same line. |
| `&&`, `\|\|`         | *AND / OR lists* — run the next command only if the previous one succeeded / failed. |
| `{ }`                | *Inline group* — commands inside the curly braces are treated as if they were one command. It is convenient to use these when Bash syntax requires only one command and a function doesn't feel warranted. Needs spaces and a final `;`: `{ cmd1; cmd2; }`. Also used for brace expansion: `{a,b}`, `{1..5}`. |
| `( )`                | *Subshell group* — similar to the above but where commands within are executed in a subshell (a new process). Used much like a sandbox, if a command causes side effects (like changing variables or `cd`), it will have no effect on the current shell. |
| `(( ))`              | *Arithmetic expression* — with an arithmetic expression, characters such as `+`, `-`, `*`, and `/` are mathematical operators used for calculations. They can be used for variable assignments like `(( a = 1 + 4 ))` as well as tests like `if (( a < b ))`. See [arithmetic](../arithmetic.md). |
| `$(( ))`             | *Arithmetic expansion* — Comparable to the above, but the expression is replaced with the result of its arithmetic evaluation. Example: `echo "The average is $(( (a+b)/2 ))"`. |
| `<( )`, `>( )`       | *Process substitution* — the output (or input) of a command used as if it were a file: `diff <(sort a) <(sort b)`. |
| `*`, `?`, `[ ]`      | *Globs* — "wildcard" characters which match parts of filenames (e.g. `ls *.txt`). See [wildcards](../wildcards.md). |
| `~`                  | *Home directory* — the tilde is a representation of a home directory. When alone or followed by a `/`, it means the current user's home directory; otherwise, a username must be specified (e.g. `ls ~/Documents; cp ~john/.bashrc .`). Not expanded inside quotes. |
| `&`                  | *Background* — when used at the end of a command, run the command in the background (do not wait for it to complete). `$!` holds its PID and `wait` waits for it. |

Examples:

```bash
$ echo "I am $LOGNAME"
I am lhunath
$ echo 'I am $LOGNAME'
I am $LOGNAME
$ # boo
$ echo An open\ \ \ space
An open   space
$ echo "My computer is $(hostname)"
My computer is Lyndir
$ echo boo > file
$ echo $(( 5 + 5 ))
10
$ (( 5 > 0 )) && echo "Five is greater than zero."
Five is greater than zero.
$ echo $'col1\tcol2'
col1	col2
$ (cd /tmp && pwd); pwd
/tmp
/home/lhunath
$ echo "~" ~
~ /home/lhunath
```
