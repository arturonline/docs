# Files

Open -> Read/Write -> Close

## Open

```php
$f = fopen(filename, mode)
```

> $f <- File handler

### Modos

| mode | description | pointer   | overwrite |
| ---- | ----------- | --------- | --------- |
| r    | read-only   | beginning | no        |
| w    | write-only  | beginning | yes       |
| x    | write-only  | beginning | no        |
| a    | Append      | end       | no        |
| c    | append      | beginning | no        |

Other modes:

| mode | description                                              |
| ---- | -------------------------------------------------------- |
| r+   | like 'r' but the file is opened for reading and writing  |
| w+   | like 'w' but the file is opened for reading and writing  |
| a+   | like 'a' but the file is opened for reading and writing  |
| x+   | like 'x' but the file is created for reading and writing |
| c+   | like 'c' but the file is opened for reading and writing  |

Example:

```php
if (!file_exists("samplefile.txt")) {
      $f = fopen("samplefile.txt", "w+");
}
else {
      $f = fopen("samplefile.txt", "a+");
}
```

- If 'samplefile.txt' doesn't exist, it will be created.
- If the file exists, it will be opened for reading and writing
- If a path is not provided, the file will be created (or sought) in the same folder where the script is.

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

    // $ Line 1 Line 2 Line 3 Line 4 Line 5
    ```

- `file_get_contents()`
Reads an entire file into a string.

    ```php
    // file_get_contents()
    echo file_get_contents("samplefile.txt");

    // $  Line 1 Line 2 Line 3 Line 4 Line 5
    ```

- `file()`
Reads an entire file into an array.

    ```php
    $array = file("samplefile.txt");
    print_r($array);

    // $ Array([0] => Line 0 [1] => Line 1 [2] => Line 2 [3] => Line 3 [4] => Line 4 [5] => Line 5 [6] => [7] =>)
    ```

    ```php
    $array = file("samplefile.txt", FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    print_r($array);

    // $ Array([0] => Line 0 [1] => Line 1 [2] => Line 2 [3] => Line 3 [4] => Line 4 [5] => Line 5)
    ```

### #2: Read chunks

#### Reading a char at a time

```php
$f = fopen('texto.txt', 'r');

while(!feof($f)) {
    $char = fgetc($f);
    echo $char . "-";
}

// L-i-n-e- -1- -L-i-n-e- -2- -L-i-n-e- -3- -L-i-n-e- -4- -L-i-n-e- -5- - --
```

#### Reading only a line

```php
$f = fopen("samplefile.txt", "r");

while (!feof($f)) {
      $line=fgets($f);
      echo $line . "<br>";
}
// Line 1
// Line 2
// Line 3
// Line 4
// Line 5 
```

#### Read a certain number of bytes

```php
// read the whole file:
$content = fread($f, filesize(filename));
```

#### Read a CSV File

- by default the length is 0 (end of line)
- by default the delimiter is comma ','
- use `enclosurechar` if every column is surronded (ex "artur", "ana");

```php
$f = fopen(filename, r);
fgetcsv(file_handler, length, delimiter, enclosurechar);
```

Example:

```php
// agenda.txt
// "John","Smith","john@gmail.com","6650403234"
// "Martha","Ford","martha@gmail.com","65345235"
// "David","Garcia","dgarcia@gmail.com","69823422"

$file = fopen("agenda.txt","r");
while (!feof($file)) {
      $data=fgetcsv($file,0,',','"');
      print_r($data);
}

// Array ( [0] => John [1] => Smith [2] => john@gmail.com [3] => 6650403234 )
// Array ( [0] => Martha [1] => Ford [2] => martha@gmail.com [3] => 65345235 )
// Array ( [0] => David [1] => Garcia [2] => dgarcia@gmail.com [3] => 69823422 )
```

## Write

>⚠️ **PHP_EOL** The correct 'End Of Line' symbol for this platform.

## Close

```php
fclose($f);
```

>⚠️ `fflush(resource $stream): bool`<br>
>This function forces a write of all buffered output to the resource pointed to by the file stream.

## File Pointers

- `rewind("filename")`
- `fseek($f, 0);`
- `fseek($f,25);`
- `fseek($f,25,SEEK_CUR);`
- `fseek($f,-25,SEEK_END);`

