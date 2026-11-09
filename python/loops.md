# Loops

See also: [lists](lists.md) · [tuples](tuples.md) (unpacking) · [sort](sort.md) · [dir](dir.md) (iterating over files)

## For Loop

```python
for <var> in <iterable>:
    <statement(s)>
```

```python
a = ['foo', 'bar', 'baz']
for i in a:
    print(i)
# foo
# bar
# baz
```

## The `range()` Function

- `range(<begin>, <end>, <stride>)`
- returns an iterable that yields integers starting with `<begin>`, up to but not including `<end>`.
- If specified, `<stride>` indicates an amount to skip between values (can be negative).

```python
>>> list(range(5, 20, 3))
[5, 8, 11, 14, 17]

>>> list(range(5, 10))
[5, 6, 7, 8, 9]

>>> list(range(4))
[0, 1, 2, 3]

>>> list(range(10, 0, -3))
[10, 7, 4, 1]
```

> 💡 Don't write `for i in range(len(a))`: iterate directly, or use `enumerate()` if you need the index.

## `enumerate()`: index + value

```python
>>> for i, name in enumerate(['foo', 'bar', 'baz']):
...     print(i, name)
0 foo
1 bar
2 baz

>>> list(enumerate('abc', start=1))
[(1, 'a'), (2, 'b'), (3, 'c')]
```

## `zip()`: several iterables in parallel

```python
>>> names = ['Ana', 'Bob', 'Eve']
>>> ages = [30, 25, 41]
>>> for name, age in zip(names, ages):
...     print(f"{name}: {age}")
Ana: 30
Bob: 25
Eve: 41

>>> dict(zip(names, ages))
{'Ana': 30, 'Bob': 25, 'Eve': 41}
```

`zip()` stops at the shortest iterable silently. Use `strict=True` (3.10+) to get an error when lengths differ:

```python
>>> list(zip([1, 2, 3], ['a', 'b']))
[(1, 'a'), (2, 'b')]

>>> list(zip([1, 2, 3], ['a', 'b'], strict=True))
ValueError: zip() argument 2 is shorter than argument 1
```

## `reversed()` and `sorted()`

```python
>>> for x in reversed([1, 2, 3]):
...     print(x, end=' ')
3 2 1

>>> for word in sorted(['pear', 'Fig', 'apple'], key=str.lower):
...     print(word, end=' ')
apple Fig pear
```

## `break`, `continue` and the `else` Clause

- `break` exits the loop.
- `continue` skips to the next iteration.

```python
>>> for n in range(10):
...     if n % 2:
...         continue      # skip odd numbers
...     if n > 6:
...         break
...     print(n, end=' ')
0 2 4 6
```

A for loop can have an `else` clause as well. The `else` clause will be executed if the loop terminates through exhaustion of the iterable:

```python
for i in ['foo', 'bar', 'baz', 'qux']:
    print(i)
else:
    print('Done.')  # Will execute
```

The `else` clause won't be executed if the loop is exited with a `break` statement. Typical use: "search, and do something if not found":

```python
for i in ['foo', 'bar', 'baz', 'qux']:
    if i == 'bar':
        break
    print(i)
else:
    print('Done.')  # Will not execute
# foo
```

## Iterating through a Dictionary

```python
d = {'a': 1, 'b': 2, 'c': 3}

for k in d:                 # keys
    print(k, d[k])

for v in d.values():        # values
    print(v)

for k, v in d.items():      # keys and values (most common)
    print(f"{k}={v}")
# a=1
# b=2
# c=3
```

> ⚠️ Don't add/remove keys while iterating a dict (`RuntimeError: dictionary changed size during iteration`). Iterate over a copy: `for k in list(d): ...`

## Unpacking in the loop variable

```python
>>> for i, j in [(1, 2), (3, 4), (5, 6)]:
...     print(i, j)
1 2
3 4
5 6

>>> for first, *rest in [[1, 2, 3], [4, 5]]:
...     print(first, rest)
1 [2, 3]
4 [5]
```

## While Loop

```python
n = 3
while n > 0:
    print(n)
    n -= 1
else:
    print('Liftoff!')   # also runs unless the loop was broken out of
# 3
# 2
# 1
# Liftoff!
```

Infinite loop with `break`:

```python
while True:
    answer = input('Type "quit" to exit: ')
    if answer == 'quit':
        break
```

### Walrus operator `:=` (3.8+)

Assign and test in the same expression:

```python
# read until the user types an empty line
while (line := input('> ')) != '':
    print(f'You typed {line!r}')

# read a file in chunks
with open('data.bin', 'rb') as f:
    while chunk := f.read(4096):
        process(chunk)
```

## Comprehensions

A compact way to build lists/dicts/sets from a loop:

```python
>>> [x * x for x in range(5)]
[0, 1, 4, 9, 16]

>>> [x for x in range(10) if x % 3 == 0]
[0, 3, 6, 9]

>>> {name: len(name) for name in ['Ana', 'Bob', 'Carla']}
{'Ana': 3, 'Bob': 3, 'Carla': 5}

>>> sorted({c for c in 'mississippi'})  # set comprehension (sets are unordered)
['i', 'm', 'p', 's']

>>> sum(x * x for x in range(5))         # generator expression: no intermediate list
30

>>> [(x, y) for x in range(2) for y in 'ab']   # nested loops
[(0, 'a'), (0, 'b'), (1, 'a'), (1, 'b')]
```

## `itertools`: useful iterators

```python
>>> from itertools import batched, chain, pairwise, product, islice, count

>>> list(batched('ABCDEFG', 3))          # chunks of n (3.12+)
[('A', 'B', 'C'), ('D', 'E', 'F'), ('G',)]

>>> list(pairwise([1, 2, 3, 4]))         # consecutive pairs (3.10+)
[(1, 2), (2, 3), (3, 4)]

>>> list(chain([1, 2], [3], [4, 5]))     # concatenate iterables
[1, 2, 3, 4, 5]

>>> list(product('ab', [0, 1]))          # cartesian product (= nested for)
[('a', 0), ('a', 1), ('b', 0), ('b', 1)]

>>> list(islice(count(10, 5), 4))         # slice of an infinite iterator
[10, 15, 20, 25]
```

> 💡 `batched(it, n, strict=True)` (3.13+) raises `ValueError` if the last batch is incomplete.
