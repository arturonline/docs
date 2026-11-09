# Grep

grep or _Global Regular Expression Print_ is the main search program on Unix-like systems which can search for any type of string on any file or list of files or even output of any command. It prints the lines that match.

By default it uses POSIX Basic Regular Expressions. In Basic Regular Expressions (BRE), meta-characters like: `'{','}','(',')','|','+','?'` need to be escaped (`\{`, `\|`...) to be treated as special characters; otherwise they match literally. See [regex](../regex.md).

## Syntax

`grep [options] [regexp] [filename...]`

Quote the regex with **single quotes** so the shell doesn't expand `*`, `$`, `\`...

> Due to shell behaviour, you can also enclose the regex in double quotes — in this case, you can use environment variables in the regex, and the shell will substitute them before calling Grep. This can be very useful, depending on what you’re trying to do — or it could turn out to be a nuisance. Remember the difference in behaviour.

Exit status: `0` a line matched, `1` no match, `2` error. Useful in `if`:

```bash
if grep -q "ERROR" app.log; then echo "there are errors"; fi
```

## Options

| Option                  | Description                                                                       |
| ----------------------- | --------------------------------------------------------------------------------- |
| `-r` / `-R`             | recursive search (`-R` also follows symlinks)                                     |
| `-n`                    | show the number of the line of the coincidence                                    |
| `-i`                    | case insensitive search                                                           |
| `-v`                    | inverse coincidence (lines that do **not** match)                                 |
| `-w`                    | match the whole word                                                              |
| `-x`                    | match the whole line                                                              |
| `-c`                    | count of lines matching the coincidence                                           |
| `-l`                    | prints out only the names of files that do contain matches for your search        |
| `-L`                    | names of files **without** matches                                                |
| `-o`                    | print only the matched part, one per line                                         |
| `-q`                    | quiet: no output, only exit status                                                |
| `-s`                    | suppress errors about missing/unreadable files                                    |
| `-h` / `-H`             | hide / show the file name                                                         |
| `-m N`                  | stop after N matches                                                              |
| `-A N` / `-B N` / `-C N`| show N lines After / Before / around (Context) each match                         |
| `-e pat`                | pattern (repeatable; useful if it starts with `-`)                                |
| `-f file`               | read patterns from a file, one per line                                           |
| `-E`                    | extended regex (ERE)                                                              |
| `-F`                    | fixed string, no regex (fast, no escaping needed)                                 |
| `-P`                    | Perl regex: `\d`, `\w`, lookarounds (GNU grep)                                    |
| `--include=GLOB`        | only search files matching (with `-r`), e.g. `--include='*.js'`                   |
| `--exclude=GLOB`, `--exclude-dir=DIR` | skip files / directories (`--exclude-dir=node_modules`)              |
| `--color=auto`          | highlight matches                                                                 |

## Examples

Sample file (`fruits.txt`):

```text
apple 3
Banana 12
cherry 7
apple pie 1
```

```bash
grep apple fruits.txt             # apple 3 / apple pie 1
grep -i banana fruits.txt         # Banana 12
grep -c apple fruits.txt          # 2
grep -n cherry fruits.txt         # 3:cherry 7
grep -v apple fruits.txt          # Banana 12 / cherry 7
grep -w pie fruits.txt            # apple pie 1
grep -x 'apple 3' fruits.txt      # apple 3
grep -m1 apple fruits.txt         # apple 3
grep -A1 Banana fruits.txt        # Banana 12 / cherry 7
grep -o '[0-9]\+' fruits.txt      # 3 / 12 / 7 / 1
grep -e apple -e cherry fruits.txt
grep -F 'a.b*' file               # literal "a.b*"
grep -P '\d{2}' fruits.txt        # Banana 12
```

Recursive search in a project:

```bash
grep -rn 'TODO' src --include='*.js'           # src/a.js:1:TODO fix
grep -rl 'TODO' .                              # only file names
grep -rn 'password' . --exclude-dir={.git,node_modules}
```

Common pipes:

```bash
ps aux | grep '[n]ginx'          # the [n] trick avoids matching the grep process itself
history | grep -i docker
grep -v '^\s*#' config | grep -v '^$'   # config without comments or empty lines
```

💡 For big codebases, `rg` (ripgrep) and `git grep` are faster and respect `.gitignore`.

## Egrep Command

**Egrep** or **grep -E** is another version of grep or the Extended grep. It uses ERE or the Extended Regular Expression set, so meta-characters (`+ ? | ( ) { }`) are special without escaping, and you are freed from the burden of escaping them as in grep.

In case of `egrep`, even if you do not escape the meta-characters, it would treat them as special characters and substitute them for their special meaning instead of treating them as part of string.

```bash
grep -E '[0-9]{2}' fruits.txt          # Banana 12
grep -E '^(apple|cherry) ' fruits.txt  # apple 3 / cherry 7 / apple pie 1
grep 'apple\|cherry' fruits.txt        # same idea in GNU BRE
```

⚠ `egrep` and `fgrep` are deprecated (GNU grep 3.8+ prints a warning). Use `grep -E` and `grep -F`.
