# sed

`sed [options] commands [file-to-edit]`

Sed sends its results to the screen by default:

```bash
sed '' some-file
cat some-file | sed ''
```

## printing

```bash
sed 'p' some-file
```

`sed` automatically prints each line by default. With "p" command you get each line printed twice. By passing the `-n` option to `sed`, which suppressed the automatic printing.

```bash
sed -n 'p' some-file
```

## Ranges

```bash
# print the first line

sed -n '1p' some-file
```

```bash
# print five lines

sed -n '1,5p' some file
```

```bash
# print line 1 and 4 more lines

sed -n '1,+4p' some-file
```

```bash
# print every other line (interval after ~ character)

sed -n '1~2p' some-file
```

## Deleting text

```bash
# Delete every other line starting with the first

sed '1~2d' some-file
```

⚠ The `sed` command does not edit the source file by default, but you can change this behavior by passing the `-i` option, which means "perform edits in-place".

```bash
# Edit with redirect

sed '1~2d' some-file > other-file

# Edit with '-i'

sed -i '1~2d' some-file
```

## Substituting text

```bash
s/old/new
```

`sed` can search for text patterns using regular expressions, and then replace the found text with something else.

⚠ `sed` replaces patterns, not words.

Example:

```bash
# Replace first match "on" for "forward"

sed 's/on/forward/' some-file
```

```bash
# Replace the 2nd instance of "on" for "forward"

sed 's/on/forward/2' some-file
```

```bash
# Replace every instance of "on" for "forward"

sed 's/on/forward/g' some-file
```

💡 If you only want to see which lines were substituted, use the `-n` option to suppress automatic printing.

```bash
# To ignore case, you can pass the "i" flag.

sed 's/on/forward/i' some-file
```

## Referencing matched text

```bash
# The `&` character represent the matched text (^.*at) in the replacement string.

sed 's/^.*at/(&)/' some-file
```

A more flexible way of referencing matched text is to use escaped parentheses to group sections of matched text.

Every group of search text marked with parentheses can be referenced by an escaped reference number. For instance, the first parentheses group can be referenced with \1, the second with \2 and so on.

In this example, we’ll switch the first two words of each line:

```bash
sed 's/\([a-zA-Z0-9][a-zA-Z0-9]*\) \([a-zA-Z0-9][a-zA-Z0-9]*\)/\2 \1/' song.txt
```