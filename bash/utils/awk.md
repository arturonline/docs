# awk

Print every line:

```sh
    ls -l | awk '{print}'
    ls -l | awk '{print $0}'
```

Print columns:

```sh
    ls -l | awk '{print $1, $2}' # print column 1 and 2
    ls -l | awk '{print $1, $2, $7}'
    ls -l | awk '{print $1 " - " $2}' # print column 1 dash column 2
```

Substitute a column with custom text:

```sh
    ls -l | awk '{$2="hola", print $1, $2}'
```

Lines that contain "artur":

```sh
    ls -l | awk '/artur/ {print $1}'
```

Lines that contains "artur" or "badenes":

```sh
    ls -l | awk '/artur|badenes/ {print $1}'
```
