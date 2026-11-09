# Sequences: Lists

Lists are ordered, **mutable** sequences. They can hold any type (even mixed).

See also: [tuples](tuples.md) (immutable sequences) · [sort](sort.md) · [loops](loops.md) (iterating, comprehensions) · [strings](strings.md)

```python
>>> [1, 2, 3]
[1, 2, 3]
>>> ['cat', 1, 1.3, None, True]
['cat', 1, 1.3, None, True]
>>> list('abc')
['a', 'b', 'c']
>>> len(['a', 'b', 'c'])
3
```

With type hints (3.9+ built-in generics):

```python
names: list[str] = ['Ana', 'Bob']
matrix: list[list[int]] = [[1, 2], [3, 4]]
maybe: list[int | None] = [1, None, 3]
```

## Indexes and slices

```python
>>> arr = ['cat', 'bat', 'rat', 'elephant']

>>> arr[0]
'cat'
>>> arr[2]
'rat'
>>> arr[int(1.0)]   # indexes must be int
'bat'
>>> arr[-1]
'elephant'
>>> arr[4]
Traceback (most recent call last):
IndexError: list index out of range
```

Slices `[start:stop:step]` (stop not included) return a **new** list:

```python
>>> arr[1:3]
['bat', 'rat']
>>> arr[1:]
['bat', 'rat', 'elephant']
>>> arr[:2]
['cat', 'bat']
>>> arr[:]          # shallow copy
['cat', 'bat', 'rat', 'elephant']
>>> arr[::2]        # every 2nd element
['cat', 'rat']
>>> arr[::-1]       # reversed copy
['elephant', 'rat', 'bat', 'cat']
```

## Changing Values

```python
>>> spam = ['cat', 'bat', 'rat', 'elephant']
>>> spam[1] = 'aardvark'
>>> spam
['cat', 'aardvark', 'rat', 'elephant']

>>> spam[2] = spam[1]
>>> spam
['cat', 'aardvark', 'aardvark', 'elephant']

>>> spam[-1] = 12345
>>> spam
['cat', 'aardvark', 'aardvark', 12345]

>>> spam[1:3] = ['X', 'Y', 'Z']   # replace a slice (sizes may differ)
>>> spam
['cat', 'X', 'Y', 'Z', 12345]
```

## Adding values

### `append()`, `insert()` and `extend()`

```python
>>> spam = ['cat', 'dog', 'bat']
>>> spam.append('moose')            # add one item at the end
>>> spam
['cat', 'dog', 'bat', 'moose']

>>> spam = ['cat', 'dog', 'bat']
>>> spam.insert(1, 'chicken')       # insert before index 1
>>> spam
['cat', 'chicken', 'dog', 'bat']

>>> spam = ['cat', 'dog']
>>> spam.extend(['ant', 'eel'])     # add every item of an iterable (= spam += [...])
>>> spam
['cat', 'dog', 'ant', 'eel']
>>> spam.append(['x', 'y'])         # append adds the list as ONE item
>>> spam
['cat', 'dog', 'ant', 'eel', ['x', 'y']]
```

## Removing values

```python
>>> spam = ['cat', 'bat', 'rat', 'elephant']
>>> del spam[2]
>>> spam
['cat', 'bat', 'elephant']
>>> del spam[2]
>>> spam
['cat', 'bat']
```

```python
>>> spam = ['cat', 'bat', 'rat', 'elephant', 'bat']
>>> spam.remove('bat')      # removes the FIRST match (ValueError if missing)
>>> spam
['cat', 'rat', 'elephant', 'bat']

>>> spam.pop()              # removes and returns the last item
'bat'
>>> spam.pop(0)             # ... or the one at an index
'cat'
>>> spam
['rat', 'elephant']

>>> spam.clear()
>>> spam
[]
```

> ⚠️ Don't remove items from a list while iterating over it. Build a new one instead: `spam = [x for x in spam if x != 'bat']`.

## Concatenation and replication

```python
>>> [1, 2, 3] + ['A', 'B', 'C']
[1, 2, 3, 'A', 'B', 'C']

>>> ['X', 'Y', 'Z'] * 3
['X', 'Y', 'Z', 'X', 'Y', 'Z', 'X', 'Y', 'Z']

>>> spam = [1, 2, 3]
>>> spam += ['A', 'B', 'C']
>>> spam
[1, 2, 3, 'A', 'B', 'C']

>>> [*[1, 2], 0, *[3, 4]]   # unpacking
[1, 2, 0, 3, 4]
```

> ⚠️ `[[]] * 3` creates 3 references to the **same** inner list. Use `[[] for _ in range(3)]`.

## `in` and `not in` operator

```python
>>> 'howdy' in ['hello', 'hi', 'howdy', 'heyas']
True

>>> spam = ['hello', 'hi', 'howdy', 'heyas']
>>> 'cat' in spam
False
>>> 'howdy' not in spam
False
>>> 'cat' not in spam
True
```

## Unpacking

```python
>>> cat = ['fat', 'orange', 'loud']
>>> size, color, disposition = cat
>>> color
'orange'

>>> first, *rest = [1, 2, 3, 4]
>>> first, rest
(1, [2, 3, 4])

>>> *_, last = [1, 2, 3, 4]
>>> last
4
```

## Useful built-ins

```python
>>> nums = [3, 1, 4, 1, 5, 9]
>>> len(nums), min(nums), max(nums), sum(nums)
(6, 1, 9, 23)
>>> sorted(nums)               # new list (see sort.md)
[1, 1, 3, 4, 5, 9]
>>> list(reversed(nums))
[9, 5, 1, 4, 1, 3]
>>> any(n > 8 for n in nums), all(n > 0 for n in nums)
(True, True)
>>> list(enumerate(['a', 'b']))
[(0, 'a'), (1, 'b')]
```

## List comprehensions

```python
>>> [x * 2 for x in range(5)]
[0, 2, 4, 6, 8]
>>> [w.upper() for w in ['cat', 'dog', 'eel'] if w != 'dog']
['CAT', 'EEL']
>>> [n if n > 0 else 0 for n in [-2, 3, -1, 5]]   # if/else goes before the for
[0, 3, 0, 5]
>>> [y for row in [[1, 2], [3, 4]] for y in row]    # flatten
[1, 2, 3, 4]
```

## Methods

### `index()` and `count()`

```python
>>> spam = ['hello', 'hi', 'howdy', 'heyas', 'hi']
>>> spam.index('hello')
0
>>> spam.index('hi')       # first match
1
>>> spam.count('hi')
2
>>> spam.index('bye')
Traceback (most recent call last):
ValueError: 'bye' is not in list
```

### `sort()` and `reverse()`

`sort()` sorts **in place** and returns `None`. See [sort](sort.md) for `sorted()` and the `key` parameter.

```python
>>> spam = [2, 5, 3.14, 1, -7]
>>> spam.sort()
>>> spam
[-7, 1, 2, 3.14, 5]

>>> spam = ['ants', 'cats', 'dogs', 'badgers', 'elephants']
>>> spam.sort()
>>> spam
['ants', 'badgers', 'cats', 'dogs', 'elephants']

>>> spam.sort(reverse=True)
>>> spam
['elephants', 'dogs', 'cats', 'badgers', 'ants']

>>> spam = ['a', 'z', 'A', 'Z']
>>> spam.sort(key=str.lower)
>>> spam
['a', 'A', 'z', 'Z']

>>> spam.reverse()          # in place, no sorting
>>> spam
['Z', 'z', 'A', 'a']
```

> ⚠️ `spam = spam.sort()` sets `spam` to `None`.

### `copy()` and `deepcopy()`

Assignment (`b = a`) does **not** copy: both names point to the same list.

```python
>>> a = [1, 2, 3]
>>> b = a
>>> b.append(4)
>>> a
[1, 2, 3, 4]
```

`copy.copy()` (or `lst.copy()`, `lst[:]`) makes a shallow copy of a mutable value like a list or dictionary, not just a copy of a reference:

```python
>>> import copy
>>> spam = ['A', 'B', 'C', 'D']
>>> cheese = copy.copy(spam)
>>> cheese[1] = 42
>>> spam
['A', 'B', 'C', 'D']
>>> cheese
['A', 42, 'C', 'D']
```

A shallow copy still shares the inner lists. Use `copy.deepcopy()` for nested structures:

```python
>>> nested = [[1, 2], [3, 4]]
>>> shallow = nested.copy()
>>> deep = copy.deepcopy(nested)
>>> nested[0].append(99)
>>> shallow
[[1, 2, 99], [3, 4]]
>>> deep
[[1, 2], [3, 4]]
```

## Lists as stacks and queues

```python
>>> stack = [1, 2]
>>> stack.append(3)        # push
>>> stack.pop()            # pop -> LIFO
3

>>> from collections import deque
>>> queue = deque(['a', 'b'])
>>> queue.append('c')      # enqueue
>>> queue.popleft()        # dequeue -> FIFO, O(1) (list.pop(0) is O(n))
'a'
```
