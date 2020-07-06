# awk

Print every line:

```bash
ls -l | awk '{print}'
ls -l | awk '{print $0}'
```

Print columns:

```bash
ls -l | awk '{print $1, $2}' # print column 1 and 2
ls -l | awk '{print $1, $2, $7}'
ls -l | awk '{print $1 " - " $2}' # print column 1 dash column 2
```

Substitute a column with custom text:

```bash
ls -l | awk '{$2="hola", print $1, $2}'
```

Lines that contain "artur":

```bash
ls -l | awk '/artur/ {print $1}'
```

Lines that contains "artur" or "badenes":

```bash
ls -l | awk '/artur|badenes/ {print $1}'
```