# Sequences: Tuples

The tuple data type is almost identical to the list data type, except in two ways. First, tuples are typed with parentheses, `(` and `)`, instead of square brackets, `[` and `]`. For example, enter the following into the interactive shell:

See also: [lists](lists.md) · [loops](loops.md) (unpacking in `for`) · [clases](clases.md) (dataclasses)

```python
>>> eggs = ('hello', 42, 0.5)
>>> eggs[0]
'hello'
>>> eggs[1:3]
(42, 0.5)
>>> len(eggs)
3
```

But the main way that tuples are different from lists is that tuples, like strings, are **immutable**. Tuples cannot have their values modified, appended, or removed.

```python
>>> eggs[1] = 99
Traceback (most recent call last):
TypeError: 'tuple' object does not support item assignment
```

> 💡 Use tuples for fixed collections of values (coordinates, records, function returns). Being immutable (and hashable if their items are), they can be dict keys or set members: `{(0, 0): 'origin'}`.

The comma makes the tuple, not the parentheses:

```python
>>> t = 1, 2, 3
>>> t
(1, 2, 3)
>>> type(('hello',))     # one-element tuple needs a trailing comma
<class 'tuple'>
>>> type(('hello'))      # this is just a str in parentheses
<class 'str'>
>>> ()                   # empty tuple
()
```

Tuple methods: only `count()` and `index()`.

```python
>>> (1, 2, 2, 3).count(2)
2
>>> (1, 2, 2, 3).index(3)
3
```

## Converting types

```python
>>> tuple(['cat', 'dog', 5])
('cat', 'dog', 5)

>>> list(('cat', 'dog', 5))
['cat', 'dog', 5]

>>> list('hello')
['h', 'e', 'l', 'l', 'o']
```

## Destructuring (unpacking)

```python
>>> cat = ['fat', 'orange', 'loud']
>>> size = cat[0]
>>> color = cat[1]
>>> disposition = cat[2]

>>> # instead, you could type this line of code:
>>> size, color, disposition = cat
>>> disposition
'loud'
```

The number of variables must match, unless you use `*`:

```python
>>> a, b = (1, 2, 3)
Traceback (most recent call last):
ValueError: too many values to unpack (expected 2)

>>> head, *tail = (1, 2, 3)
>>> head, tail             # the starred name is always a list
(1, [2, 3])

>>> (x, y), z = (1, 2), 3  # nested
>>> x, y, z
(1, 2, 3)
```

Swap variables and return several values from a function:

```python
>>> a, b = 1, 2
>>> a, b = b, a
>>> a, b
(2, 1)

>>> def min_max(nums: list[int]) -> tuple[int, int]:
...     return min(nums), max(nums)
>>> lo, hi = min_max([3, 1, 4])
>>> lo, hi
(1, 4)
```

### Type hints

```python
point: tuple[float, float] = (1.0, 5.0)       # fixed length
row: tuple[str, int, bool] = ('Ana', 30, True)
nums: tuple[int, ...] = (1, 2, 3)             # any length, all int

type Point = tuple[float, float]              # type alias (3.12+)
```

### Pattern matching (`match`)

```python
>>> def where(point: tuple[int, int]) -> str:
...     match point:
...         case (0, 0):
...             return 'origin'
...         case (0, y):
...             return f'on Y axis at {y}'
...         case (x, 0):
...             return f'on X axis at {x}'
...         case (x, y):
...             return f'at {x=}, {y=}'
>>> where((0, 0)), where((0, 5)), where((3, 4))
('origin', 'on Y axis at 5', 'at x=3, y=4')
```

## Named Tuples

Named tuples are easy-to-create, lightweight object types. Named tuple instances can be referenced using object-like attribute access or the standard tuple syntax. They can be used similarly to a struct or other common record types, except that they are immutable.

For example, it is common to represent a point as a tuple `(x, y)`. This leads to code like the following:

```python
pt1 = (1.0, 5.0)
pt2 = (2.5, 1.5)

from math import sqrt
line_length = sqrt((pt1[0]-pt2[0])**2 + (pt1[1]-pt2[1])**2)
```

Using a named tuple it becomes more readable:

```python
from collections import namedtuple
Point = namedtuple('Point', 'x y')
pt1 = Point(1.0, 5.0)
pt2 = Point(2.5, 1.5)

from math import sqrt
line_length = sqrt((pt1.x-pt2.x)**2 + (pt1.y-pt2.y)**2)
# -> 3.8078865529319543
```

However, named tuples are still backwards compatible with normal tuples, so the following will still work:

```python
Point = namedtuple('Point', 'x y')
pt1 = Point(1.0, 5.0)
pt2 = Point(2.5, 1.5)

from math import sqrt
# use index referencing
line_length = sqrt((pt1[0]-pt2[0])**2 + (pt1[1]-pt2[1])**2)
# use tuple unpacking
x1, y1 = pt1
```

Thus, you should use named tuples instead of tuples anywhere you think object notation will make your code more pythonic and more easily readable. You can also replace simple immutable classes that have only fields (no methods) with them.

### `typing.NamedTuple` (preferred syntax)

Same thing, with a class syntax, type hints, defaults and methods:

```python
>>> from typing import NamedTuple
>>> from math import dist
>>> class Point(NamedTuple):
...     x: float
...     y: float = 0.0
...
...     def distance(self, other: 'Point') -> float:
...         return dist(self, other)

>>> p = Point(3, 4)
>>> p
Point(x=3, y=4)
>>> p.distance(Point(0))
5.0
>>> p._replace(y=10)       # returns a NEW tuple
Point(x=3, y=10)
>>> p._asdict()
{'x': 3, 'y': 4}
>>> x, y = p
```

> 💡 If you need mutability, `slots`, or no index access, use a `@dataclass` instead (see [clases](clases.md#dataclasses)).
