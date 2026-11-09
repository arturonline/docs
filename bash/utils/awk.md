# awk

`awk` processes text **line by line** (records), splitting each line into **fields** (`$1`, `$2`... `$0` is the whole line). Program structure: `pattern { action }`; a missing pattern matches every line, a missing action prints the line. Uses ERE regex (see [regex](../regex.md)).

```bash
awk [-F sep] [-v var=value] 'program' [file...]
```

Sample file used below (`emp.csv`):

```text
name,dept,salary
ana,dev,3000
bob,ops,2500
eva,dev,3500
```

## Built-in variables

| Variable   | Meaning                                         |
| ---------- | ----------------------------------------------- |
| `$0`       | whole line                                      |
| `$1..$n`   | fields                                          |
| `NF`       | number of fields (`$NF` = last field)           |
| `NR`       | line number (across all files)                  |
| `FNR`      | line number in the current file                 |
| `FS`       | input field separator (default: spaces/tabs); same as `-F` |
| `OFS`      | output field separator (default: space)         |
| `FILENAME` | current file name                               |

Print every line:

```bash
ls -l | awk '{print}'
ls -l | awk '{print $0}'
```

Print columns:

```bash
ls -l | awk '{print $1, $2}'          # print column 1 and 2 (separated by OFS)
ls -l | awk '{print $1, $2, $7}'
ls -l | awk '{print $1 " - " $2}'     # print column 1 dash column 2
echo "path/to/file.txt" | awk -F/ '{print $NF}'   # file.txt
```

Substitute a column with custom text:

```bash
ls -l | awk '{$2="hola"; print $1, $2}'
echo "one two three" | awk '{$2 = "hola"; print}'   # one hola three
```

Lines that contain "artur":

```bash
ls -l | awk '/artur/ {print $1}'
```

Lines that contains "artur" or "badenes":

```bash
ls -l | awk '/artur|badenes/ {print $1}'
```

## Field separator and conditions

```bash
awk -F, 'NR > 1 {print $1, $3}' emp.csv              # skip header
# ana 3000
# bob 2500
# eva 3500

awk -F, -v OFS=' | ' 'NR > 1 {print $1, $3}' emp.csv  # ana | 3000 ...
awk -F, '$2 == "dev" {print $1}' emp.csv             # ana, eva
awk -F, 'NR > 1 && $3 > 2800 {print $1}' emp.csv     # ana, eva
awk -F, '$1 ~ /^e/ {print $1}' emp.csv               # eva   (~ regex match, !~ no match)
awk -F, 'NR == 2' emp.csv                            # ana,dev,3000   (print line 2)
```

## BEGIN / END, sums and counters

```bash
awk -F, 'NR > 1 {sum += $3} END {print "total:", sum}' emp.csv
# total: 9000

awk -F, 'NR > 1 {sum += $3; n++} END {printf "avg: %.1f\n", sum / n}' emp.csv
# avg: 3000.0

awk -F, 'NR > 1 {by[$2] += $3} END {for (d in by) print d, by[d]}' emp.csv
# dev 6500
# ops 2500       (for-in order is not guaranteed; pipe to sort if needed)

awk 'BEGIN {print "start"} END {print NR " lines"}' emp.csv
# start
# 4 lines
```

## Shell variables

Pass them with `-v`, don't paste them inside the quotes:

```bash
min=3000
awk -F, -v min="$min" 'NR > 1 && $3 >= min {print $1}' emp.csv   # ana, eva
```

## printf and string functions

```bash
awk -F, 'NR > 1 {printf "%-5s %8.2f\n", $1, $3}' emp.csv
# ana    3000.00

echo "a-b-c" | awk '{gsub(/-/, "+"); print}'           # a+b+c   (sub() = first only)
echo "hello world" | awk '{print toupper($1), length($2)}'   # HELLO 5
awk -F, '{print substr($1, 1, 2)}' emp.csv             # na, an, bo, ev
echo "a:b:c" | awk '{n = split($0, p, ":"); print n, p[2]}'  # 3 b
```

## Handy one-liners

```bash
awk '!seen[$0]++' file              # remove duplicate lines keeping order
awk 'NF' file                       # remove empty lines
awk '{$1=$1; print}' file           # squeeze spaces: "  lots   of  space " → "lots of space"
awk 'END {print NR}' file           # count lines (like wc -l)
awk '{print NF}' file               # number of fields per line
awk 'length > 80' file              # lines longer than 80 chars
awk -F: '{print $1}' /etc/passwd    # user names
```
