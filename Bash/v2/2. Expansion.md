# Expansion

In bash you have to spell out every single file name or program perfectly. But, passing information to commands as arguments so explicitly is very limiting.

To automate this process we can use forms of expansion.

## Pathname Expansion

```bash
cd ~/Downloads
rm -v *
$ removed '05 Between Angels and Insects.ogg'
$ removed '07 Wake Up.ogg'
ls
$
```

**bash** notices that you have put a pathname pattern on the command line in the place where it would expect to see arguments. It has then taken this pathname pattern, and went looking on the file system for every pathname that it could find which matches this pattern of ours.

> It is important to understand that while we see an apparent `*` argument in our code to rm, we are not actually passing `*` to `rm`. Expansion is always performed before actually running the command. As far as `rm` knows, it simply receives a `-v` argument followed by the exact and full name of every single file in the directory.

## globs

Bash can perform all sorts of pathname expansions for us. To perform a pathname expansion, we simply write a syntactical glob pattern in the place where we want to expand pathnames. A glob is the name of the type of pattern supported by the bash shell. Here are the various basic glob patterns supported by the bash shell:

| Glob              | Meaning                                                    |
| ----------------- | ---------------------------------------------------------- |
| `+`               | matches any kind of text, even no text at all              |
| `?`               | matches any one single character                           |
| `[characters]`    | matches a single, character, only it it's in the given set |
| `[[:classname:]]` | matches a various kinds of character classes               |

> Supported character classes include: alnum, alpha, ascii, blank, cntrl, digit, graph, lower, print, punct, space, upper, word, xdigit

Examples:

```bash
$ ls # Without arguments, ls simply lists the full contents of a directory.
myscript.txt
mybudget.xsl
hello.txt
05 Between Angels and Insects.ogg
07 Wake Up.ogg

$ ls * # While the effect is the same, this command actually enumerates every single file
myscript.txtin the directory to the ls in its arguments!
mybudget.xsl
hello.txt
05 Between Angels and Insects.ogg
07 Wake Up.ogg

$ ls *.txt # When we include the literal string .txt, the only pathnames that still match the pattern
myscript.txt # are those that start with any kind of text and end with the literal string .txt.
hello.txt

$ ls 0?' '*.ogg # Here we're combining patterns, looking for any pathname start starts with a 0,
05 Between Angels and Insects.ogg # followed by any single character, followed by a literal space, ending in .ogg.
07 Wake Up.ogg

$ ls [0-9]* # In a character set, we can use - to indicate a range of characters.  This will match
05 Between Angels and Insects.ogg # a pathname starting with one character between 0 and 9 followed by any other text.
07 Wake Up.ogg

$ ls [[:digit:]][[:digit:]]* # Character classes are really nice because they speak for us: they tell us exactly
05 Between Angels and Insects.ogg # what our intent here is.  We want any pathname that start with two digits.
07 Wake Up.ogg

$ ls [[:digit:]][[:digit:]] # Your pattern needs to be complete!  None of our filenames is only just a single digit.
$
```

### subdirectories

It is also important to understand that these globs will never jump into subdirectories. They only match against file names in their own directory. If we want a glob to go looking at the pathnames in a different directory, we need to explicitly tell it with a literal pathname:

```bash
$ ls ~/Downloads/*.txt # Enumerate all pathnames in ~/Downloads that end with .txt.
/Users/lhunath/Downloads/myscript.txt
/Users/lhunath/Downloads/hello.txt

$ ls ~/*/hello.txt # Globs can even search through many directories!  Here bash will search
/Users/lhunath/Documents/hello.txt # through all directories in our home directory for a file that's called hello.txt.
/Users/lhunath/Downloads/hello.txt
```

## Advanced globs

bash has also built support in for more advanced glob patterns. These globs are called: extended globs. By default, support for them is disabled, but we can easily enable it in our current shell with the command:

```bash
shopt -s extglob
```

Once extended globs are enabled, the above table of glob pattern operators is extended with the following additional operators:

Extended Glob | Meaning
-------------|----------------
`+(pattern[ | pattern ... ])` | Matches when any of the patterns in the list appears, once or many times over. Reads: *at least one of ....*
`*(pattern[ | pattern ... ])` | Matches when any of the patterns in the list appears, once, not at all, or many times over. Reads: *however many of ....*
`?(pattern[ | pattern ... ])` | Matches when any of the patterns in the list appears, once or not at all. Reads: maybe one of ....
`@(pattern[ | pattern ... ])` | Matches when any of the patterns in the list appears just once. Reads: *one of ....*
`!(pattern[ | pattern ... ])` | Matches only when none of the patterns in the list appear. Reads: *none of ....*

```bash
$ ls +([:digit:])' '*.ogg # Filenames that start with one or more digits.
05 Between Angels and Insects.ogg
07 Wake Up.ogg

$ ls *.jp?(e)g # Filenames that end either in .jpg or .jpeg.
img_88751.jpg
igpd_45qr.jpeg

$ ls *.@(jpg|jpeg) # Same thing, perhaps written more clearly!
img_88751.jpg
igpd_45qr.jpeg

$ ls !(my*).txt # All the .txt files that do not begin with my.
hello.txt
```

Extended glob patterns can be extremely useful at times, but they can also be confusing and misleading.

```bash
$ ls !(my)*.txt # Can you guess why this one matches myscript.txt?
myscript.txt
hello.txt
```

Let's focus on the last example: why does `!(my)*.txt` expand the pathname `myscript.txt?` Isn't `!(my)` supposed to only match when the pathname does not have a my in this position? You are correct, it is! And yet, bash expands a pathname that begins with `my!`

The answer here is that bash will happily match this part of the pattern against the `m` at the beginning (which is not the same as my) or even empty space at the start of the filename. This means that in order for the pathname to still be eligible for expansion, the rest of our pattern needs to match against the remainder of our pathname. And it so happens that we have a `*` glob right after the !(my) glob which will happily match the entirety of the filename. In this situation, the !(my) part matches against the m character in the beginning of the name, the `*` matches against the `yscript` part, and the `.txt` suffix of the pattern matches against the trailing `.txt` of our pathname. The pattern matches the name, so the name is expanded!

When we include the `*` inside the `!()` pattern, this no longer works and the match fails against this pathname:

```bash
$ ls !(my)*.txt
myscript.txt
hello.txt

$ ls !(my*).txt
hello.txt
```

## Command Substitution

Command Substitution is an extremely popular method of expanding data into command arguments. With Command Substitution, we effectively write a command within a command, and we ask bash to expand the inner command into its output and use that output as argument data for the main command:

```bash
echo 'Hello world.' > hello.txt
cat hello.txt
$ Hello world.
echo "The file <hello.txt> contains: $(cat hello.txt)"
$ The file <hello.txt> contains: Hello world.
```

Command Substitution essentially expands the value of a command that was executed in a subshell. As such, the syntax is a combination of the value-expansion prefix `$` followed by the subshell to expand: `(...)`. A subshell is essentially a small new bash process that is used to run a command while the main bash shell waits for the result.