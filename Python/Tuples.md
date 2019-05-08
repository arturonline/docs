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