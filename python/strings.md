# Sequences: Strings

See also: [lists](lists.md) (`split`/`join`) · [files](files.md) (reading text) · [sort](sort.md) (sorting strings)

## String Literals

Strings in Python begin and end with single or double quotes.

```python
>>> 'That is Alice\'s cat.'
"That is Alice's cat."

>>> # With double quotes a string can have a single quote character in it.
>>> "That is Alice's cat."
"That is Alice's cat."
```

Common escape sequences: `\'`, `\"`, `\\`, `\n` (newline), `\t` (tab), `\u00e9` (Unicode code point).

```python
>>> print('Hello\tthere!\nHow are you?\nI\'m doing fine.')
Hello	there!
How are you?
I'm doing fine.
```

## Raw Strings

A raw string (`r'...'`) ignores escape characters. Useful for Windows paths and regular expressions.

```python
>>> print(r'That is Carol\'s cat.')
That is Carol\'s cat.
>>> print(r'C:\Users\new\table')
C:\Users\new\table
```

## Multiline

```python
>>> print('''Dear Alice,
...
... Eve's cat has been arrested for catnapping, cat burglary, and extortion.
...
... Sincerely,
... Bob''')
Dear Alice,
<BLANKLINE>
Eve's cat has been arrested for catnapping, cat burglary, and extortion.
<BLANKLINE>
Sincerely,
Bob
```

Use `textwrap.dedent()` to write indented multiline strings inside functions:

```python
>>> from textwrap import dedent
>>> print(dedent('''\
...     line 1
...       line 2'''))
line 1
  line 2
```

## Multiline Comments (docstrings)

Python has no block comments: a triple-quoted string as the first statement of a function/class/module is its **docstring** (shown by `help()`).

```python
def spam():
    """This is a multiline comment to help
    explain what the spam() function does."""
    print('Hello!')

spam.__doc__.splitlines()[0]
# -> 'This is a multiline comment to help'
```

## Formatting

### %-formatting (old style)

```python
>>> name = "Eric"
>>> age = 74
>>> "Hello, %s. You are %s." % (name, age)
'Hello, Eric. You are 74.'
```

### format()

```python
>>> "Hello, {}. You are {}.".format(name, age)
'Hello, Eric. You are 74.'
>>> "Hello, {n}. You are {a}.".format(n=name, a=age)
'Hello, Eric. You are 74.'
```

### f-strings (preferred)

```python
>>> f"Hello, {name}. You are {age}."
'Hello, Eric. You are 74.'
>>> f"{name.upper()} will be {age + 1} next year"     # any expression
'ERIC will be 75 next year'
```

#### Format spec: `{value:spec}`

```python
>>> pi = 3.14159265
>>> f"{pi:.2f}"            # 2 decimals
'3.14'
>>> f"{1234567.891:,.2f}"  # thousands separator
'1,234,567.89'
>>> f"{0.256:.1%}"         # percentage
'25.6%'
>>> f"{42:05d}"            # zero padding
'00042'
>>> f"{'left':<10}|{'center':^10}|{'right':>10}"
'left      |  center  |     right'
>>> f"{'x':*^7}"          # fill character
'***x***'
>>> f"{255:b} {255:o} {255:x} {255:#x}"
'11111111 377 ff 0xff'
>>> width = 8
>>> f"{pi:{width}.3f}"     # nested fields
'   3.142'
>>> from datetime import date
>>> f"{date(2026, 1, 31):%d/%m/%Y}"
'31/01/2026'
```

#### `=` for debugging (3.8+) and `!r`

```python
>>> x, user = 10, 'ana'
>>> f"{x=}"
'x=10'
>>> f"{x * 2 = }"           # spaces are kept
'x * 2 = 20'
>>> f"{user=}  {user!r}  {user!s}"
"user='ana'  'ana'  ana"
>>> f"{pi=:.2f}"
'pi=3.14'
>>> f"{{literal braces}}"
'{literal braces}'
```

#### Quotes inside f-strings (PEP 701, 3.12+)

Since 3.12 you can reuse the same quote type, use backslashes and comments inside `{}`:

```python
>>> person = {'name': 'Ana', 'langs': ['es', 'en']}
>>> f"{person["name"]} speaks {", ".join(person["langs"])}"   # 3.12+
'Ana speaks es, en'
>>> f"{'\n'.join(['a', 'b'])}"                                  # backslash: 3.12+
'a\nb'
```

> ⚠️ Before 3.12, reusing the outer quote inside `{}` is a `SyntaxError`: use the other quote type (`f"{person['name']}"`).

#### Multiline f-strings

```python
>>> name = "Eric"
>>> profession = "comedian"
>>> affiliation = "Monty Python"
>>> message = (
...     f"Hi {name}. "
...     f"You are a {profession}. "
...     f"You were in {affiliation}."
... )
>>> message
'Hi Eric. You are a comedian. You were in Monty Python.'
```

#### Template strings (3.14+)

`t"..."` looks like an f-string but returns a `string.templatelib.Template` object (the static parts + the interpolated values) instead of a `str`, so a library can process the values safely (escape HTML, parametrize SQL...) before building the final string (PEP 750).

```python
from string.templatelib import Template
user_input = '<script>'
t = t"<p>{user_input}</p>"
isinstance(t, Template)   # -> True
t.values                  # -> ('<script>',)
```

## Indexing and Slicing

Strings are immutable: methods return a **new** string.

```python
>>> spam = 'Hello world!'
>>> spam[0]
'H'
>>> spam[4]
'o'
>>> spam[-1]
'!'
>>> spam[0:5]
'Hello'
>>> spam[:5]
'Hello'
>>> spam[6:]
'world!'
>>> spam[::-1]
'!dlrow olleH'
>>> spam[0] = 'J'
Traceback (most recent call last):
TypeError: 'str' object does not support item assignment
```

## in and not in operators

```python
>>> 'Hello' in 'Hello World'
True
>>> 'Hello' in 'Hello'
True
>>> 'HELLO' in 'Hello World'
False
>>> '' in 'spam'
True
>>> 'cats' not in 'cats and dogs'
False
```

## Concatenation

```python
>>> 'Hello' + ' ' + 'world' + '!' * 3
'Hello world!!!'
>>> 'Age: ' + str(30)        # str + int -> TypeError; convert, or use an f-string
'Age: 30'
```

> 💡 To build a string in a loop, collect parts in a list and `''.join(parts)` at the end (faster than `+=`).

## Methods

### lower() upper() title() capitalize() casefold()

```python
>>> spam = 'Hello world!'
>>> spam = spam.upper()
>>> spam
'HELLO WORLD!'
>>> spam = spam.lower()
>>> spam
'hello world!'
>>> spam.title(), spam.capitalize(), 'HeLLo'.swapcase()
('Hello World!', 'Hello world!', 'hEllO')
>>> 'Straße'.casefold() == 'STRASSE'.casefold()   # for case-insensitive comparisons
True
```

```python
>>> spam = 'Hello world!'
>>> spam.islower()
False
>>> spam.isupper()
False
>>> 'HELLO'.isupper()
True
>>> 'abc12345'.islower()
True
>>> '12345'.islower()
False
>>> '12345'.isupper()
False
```

### startswith() and endswith()

```python
>>> 'Hello world!'.startswith('Hello')
True
>>> 'Hello world!'.endswith('world!')
True
>>> 'abc123'.startswith('abcdef')
False
>>> 'abc123'.endswith('12')
False
>>> 'Hello world!'.startswith('Hello world!')
True
>>> 'Hello world!'.endswith('Hello world!')
True
>>> 'report.pdf'.endswith(('.pdf', '.docx'))   # a tuple checks several options
True
```

### removeprefix() and removesuffix() (3.9+)

```python
>>> 'test_login.py'.removeprefix('test_')
'login.py'
>>> 'test_login.py'.removesuffix('.py')
'test_login'
>>> 'login.py'.removeprefix('test_')     # no match -> unchanged
'login.py'
```

> ⚠️ Not the same as `strip('test_')`, which removes any of the characters `t`, `e`, `s`, `_` from both ends.

### isX String Methods

- `isalpha()` returns True if the string consists only of letters and is not blank.
- `isalnum()` returns True if the string consists only of letters and numbers and is not blank.
- `isdecimal()` returns True if the string consists only of numeric characters and is not blank.
- `isspace()` returns True if the string consists only of spaces, tabs, and new-lines and is not blank.
- `istitle()` returns True if the string consists only of words that begin with an uppercase letter followed by only lowercase letters (non-letters are ignored).
- `isidentifier()` returns True if the string is a valid Python name.

```python
>>> 'hello'.isalpha()
True
>>> 'hello123'.isalpha()
False
>>> 'hello123'.isalnum()
True
>>> 'hello'.isalnum()
True
>>> '123'.isdecimal()
True
>>> '-123'.isdecimal()      # sign and dot are not digits: use int()/float() in a try
False
>>> '    '.isspace()
True
>>> 'This Is Title Case'.istitle()
True
>>> 'This Is Title Case 123'.istitle()
True
>>> 'This Is not Title Case'.istitle()
False
>>> 'This Is NOT Title Case Either'.istitle()
False
```

### find() index() count() replace()

```python
>>> s = 'one two one two'
>>> s.find('two')           # first index, -1 if not found
4
>>> s.rfind('two')          # last index
12
>>> s.find('six')
-1
>>> s.index('six')          # like find() but raises
Traceback (most recent call last):
ValueError: substring not found
>>> s.count('one')
2
>>> s.replace('one', '1')
'1 two 1 two'
>>> s.replace('one', '1', 1)   # max replacements
'1 two one two'
```

### join() split() partition()

```python
>>> ', '.join(['cats', 'rats', 'bats'])
'cats, rats, bats'
>>> ' '.join(['My', 'name', 'is', 'Simon'])
'My name is Simon'
>>> 'ABC'.join(['My', 'name', 'is', 'Simon'])
'MyABCnameABCisABCSimon'
>>> '-'.join(str(n) for n in [1, 2, 3])     # join needs str items
'1-2-3'

>>> 'My name is Simon'.split()              # any whitespace, ignores repeats
['My', 'name', 'is', 'Simon']
>>> 'MyABCnameABCisABCSimon'.split('ABC')
['My', 'name', 'is', 'Simon']
>>> 'My name is Simon'.split('m')
['My na', 'e is Si', 'on']
>>> 'a,b,,c'.split(',')
['a', 'b', '', 'c']
>>> 'key=value=x'.split('=', maxsplit=1)
['key', 'value=x']
>>> 'line1\nline2\r\nline3'.splitlines()
['line1', 'line2', 'line3']

>>> 'user@example.com'.partition('@')       # always a 3-tuple
('user', '@', 'example.com')
>>> key, _, value = 'host=localhost'.partition('=')
>>> value
'localhost'
```

### Justifying Text with rjust(), ljust(), center() and zfill()

```python
>>> 'Hello'.rjust(10)
'     Hello'
>>> 'Hello'.rjust(20)
'               Hello'
>>> 'Hello World'.rjust(20)
'         Hello World'
>>> 'Hello'.ljust(10)
'Hello     '
>>> 'Hello'.rjust(20, '*')
'***************Hello'
>>> 'Hello'.ljust(20, '-')
'Hello---------------'
>>> 'Hello'.center(20)
'       Hello        '
>>> 'Hello'.center(20, '=')
'=======Hello========'
>>> '42'.zfill(5)
'00042'
```

### Removing Whitespace with strip(), rstrip(), and lstrip()

```python
>>> spam = '    Hello World     '
>>> spam.strip()
'Hello World'
>>> spam.lstrip()
'Hello World     '
>>> spam.rstrip()
'    Hello World'

>>> spam = 'SpamSpamBaconSpamEggsSpamSpam'
>>> spam.strip('ampS')     # removes any of these characters from both ends
'BaconSpamEggs'
```

## Matching strings with `match`

```python
>>> def command(text: str) -> str:
...     match text.split():
...         case ['go', ('north' | 'south') as direction]:
...             return f'going {direction}'
...         case ['say', *words]:
...             return ' '.join(words)
...         case ['quit' | 'exit']:
...             return 'bye'
...         case _:
...             return f'unknown: {text!r}'
>>> command('go north'), command('say hi there'), command('exit'), command('jump')
('going north', 'hi there', 'bye', "unknown: 'jump'")
```

## Bytes and encodings

```python
>>> 'café'.encode('utf-8')        # str -> bytes
b'caf\xc3\xa9'
>>> b'caf\xc3\xa9'.decode('utf-8')  # bytes -> str
'café'
>>> len('café'), len('café'.encode())
(4, 5)
>>> ord('A'), chr(65)
(65, 'A')
```

## Copying and Pasting Strings with the pyperclip Module

Third-party module: `python -m pip install pyperclip` (see [pip](pip.md)).

```python
import pyperclip

pyperclip.copy('Hello world!')
pyperclip.paste()
# -> 'Hello world!'
```
