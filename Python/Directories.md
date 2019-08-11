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

## dirname and basename

```python
path = 'C:\\Windows\\System32\\calc.exe'
os.path.basename(path)
# 'calc.exe'
os.path.dirname(path)
# 'C:\\Windows\\System32'
```

## Split

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

## listdir

It returns a list of all the files and sub directories in the given path.

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

## List in subdirectories tree

### #1: using `os.walker`

```python
os.walk(top, topdown=True, onerror=None, followlinks=False)
```

Generate the file names in a directory tree by walking the tree either top-down or bottom-up. For each directory in the tree rooted at directory top (including top itself), it yields a 3-tuple (dirpath, dirnames, filenames).

Example #1:

Get the list of all files in directory tree at given path:

```python
listOfFiles = list()
for (dirpath, dirnames, filenames) in os.walk(dirName):
    listOfFiles += [os.path.join(dirpath, file) for file in filenames]
```

Example #2:

List all .txt files in a specified directory + subdirectories:

```python
import os

path = 'c:\\projects\\hc2\\'

files = []
# r=root, d=directories, f = files
for r, d, f in os.walk(path):
    for file in f:
        if '.txt' in file:
            files.append(os.path.join(r, file))

for f in files:
    print(f)
# c:\projects\hc2\app\readme.txt
# c:\projects\hc2\whois\download\afrinic.txt
# c:\projects\hc2\whois\download\apnic.txt
# ...
```

### #2: using `Glob`

```python
glob.glob(pathname, *, recursive=False)
```

The `glob` module finds all the `pathnames` matching a specified pattern according to the rules used by the Unix shell, although results are returned in arbitrary order. No tilde expansion is done, but `*`, `?`, and character ranges expressed with `[]` will be correctly matched.

For a literal match, wrap the meta-characters in brackets. For example, '[?]' matches the character '?'.

For example, consider a directory containing the following files: `1.gif`, `2.txt`, `card.gif` and a subdirectory sub which contains only the file `3.txt`. `glob()` will produce the following results:

```python
import glob
glob.glob('./[0-9].*')
# ['./1.gif', './2.txt']
glob.glob('*.gif')
# ['1.gif', 'card.gif']
glob.glob('?.gif')
# ['1.gif']
glob.glob('**/*.txt', recursive=True)
# ['2.txt', 'sub/3.txt']
glob.glob('./**/', recursive=True)
# ['./', './sub/']
```

Example #2, List all directories in a specified directory + subdirectories (**):

```python
import glob

path = 'c:\\projects\\hc2\\'

files = [f for f in glob.glob(path + "**/*.txt", recursive=True)]

for f in files:
    print(f)

# c:\projects\hc2\
# c:\projects\hc2\analyzer\
# c:\projects\hc2\analyzer\out\
# c:\projects\hc2\analyzer\out\production\
# c:\projects\hc2\analyzer\out\production\classes\
# c:\projects\hc2\analyzer\out\production\classes\com\
# ...
```

### #3: using `listdir` recursively

```python
def getListOfFiles(dirName):
    # create a list of file and sub directories
    # names in the given directory
    listOfFile = os.listdir(dirName)
    allFiles = list()
    # Iterate over all the entries
    for entry in listOfFile:
        # Create full path
        fullPath = os.path.join(dirName, entry)
        # If entry is a directory then get the list of files in this directory
        if os.path.isdir(fullPath):
            allFiles = allFiles + getListOfFiles(fullPath)
        else:
            allFiles.append(fullPath)

    return allFiles

dirName = '/home/varun/Downloads';

# Get the list of all files in directory tree at given path
listOfFiles = getListOfFiles(dirName)
```
