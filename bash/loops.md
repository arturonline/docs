# Loops

>⚡ [Source 1](http://linuxcommand.org/lc3_wss0110.php)<br>⚡ [Source 2](http://linuxcommand.org/lc3_wss0130.php)

## While

```bash
number=0
while [ "$number" -lt 10 ]; do
    echo "Number = $number"
    number=$((number + 1))
done
```

## until

```bash
number=0
until [ "$number" -ge 10 ]; do
    echo "Number = $number"
    number=$((number + 1))
done
```

## for

```bash
for i in word1 word2 word3; do
    echo $i
done
```