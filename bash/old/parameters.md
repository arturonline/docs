# Parameters

**sh** parameters are regions in memory where you can temporarily store some information for later use.

## Variables

A shell variable is essentially a sh parameter that has a name. You can use variables to store a value and later modify or read that value back for re-use.

To store data in a variable, we use the following assignment syntax:

```sh
varname=vardata
```

you cannot use spaces around the = sign in an assignment.

```sh
varname = vardata     # This is wrong!
```

## Variables can be unset

```sh
TMPDIR=/tmp

unset TMPDIR
```

## Quotes

Single quotes will literally `echo` what you have between them, while double quotes will evaluate variables between them and output the value of the variable:

```sh
$ MYVAR=sometext
$ echo "double quotes gives you $MYVAR"
$ echo 'single quotes gives you $MYVAR'

double quotes gives you sometext
single quotes gives you $MYVAR
```

⚠️ Double quotes group everything inside them into a single argument:

```sh
The secret voice in your head.mp3    # a mp3 file
$ rm The secret voice in your head.mp3    # Executes rm with 6 arguments; not 1!
```

This is what we should have done:

```sh
mysong="The secret void in your head.mp3"

rm $mysong

# or

rm "The secret voice in your head.mp3"
```

## echo

`echo` is a command that prints its arguments to standard output (which in our case is the terminal).

```sh
$ echo This is a test.
This is a test.

$ echo This    is    a    test.
This is a test.

$ echo "This    is    a    test."
This    is    a    test.
```

## Parameter expansion

We expand parameters by prefixing their name with a `$` symbol. Whenever you see this symbol in sh, it's probably because something is getting expanded.

In addition, parameter expansion allows you to wrap curly braces `{` and `}` around your expansion. These braces are used to tell sh what the beginning and end of your parameter name is. They are usually optional, though sometimes they become a necessity:

```sh
name=Britta time=23.73 # We want to expand time and add an s for seconds

echo "$name current record is ${time}s." # Braces explicitly tell sh where the name ends
$ Britta current record is 23.73s.
```

### Parameter expansion operators

While expanding a parameter, it is possible to apply an operator to the expanding value. This operator can modify the value in one of many useful ways. Remember that this operator only changes the value that is expanded; it does not change the original value that's sitting in your variable.

```sh
$ name=Britta time=23.73
$ echo "$name current record is ${time%.*} seconds and ${time#*.} hundredths."
Britta current record is 23 seconds and 73 hundredths.
$ echo "PATH currently contains: ${PATH//:/, }"
PATH currently contains: /Users/lhunath/.bin, /usr/local/bin, /usr/bin, /bin, /usr/libexec
```

The examples above use the %, # and // operators to perform various operations on the parameter's value before expanding the result.

- In the first case, we used the % operator to remove the . and the number after it from time's value before expanding it. That left us with just the part in front of the ., which is the seconds.
- The second case did something similar, we used the # operator to remove a part from the start of the time value.
- Finally, we used the // operator, (which is really a special case of the / operator), to replace every : character in PATH's value with , . The result is a list of directories that is easier to read for people than the original colon-separated PATH.

### List of operators

> [Link](https://guide.sh.academy/variables.html)

| Syntax    | Description    |
| ---------------------------- | ------------------------------------ |
| `${parameter:-word}` | Use Default Value. If `'parameter'` is unset or null, `'word'` (which may be an expansion) is substituted. Otherwise, the value of `'parameter'` is substituted. |
| `${parameter:=word}` | Assign Default Value. If `'parameter'` is unset or null, `'word'` (which may be an expansion) is assigned to `'parameter'`. The value of `'parameter'` is then substituted. |
| `${parameter:+word}` | Use Alternate Value. If `'parameter'` is null or unset, nothing is substituted, otherwise `'word'` (which may be an expansion) is substituted. |
| `${parameter:offset:length}` | Substring Expansion. Expands to up to `'length'` characters of `'parameter'` starting at the character specified by `'offset'` (0-indexed). If `':length'` is omitted, go all the way to the end. If `'offset'` is negative (use parentheses!), count backward from the end of `'parameter'` instead of forward from the beginning. If 'parameter' is `@` or an indexed array name subscripted by `@` or `*`, the result is `'length'` positional parameters or members of the array, respectively, starting from `'offset'`. |
| `${#parameter}` | The length in characters of the value of `'parameter'` is substituted. If `'parameter'` is an array name subscripted by `@` or `*`, return the number of elements. |
| `${parameter#pattern}`       | The `'pattern'` is matched against the beginning of `'parameter'`. The result is the expanded value of `'parameter'` with the shortest match deleted. If `'parameter'` is an array name subscripted by `@` or `*`, this will be done on each element. Same for all following items. |
| `${parameter##pattern}` | As above, but the longest match is deleted. |
| `${parameter%pattern}` | The `'pattern'` is matched against the end of `'parameter'`. The result is the expanded value of `'parameter'` with the shortest match deleted. |
| `${parameter%%pattern}` | As above, but the longest match is deleted. |
| `${parameter/pat/string}` | Results in the expanded value of `'parameter'` with the first (unanchored) match of `'pat'` replaced by `'string'`. Assume null string when the `'/string'` part is absent. |
| `${parameter//pat/string}`   | As above, but every match of `'pat'` is replaced. |
| `${parameter/#pat/string}`   | As above, but matched against the beginning. Useful for adding a common prefix with a null pattern: `"${array[@]/#/prefix}"`. |
| `${parameter/%pat/string}`   | As above, but matched against the end. Useful for adding a common suffix with a null pattern. |

Example:

```sh
$ for file in *.JPG *.jpeg
do mv -- "$file" "${file%.*}.jpg"
done
```

The code above can be used to rename all JPEG files with a `.JPG` or a `.jpeg` extension to have a normal `.jpg` extension. The expression `${file%.*}` cuts off everything from the end starting with the last period `(.)`. Then, in the same quotes, a new extension is appended to the expansion result.

You will learn them through experience. They come in handy far more often than you think they might. Here are a few examples to kickstart you:

```sh
$ file="$HOME/.secrets/007"; \
echo "File location: $file"; \
echo "Filename: ${file##*/}"; \
echo "Directory of file: ${file%/*}"; \
echo "Non-secret file: ${file/secrets/not_secret}"; \
echo; \
echo "Other file location: ${other:-There is no other file}"; \
echo "Using file if there is no other file: ${other:=$file}"; \
echo "Other filename: ${other##*/}"; \
echo "Other file location length: ${#other}"
File location: /home/lhunath/.secrets/007
Filename: 007
Directory of file: /home/lhunath/.secrets
Non-secret file: /home/lhunath/.not_secret/007

Other file location: There is no other file
Using file if there is no other file: /home/lhunath/.secrets/007
Other filename: 007
Other file location length: 26
```

Remember the difference between `${v#p}` and `${v##p}`. The doubling of the `#` character means patterns will become greedy. The same goes for `%`:

```sh
$ version=1.5.9; echo "MAJOR: ${version%%.*}, MINOR: ${version#*.}."
MAJOR: 1, MINOR: 5.9.
$ echo "Dash: ${version/./-}, Dashes: ${version//./-}."
Dash: 1-5.9, Dashes: 1-5-9.
```

Note: You cannot use multiple PEs together. If you need to execute multiple PEs on a parameter, you will need to use multiple statements:

```sh
$ file=$HOME/image.jpg; file=${file##*/}; echo "${file%.*}"
image
```

## Arguments

Arguments are separated from the command name and from each other by a whitespace. This is important to remember. For example, the following is wrong:

```sh
[-f file]     # wrong: We want the command [ (a synonym for test) to be separated from the arguments: -f, file, and ]

[ -f file ]    # correct
```
