# Grep

grep or _Global Regular Expression Print_ is the main search program on Unix-like systems which can search for any type of string on any file or list of files or even output of any command.

It uses Posix Basic Regular Expressions. In Basic Regular Expressions (BRE), meta-characters like: `'{','}','(',')','|','+','?'` need to be escaped if they are to be treated as special characters.

## Syntax

`grep [options] [regexp] [filename]`

> ⚠ Due to shell behaviour, you can also enclose the regex in double quotes — in this case, you can use environment variables in the regex, and the shell will substitute them before calling Grep. This can be very useful, depending on what you’re trying to do — or it could turn out to be a nuisance. Remember the difference in behaviour.

## Options

`-r` -> recursive search
`-n` -> show the number of the line of the coincidence
`-i` -> case insensitive search
`-v` -> inverse coincidence
`-w` -> match the whole word
`-c` -> count of lines matching the coincidence
`-l` -> which prints out only the names of files that do contain matches for your search.

## Egrep Command

**Egrep** or **grep -E** is another version of grep or the Extended grep. This version of grep is efficient and fast when it comes to searching for a regular expression pattern as it treats meta-characters as is and doesn’t substitute them as strings like in grep, and hence you are freed from the burden of escaping them as in grep. It uses ERE or the Extended Regular Expression set.

In case of egrep, even if you do not escape the meta-characters, it would treat them as special characters and substitute them for their special meaning instead of treating them as part of string.
