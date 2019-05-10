# Classes

- class members are public
- All member functions are virtual.
- The method function is declared with an explicit first argument representing the object, which is provided implicitly by the call.

## Declaration

```python
class MyClass:
    """A simple example class"""
    i = 12345

    def f(self):
        return 'hello world'
```

## Constructor

```python
class Complex:
    def __init__(self, realpart, imagpart):
        self.r = realpart
        self.i = imagpart

x = Complex(3.0, -4.5)
x.r, x.i
>>> (3.0, -4.5)
```

## Properties: `@property`

The `@property` lets a method to be accessed as an attribute instead of as a method with a '`()`'

```python
class Person(object):
    def __init__(self, first_name, last_name):
        self.first_name = first_name
        self.last_name = last_name

    @property
    def full_name(self):
        return self.first_name + ' ' + self.last_name

    @full_name.setter
    def full_name(self, value):
        first_name, last_name = value.split(' ')
        self.first_name = first_name
        self.last_name = last_name

    @full_name.deleter
    def full_name(self):
        del self.first_name
        del self.last_name
```

## class var

```python
class Dog:

    kind = 'canine'         # class variable shared by all instances

    def __init__(self, name):
        self.name = name    # instance variable unique to each instance

>>> d = Dog('Fido')
>>> e = Dog('Buddy')
>>> d.kind                  # shared by all dogs
'canine'
>>> e.kind                  # shared by all dogs
'canine'
>>> d.name                  # unique to d
'Fido'
>>> e.name                  # unique to e
'Buddy'
```

## `@classmethod`

```python
>>> class A():
    count = 0

    def __init__(self):
        A.count += 1

    def exclaim(self):
        print("I'm an A!")

    @classmethod # AKA: Static
    def kids(cls):
        print("A has", cls.count, "little objects.")

easy_a = A()
breezy_a = A()
wheezy_a = A()
A.kids()
A has 3 little objects.
```

## `@staticmethod`

A third type of method in a class definition affects neither the class nor its objects; it’s just in there for convenience instead of floating around on its own. It’s a static method, preceded by a `@staticmethod` decorator, with no initial self or class parameter.

Here’s an example that serves as a commercial for the class `CoyoteWeapon`:

```python
class CoyoteWeapon():
    @staticmethod
    def commercial():
    print('This CoyoteWeapon has been brought to you by Acme')

CoyoteWeapon.commercial()
>>> This CoyoteWeapon has been brought to you by Acme
```

Notice that we didn’t need to create an object from class CoyoteWeapon to access this method. Very class-y.

## Inheritance

Python classes provide all the standard features of Object Oriented Programming: the class inheritance mechanism allows multiple base classes, a derived class can override any methods of its base class or classes, and a method can call the method of a base class with the same name.

Python has two built-in functions that work with inheritance:

- Use `isinstance()` to check an instance’s type: isinstance(obj, int) will be True only if obj.__class__ is int or some class derived from int.
- Use `issubclass()` to check class inheritance: issubclass(bool, int) is True since bool is a subclass of int. However, issubclass(float, int) is False since float is not a subclass of int.

### Declaration

```python
class Car():
    pass

class Yugo(Car):
    pass
```

### Methods

```python
>>> class Car():
    def exclaim(self):
    print("I'm a Car!")

>>> class Yugo(Car):
    pass

give_me_a_car = Car()
give_me_a_yugo = Yugo()

give_me_a_car.exclaim()
>>> I'm a Car!
give_me_a_yugo.exclaim()
>>> I'm a Car!
```

### Overriding Methods

```python
class Car():
    def exclaim(self):
    print("I'm a Car!")

class Yugo(Car):
    def exclaim(self):
    print("I'm a Yugo! Much like a Car, but more Yugo-ish.")
...

give_me_a_car = Car()
give_me_a_yugo = Yugo()

give_me_a_car.exclaim()
>>> I'm a Car!

give_me_a_yugo.exclaim()
>>> I'm a Yugo! Much like a Car, but more Yugo-ish.
```

### `super()`

```python
class Person():
    def __init__(self, name):
    self.name = name

class EmailPerson(Person):
    def __init__(self, name, email):
    super().__init__(name)
    self.email = email
```