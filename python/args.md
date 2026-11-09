# Python arguments

Function parameters (`*args`, `**kwargs`, `/`, `*`) and command line arguments (`sys.argv`, `argparse`).

See also: [errors](errors.md) · [modules](modules.md) · [env](env.md)

## Function parameters

### Default values

```python
def greet(name: str, greeting: str = "Hello") -> str:
    return f"{greeting}, {name}!"

greet("Ana")              # -> 'Hello, Ana!'
greet("Ana", "Hola")      # -> 'Hola, Ana!'
greet("Ana", greeting="Hi")  # -> 'Hi, Ana!'
```

> ⚠️ Never use a mutable default (`def f(x=[])`): it is created **once** and shared between calls. Use `None`:

```python
def add_item(item: str, items: list[str] | None = None) -> list[str]:
    if items is None:
        items = []
    items.append(item)
    return items
```

### `*args` and `**kwargs`

- `*args` collects extra **positional** arguments into a `tuple`.
- `**kwargs` collects extra **keyword** arguments into a `dict`.

```python
def show(*args, **kwargs):
    print(args, kwargs)

show(1, 2, x=3, y=4)   # -> (1, 2) {'x': 3, 'y': 4}
show()                 # -> () {}

def total(*nums: float) -> float:
    return sum(nums)

total(2, 3, 5, 6)      # -> 16
```

### Unpacking when calling

```python
def point(x, y, z):
    return f"{x=} {y=} {z=}"

coords = [1, 2, 3]
opts = {"x": 1, "y": 2, "z": 3}

point(*coords)   # -> 'x=1 y=2 z=3'
point(**opts)    # -> 'x=1 y=2 z=3'
```

### Positional-only (`/`) and keyword-only (`*`)

```python
def f(a, b, /, c, *, d, e=0):
    return a, b, c, d, e
#     ^^^^  pos-only   ^^^^ keyword-only

f(1, 2, 3, d=4)        # -> (1, 2, 3, 4, 0)
f(1, 2, c=3, d=4)      # -> (1, 2, 3, 4, 0)
f(1, 2, 3, 4)          # TypeError: f() takes 3 positional arguments but 4 were given
f(a=1, b=2, c=3, d=4)  # TypeError: f() got some positional-only arguments passed as keyword arguments: 'a, b'
```

- Parameters before `/` can't be passed by name (lets you rename them freely, like builtins: `len(obj, /)`).
- Parameters after `*` (or after `*args`) must be passed by name: good for flags (`sort(key=..., reverse=True)`).

### Full order

```python
def f(pos_only, /, normal, *args, kw_only, **kwargs): ...
```

### Typing `*args` / `**kwargs`

```python
from typing import Unpack, TypedDict

def log(*args: str, **kwargs: int) -> None: ...   # every arg is str, every kwarg is int

class Options(TypedDict, total=False):
    timeout: int
    verbose: bool

def connect(host: str, **kwargs: Unpack[Options]) -> None: ...  # precise kwargs (3.12+)
```

## Command line: `sys.argv`

`sys.argv` is a `list[str]`; `sys.argv[0]` is the script name.

```python
# app.py
import sys

print("Script:", sys.argv[0])
print("Args:", sys.argv[1:])
print("Result:", sum(int(arg) for arg in sys.argv[1:]))
```

```bash
python app.py 2 3 5 6
# Script: app.py
# Args: ['2', '3', '5', '6']
# Result: 16
```

Small scripts can use `match` on the arguments:

```python
import sys

match sys.argv[1:]:
    case []:
        print("usage: app.py <cmd> [args]")
    case ["hello", name]:
        print(f"Hello, {name}")
    case ["sum", *nums]:
        print(sum(map(int, nums)))
    case [cmd, *_]:
        sys.exit(f"unknown command: {cmd}")   # prints to stderr, exit code 1
```

```bash
python app.py sum 1 2 3   # 6
python app.py hello Ana   # Hello, Ana
```

## Command line: `argparse`

For real CLIs use `argparse` (stdlib): it gives `--help`, types, defaults and error messages for free.

```python
# app.py
import argparse
from pathlib import Path

parser = argparse.ArgumentParser(description="Process some files.")
parser.add_argument("files", nargs="+", type=Path, help="input files")       # positional, 1 or more
parser.add_argument("-n", "--lines", type=int, default=10, help="lines to show")
parser.add_argument("-v", "--verbose", action="store_true")                  # flag -> bool
parser.add_argument("--mode", choices=["fast", "safe"], default="safe")

args = parser.parse_args()
print(args)
print(args.files, args.lines, args.verbose, args.mode)
```

```bash
python app.py a.txt b.txt -n 5 -v
# Namespace(files=[WindowsPath('a.txt'), WindowsPath('b.txt')], lines=5, verbose=True, mode='safe')
# [WindowsPath('a.txt'), WindowsPath('b.txt')] 5 True safe
# (PosixPath(...) on Linux/macOS)

python app.py --mode turbo a.txt
# usage: app.py [-h] [-n LINES] [-v] [--mode {fast,safe}] files [files ...]
# app.py: error: argument --mode: invalid choice: 'turbo' (choose from 'fast', 'safe')

python app.py -h      # auto-generated help
```

Useful options:

| Option                       | Meaning                                         |
| ---------------------------- | ----------------------------------------------- |
| `nargs="?" / "*" / "+"`      | 0-1 / 0 or more / 1 or more values              |
| `action="store_true"`        | flag, `False` by default                        |
| `action="count"`             | `-vvv` -> `3`                                   |
| `action="append"`            | `--tag a --tag b` -> `['a', 'b']`               |
| `required=True`              | make an option mandatory                        |
| `parser.add_subparsers()`    | sub-commands (`git commit`, `git push`...)      |
| `parse_args(["-n", "3"])`    | parse a given list (handy for tests)            |

> 💡 Third-party alternatives: [`click`](https://click.palletsprojects.com/) and [`typer`](https://typer.tiangolo.com/) (uses type hints).
