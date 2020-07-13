# Loops

⚡ [Source 1](http://linuxcommand.org/lc3_wss0110.php)<br>⚡ [Source 2](http://linuxcommand.org/lc3_wss0130.php)

## While

```sh
    number=0
    while [ "$number" -lt 10 ]; do
        echo "Number = $number"
        number=$((number + 1))
    done
```

## until

```sh
    number=0
    until [ "$number" -ge 10 ]; do
        echo "Number = $number"
        number=$((number + 1))
    done
```

## for

```sh
    for i in word1 word2 word3; do
        echo $i
    done
```
