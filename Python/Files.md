# File Reading/Writing

There are three steps to reading or writing files in Python.

1. Call the `open()` function to return a File object.
2. Call the `read()` or write() method on the File object.
3. Close the file by calling the `close()` method on the File object.

## Opening and Closing a File in Python

When you want to work with a file, the first thing to do is to open it. This is done by invoking the `open()` built-in function.

```python
reader = open('dog_breeds.txt')
    # Further file processing goes here
```

The second positional argument, `mode` is a string that contains multiple characters to represent how you want to open the file. The default and most common is 'r', which represents opening the file in read-only mode as a text file:

```python
reader = open('dog_breeds.txt', 'r')
    # Further file processing goes here
```

Other options for modes are [fully documented online](https://docs.python.org/3/library/functions.html#open), but the most commonly used ones are the following:

| Character    | Meaning                                                   |
| ------------ | --------------------------------------------------------- |
| 'r'          | Open for reading (default)                                |
| 'w'          | Open for writing, truncating (overwriting) the file first |
| 'rb' or 'wb' | Open in binary mode (read/write using byte data)          |

After you open a file, the next thing to learn is how to close it. It’s important to remember that it’s your responsibility to close the file. When you’re manipulating a file, there are two ways that you can use to ensure that a file is closed properly, even when encountering an error. The first way to close a file is to use the `try-finally` block:

```python
reader = open('dog_breeds.txt')
try:
    # Further file processing goes here
finally:
    reader.close()
```

The second way to close a file is to use the with statement:

```python
with open('dog_breeds.txt') as reader:
    # Further file processing goes here
```

The with statement automatically takes care of closing the file once it leaves the with block, even in cases of error. I highly recommend that you use the with statement as much as possible, as it allows for cleaner code and makes handling any unexpected errors easier for you.

## Reading Opened Files

There are multiple methods that can be called on a file object to help you out:

| Method             | What It Does                                                                                                                                                                                                                        |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| .read(size=-1)     | This reads from the file based on the number of size bytes. If no argument is passed or None or -1 is passed, then the entire file is read.                                                                                         |
| .readline(size=-1) | This reads at most size number of characters from the line. This continues to the end of the line and then wraps back around. If no argument is passed or None or -1 is passed, then the entire line (or rest of the line) is read. |
| .readlines()       | This reads the remaining lines from the file object and returns them as a list.                                                                                                                                                     |

```python
with open('dog_breeds.txt', 'r') as reader:
    # Read & print the entire file
    print(reader.read())
```

Here’s an example of how to read **5 bytes** of a line each time using `.readline()`:

```python
with open('dog_breeds.txt', 'r') as reader:
    # Read & print the first 5 characters of the line 5 times
    print(reader.readline(5))
```

Here’s an example of how to read the entire file as a list using `.readlines()`:

```python
f = open('dog_breeds.txt')
f.readlines()  # Returns a list object
['Pug\n', 'Jack Russell Terrier\n', 'English Springer Spaniel\n', 'German Shepherd\n', 'Staffordshire Bull Terrier\n', 'Cavalier King Charles Spaniel\n', 'Golden Retriever\n', 'West Highland White Terrier\n', 'Boxer\n', 'Border Terrier\n']
```

The above example can also be done by using `list()` to create a list out of the file object:

```python
f = open('dog_breeds.txt')
list(f)
['Pug\n', 'Jack Russell Terrier\n', 'English Springer Spaniel\n', 'German Shepherd\n', 'Staffordshire Bull Terrier\n', 'Cavalier King Charles Spaniel\n', 'Golden Retriever\n', 'West Highland White Terrier\n', 'Boxer\n', 'Border Terrier\n']
```

### Iterating Over Each Line in the File

A common thing to do while reading a file is to iterate over each line. Here’s an example of how to use `.readline()` to perform that iteration:

```python
with open('dog_breeds.txt', 'r') as reader:
    # Read and print the entire file line by line
    line = reader.readline()
    while line != '':  # The EOF char is an empty string
        print(line, end='')
        line = reader.readline()
```

However, the above examples can be further simplified by iterating over the file object itself:

```python
with open('dog_breeds.txt', 'r') as reader:
    # Read and print the entire file line by line
    for line in reader:
        print(line, end='')
```

> ⚠️ The `end=''` is to prevent Python from adding an additional newline to the text that is being printed and only print what is being read from the file.

## Writing Opened Files

As with reading files, file objects have multiple methods that are useful for writing to a file:

| Method             | What It Does                                                                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `.write(string)`   | This writes the string to the file.                                                                                                             |
| `.writelines(seq)` | This writes the sequence to the file. No line endings are appended to each sequence item. It’s up to you to add the appropriate line ending(s). |

Here’s a quick example of using .write() and `.writelines()`:

```python
with open('dog_breeds.txt', 'r') as reader:
    # Note: readlines doesn't trim the line endings
    dog_breeds = reader.readlines()

with open('dog_breeds_reversed.txt', 'w') as writer:
    # Alternatively you could use
    # writer.writelines(reversed(dog_breeds))

    # Write the dog breeds to the file in reversed order
    for breed in reversed(dog_breeds):
        writer.write(breed)
```

## Appending to a File

Sometimes, you may want to append to a file or start writing at the end of an already populated file. This is easily done by using the 'a' character for the mode argument:

```python
with open('dog_breeds.txt', 'a') as a_writer:
    a_writer.write('\nBeagle')
```

When you examine dog_breeds.txt again, you’ll see that the beginning of the file is unchanged and Beagle is now added to the end of the file.

## Working With Two Files at the Same Time

There are times when you may want to read a file and write to another file at the same time. If you use the example that was shown when you were learning how to write to a file, it can actually be combined into the following:

```python
d_path = 'dog_breeds.txt'
d_r_path = 'dog_breeds_reversed.txt'
with open(d_path, 'r') as reader, open(d_r_path, 'w') as writer:
    dog_breeds = reader.readlines()
    writer.writelines(reversed(dog_breeds))
```