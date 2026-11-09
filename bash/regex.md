# Regular Expressions

A regular expression, regex or regexp is a sequence of characters that define a search pattern. Not to be confused with [wildcards/globs](wildcards.md), which match file names.

There are two POSIX dialects:

- **BRE** (Basic): default in `grep` and `sed`.
- **ERE** (Extended): `grep -E`, `sed -E`, `awk`, and bash's `[[ =~ ]]`.

And **PCRE** (Perl-compatible: `\d`, `\w`, lookarounds, `+?` lazy) with `grep -P`. Bash itself has no PCRE.

## Regex in bash: `[[ string =~ regex ]]`

Since 3.0, Bash supports the `=~` operator to the `[[` keyword. Bash uses the Extended Regular Expression (ERE) dialect. This operator matches the string that comes before it against the regex pattern that follows it. When the string matches the pattern, `[[` returns with an exit code of 0 ("_true_"). If the string does not match the pattern, an exit code of 1 ("_false_") is returned. In case the pattern's syntax is invalid, `[[` will abort the operation and return an exit code of 2.

The match is stored in `BASH_REMATCH`: `[0]` whole match, `[1]`, `[2]`... capture groups.

```bash
v="2024-05-17"
re='^([0-9]{4})-([0-9]{2})-([0-9]{2})$'
if [[ $v =~ $re ]]; then
    echo "${BASH_REMATCH[0]} y=${BASH_REMATCH[1]} m=${BASH_REMATCH[2]}"
fi
# 2024-05-17 y=2024 m=05
```

⚠ Rules:

- Don't quote the regex: a quoted part is matched **literally**. Store complex regexes in a variable and use it unquoted (`[[ $v =~ $re ]]`).
- No `\d`, `\w`, `\s`: use `[0-9]`, `[[:alnum:]_]`, `[[:space:]]`.
- The regex is not anchored: use `^` and `$` to match the whole string.

```bash
[[ "a.c" =~ ^a.c$ ]] && echo "dot = any char"      # dot = any char
[[ "abc" =~ "a.c" ]] || echo "quoted = literal"    # quoted = literal
[[ "1.5" =~ ^[0-9]+\.[0-9]+$ ]] && echo "float"    # float
[[ 192.168.1.10 =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}$ ]] && echo "ip"   # ip
```

## Posix-Basic Regular Expressions

In POSIX Basic Regular Expression syntax, most characters are treated as literals — they match only themselves (e.g., `a` matches `"a"`). The exceptions, listed below, are called metacharacters or metasequences.

Anchors:

| Symbol     | Description                                            |
| ---------- | ------------------------------------------------------ |
| `^`        | define a pattern that describes the start of the line. |
| `$`        | define a pattern that describes the end of the line.   |
| `\<` `\>`  | start / end of a word (GNU). `\<word\>` = whole word   |
| `\b`       | word boundary (GNU)                                    |

Characters:

| Symbol       | Description                                                      |
| ------------ | ---------------------------------------------------------------- |
| `.`          | Any character, just one.                                         |
| `[abc]`      | specifies just one character of the list inside of the brackets. |
| `[a-z]`      | one character in the range.                                      |
| `[^abc]`     | any character **not** in the list.                               |
| `[[:digit:]]`| character class. Others: `alpha alnum upper lower space punct xdigit` |
| `\`          | escape the next character: `\.` is a literal dot                 |

Repetition:

| Symbol      | Description                                                                                                                      |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `*`         | zero or more occurrences of the preceding element. For example, `ab*c` matches "ac", "abc", "abbc", "abbbc", and so on.          |
| `\?`        | zero or one occurrence (GNU extension; `?` alone is a literal in BRE). `colou\?r` matches "color" and "colour".                   |
| `\+`        | one or more occurrences (GNU extension; `+` alone is a literal in BRE). `ab\+c` matches "abc", "abbc"... but not "ac".           |
| `\|`        | alternation (GNU extension). `cat\|dog`                                                                                          |

Ranges:

| Symbol      | Description                                                   |
| ----------- | ------------------------------------------------------------- |
| `\{n\}`     | The preceding item is matched exactly n times.                |
| `\{n,\}`    | The preceding item is matched n or more times.                |
| `\{n,m\}`   | at least n, as maximum m coincidences.                        |
| `\{,m\}`    | no minimum, just maximum number of coincidences (GNU)         |

Sub-Expressions:

| Symbol      | Description                                                                         |
| ----------- | ----------------------------------------------------------------------------------- |
| `\( \)`     | Defines a subexpression (group). It is treated as a single element.                 |
| `\1` .. `\9`| Back-reference: the text matched by group N (in the pattern or in a `sed` replacement) |

### Examples

- `.at` matches any three-character string ending with "at", including "hat", "cat", and "bat".
- `[hc]at` matches "hat" and "cat".
- `[^b]at` matches all strings matched by .at except "bat".
- `[^hc]at` matches all strings matched by .at other than "hat" and "cat".
- `^[hc]at` matches "hat" and "cat", but only at the beginning of the string or line.
- `[hc]at$` matches "hat" and "cat", but only at the end of the string or line.
- `\[.\]` matches any single character surrounded by "[" and "]" since the brackets are escaped, for example: "[a]" and "[b]".
- `s.*` matches s followed by zero or more characters, for example: "s" and "saw" and "seed".
- `[hc]*at` matches "at", "hat", "cat", "hhat", "chat", "hcat", "cchchat", and so on.
- `b\{2\}` matches "bb".

```bash
grep 'colou?r' file      # BRE: '?' is literal → only matches the text "colou?r"
grep 'colou\?r' file     # GNU BRE: color, colour
grep -E 'colou?r' file   # ERE: color, colour
```

## Posix-Extended Regular Expressions

The more advanced "extended" regular expressions can be used with Unix utilities by including the command line flag `-E` (`grep -E`, `sed -E`). `awk` and `[[ =~ ]]` always use ERE.

The main difference is that some backslashes are removed: `\{…\}` becomes `{…}`, `\(…\)` becomes `(…)`, and `?`, `+`, `|` are special without a backslash.

| Symbol   | Description                     |
| -------- | ------------------------------- |
| `?`      | zero or one                     |
| `+`      | one or more                     |
| `{n,m}`  | between n and m times           |
| `( )`    | group                           |
| `\|`     | alternation: `a\|e` → a or e    |

Examples:

- `"[hc]+at"` matches with "hat", "cat", "hhat", "chat", "hcat", "ccchat" etc.
- `"[hc]?at"` matches "hat", "cat" and "at"
- `"([cC]at)|([dD]og)"` matches "cat", "Cat", "dog" and "Dog"
- `"[0-9]{2,}"` matches two or more consecutive digits

The characters `(`, `)`, `[`, `]`, `{`, `}`, `.`, `*`, `?`, `+`, `|`, `^` and `$` are special symbols and have to be escaped with a backslash symbol in order to be treated as literal characters.

## PCRE (`grep -P`)

| Symbol         | Meaning                              |
| -------------- | ------------------------------------ |
| `\d` `\w` `\s` | digit, word char, whitespace         |
| `\D` `\W` `\S` | negations                            |
| `*?` `+?`      | lazy (non-greedy) quantifiers        |
| `(?=...)`      | lookahead                            |
| `(?<=...)`     | lookbehind                           |

```bash
echo "abc123" | grep -oP '\d+'               # 123
echo "price: 42 EUR" | grep -oP '\d+(?= EUR)' # 42
```

Tools: [grep](utils/grep.md), [sed](utils/sed.md), [awk](utils/awk.md).
