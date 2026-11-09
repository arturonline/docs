# sed

`sed` (stream editor) reads its input line by line, applies commands and prints the result. Uses BRE by default, ERE with `-E` (see [regex](../regex.md)).

```bash
sed [options] commands [file-to-edit]
```

Sed sends its results to the screen by default:

```bash
sed '' some-file
cat some-file | sed ''
```

Sample file used below (`fruits.txt`):

```text
apple 3
Banana 12
cherry 7
apple pie 1
```

## Options

| Option         | Meaning                                                      |
| -------------- | ------------------------------------------------------------ |
| `-n`           | don't print lines automatically (use with `p`)               |
| `-E` (`-r`)    | extended regex: `( ) { } + ? \|` without backslashes         |
| `-i[SUFFIX]`   | edit the file in place (optionally keep a backup)            |
| `-e cmd`       | add a command (several `-e` allowed)                         |
| `-s`           | treat several files as separate (for `$`, line numbers)      |

## printing

```bash
sed 'p' some-file
```

`sed` automatically prints each line by default. With "p" command you get each line printed twice. By passing the `-n` option to `sed`, which suppresses the automatic printing, only the lines you print explicitly are shown.

```bash
sed -n 'p' some-file
```

## Ranges (addresses)

print the first line:

```bash
sed -n '1p' some-file
```

print five lines:

```bash
sed -n '1,5p' some-file
```

print line 1 and 4 more lines:

```bash
sed -n '1,+4p' some-file
```

print every other line (interval after ~ character, GNU):

```bash
sed -n '1~2p' some-file
```

print the last line:

```bash
sed -n '$p' fruits.txt     # apple pie 1
```

Lines matching a regex, or between two regexes:

```bash
sed -n '/Banana/p' fruits.txt            # Banana 12
sed -n '/Banana/,/cherry/p' fruits.txt   # Banana 12 / cherry 7
sed -n '/apple/!p' fruits.txt            # ! negates: lines without "apple"
```

Quit after line 2 (like `head -2`):

```bash
sed '2q' fruits.txt
```

## Deleting text

Delete every other line starting with the first:

```bash
sed '1~2d' fruits.txt
# Banana 12
# apple pie 1
```

```bash
sed '/Banana/d' fruits.txt     # delete lines matching
sed '/^$/d' some-file          # delete empty lines
sed '/^#/d' config             # delete comment lines
```

⚠ The `sed` command does not edit the source file by default, but you can change this behavior by passing the `-i` option, which means "perform edits in-place".

```bash
# Edit with redirect (never redirect to the same file: it gets truncated first)

sed '1~2d' some-file > other-file

# Edit with '-i'

sed -i '1~2d' some-file

# Edit in place keeping a backup (some-file.bak)

sed -i.bak '1~2d' some-file
```

⚠ macOS/BSD `sed` requires an argument after `-i`: `sed -i '' 's/a/b/' file`. `-i.bak` works on both.

## Substituting text

```bash
s/old/new/flags
```

`sed` can search for text patterns using regular expressions, and then replace the found text with something else.

>⚠ `sed` replaces patterns, not words: `s/on/X/` also changes "m**on**ey". Use `\bon\b` or `\<on\>` (GNU) for whole words.

Example:

Replace first match "on" for "forward"

```bash
sed 's/on/forward/' some-file
```

Replace the 2nd instance of "on" for "forward"

```bash
sed 's/on/forward/2' some-file
echo "on and on and on" | sed 's/on/X/2'    # on and X and on
```

Replace every instance of "on" for "forward"

```bash
sed 's/on/forward/g' some-file
echo "on and on and on" | sed 's/on/X/g'    # X and X and X
```

💡 If you only want to see which lines were substituted, use the `-n` option with the `p` flag: `sed -n 's/on/forward/gp' some-file`.

To ignore case, you can pass the "I" flag (GNU; lowercase `i` also works in GNU sed).

```bash
sed 's/on/forward/I' some-file
```

Use another delimiter when the pattern contains `/`:

```bash
echo /usr/local/bin | sed 's|/usr/local|/opt|'    # /opt/bin
```

Several commands:

```bash
sed -e 's/apple/A/' -e 's/cherry/C/' fruits.txt
sed 's/apple/A/; s/cherry/C/' fruits.txt          # same
```

Use shell variables with double quotes (and beware of `/` in their value):

```bash
old=apple new=pear
sed "s/$old/$new/g" fruits.txt
```

Trim spaces:

```bash
sed 's/^[[:space:]]*//; s/[[:space:]]*$//' some-file
```

## Referencing matched text

The `&` character represent the matched text (^.*at) in the replacement string.

```bash
sed 's/^.*at/(&)/' some-file
echo "cat hat" | sed 's/[ch]at/(&)/g'     # (cat) (hat)
```

A more flexible way of referencing matched text is to use escaped parentheses to group sections of matched text.

Every group of search text marked with parentheses can be referenced by an escaped reference number. For instance, the first parentheses group can be referenced with \1, the second with \2 and so on.

In this example, we’ll switch the first two words of each line:

```bash
sed 's/\([a-zA-Z0-9][a-zA-Z0-9]*\) \([a-zA-Z0-9][a-zA-Z0-9]*\)/\2 \1/' song.txt

# Same with -E (no backslashes on the groups):
echo "one two three" | sed -E 's/([a-z]+) ([a-z]+)/\2 \1/'    # two one three
```

## Insert, append, change, transliterate

```bash
sed '2i\--inserted--' fruits.txt     # insert a line before line 2
sed '1a\--appended--' fruits.txt     # append a line after line 1
sed '1c\--changed--' fruits.txt      # replace line 1
sed '/^\[db\]/a\host=localhost' config.ini   # append after a matching line
echo hello | sed 'y/abcdefghijklmnopqrstuvwxyz/ABCDEFGHIJKLMNOPQRSTUVWXYZ/'   # HELLO
```
