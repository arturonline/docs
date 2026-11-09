# File Reading/Writing

There are three steps to reading or writing files in Python.

1. Call the `open()` function to return a file object.
2. Call the `read()` or `write()` method on the file object.
3. Close the file by calling the `close()` method on the file object (or, better, let a `with` block do it).

See also: [dir](dir.md) (paths, `pathlib`, listing directories) · [errors](errors.md) (`try`/`except`, `with`) · [strings](strings.md)

## Opening and Closing a File in Python

When you want to work with a file, the first thing to do is to open it. This is done by invoking the `open()` built-in function.

```python
reader = open('dog_breeds.txt', encoding='utf-8')
# Further file processing goes here
reader.close()
```

> ⚠️ Always pass `encoding='utf-8'` in text mode. Otherwise the default depends on the OS (on Windows it's often `cp1252`), so the same code can fail or produce mojibake on another machine. (UTF-8 becomes the default in 3.15, PEP 686.)

The second positional argument, `mode`, is a string that contains multiple characters to represent how you want to open the file. The default and most common is `'r'`, which represents opening the file in read-only mode as a text file:

```python
reader = open('dog_breeds.txt', 'r', encoding='utf-8')
```

Other options for modes are [fully documented online](https://docs.python.org/3/library/functions.html#open), but the most commonly used ones are the following:

| Character        | Meaning                                                    |
| ---------------- | ---------------------------------------------------------- |
| `'r'`            | Open for reading (default)                                 |
| `'w'`            | Open for writing, truncating (overwriting) the file first  |
| `'a'`            | Open for appending at the end of the file                  |
| `'x'`            | Create a new file, fail with `FileExistsError` if it exists |
| `'r+'`           | Open for reading and writing (file must exist)             |
| `'rb'` or `'wb'` | Open in binary mode (read/write `bytes`, no encoding)      |

After you open a file, the next thing to learn is how to close it. It's your responsibility to close the file. There are two ways to ensure that a file is closed properly, even when encountering an error. The first way is to use a `try`/`finally` block:

```python
reader = open('dog_breeds.txt', encoding='utf-8')
try:
    print(reader.read())
finally:
    reader.close()
```

The second (and recommended) way is to use the `with` statement:

```python
with open('dog_breeds.txt', encoding='utf-8') as reader:
    print(reader.read())

reader.closed   # -> True
```

The `with` statement automatically takes care of closing the file once it leaves the `with` block, even in cases of error. Use it as much as possible: it makes cleaner code and makes handling unexpected errors easier.

## Reading Opened Files

The examples below use this `dog_breeds.txt`:

```text
Pug
Jack Russell Terrier
English Springer Spaniel
German Shepherd
Staffordshire Bull Terrier
Cavalier King Charles Spaniel
Golden Retriever
West Highland White Terrier
Boxer
Border Terrier
```

There are multiple methods that can be called on a file object to help you out:

| Method               | What It Does                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `.read(size=-1)`     | Reads `size` characters (bytes in binary mode). If no argument, `None` or `-1` is passed, the entire file is read.                   |
| `.readline(size=-1)` | Reads one line (including the trailing `\n`), or at most `size` characters of it. Returns `''` at end of file.                         |
| `.readlines()`       | Reads the remaining lines from the file object and returns them as a list.                                                           |

```python
with open('dog_breeds.txt', 'r', encoding='utf-8') as reader:
    # Read & print the entire file
    print(reader.read())
```

`.readline(size)` reads at most `size` characters; the next call continues where the previous one stopped (it doesn't jump to the next line):

```python
with open('dog_breeds.txt', encoding='utf-8') as reader:
    for _ in range(3):
        print(repr(reader.readline(5)))
# 'Pug\n'
# 'Jack '
# 'Russe'
```

Here's an example of how to read the entire file as a list using `.readlines()`:

```python
>>> with open('dog_breeds.txt', encoding='utf-8') as f:
...     f.readlines()  # Returns a list object
['Pug\n', 'Jack Russell Terrier\n', 'English Springer Spaniel\n', 'German Shepherd\n', 'Staffordshire Bull Terrier\n', 'Cavalier King Charles Spaniel\n', 'Golden Retriever\n', 'West Highland White Terrier\n', 'Boxer\n', 'Border Terrier\n']
```

The above example can also be done by using `list()` to create a list out of the file object:

```python
>>> with open('dog_breeds.txt', encoding='utf-8') as f:
...     list(f)
['Pug\n', 'Jack Russell Terrier\n', ...]
```

Lines without the trailing newline:

```python
>>> with open('dog_breeds.txt', encoding='utf-8') as f:
...     f.read().splitlines()[:3]
['Pug', 'Jack Russell Terrier', 'English Springer Spaniel']
```

### Iterating Over Each Line in the File

A common thing to do while reading a file is to iterate over each line. Here's an example of how to use `.readline()` to perform that iteration (with the walrus operator `:=`):

```python
with open('dog_breeds.txt', 'r', encoding='utf-8') as reader:
    # Read and print the entire file line by line
    while (line := reader.readline()) != '':  # EOF is an empty string
        print(line, end='')
```

However, the above example can be simplified by iterating over the file object itself (memory-efficient, reads one line at a time):

```python
with open('dog_breeds.txt', 'r', encoding='utf-8') as reader:
    for lineno, line in enumerate(reader, start=1):
        print(f'{lineno:>2}: {line}', end='')
#  1: Pug
#  2: Jack Russell Terrier
# ...
```

> ⚠️ The `end=''` is to prevent Python from adding an additional newline to the text that is being printed and only print what is being read from the file.

## Writing Opened Files

As with reading files, file objects have multiple methods that are useful for writing to a file:

| Method             | What It Does                                                                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `.write(string)`   | Writes the string to the file. Returns the number of characters written.                                                                        |
| `.writelines(seq)` | Writes the sequence to the file. No line endings are appended to each sequence item. It's up to you to add the appropriate line ending(s). |

Here's a quick example of using `.write()` and `.writelines()`:

```python
with open('dog_breeds.txt', 'r', encoding='utf-8') as reader:
    # Note: readlines doesn't trim the line endings
    dog_breeds = reader.readlines()

with open('dog_breeds_reversed.txt', 'w', encoding='utf-8') as writer:
    # Alternatively you could use
    # writer.writelines(reversed(dog_breeds))

    # Write the dog breeds to the file in reversed order
    for breed in reversed(dog_breeds):
        writer.write(breed)
```

`print()` can also write to a file (it adds the newline for you):

```python
with open('out.txt', 'w', encoding='utf-8') as f:
    print('Hello', 'world', sep=', ', file=f)   # out.txt -> Hello, world\n
```

## Appending to a File

Sometimes, you may want to append to a file or start writing at the end of an already populated file. This is easily done by using the `'a'` character for the mode argument:

```python
with open('dog_breeds.txt', 'a', encoding='utf-8') as a_writer:
    a_writer.write('Beagle\n')
```

When you examine `dog_breeds.txt` again, you'll see that the beginning of the file is unchanged and `Beagle` is now added to the end of the file.

## Working With Two Files at the Same Time

There are times when you may want to read a file and write to another file at the same time. The previous example can be combined into one `with` statement (parenthesized form, 3.10+):

```python
d_path = 'dog_breeds.txt'
d_r_path = 'dog_breeds_reversed.txt'
with (
    open(d_path, 'r', encoding='utf-8') as reader,
    open(d_r_path, 'w', encoding='utf-8') as writer,
):
    dog_breeds = reader.readlines()
    writer.writelines(reversed(dog_breeds))
```

## `pathlib` shortcuts

For whole-file reads/writes, `pathlib.Path` is shorter (it opens and closes the file for you):

```python
from pathlib import Path

p = Path('notes.txt')
p.write_text('line 1\nline 2\n', encoding='utf-8')   # -> 14 (chars written; overwrites)
p.read_text(encoding='utf-8')                         # -> 'line 1\nline 2\n'
p.read_text(encoding='utf-8').splitlines()            # -> ['line 1', 'line 2']

with p.open('a', encoding='utf-8') as f:              # same options as open()
    f.write('line 3\n')

Path('data.bin').write_bytes(b'\x00\x01')             # binary
Path('data.bin').read_bytes()                         # -> b'\x00\x01'
```

## Common formats

### CSV

```python
import csv

rows = [{'name': 'Ana', 'age': 30}, {'name': 'Bob', 'age': 25}]

with open('people.csv', 'w', newline='', encoding='utf-8') as f:   # newline='' is required for csv
    writer = csv.DictWriter(f, fieldnames=['name', 'age'])
    writer.writeheader()
    writer.writerows(rows)

with open('people.csv', newline='', encoding='utf-8') as f:
    for row in csv.DictReader(f):
        print(row)
# {'name': 'Ana', 'age': '30'}     <- values are always str
# {'name': 'Bob', 'age': '25'}
```

### JSON

```python
import json
from pathlib import Path

data = {'name': 'Ana', 'langs': ['es', 'en'], 'active': True}

Path('data.json').write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding='utf-8')
json.loads(Path('data.json').read_text(encoding='utf-8'))
# -> {'name': 'Ana', 'langs': ['es', 'en'], 'active': True}

# or with file objects
with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
with open('data.json', encoding='utf-8') as f:
    data = json.load(f)
```

## Errors

```python
from pathlib import Path

try:
    text = Path('missing.txt').read_text(encoding='utf-8')
except FileNotFoundError as e:
    print(e)     # -> [Errno 2] No such file or directory: 'missing.txt'
except PermissionError:
    print('No permission')
except UnicodeDecodeError:
    print('Not UTF-8: try another encoding or errors="replace"')
```
