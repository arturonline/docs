# Sequences: Tuples

The tuple data type is almost identical to the list data type, except in two ways. First, tuples are typed with parentheses, ( and ), instead of square brackets, [ and ]. For example, enter the following into the interactive shell:

```python
>>> eggs = ('hello', 42, 0.5)
>>> eggs[0]
'hello'
>>> eggs[1:3]
(42, 0.5)
>>> len(eggs)
3
```

But the main way that tuples are different from lists is that tuples, like strings, are immutable. Tuples cannot have their values modified, appended, or removed.

## Converting types

```python
tuple(['cat', 'dog', 5])
>>> ('cat', 'dog', 5)

list(('cat', 'dog', 5))
>>> ['cat', 'dog', 5]

list('hello')
>>> ['h', 'e', 'l', 'l', 'o']
```

### Destructuring

```python
cat = ['fat', 'orange', 'loud']
size = cat[0]
color = cat[1]
>>> disposition = cat[2]

# you could type this line of code:

cat = ['fat', 'orange', 'loud']
size, color, disposition = cat
```

## Named Tuples

Named tuples are basically easy-to-create, lightweight object types. Named tuple instances can be referenced using object-like variable dereferencing or the standard tuple syntax. They can be used similarly to struct or other common record types, except that they are immutable. They were added in Python 2.6 and Python 3.0, although there is a recipe for implementation in Python 2.4.

For example, it is common to represent a point as a tuple (x, y). This leads to code like the following:

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

Thus, you should use named tuples instead of tuples anywhere you think object notation will make your code more pythonic and more easily readable. Furthermore, you can also replace ordinary immutable classes that have no functions, only fields with them. You can even use your named tuple types as base classes:

```python
class Point(namedtuple('Point', 'x y')):
    [...]
```