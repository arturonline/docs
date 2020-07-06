# Sort

More info on [After Nerd](https://www.afternerd.com/blog/python-sort-list/)

## Sort a list of numbers

```python
l = [15, 22.4, 8, 10, 3.14]
l.sort()

# output: [3.14, 8, 10, 15, 22.4]
```

Notice that the list `l` was sorted in place. No new objects were created. To create a new sorted list without modifying the original one, you should use `sorted()` function instead.

```python
l = [15, 22.4, 8, 10, 3.14]
sorted_list = sorted(L)

l
# output: [15, 22.4, 8, 10, 3.14]

sorted_list
# output: [3.14, 8, 10, 15, 22.4]
```

If you want to sort in a descending order, all you have to do is add the parameter `reverse = True` to either the sort or sorted functions.

```python
l = [15, 22.4, 8, 10, 3.14]
l.sort(reverse = True)

# output: [22.4, 15, 10, 8, 3.14]
```

## Sorting a list of Strings

```python
l = ["oranges", "apples", "bananas"]
l.sort()

# output: ['apples', 'bananas', 'oranges']
```

With uppercase letters:

```python
l = ["oranges", "apples", "Bananas"]
l.sort()

# output: ['Bananas', 'apples', 'oranges']
```

## The key parameter

```python
l = ["oranges", "apples", "Bananas"]
l.sort(key=str.lower)
l
>>> ['apples', 'Bananas', 'oranges']
```

## Sorting objects

The key argument expects a function to be passed to it, and that function will be used on each value in the list being sorted to determine the resulting order.

```python
class User:
    def __init__(self, name, age):
        self.name = name
        self.age = age

Bob = User('Bob', 20)
Alice = User('Alice', 30)
Leo = User('Leo', 15)
L = [Bob, Alice, Leo]

L.sort(key=lambda x: x.name)
print([item.name for item in L])

# output: ['Alice', 'Bob', 'Leo']

L.sort(key=lambda x: x.age)
print([item.name for item in L])

# output: ['Leo', 'Bob', 'Alice']
```