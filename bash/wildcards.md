# WildCards vs Regular Expressions

- **Wildcards (globs)** are expanded by the shell to match **file names** (and are used in `[[ == ]]`, `case` and `${var#pattern}`). They are anchored: the whole name must match.
- **Regular expressions** are used by tools like `grep`, `sed`, `awk` and by `[[ =~ ]]` to match **text**, anywhere in the line unless anchored. See [regex](regex.md).

| Meaning                | Glob      | Regex (ERE) |
| ---------------------- | --------- | ----------- |
| any single character   | `?`       | `.`         |
| any string             | `*`       | `.*`        |
| one char from a set    | `[abc]`   | `[abc]`     |
| one char not in a set  | `[!abc]`  | `[^abc]`    |
| starts with `a`        | `a*`      | `^a`        |

## Wildcards

In software, a wildcard character is a kind of placeholder represented by a single character, such as an asterisk (\*), which can be interpreted as a number of literal characters or an empty string. It is often used in file searches so the full name need not be typed.

| wildcard     | definition                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------ |
| `*`          | matches any number of any characters including none. Ex `a*` => arbol, as, asimetria, a, etc...  |
| `?`          | matches exactly one character. Ex: `h?r` => har, hor, hur (but not hora)                        |
| `[abc]`      | matches one character given in the bracket.                                                      |
| `[.,_]`      | specifies character `.`, `,` or `_`                                                              |
| `[a-z]`      | matches one character from the range given in the bracket. In this case any lowercase letter     |
| `[0-9]`      | any digit                                                                                        |
| `[a-zA-Z]`   | any letter, lower or upper case                                                                  |
| `[!...]`     | matches one character that is not given in the bracket. Ex: `[!0-9]` any character except digits. `[^...]` also works in bash |
| `[[:class:]]`| character class: `[[:digit:]]`, `[[:alpha:]]`, `[[:upper:]]`, `[[:lower:]]`, `[[:space:]]`, `[[:alnum:]]`, `[[:punct:]]` |

⚠ `*` and `?` do not match a leading `.` (hidden files) unless `dotglob` is enabled.

### Wildcard examples

| Example       | Matches                                 | Does not match              |
| ------------- | --------------------------------------- | --------------------------- |
| `Law*`        | Law, Laws, Lawyer                       | GrokLaw, La, aw             |
| `*Law*`       | Law, GrokLaw, Lawyer                    | La, aw                      |
| `?at`         | Cat, cat, Bat, bat                      | at                          |
| `[CB]at`      | Cat, Bat                                | cat, bat                    |
| `Letter[0-9]` | Letter0, Letter1, Letter2 up to Letter9 | Letters, Letter or Letter10 |

```bash
$ ls
GrokLaw  Law  Laws  Lawyer  Letter1  Letter10  a.txt  b.TXT  at  bat  Cat
$ echo Law*
Law Laws Lawyer
$ echo *Law*
GrokLaw Law Laws Lawyer
$ echo [CB]at
Cat
$ echo Letter[0-9]
Letter1
$ echo [[:upper:]]*
Cat GrokLaw Law Laws Lawyer Letter1 Letter10
```

## No matches

By default, a pattern that matches nothing is passed **literally**:

```bash
echo *.nomatch                      # *.nomatch
shopt -s nullglob;  echo *.nomatch  # (nothing)
shopt -s failglob;  echo *.nomatch  # bash: no match: *.nomatch   (error)
```

## Shell options (`shopt -s` to enable, `shopt -u` to disable)

| Option       | Effect                                                     |
| ------------ | ---------------------------------------------------------- |
| `nullglob`   | patterns with no matches expand to nothing                 |
| `failglob`   | patterns with no matches are an error                      |
| `dotglob`    | `*` also matches hidden files (`.bashrc`)                  |
| `nocaseglob` | case-insensitive matching: `*.txt` also matches `b.TXT`    |
| `globstar`   | `**` matches any number of directories (recursive)         |
| `extglob`    | extended patterns (see below)                              |

```bash
shopt -s globstar
echo **/*.txt          # a.txt sub/deep/y.txt sub/x.txt
```

## Extended globs (`shopt -s extglob`)

| Pattern        | Matches                                  |
| -------------- | ---------------------------------------- |
| `?(p1\|p2)`    | zero or one of the patterns              |
| `*(p1\|p2)`    | zero or more                             |
| `+(p1\|p2)`    | one or more                              |
| `@(p1\|p2)`    | exactly one                              |
| `!(p1\|p2)`    | anything except the patterns             |

```bash
shopt -s extglob
echo *.@(jpg|jpeg)     # img.jpg img2.jpeg
echo *.jp?(e)g         # img.jpg img2.jpeg
rm -- !(*.txt)         # delete everything except .txt files
```

⚠ In a script, `shopt -s extglob` must be on a line **before** the code that uses it (it affects parsing).

## Brace expansion `{}`

Not a wildcard: it generates words whether or not files exist. No spaces allowed inside the braces.

```bash
echo pe{lota,lotero,lotazo}   # pelota pelotero pelotazo
echo {a,b}{1,2}               # a1 a2 b1 b2
echo file{1..3}.txt           # file1.txt file2.txt file3.txt
echo {01..03}                 # 01 02 03
echo {c..a}                   # c b a
mkdir -p src/{api,web}/test   # creates 2 directories
cp config.yml{,.bak}          # cp config.yml config.yml.bak
x=5; echo {1..$x}             # {1..5}   ⚠ variables are not expanded in ranges; use seq or a C-style for
```

More detail: [old/patterns](old/patterns.md), [old/expansion1](old/expansion1.md).
