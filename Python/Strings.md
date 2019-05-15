# Sequences: Strings

## Index

1. [Introduction](#Index)
    1. [String Literals](#String-Literals)
    1. [Raw Strings](#Raw-Strings)
    1. [Multiline Strings](#Multiline)
    1. [Multiline Comments](#Multiline-Comments)
1. [Formating](#Formating)
    1. [%-formatting](#Formatting)
    1. [str.format()](#str.format())
    1. [f-strings](#f-strings)
        1. [Multiline f-strings](#Multiline-`f-strings`)
1. [Indexing and Slicing](#Indexing-and-Slicing)
1. [in and not in operators](#`in`-and-`not-in`-operators)
1. [Methods](#Methods)
    1. [.lower(), .upper()](#.lower()-.upper())
    1. [.startswith() and .endswith()](#.startswith()-and-.endswith())
    1. [.isX String Methods](#`.isX`-String-Methods)
    1. [.join() .split()](#.join()-.split())
    1. [Justifying Text with .rjust(), .ljust(), and .center()](#Justifying-Text-with-.rjust(),-.ljust(),-and-.center())
    1. [Removing Whitespace with .strip(), .rstrip(), and .lstrip()](#Removing-Whitespace-with-.strip(),-.rstrip(),-and-.lstrip())
    1. [Copying and Pasting Strings with the pyperclip Module](#Copying-and-Pasting-Strings-with-the-pyperclip-Module)

## String Literals

String in Python begin and end with single or double quotes.

```python
'That is Alice\'s cat.'
>>> "That is Alice's cat."
```

```python
# With double quotes a string can have a single quote character in it.
"That is Alice's cat."
>>> "That is Alice's cat."
```

## Raw Strings

```python
print(r'That is Carol\'s cat.')
>>> That is Carol\'s cat.
```

## Multiline

```python
print('''Dear Alice,

Eve's cat has been arrested for catnapping, cat burglary, and extortion.

Sincerely,
Bob''')
```

## Multiline Comments

```powershell
def spam():
    """This is a multiline comment to help
    explain what the spam() function does."""
    print('Hello!')
```

[Back to Top](#Index)

## Formating

### `%-formatting`

```python
name = "Eric"
age = 74
"Hello, %s. You are %s." % (name, age)
>>> 'Hello Eric. You are 74.'
```

### `str.format()`

```python
"Hello, {}. You are {}.".format(name, age)
>>> 'Hello Eric. You are 74.'
```

### `f-strings`

```python
f"Hello, {name}. You are {age}."
'Hello, Eric. You are 74.'
```

#### Multiline `f-strings`

```python
name = "Eric"
profession = "comedian"
affiliation = "Monty Python"
message = (
    f"Hi {name}. "
    f"You are a {profession}. "
    f"You were in {affiliation}."
)
message
>>>'Hi Eric. You are a comedian. You were in Monty Python.'
```

>⚠️ watch out when you are working with dictionaries. If you are going to use single quotation marks for the keys of the dictionary, then remember to make sure you’re using double quotation marks for the f-strings containing the keys.

[Back to Top](#Index)

## Indexing and Slicing

Strings are inmutable.

```python
spam = 'Hello world!'
spam[0]
>>> 'H'

spam[4]
>>> 'o'

spam[-1]
>>> '!'

spam[0:5]
>>> 'Hello'

spam[:5]
>>> 'Hello'

spam[6:]
>>> 'world!'
```

[Back to Top](#Index)

## `in` and `not in` operators

```python
'Hello' in 'Hello World'
>>> True

'Hello' in 'Hello'
>>> True

'HELLO' in 'Hello World'
>>> False

'' in 'spam'
>>> True

'cats' not in 'cats and dogs'
>>> False
```

[Back to Top](#Index)

## Methods

### `.lower()` `.upper()`

```python
spam = 'Hello world!'
spam = spam.upper()
spam
>>> 'HELLO WORLD!'
spam = spam.lower()
spam
>>> 'hello world!'
```

```python
spam = 'Hello world!'
spam.islower()
>>> False

spam.isupper()
False

'HELLO'.isupper()
>>> True

'abc12345'.islower()
>>> True

'12345'.islower()
>>> False

'12345'.isupper()
>>> False
```

[Back to Top](#Index)

### `.startswith()` and `.endswith()`

```python
'Hello world!'.startswith('Hello')
>>> True

'Hello world!'.endswith('world!')
>>> True

'abc123'.startswith('abcdef')
>>> False

'abc123'.endswith('12')
>>> False

'Hello world!'.startswith('Hello world!')
>>> True

'Hello world!'.endswith('Hello world!')
>>> True
```

[Back to Top](#Index)

### `.isX` String Methods

- `isalpha()` returns True if the string consists only of letters and is not blank.
- `isalnum()` returns True if the string consists only of letters and numbers and is not blank.
- `isdecimal()` returns True if the string consists only of numeric characters and is not blank.
- `isspace()` returns True if the string consists only of spaces, tabs, and new-lines and is not blank.
- `istitle()` returns True if the string consists only of words that begin with an uppercase letter followed by only lowercase letters.

```python
'hello'.isalpha()
>>> True

'hello123'.isalpha()
>>> False

'hello123'.isalnum()
>>> True

'hello'.isalnum()
>>> True

'123'.isdecimal()
>>> True

'    '.isspace()
>>> True

'This Is Title Case'.istitle()
>>> True

'This Is Title Case 123'.istitle()
>>> True

'This Is not Title Case'.istitle()
>>> False

'This Is NOT Title Case Either'.istitle()
>>> False
```

[Back to Top](#Index)

### `.join()` `.split()`

```python
', '.join(['cats', 'rats', 'bats'])
>>> 'cats, rats, bats'

' '.join(['My', 'name', 'is', 'Simon'])
>>> 'My name is Simon'

'ABC'.join(['My', 'name', 'is', 'Simon'])
>>> 'MyABCnameABCisABCSimon'

'My name is Simon'.split()
>>> ['My', 'name', 'is', 'Simon']

'MyABCnameABCisABCSimon'.split('ABC')
>>> ['My', 'name', 'is', 'Simon']

'My name is Simon'.split('m')
>>> ['My na', 'e is Si', 'on']
```

[Back to Top](#Index)

### Justifying Text with `.rjust()`, `.ljust()`, and `.center()`

```python
'Hello'.rjust(10)
>>> '     Hello'

'Hello'.rjust(20)
>>> '               Hello'

'Hello World'.rjust(20)
>>> '         Hello World'

'Hello'.ljust(10)
>>> 'Hello     '

'Hello'.rjust(20, '*')
>>> '***************Hello'

'Hello'.ljust(20, '-')
>>> 'Hello---------------'

'Hello'.center(20)
>>> '       Hello       '

'Hello'.center(20, '=')
>>> '=======Hello========'
```

[Back to Top](#Index)

### Removing Whitespace with `.strip()`, `.rstrip()`, and `.lstrip()`

```python
spam = '    Hello World     '
spam.strip()
>>> 'Hello World'

spam.lstrip()
>>> 'Hello World '

spam.rstrip()
>>> '    Hello World'

spam = 'SpamSpamBaconSpamEggsSpamSpam'
spam.strip('ampS')
>>> 'BaconSpamEggs'
```

[Back to Top](#Index)

## Copying and Pasting Strings with the `pyperclip` Module

```python
import pyperclip

pyperclip.copy('Hello world!')
pyperclip.paste()
>>> 'Hello world!'
```