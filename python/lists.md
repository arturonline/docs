# Sequences: Lists

```python
[1, 2, 3]

['cat', 1, 1.3, None, True]
```

## Indexes

```python
arr = ['cat', 'bat', 'rat', 'elephant']

arr[0]
>>> 'cat'

arr[2]
>>> 'rat'

arr[int(1.0)]
>>>'bat'

arr[-1]
>>> 'elephant'

arr[1:3]
>>> ['bat', 'rat']

arr[1:]
>>> ['bat', 'rat', 'elephant']

arr[:]
>>> ['cat', 'bat', 'rat', 'elephant']
```

## Changing Values

```python
spam = ['cat', 'bat', 'rat', 'elephant']

spam[1] = 'aardvark'
>>> ['cat', 'aardvark', 'rat', 'elephant']

spam[2] = spam[1]
>>> ['cat', 'aardvark', 'aardvark', 'elephant']

spam[-1] = 12345
>>> ['cat', 'aardvark', 'aardvark', 12345]
```

## Removing values

```python
spam = ['cat', 'bat', 'rat', 'elephant']

del spam[2]
>>> ['cat', 'bat', 'elephant']

del spam[2]
>>> ['cat', 'bat']
```

```python
spam = ['cat', 'bat', 'rat', 'elephant']
spam.remove('bat')
>>> ['cat', 'rat', 'elephant']
```

## Concatenation and replication

```python
[1, 2, 3] + ['A', 'B', 'C']
>>> [1, 2, 3, 'A', 'B', 'C']

['X', 'Y', 'Z'] * 3
>>> ['X', 'Y', 'Z', 'X', 'Y', 'Z', 'X', 'Y', 'Z']

spam = [1, 2, 3]
spam = spam + ['A', 'B', 'C']
>>> [1, 2, 3, 'A', 'B', 'C']
```

## `in` and `not in` operator

```python
'howdy' in ['hello', 'hi', 'howdy', 'heyas']
>>> True

spam = ['hello', 'hi', 'howdy', 'heyas']
'cat' in spam
>>> False

'howdy' not in spam
>>> False

'cat' not in spam
>>> True
```

## Methods

### Index

```python
spam = ['hello', 'hi', 'howdy', 'heyas']
spam.index('hello')
>>> 0

spam.index('heyas')
>>> 3
```

### `Append()` & `Insert()`

```python
spam = ['cat', 'dog', 'bat']
spam.append('moose')
>>> ['cat', 'dog', 'bat', 'moose']


spam = ['cat', 'dog', 'bat']
spam.insert(1, 'chicken')
>>> ['cat', 'chicken', 'dog', 'bat']
```

### `Sort()`

```python
spam = [2, 5, 3.14, 1, -7]
spam.sort()
>>> [-7, 1, 2, 3.14, 5]

spam = ['ants', 'cats', 'dogs', 'badgers', 'elephants']
spam.sort()
>>> ['ants', 'badgers', 'cats', 'dogs', 'elephants']

>>> spam.sort(reverse=True)
>>> ['elephants', 'dogs', 'cats', 'badgers', 'ants']

spam = ['a', 'z', 'A', 'Z']
spam.sort(key=str.lower)
>>> ['a', 'A', 'z', 'Z']
```

### `copy()` and `deepcopy()`

Makes a duplicate copy of a mutable value like a list or dictionary, not just a copy of a reference.

```python
import copy
spam = ['A', 'B', 'C', 'D']
cheese = copy.copy(spam)
cheese[1] = 42

spam
>>> ['A', 'B', 'C', 'D']
cheese
>>> ['A', 42, 'C', 'D']
```