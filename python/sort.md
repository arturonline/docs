# Sort

More info: [Sorting HOW TO](https://docs.python.org/3/howto/sorting.html) (official docs) · [After Nerd](https://www.afternerd.com/blog/python-sort-list/)

See also: [lists](lists.md) · [loops](loops.md) · [clases](clases.md) (comparing objects)

## `list.sort()` vs `sorted()`

| | `list.sort()` | `sorted(iterable)` |
| --- | --- | --- |
| Works on | lists only | any iterable (list, tuple, dict, set, str, generator...) |
| Result | sorts **in place**, returns `None` | returns a **new** list, original untouched |

## Sort a list of numbers

```python
l = [15, 22.4, 8, 10, 3.14]
l.sort()
l
# output: [3.14, 8, 10, 15, 22.4]
```

Notice that the list `l` was sorted in place. No new objects were created. To create a new sorted list without modifying the original one, use the `sorted()` function instead.

```python
l = [15, 22.4, 8, 10, 3.14]
sorted_list = sorted(l)

l
# output: [15, 22.4, 8, 10, 3.14]

sorted_list
# output: [3.14, 8, 10, 15, 22.4]
```

If you want to sort in descending order, add the parameter `reverse=True` to either `sort()` or `sorted()`.

```python
l = [15, 22.4, 8, 10, 3.14]
l.sort(reverse=True)
l
# output: [22.4, 15, 10, 8, 3.14]
```

> ⚠️ `l = l.sort()` sets `l` to `None`. Mixing incomparable types fails: `sorted([1, 'a'])` -> `TypeError: '<' not supported between instances of 'str' and 'int'`.

## `sorted()` on other iterables

```python
sorted('python')
# output: ['h', 'n', 'o', 'p', 't', 'y']

sorted((3, 1, 2))
# output: [1, 2, 3]          <- always returns a list

d = {'b': 2, 'a': 3, 'c': 1}
sorted(d)                          # keys
# output: ['a', 'b', 'c']
sorted(d.items(), key=lambda kv: kv[1])   # by value
# output: [('c', 1), ('b', 2), ('a', 3)]
dict(sorted(d.items(), key=lambda kv: kv[1], reverse=True))
# output: {'a': 3, 'b': 2, 'c': 1}
```

## Sorting a list of Strings

```python
l = ["oranges", "apples", "bananas"]
l.sort()
l
# output: ['apples', 'bananas', 'oranges']
```

Uppercase letters sort before lowercase (strings are compared by Unicode code point):

```python
l = ["oranges", "apples", "Bananas"]
l.sort()
l
# output: ['Bananas', 'apples', 'oranges']
```

## The key parameter

`key` is a function called **once per element**; the list is sorted by the values it returns.

```python
l = ["oranges", "apples", "Bananas"]
l.sort(key=str.lower)        # case-insensitive (str.casefold is even better for Unicode)
l
# output: ['apples', 'Bananas', 'oranges']

sorted(["ccc", "a", "bb"], key=len)
# output: ['a', 'bb', 'ccc']

sorted([-5, 3, -1, 4], key=abs)
# output: [-1, 3, 4, -5]
```

### Several criteria: return a tuple

Tuples compare element by element, so a tuple key sorts by the first item, then the second...

```python
words = ["pear", "fig", "apple", "kiwi", "date"]

sorted(words, key=lambda w: (len(w), w))      # by length, then alphabetically
# output: ['fig', 'date', 'kiwi', 'pear', 'apple']

sorted(words, key=lambda w: (-len(w), w))     # length DESC, then name ASC (negate numbers)
# output: ['apple', 'date', 'kiwi', 'pear', 'fig']
```

### Stability

Python's sort is **stable**: elements with equal keys keep their original order. So you can sort in several passes (least important key first):

```python
data = [('red', 1), ('blue', 1), ('red', 2), ('blue', 2)]
sorted(data, key=lambda t: t[0])
# output: [('blue', 1), ('blue', 2), ('red', 1), ('red', 2)]   <- 1 before 2 preserved
```

## Sorting objects

The `key` argument expects a function to be passed to it, and that function will be used on each value in the list being sorted to determine the resulting order.

```python
from dataclasses import dataclass

@dataclass
class User:
    name: str
    age: int

bob = User('Bob', 20)
alice = User('Alice', 30)
leo = User('Leo', 15)
users = [bob, alice, leo]

users.sort(key=lambda u: u.name)
print([u.name for u in users])
# output: ['Alice', 'Bob', 'Leo']

users.sort(key=lambda u: u.age)
print([u.name for u in users])
# output: ['Leo', 'Bob', 'Alice']

max(users, key=lambda u: u.age)          # min/max accept key too
# output: User(name='Alice', age=30)
```

### `operator.attrgetter` / `itemgetter`

Faster and more readable than a `lambda` for simple keys:

```python
from operator import attrgetter, itemgetter

sorted(users, key=attrgetter('age'))           # = lambda u: u.age
sorted(users, key=attrgetter('age', 'name'))   # several attributes

rows = [{'name': 'Bob', 'age': 20}, {'name': 'Alice', 'age': 30}]
sorted(rows, key=itemgetter('name'))
# output: [{'name': 'Alice', 'age': 30}, {'name': 'Bob', 'age': 20}]

pairs = [(1, 'b'), (2, 'a')]
sorted(pairs, key=itemgetter(1))
# output: [(2, 'a'), (1, 'b')]
```

### Natural ordering with `order=True`

A dataclass with `order=True` gets `<`, `>`... comparing its fields in order, so it can be sorted without `key`:

```python
@dataclass(order=True)
class Version:
    major: int
    minor: int

sorted([Version(1, 10), Version(1, 2), Version(0, 9)])
# output: [Version(major=0, minor=9), Version(major=1, minor=2), Version(major=1, minor=10)]
```

## Related

```python
import heapq, bisect

heapq.nsmallest(2, [5, 1, 8, 3])           # top-N without sorting everything
# output: [1, 3]
heapq.nlargest(2, users, key=attrgetter('age'))
# output: [User(name='Alice', age=30), User(name='Bob', age=20)]

scores = [10, 20, 30]
bisect.insort(scores, 25)                  # insert keeping the list sorted
scores
# output: [10, 20, 25, 30]
```
