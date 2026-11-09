# Modules

A module is a file containing Python definitions and statements. The file name is the module name plus `.py` (`fibo.py` -> module `fibo`).

See also: [pip](pip.md) (installing third-party packages) · [env](env.md) (virtual environments)

```python
# fibo.py
def fib(n: int) -> None:
    """Print the Fibonacci series up to n."""
    a, b = 0, 1
    while a < n:
        print(a, end=' ')
        a, b = b, a + b
    print()

def fib2(n: int) -> list[int]:
    """Return the Fibonacci series up to n."""
    result = []
    a, b = 0, 1
    while a < n:
        result.append(a)
        a, b = b, a + b
    return result
```

## Import forms

```python
>>> import fibo
>>> fibo.fib(100)
0 1 1 2 3 5 8 13 21 34 55 89
>>> fibo.fib2(10)
[0, 1, 1, 2, 3, 5, 8]
```

```python
>>> from fibo import fib, fib2
>>> fib(50)
0 1 1 2 3 5 8 13 21 34

>>> fibo        # only the names were imported, not the module
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
NameError: name 'fibo' is not defined
```

```python
>>> import fibo as fb
>>> fb.fib(10)
0 1 1 2 3 5 8
```

```python
>>> from fibo import fib as fibonacci
>>> fibonacci(10)
0 1 1 2 3 5 8
```

> ⚠️ Avoid `from fibo import *`: it pollutes the namespace and hides where names come from. (It imports every name not starting with `_`, or only those listed in the module's `__all__`.)

## `if __name__ == "__main__"`

When a file is run directly, `__name__` is `"__main__"`; when it is imported, `__name__` is the module name. Use it to write files that are both importable modules and scripts:

```python
# fibo.py
...

def main() -> None:
    import sys
    fib(int(sys.argv[1]))

if __name__ == "__main__":
    main()      # runs with `python fibo.py 50`, NOT on `import fibo`
```

```bash
python fibo.py 50
# 0 1 1 2 3 5 8 13 21 34
python -m fibo 50      # same, but finds the module via sys.path (works for packages too)
```

## The `dir()` Function

The built-in function `dir()` is used to find out which names a module defines (sorted).

```python
>>> import fibo
>>> [name for name in dir(fibo) if not name.startswith('__')]
['fib', 'fib2', 'main']
>>> dir(fibo)[:3]
['__builtins__', '__cached__', '__doc__']
```

Without arguments, `dir()` lists the names defined in the current scope. Other introspection helpers: `help(fibo)`, `fibo.__file__`, `fibo.__doc__`.

## The module search path

`import x` looks in `sys.path`, in order: the script's directory (or current dir in the REPL), `PYTHONPATH`, the standard library, then `site-packages` (installed packages / [venv](env.md)).

```python
>>> import sys
>>> sys.path             # list of directories, searched in order
[...]
>>> 'fibo' in sys.modules  # already-imported modules are cached here
True
```

> ⚠️ Don't name your files like stdlib/third-party modules (`random.py`, `json.py`, `requests.py`): they shadow the real ones.

Reload a module after editing it (REPL only):

```python
import importlib
importlib.reload(fibo)
```

## Packages

Packages are a way of structuring Python's module namespace by using "dotted" module names. A package is a folder with an `__init__.py` file (it can be empty; it runs on first import of the package).

```text
sound/                          Top-level package
      __init__.py               Initialize the sound package
      formats/                  Subpackage for file format conversions
              __init__.py
              wavread.py
              wavwrite.py
              aiffread.py
              aiffwrite.py
              auread.py
              auwrite.py
              ...
      effects/                  Subpackage for sound effects
              __init__.py
              echo.py
              surround.py
              reverse.py
              ...
      filters/                  Subpackage for filters
              __init__.py
              equalizer.py
              vocoder.py
              karaoke.py
              ...
```

Example:

```python
import sound.effects.echo
sound.effects.echo.echofilter(input, output, delay=0.7, atten=4)
```

```python
from sound.effects import echo
echo.echofilter(input, output, delay=0.7, atten=4)
```

```python
from sound.effects.echo import echofilter
echofilter(input, output, delay=0.7, atten=4)
```

You can also write relative imports, with the `from module import name` form of import statement. These imports use leading dots to indicate the current and parent packages involved in the relative import. From the `surround` module:

```python
from . import echo                  # sound/effects/echo.py
from .. import formats              # sound/formats/
from ..filters import equalizer     # sound/filters/equalizer.py
```

> ⚠️ Relative imports only work inside a package. Run the code as a module from the project root (`python -m sound.effects.surround`), not as a script (`python sound/effects/surround.py` -> `ImportError: attempted relative import with no known parent package`).

### Recommended project layout

```text
myproject/
├── pyproject.toml          # metadata + dependencies (see pip.md)
├── src/
│   └── myapp/
│       ├── __init__.py
│       ├── __main__.py     # enables `python -m myapp`
│       └── cli.py
└── tests/
    └── test_cli.py
```

Install it in editable mode (`python -m pip install -e .` or `uv sync`) so `import myapp` works from anywhere, including the tests. See [pip](pip.md#pyprojecttoml).
