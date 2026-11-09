# Directories

Two APIs: the modern object-oriented `pathlib` (recommended) and the older string-based `os` / `os.path`. Both work everywhere; `pathlib` is easier to read and handles `/` vs `\` for you.

See also: [files](files.md) (reading/writing files) · [loops](loops.md)

## pathlib (recommended)

```python
from pathlib import Path

p = Path('C:/Windows/System32') / 'calc.exe'   # join with /
p                  # -> WindowsPath('C:/Windows/System32/calc.exe')
str(p)             # -> 'C:\\Windows\\System32\\calc.exe'
p.name             # -> 'calc.exe'
p.stem             # -> 'calc'
p.suffix           # -> '.exe'
p.parent           # -> WindowsPath('C:/Windows/System32')
p.parents[1]       # -> WindowsPath('C:/Windows')
p.parts            # -> ('C:\\', 'Windows', 'System32', 'calc.exe')
p.anchor           # -> 'C:\\'
p.with_suffix('.bak')      # -> WindowsPath('C:/Windows/System32/calc.bak')
p.with_name('notepad.exe') # -> WindowsPath('C:/Windows/System32/notepad.exe')

Path.cwd()         # current working directory
Path.home()        # -> WindowsPath('C:/Users/me')
Path('~/docs').expanduser()   # -> WindowsPath('C:/Users/me/docs')
Path(__file__).resolve().parent   # folder of the running script (common idiom)
```

On Linux/macOS you get `PosixPath` instead of `WindowsPath`; the API is the same.

| `os` / `os.path`                     | `pathlib`                                   |
| ------------------------------------ | ------------------------------------------- |
| `os.path.join(a, b)`                 | `Path(a) / b`                               |
| `os.getcwd()`                        | `Path.cwd()`                                |
| `os.path.abspath(p)`                 | `Path(p).resolve()` (or `.absolute()`)      |
| `os.path.basename(p)`                | `p.name`                                    |
| `os.path.dirname(p)`                 | `p.parent`                                  |
| `os.path.splitext(p)`                | `p.stem`, `p.suffix`                        |
| `os.path.exists(p)`                  | `p.exists()`                                |
| `os.path.isfile(p)` / `isdir(p)`     | `p.is_file()` / `p.is_dir()`                |
| `os.path.getsize(p)`                 | `p.stat().st_size`                          |
| `os.makedirs(p, exist_ok=True)`      | `p.mkdir(parents=True, exist_ok=True)`      |
| `os.listdir(p)`                      | `p.iterdir()`                               |
| `glob.glob('**/*.txt', recursive=True)` | `p.rglob('*.txt')` / `p.glob('**/*.txt')` |
| `os.walk(p)`                         | `p.walk()` (3.12+)                          |
| `os.remove(p)` / `os.rmdir(p)`       | `p.unlink()` / `p.rmdir()`                  |
| `os.rename(a, b)`                    | `Path(a).rename(b)`                         |
| `os.path.relpath(p, start)`          | `p.relative_to(start)` (`walk_up=True` 3.12+) |

## Paths

```python
import os
os.path.join('usr', 'bin', 'spam')
# 'usr\\bin\\spam'   (Windows)
# 'usr/bin/spam'     (Linux/macOS)
```

```python
my_files = ['accounts.txt', 'details.csv', 'invite.docx']
for filename in my_files:
    print(os.path.join('C:\\Users\\asweigart', filename))

# C:\Users\asweigart\accounts.txt
# C:\Users\asweigart\details.csv
# C:\Users\asweigart\invite.docx
```

Same with `pathlib`:

```python
from pathlib import Path

base = Path('C:/Users/asweigart')
[base / f for f in my_files]
# -> [WindowsPath('C:/Users/asweigart/accounts.txt'), WindowsPath('C:/Users/asweigart/details.csv'), ...]
```

> 💡 In Windows paths use raw strings (`r'C:\Users\me'`) or forward slashes (`'C:/Users/me'`) to avoid escaping every backslash.

## Absolute and Relative Paths

> 💡 There are also the dot (`.`) and dot-dot (`..`) folders. These are not real folders but special names that can be used in a path. A single period ("dot") for a folder name is shorthand for "this directory." Two periods ("dot-dot") means "the parent folder."

```python
os.path.abspath('.')
# 'C:\\Python313'
os.path.abspath('.\\Scripts')
# 'C:\\Python313\\Scripts'
os.path.isabs('.')
# False
os.path.isabs(os.path.abspath('.'))
# True

Path('.').resolve()          # -> WindowsPath('C:/Python313')   (absolute, resolves .. and symlinks)
Path('.').is_absolute()      # -> False
```

```python
os.path.relpath('C:\\Windows', 'C:\\')
# 'Windows'
os.path.relpath('C:\\Windows', 'C:\\spam\\eggs')
# '..\\..\\Windows'

Path('C:/Windows/System32').relative_to('C:/Windows')
# -> WindowsPath('System32')
Path('C:/Windows').relative_to('C:/spam/eggs', walk_up=True)   # 3.12+
# -> WindowsPath('../../Windows')
```

## Current Working Directory

```python
import os

os.getcwd()
# 'C:\\Python313'
Path.cwd()
# -> WindowsPath('C:/Python313')
```

## Change dir

```python
os.chdir('C:\\Windows\\System32')
os.getcwd()
# 'C:\\Windows\\System32'
```

> 💡 Changing the cwd affects the whole process. Prefer building absolute paths (e.g. `Path(__file__).parent / 'data.txt'`) over `chdir`.

## Make dir

```python
import os

os.makedirs('C:\\delicious\\walnut\\waffles', exist_ok=True)   # creates intermediate folders
os.mkdir('C:\\delicious\\other')                              # only the last level

Path('C:/delicious/walnut/waffles').mkdir(parents=True, exist_ok=True)
```

Without `exist_ok=True` they raise `FileExistsError` if the folder already exists.

## Remove, copy, move

```python
import shutil
from pathlib import Path

Path('old.txt').unlink(missing_ok=True)     # delete a file
Path('empty_dir').rmdir()                   # delete an EMPTY dir
shutil.rmtree('build')                      # ⚠️ delete a dir and everything inside

shutil.copy('a.txt', 'backup/')             # copy file (into a folder or to a new name)
shutil.copy2('a.txt', 'b.txt')              # also copies metadata (timestamps)
shutil.copytree('src', 'dst', dirs_exist_ok=True)   # copy a whole tree
shutil.move('a.txt', 'archive/a.txt')       # move / rename (across drives too)
Path('a.txt').rename('b.txt')               # rename (same drive)
```

## dirname and basename

```python
path = 'C:\\Windows\\System32\\calc.exe'
os.path.basename(path)
# 'calc.exe'
os.path.dirname(path)
# 'C:\\Windows\\System32'
os.path.splitext(path)
# ('C:\\Windows\\System32\\calc', '.exe')
```

## Split

If you need a path's dir name and base name together, you can just call `os.path.split()` to get a tuple value with these two strings, like so:

```python
calc_file_path = 'C:\\Windows\\System32\\calc.exe'
os.path.split(calc_file_path)
# ('C:\\Windows\\System32', 'calc.exe')
```

## sep

`os.path.split()` does not return a list of strings of each folder. For that, split on `os.sep` (or use `Path(...).parts`).

```python
calc_file_path.split(os.sep)
# ['C:', 'Windows', 'System32', 'calc.exe']
Path(calc_file_path).parts
# ('C:\\', 'Windows', 'System32', 'calc.exe')
```

On macOS and Linux systems, there will be a blank string at the start of the returned list:

```python
'/usr/bin'.split(os.sep)
# ['', 'usr', 'bin']
```

## size

```python
os.path.getsize('C:\\Windows\\System32\\calc.exe')
# 49152
Path('C:/Windows/System32/calc.exe').stat().st_size
# 49152
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

p = Path('C:/Windows/System32/calc.exe')
p.exists(), p.is_file(), p.is_dir()
# (True, True, False)
```

## listdir

It returns a list of all the files and subdirectories (names only, not full paths) in the given path, in arbitrary order.

```python
os.listdir('.')
# ['.DS_Store', 'Playground', 'Projects', 'MDFiles', 'pruebas']

sorted(p.name for p in Path('.').iterdir())       # Path objects -> names
[p for p in Path('.').iterdir() if p.is_dir()]    # only folders
```

> 💡 `os.scandir()` is faster than `listdir()` + `os.path` calls when you need file type/size: each entry has `.name`, `.path`, `.is_file()`, `.stat()`.

Example, total size of the files in a folder:

```python
total_size = 0
for filename in os.listdir('C:\\Windows\\System32'):
    total_size += os.path.getsize(os.path.join('C:\\Windows\\System32', filename))

print(total_size)
# 1117846456

# pathlib version (files only)
sum(f.stat().st_size for f in Path('C:/Windows/System32').iterdir() if f.is_file())
```

## List in subdirectories tree

### #1: using `os.walk`

```python
os.walk(top, topdown=True, onerror=None, followlinks=False)
```

Generate the file names in a directory tree by walking the tree either top-down or bottom-up. For each directory in the tree rooted at directory `top` (including `top` itself), it yields a 3-tuple `(dirpath, dirnames, filenames)`.

Example #1:

Get the list of all files in directory tree at given path:

```python
dir_name = 'c:\\projects\\hc2'
list_of_files = []
for dirpath, dirnames, filenames in os.walk(dir_name):
    list_of_files += [os.path.join(dirpath, file) for file in filenames]
```

Example #2:

List all `.txt` files in a specified directory + subdirectories:

```python
import os

path = 'c:\\projects\\hc2\\'

files = []
# r=root, d=directories, f=files
for r, d, f in os.walk(path):
    for file in f:
        if file.endswith('.txt'):
            files.append(os.path.join(r, file))

for f in files:
    print(f)
# c:\projects\hc2\app\readme.txt
# c:\projects\hc2\whois\download\afrinic.txt
# c:\projects\hc2\whois\download\apnic.txt
# ...
```

> 💡 With `topdown=True` you can prune the walk by modifying `dirnames` in place: `dirnames[:] = [d for d in dirnames if d not in {'.git', '.venv', 'node_modules'}]`.

`Path.walk()` (3.12+) does the same but yields `Path` objects:

```python
from pathlib import Path

for root, dirs, files in Path('c:/projects/hc2').walk():
    dirs[:] = [d for d in dirs if not d.startswith('.')]   # skip hidden folders
    for name in files:
        if name.endswith('.txt'):
            print(root / name)
```

### #2: using `glob`

```python
glob.glob(pathname, *, recursive=False)
```

The `glob` module finds all the pathnames matching a specified pattern according to the rules used by the Unix shell; results are returned in arbitrary order. No tilde expansion is done, but `*`, `?`, and character ranges expressed with `[]` will be correctly matched.

For a literal match, wrap the meta-characters in brackets. For example, `'[?]'` matches the character `'?'`.

For example, consider a directory containing the following files: `1.gif`, `2.txt`, `card.gif` and a subdirectory `sub` which contains only the file `3.txt`. `glob()` will produce the following results:

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

(On Windows the separators in the results are `\`: `'sub\\3.txt'`.)

Example, list all `.txt` files in a directory + subdirectories (`**`):

```python
import glob

path = 'c:\\projects\\hc2\\'

for f in glob.glob(path + '**/*.txt', recursive=True):
    print(f)
# c:\projects\hc2\app\readme.txt
# c:\projects\hc2\whois\download\afrinic.txt
# ...
```

And all directories (a pattern ending in a separator only matches folders):

```python
for d in glob.glob(path + '**/', recursive=True):
    print(d)
# c:\projects\hc2\
# c:\projects\hc2\analyzer\
# c:\projects\hc2\analyzer\out\
# ...
```

The `pathlib` equivalents return `Path` objects (generators):

```python
from pathlib import Path

root = Path('c:/projects/hc2')
list(root.glob('*.txt'))      # this folder only
list(root.rglob('*.txt'))     # recursive (= glob('**/*.txt'))
sorted(root.rglob('*.py'), key=lambda p: p.stat().st_size, reverse=True)[:5]   # 5 biggest .py files
```

### #3: using `listdir` recursively

```python
def get_list_of_files(dir_name: str) -> list[str]:
    """Return all file paths below dir_name (recursive)."""
    all_files = []
    for entry in os.listdir(dir_name):
        full_path = os.path.join(dir_name, entry)
        # If entry is a directory then get the list of files in this directory
        if os.path.isdir(full_path):
            all_files += get_list_of_files(full_path)
        else:
            all_files.append(full_path)
    return all_files

list_of_files = get_list_of_files('/home/varun/Downloads')
```

## Temporary files and directories

```python
import tempfile
from pathlib import Path

with tempfile.TemporaryDirectory() as tmp:
    p = Path(tmp) / 'test.txt'
    p.write_text('hi', encoding='utf-8')
    print(p.exists())   # -> True
# the folder and its contents are deleted here
```
