# Loops

⚡ [Source 1](http://linuxcommand.org/lc3_wss0110.php)<br>⚡ [Source 2](http://linuxcommand.org/lc3_wss0130.php)

See also: [flow control](flow_control.md), [conditionals](conditionals.md), [wildcards](wildcards.md).

## While

Runs while the condition is true (exit status 0).

```bash
number=0
while [ "$number" -lt 3 ]; do
    echo "Number = $number"
    number=$((number + 1))
done
# Number = 0
# Number = 1
# Number = 2
```

Infinite loop:

```bash
while true; do
    ping -c1 example.com >/dev/null && break
    sleep 5
done
```

## until

Runs until the condition becomes true.

```bash
n=0
until (( n >= 3 )); do
    printf '%s ' "$n"
    (( ++n ))
done
# 0 1 2
```

## for

```bash
for i in word1 word2 word3; do
    echo "$i"
done
```

Ranges and C-style:

```bash
for i in {1..3}; do printf '%s ' "$i"; done          # 1 2 3
for i in {0..10..5}; do printf '%s ' "$i"; done      # 0 5 10   (step)
for ((i = 0; i < 3; i++)); do printf '%s ' "$i"; done # 0 1 2
for i in $(seq 1 "$n"); do ...; done                 # when the limit is a variable ({1..$n} does NOT work)
```

Arrays (always quote `"${arr[@]}"`):

```bash
fruits=("green apple" banana)
for f in "${fruits[@]}"; do echo "[$f]"; done
# [green apple]
# [banana]

for i in "${!fruits[@]}"; do echo "$i=${fruits[i]}"; done   # iterate indexes
# 0=green apple
# 1=banana

declare -A ages=([ana]=30 [bob]=25)
for k in "${!ages[@]}"; do echo "$k ${ages[$k]}"; done      # order is not guaranteed
```

Files: use globs, never `$(ls)`:

```bash
for f in *.log; do
    [[ -e $f ]] || continue          # no match → the loop gets the literal "*.log"
    gzip -- "$f"
done

shopt -s nullglob                    # alternative: a pattern with no matches expands to nothing
for f in *.log; do gzip -- "$f"; done

shopt -s globstar                    # ** = recursive
for f in **/*.md; do echo "$f"; done
```

## Reading a file line by line

```bash
while IFS= read -r line; do
    echo "<$line>"
done < input.txt
```

- `IFS=` keeps leading/trailing spaces, `-r` keeps backslashes.
- Last line without trailing newline: `while IFS= read -r line || [[ -n $line ]]; do`.
- Split fields: `while IFS=, read -r name age; do ...; done < data.csv`.

⚠ A pipe runs the loop in a **subshell**, so variables set inside are lost. Use process substitution (or `shopt -s lastpipe` in scripts):

```bash
count=0
printf '1\n2\n' | while read -r l; do ((count++)); done
echo "$count"     # 0

count=0
while read -r l; do ((count++)); done < <(printf '1\n2\n')
echo "$count"     # 2
```

Load all lines into an array (bash 4+):

```bash
mapfile -t lines < input.txt       # readarray is a synonym
echo "${#lines[@]}"                # number of lines
```

## break and continue

```bash
for i in 1 2 3 4 5; do
    (( i == 2 )) && continue       # skip to next iteration
    (( i == 4 )) && break          # exit the loop
    echo "$i"
done
# 1
# 3
```

`break N` / `continue N` act on the N-th enclosing loop:

```bash
for i in 1 2; do
    for j in a b; do
        [[ $j == b ]] && continue 2
        echo "$i$j"
    done
done
# 1a
# 2a
```

## select

Menu loop, see [flow control](flow_control.md#select-simple-menus).
