# Directories

## Paths

```python
import os
os.path.join('usr', 'bin', 'spam')
# 'usr/bin/spam'
```

```python
myFiles = ['accounts.txt', 'details.csv', 'invite.docx']
for filename in myFiles:
    print(os.path.join('C:\\Users\\asweigart', filename))

# C:\Users\asweigart\details.csv
# C:\Users\asweigart\invite.docx
# C:\Users\asweigart\accounts.txt
```

## Absolute and Relative Paths

>💡 There are also the dot (.) and dot-dot (..) folders. These are not real folders but special names that can be used in a path. A single period (“dot”) for a folder name is shorthand for “this directory.” Two periods (“dot-dot”) means “the parent folder.”

```python
os.path.abspath('.')
# 'C:\\Python34'
os.path.abspath('.\\Scripts')
# 'C:\\Python34\\Scripts'
os.path.isabs('.')
# False
os.path.isabs(os.path.abspath('.'))
# True
```

```python
os.path.relpath('C:\\Windows', 'C:\\')
# 'Windows'
os.path.relpath('C:\\Windows', 'C:\\spam\\eggs')
# '..\\..\\Windows'
os.getcwd() 'C:\\Python34'
```

## Current Working Directory

```python
import os

os.getcwd()
# 'C:\\Python34'
```

## Change dir

```python
os.chdir('C:\\Windows\\System32')
os.getcwd()
#'C:\\Windows\\System32'
```

## Make dir

```go
import os

os.makedirs('C:\\delicious\\walnut\\waffles')
```

## dirname and base

```python
path = 'C:\\Windows\\System32\\calc.exe'
os.path.basename(path)
# 'calc.exe'
os.path.dirname(path)
# 'C:\\Windows\\System32'
```

If you need a path’s dir name and base name together, you can just call `os.path.split()` to get a tuple value with these two strings, like so:

```python
calcFilePath = 'C:\\Windows\\System32\\calc.exe'
os.path.split(calcFilePath)
# ('C:\\Windows\\System32', 'calc.exe')
```

## sep

`os.path.split()` does not return a list of strings of each folder. For that, use `os.sep`.

```python
calcFilePath.split(os.path.sep)
# ['C:', 'Windows', 'System32', 'calc.exe']
```

On OS X and Linux systems, there will be a blank string at the start of the returned list:

```python
'/usr/bin'.split(os.path.sep)
# ['', 'usr', 'bin']
```

## size

```python
os.path.getsize('C:\\Windows\\System32\\calc.exe')
# 776192
```

## listdir

```python
os.listdir(".")
# ['.DS_Store', 'Playground', 'Projects', 'MDFiles', 'pruebas']
```

Example:

```python
totalSize = 0
for filename in os.listdir('C:\\Windows\\System32'):
    totalSize = totalSize + os.path.getsize(os.path.join('C:\\Windows\\System32', filename))

print(totalSize)
# 1117846456
```

## Checking Path Validity

```python
os.path.exists('C:\\Windows')
# True
os.path.exists('C:\\some_made_up_folder')
# False
os.path.isdir('C:\\Windows\\System32')
# True
os.path.isfile('C:\\Windows\\System32')
# False
os.path.isdir('C:\\Windows\\System32\\calc.exe')
# False
os.path.isfile('C:\\Windows\\System32\\calc.exe')
# True
```