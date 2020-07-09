# Regular Expressions

A regular expression, regex or regexp is a sequence of characters that define a search pattern.

Bash uses the Extended Regular Expression (ERE) dialect. Regular expressions (regex) can only be used for pattern matching, not for filename matching.

Since 3.0, Bash supports the `=~` operator to the `[[` keyword. This operator matches the string that comes before it against the regex pattern that follows it. When the string matches the pattern, `[[` returns with an exit code of 0 ("*true*"). If the string does not match the pattern, an exit code of 1 ("*false*") is returned. In case the pattern's syntax is invalid, `[[` will abort the operation and return an exit code of 2.

## Posix-Basic Regular Expressions

In POSIX Basic Regular Expression syntax, most characters are treated as literals — they match only themselves (e.g., `a` matches `"a"`). The exceptions, listed below, are called metacharacters or metasequences.

| Symbol | Description                                            |
| ------ | ------------------------------------------------------ |
| `^`    | define a pattern that describes the start of the line. |
| `$`    | define a pattern that describes the end of the line.   |

| Symbol     | Description                                                      |
| ---------- | ---------------------------------------------------------------- |
| `[abc]`    | specifies just one character of the list inside of the brackets. |
| `[^abc]`   | inverse coincidence.                                             |
| `\<Word\>` | word coincidence                                                 |
| `.`        | Any character just one.                                          |
| \\         | scape string                                                     |
| `|`        | Ex: `a|e` a or e will be found.                                  |

| Symbol | Description                                                                                                                            |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `*`    | indicates zero or more occurrences of the preceding element. For example, ab\*c matches "ac", "abc", "abbc", "abbbc", and so on.       |
| `?`    | The question mark indicates zero or one occurrences of the preceding element. For example, colou?r matches both "color" and "colour".  |
| `+`    | indicates one or more occurrences of the preceding element. For example, ab+c matches "abc", "abbc", "abbbc", and so on, but not "ac". |
| `.`    | Matches any single character                                                                                                           |

Ranges:

| Symbol    | Description                                                                    |
| --------- | ------------------------------------------------------------------------------ |
| \\{n,m\\} | The preceding item is matched at least min times, but not more than max times. |
| \\{n\\}   | The preceding item is matched exactly n times.                                 |
| \\{n, \\} | The preceding item is matched min or more times.                               |
| \\{n,m\\} | at least n, as maximum m coincidences.                                         |
| \\{, m\\} | no minimum, just maximun number of coincidences                                |

Sub-Expressions:

| Symbol | Description                                                 |
| ------ | ----------------------------------------------------------- |
| \\( \\)   | Defines a subexpression. It is treated as a single element. |

### Examples

- `.at` matches any three-character string ending with "at", including "hat", "cat", and - "bat".
- `[hc]at` matches "hat" and "cat".
- `[^b]at` matches all strings matched by .at except "bat".
- `[^hc]at` matches all strings matched by .at other than "hat" and "cat".
- `^[hc]at` matches "hat" and "cat", but only at the beginning of the string or line.
- `[hc]at$` matches "hat" and "cat", but only at the end of the string or line.
- `\[.\]` matches any single character surrounded by "[" and "]" since the brackets are - escaped, for example: "[a]" and "[b]".
- `s.*` matches s followed by zero or more characters, for example: "s" and "saw" and "seed".
- `[hc]?at` matches "at", "hat", and "cat".
- `[hc]*at` matches "at", "hat", "cat", "hhat", "chat", "hcat", "cchchat", and so on.
- `[hc]+at` matches "hat", "cat", "hhat", "chat", "hcat", "cchchat", and so on, but not "at".
- `cat|dog` matches "cat" or "dog".

## Posix-Extended Regular Expressions

The more advanced "extended" regular expressions can sometimes be used with Unix utilities by including the command line flag "-E".

The main difference is that some backslashes are removed: `\{…\}` becomes `{…}` and `\(…\)` becomes `(…)`.

Examples:

- `"[hc]+at"` matches with "hat", "cat", "hhat", "chat", "hcat", "ccchat" etc.
- `"[hc]?at"` matches "hat", "cat" and "at"
- `"([cC]at)|([dD]og)"` matches "cat", "Cat", "dog" and "Dog"

The characters (,),[,],.,*,?,+,|,^ and $ are special symbols and have to be escaped with a backslash symbol in order to be treated as literal characters.
