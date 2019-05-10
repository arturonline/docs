# Modules

A module is a file containing Python definitions and statements.

```python
import fiblo
>>> fibo.fib(1000)
```

```python
from fibo import fib
>>> fib(500)

>>> fibo
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
NameError: name 'fibo' is not define
```

```python
import fibo as fib
>>> fib.fib(500)
```

```python
from fibo import fib as fibonacci
>>> fibonacci(500)
```

## The `dir()` Function

The built-in function `dir()` is used to find out which names a module defines.

```python
import fibo
dir(fibo)
>>> ['__name__', 'fib', 'fib2']
```

## Packages

Packages are a way of structuring Python’s module namespace by using "dotted" module name. To accomplish that, you should save your files in folders in a hierarchical way.

```cmd
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

```python
import sound.effects.echo
```

```python
from sound.effects import echo
```

You can also write relative imports, with the from module import name form of import statement. These imports use leading dots to indicate the current and parent packages involved in the relative import. From the surround module:

```python
from . import echo
from .. import formats
from ..filters import equalizer
```