# Files

Open -> Read/Write -> Close

> See also: [Filesystem](Filesystem.md) (directories, permissions, uploads).

## Open

```php
$f = fopen(string $filename, string $mode); // resource|false
```

> $f <- File handler

```php
$f = fopen('samplefile.txt', 'r');
if ($f === false) {
    exit('Cannot open file');
}
```

### Modos

| mode | description | pointer   | truncates | creates if missing | if file exists |
| ---- | ----------- | --------- | --------- | ------------------ | -------------- |
| r    | read-only   | beginning | no        | no (fails)         | ok             |
| w    | write-only  | beginning | **yes**   | yes                | ok             |
| a    | write-only (append) | end | no     | yes                | ok             |
| x    | write-only  | beginning | no        | yes                | **fails**      |
| c    | write-only  | beginning | no        | yes                | ok             |

Other modes:

| mode | description                                              |
| ---- | -------------------------------------------------------- |
| r+   | like 'r' but the file is opened for reading and writing  |
| w+   | like 'w' but the file is opened for reading and writing  |
| a+   | like 'a' but the file is opened for reading and writing  |
| x+   | like 'x' but the file is created for reading and writing |
| c+   | like 'c' but the file is opened for reading and writing  |

> Add `b` (e.g. `rb`, `wb`) for binary files: on Windows it prevents line ending translation.

Example:

```php
if (!file_exists("samplefile.txt")) {
    $f = fopen("samplefile.txt", "w+");
} else {
    $f = fopen("samplefile.txt", "a+");
}
// The same can be done with just: $f = fopen("samplefile.txt", "a+");
```

- If 'samplefile.txt' doesn't exist, it will be created.
- If the file exists, it will be opened for reading and writing (writes go to the end).
- Relative paths are resolved against the current working directory (`getcwd()`), not the script's folder. Use `__DIR__ . '/samplefile.txt'` to be safe.

## Read

### #1: Read all in a single operation

```txt
// samplefile.txt
Line 1
Line 2
Line 3
Line 4
Line 5
```

- `readfile()`
Reads a file and writes it to the output buffer. Returns the number of bytes read from the file on success, or false on failure.

    ```php
    readfile("samplefile.txt");

    // Line 1
    // Line 2
    // ...       (in a browser the newlines collapse: Line 1 Line 2 Line 3 Line 4 Line 5)
    ```

- `file_get_contents()`
Reads an entire file into a string.

    ```php
    $content = file_get_contents("samplefile.txt"); // string|false
    echo nl2br(htmlspecialchars($content));          // safe HTML output keeping the line breaks

    // Line 1<br />
    // Line 2<br /> ...
    ```

- `file()`
Reads an entire file into an array (one element per line, **including** the `\n`).

    ```php
    $array = file("samplefile.txt");
    print_r($array);

    // Array ( [0] => Line 1\n [1] => Line 2\n [2] => Line 3\n [3] => Line 4\n [4] => Line 5\n )
    ```

    ```php
    $array = file("samplefile.txt", FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    print_r($array);

    // Array ( [0] => Line 1 [1] => Line 2 [2] => Line 3 [3] => Line 4 [4] => Line 5 )
    ```

### #2: Read chunks

> ⚠️ Don't use `while (!feof($f))`: `feof()` is only true *after* a read fails, so the loop runs one extra time with `false`. Loop on the read result instead.

#### Reading a char at a time

```php
$f = fopen('samplefile.txt', 'r');

while (($char = fgetc($f)) !== false) {
    echo $char . "-";
}
fclose($f);

// L-i-n-e- -1-
// -L-i-n-e- -2- ...   (the newline is also a char)
```

#### Reading a line at a time

```php
$f = fopen("samplefile.txt", "r");

while (($line = fgets($f)) !== false) {
    echo rtrim($line) . "<br>";
}
fclose($f);
// Line 1<br>Line 2<br>Line 3<br>Line 4<br>Line 5<br>
```

Memory-friendly alternatives for big files:

```php
// SplFileObject (iterable)
foreach (new SplFileObject('samplefile.txt') as $i => $line) {
    if ($line === '') continue;     // last empty line
    echo "$i:" . rtrim($line) . ' ';
}
// 0:Line 1 1:Line 2 2:Line 3 3:Line 4 4:Line 5

// Generator: reads one line at a time and always closes the file
function readLines(string $path): Generator {
    $h = fopen($path, 'r');
    try {
        while (($line = fgets($h)) !== false) {
            yield rtrim($line, "\r\n");
        }
    } finally {
        fclose($h);
    }
}

foreach (readLines('samplefile.txt') as $line) {
    echo strtoupper($line) . ',';
}
// LINE 1,LINE 2,LINE 3,LINE 4,LINE 5,
```

#### Read a certain number of bytes

```php
$f = fopen('samplefile.txt', 'r');
echo fread($f, 6);  // Line 1
echo ftell($f);     // 6 (current position)

// read the whole file:
rewind($f);
$content = fread($f, filesize('samplefile.txt'));
```

#### Read a CSV File

`fgetcsv(resource $stream, ?int $length = null, string $separator = ",", string $enclosure = "\"", string $escape = "\\"): array|false`

- `$length`: `null`/0 = no limit (whole line)
- by default the separator is comma ','
- `$enclosure`: char that surrounds the columns (ex `"artur","ana"`)
- ⚠️ PHP 8.4 deprecates relying on the default `$escape`: pass it explicitly (`''` is recommended, RFC 4180 compliant).

Example:

```php
// agenda.txt
// "John","Smith","john@gmail.com","6650403234"
// "Martha","Ford","martha@gmail.com","65345235"

$file = fopen("agenda.txt", "r");
while (($data = fgetcsv($file, null, ',', '"', '')) !== false) {
    print_r($data);
}
fclose($file);

// Array ( [0] => John [1] => Smith [2] => john@gmail.com [3] => 6650403234 )
// Array ( [0] => Martha [1] => Ford [2] => martha@gmail.com [3] => 65345235 )
```

## Write

```php
// fwrite(resource $stream, string $data): int|false  (bytes written)
$f = fopen('out.txt', 'w');
fwrite($f, "Hello" . PHP_EOL);
fclose($f);

// One-liners
$bytes = file_put_contents('out.txt', "Hello" . PHP_EOL);                 // overwrite
file_put_contents('out.txt', "World" . PHP_EOL, FILE_APPEND | LOCK_EX);   // append with exclusive lock
var_dump($bytes);                    // int(7) on Windows ("\r\n"), int(6) on Linux
echo file_get_contents('out.txt');
// Hello
// World
```

>⚠️ **PHP_EOL** The correct 'End Of Line' symbol for this platform (`"\r\n"` on Windows, `"\n"` on Linux).

Write CSV (handles quotes and separators for you):

```php
$f = fopen('people.csv', 'w');
fputcsv($f, ['Ana', 'O"Neil', 'x y'], ',', '"', '');
fclose($f);
// Ana,"O""Neil","x y"
```

JSON files:

```php
file_put_contents('data.json', json_encode(['name' => 'Ana', 'tags' => ['a', 'b']], JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));

$data = json_decode(file_get_contents('data.json'), true, flags: JSON_THROW_ON_ERROR);
echo $data['tags'][1]; // b
```

### Locking

When several requests may write at the same time:

```php
$f = fopen('counter.txt', 'c+');
if (flock($f, LOCK_EX)) {          // exclusive lock (waits)
    $count = (int) stream_get_contents($f) + 1;
    ftruncate($f, 0);
    rewind($f);
    fwrite($f, (string) $count);
    fflush($f);
    flock($f, LOCK_UN);            // release
}
fclose($f);
```

## Close

```php
fclose($f);
```

>⚠️ `fflush(resource $stream): bool`<br>
>This function forces a write of all buffered output to the resource pointed to by the file stream.

## File Pointers

- `rewind($f);` → go to the beginning
- `ftell($f);` → current position
- `fseek($f, 0);` → go to the beginning
- `fseek($f, 25);` → byte 25
- `fseek($f, 25, SEEK_CUR);` → 25 bytes forward from the current position
- `fseek($f, -25, SEEK_END);` → 25 bytes before the end

```php
$f = fopen('samplefile.txt', 'r');
fseek($f, -7, SEEK_END);
echo fgets($f); // Line 5
fclose($f);
```
