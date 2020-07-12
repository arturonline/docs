# Snippets

## Read input from console

### Using scanf

`Scanf` scans text read from standard input, storing successive **space-separated values** into successive arguments as **determined by the format**. It returns the number of items successfully scanned. If that is less than the number of arguments, err will report why. Newlines in the input must match newlines in the format. The one exception: the verb %c always scans the next rune in the input, even if it is a space (or tab etc.) or newline.

Read integer:

```go
var i int
fmt.Scanf("%d", &i) // 1
print(i)
// 1
```

Read string:

```go
var str string
fmt.Scanf("%s", &str) // hola
print(str)
// hola
```

### Using scan

`Scan` scans text read from standard input, storing successive **space-separated** values into successive arguments. **Newlines count as space**. It returns the number of items successfully scanned. If that is less than the number of arguments, err will report why.

Read integer:

```go
var i int
fmt.Scan(&i)
```

Read string:

```go
var str string
fmt.Scan(&str)
```

## Using scanln

`scanln` is similar to `Scan`, but stops scanning at a newline and after the final item there must be a newline or EOF.

Read string:

```go
var input string
fmt.Scanln(&input)
```

### Using bufio

Read int:

```go
scanner := bufio.NewScanner(os.Stdin)

fmt.Println("Give first number: ")
scanner.Scan()
result, _ := strconv.Atoi(scanner.Text()

fmt.Println("Result: ", result)
```

Read string:

```go
reader := bufio.NewReader(os.Stdin)
text, err := reader.ReadString('\n')
```

```go
fmt.Println("Enter a name: ") // artur
scanner := bufio.NewScanner(os.Stdin)
scanner.Scan()
value := scanner.Text()
fmt.Println(value) // artur
```
