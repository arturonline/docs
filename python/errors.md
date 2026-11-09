# Exceptions

See also: [files](files.md) (`with` and file errors) · [args](args.md) · [clases2](clases2.md) (inheritance)

## `raise` an Exception

`raise` allows you to throw an exception at any time. Raise the most specific built-in exception that fits (`ValueError`, `TypeError`, `KeyError`...), not a bare `Exception`.

```python
x = 10
if x > 5:
    raise ValueError(f'x should not exceed 5. The value of x was: {x}')
# ValueError: x should not exceed 5. The value of x was: 10
```

## The `AssertionError` Exception

Instead of waiting for a program to crash midway, you can also start by making an assertion in Python. `assert` enables you to verify if a certain condition is met and throw an exception if it isn't.

```python
import sys
assert sys.platform.startswith('linux'), "This code runs on Linux only."
# AssertionError: This code runs on Linux only.   (on Windows/macOS)
```

> ⚠️ Asserts are removed with `python -O`. Use them for internal sanity checks/tests, never to validate user input.

## Handling Exceptions

The `try` and `except` block in Python is used to catch and handle exceptions. The `except` clause determines how your program responds to exceptions.

```python
try:
    with open('file.log') as file:
        read_data = file.read()
except OSError:
    print('Could not open file.log')
```

> ⚠️ Avoid a bare `except:` (or `except Exception:` with `pass`): it also catches `KeyboardInterrupt`/`SystemExit` and hides bugs. Catch only what you expect.

In the [Python docs](https://docs.python.org/3/library/exceptions.html#exception-hierarchy), you can see the built-in exceptions and their hierarchy.

```python
try:
    with open('file.log') as file:
        read_data = file.read()
except FileNotFoundError as fnf_error:
    print(fnf_error)
# [Errno 2] No such file or directory: 'file.log'
```

You can have more than one function call in your `try` clause and anticipate catching various exceptions. In the `try` clause, all statements are executed until an exception is encountered.

```python
def linux_interaction():
    import sys
    assert sys.platform.startswith('linux'), 'Function can only run on Linux systems.'
    print('Doing something.')

try:
    linux_interaction()
    with open('file.log') as file:
        read_data = file.read()
except FileNotFoundError as fnf_error:
    print(fnf_error)
except AssertionError as error:
    print(error)
    print('The linux_interaction() function was not executed')
```

Several exceptions in the same handler:

```python
try:
    value = int(input('Number: '))
    result = 100 / value
except (ValueError, ZeroDivisionError) as e:
    print(f'Invalid input: {e!r}')
# Number: 0   -> Invalid input: ZeroDivisionError('division by zero')
# Number: abc -> Invalid input: ValueError("invalid literal for int() with base 10: 'abc'")
```

> 💡 3.14+: the parentheses are optional when there is no `as`: `except ValueError, ZeroDivisionError:` (PEP 758).

## The `else` Clause

`else` lets you code sections that should run only when no exceptions are encountered in the `try` clause.

```python
try:
    linux_interaction()
except AssertionError as error:
    print(error)
else:
    print('Executing the else clause.')
```

## The `finally` Clause

`finally` enables you to execute sections of code that should always run, with or without any previously encountered exceptions.

```python
try:
    linux_interaction()
except AssertionError as error:
    print(error)
else:
    try:
        with open('file.log') as file:
            read_data = file.read()
    except FileNotFoundError as fnf_error:
        print(fnf_error)
finally:
    print('Cleaning up, irrespective of any exceptions.')
```

> 💡 For resources (files, locks, connections) prefer `with` over `try`/`finally`: it closes them automatically. See [files](files.md).

## Re-raising and chaining

```python
try:
    config = {}['port']
except KeyError as e:
    raise RuntimeError('Missing config') from e   # keeps the original cause
# KeyError: 'port'
#
# The above exception was the direct cause of the following exception:
# ...
# RuntimeError: Missing config
```

- `raise` alone (inside `except`) re-raises the current exception unchanged.
- `raise X from None` hides the original exception.

## Custom Exceptions

Inherit from `Exception` (or a more specific built-in):

```python
class InsufficientFundsError(Exception):
    def __init__(self, balance: float, amount: float):
        super().__init__(f'Balance {balance} is less than {amount}')
        self.balance = balance
        self.amount = amount

try:
    raise InsufficientFundsError(50, 100)
except InsufficientFundsError as e:
    print(e)              # -> Balance 50 is less than 100
    print(e.amount)       # -> 100
```

## `add_note()` (3.11+)

Add extra context to an exception without changing its type. Notes are shown after the message in the traceback:

```python
def parse(line: str, lineno: int) -> int:
    try:
        return int(line)
    except ValueError as e:
        e.add_note(f'while parsing line {lineno}: {line!r}')
        raise

parse('abc', 3)
# Traceback (most recent call last):
#   ...
# ValueError: invalid literal for int() with base 10: 'abc'
# while parsing line 3: 'abc'
```

## Exception Groups and `except*` (3.11+)

`ExceptionGroup` bundles several unrelated exceptions (e.g. from concurrent tasks or a validation that collects all errors). `except*` handles each type in the group separately; more than one `except*` clause can run.

```python
def validate(user: dict) -> None:
    errors = []
    if not user.get('name'):
        errors.append(ValueError('name is required'))
    if not isinstance(user.get('age'), int):
        errors.append(TypeError('age must be an int'))
    if errors:
        raise ExceptionGroup('invalid user', errors)

try:
    validate({'name': '', 'age': '30'})
except* ValueError as eg:
    print('Value errors:', eg.exceptions)
except* TypeError as eg:
    print('Type errors:', eg.exceptions)
# Value errors: (ValueError('name is required'),)
# Type errors: (TypeError('age must be an int'),)
```

`asyncio.TaskGroup` raises an `ExceptionGroup` when tasks fail:

```python
import asyncio

async def fail(msg: str):
    raise ValueError(msg)

async def main():
    try:
        async with asyncio.TaskGroup() as tg:
            tg.create_task(fail('a'))
            tg.create_task(fail('b'))
    except* ValueError as eg:
        print([str(e) for e in eg.exceptions])

asyncio.run(main())   # -> ['a', 'b']
```

## Exceptions with `match`

Sometimes it is cleaner to dispatch on an exception's data:

```python
import json

try:
    json.loads('{"a": }')
except json.JSONDecodeError as e:
    match e:
        case json.JSONDecodeError(lineno=1, colno=col):
            print(f'Bad JSON at column {col}')   # -> Bad JSON at column 7
```

## `contextlib.suppress`

Ignore a specific exception on purpose (cleaner than `try/except: pass`):

```python
from contextlib import suppress
from pathlib import Path

with suppress(FileNotFoundError):
    Path('tmp.txt').unlink()

Path('tmp.txt').unlink(missing_ok=True)   # same thing, for this particular case
```
