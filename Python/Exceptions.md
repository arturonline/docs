# Exceptions

## `Raise` an Exception

`raise` allows you to throw an exception at any time.

```python
x = 10
if x > 5:
    raise Exception('x should not exceed 5.')
```

## The `AssertionError` Exception

Instead of waiting for a program to crash midway, you can also start by making an assertion in Python. `assert` enables you to verify if a certain condition is met and throw an exception if it isn’t.

```python
import sys
assert ('linux' in sys.platform), "This code runs on Linux only."
```

## Handling Exceptions

The `try` and `except block` in Python is used to catch and handle exceptions. The `except clause` determines how your program responds to exceptions.

```python
try:
    with open('file.log') as file:
        read_data = file.read()
except:
    print('Could not open file.log')
```

In the [Python docs](https://docs.python.org/3/library/exceptions.html), you can see that there are a lot of built-in exceptions that you can use.

```python
try:
    with open('file.log') as file:
        read_data = file.read()
except FileNotFoundError as fnf_error:
    print(fnf_error)
```

You can have more than one function call in your `try clause` and anticipate catching various exceptions. In the `try clause`, all statements are executed until an `exception` is encountered.

```python
try:
    linux_interaction()
    with open('file.log') as file:
        read_data = file.read()
except FileNotFoundError as fnf_error:
    print(fnf_error)
except AssertionError as error:
    print(error)
    print('Linux linux_interaction() function was not executed')
```

## The `else` Clause

`else` lets you code sections that should run only when no exceptions are encountered in the try clause.

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