# For Loop

```python
for i = 1 to 10
    print(i)
```

```python
for (i = 1; i <= 10; i++)
    print(i)
```

```python
a = ['foo', 'bar', 'baz']
for i in a:
    print(i)
```

## Iterating through a Dictionary

```python
for k in d:
    print(d[k])
```

```python
for v in d.values():
    print(v)
```

```python
for i, j in [(1, 2), (3, 4), (5, 6)]:
    print(i, j)
```

## The `else` Clause

A for loop can have an `else clause` as well. The `else clause` will be executed if the loop terminates through exhaustion of the iterable:

```python
for i in ['foo', 'bar', 'baz', 'qux']:
    print(i)
else:
    print('Done.')  # Will execute
```

The `else clause` won’t be executed if the list is broken out of with a break statement:

```python
for i in ['foo', 'bar', 'baz', 'qux']:
    if i == 'bar':
        break
    print(i)
else:
    print('Done.')  # Will not execute
```

## The `range()` Function

`range(<begin>, <end>, <stride>)` returns an iterable that yields integers starting with `<begin>`, up to but not including `<end>`. If specified, `<stride>` indicates an amount to skip between values (analogous to the stride value used for string and list slicing):

```python
list(range(5, 20, 3))
>>> [5, 8, 11, 14, 17]

list(range(5, 10))
>>> [5, 6, 7, 8, 9]
```