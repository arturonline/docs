# ArrayList

- [ArrayList](#arraylist)
    - [Using an ArrayList](#using-an-arraylist)
        - [add()](#add)
        - [remove()](#remove)
        - [set()](#set)
        - [isEmpty() and size()](#isempty-and-size)
        - [clear()](#clear)
        - [contains()](#contains)
        - [equals()](#equals)
        - [Sorting](#sorting)

```Java
//Old way
ArrayList list1 = new ArrayList();
ArrayList list2 = new ArrayList(10); // 10 elements
ArrayList list3 = new ArrayList(list2); // copy of another arraylist

//New way
ArrayList<String> list4 = new ArrayList<String>(); //java 5
ArrayList<String> list5 = new ArrayList<>(); //java 7
```

You can store an ArrayList in a List reference variable but not vice
versa:

```Java
List<String> list6 = new ArrayList<>();
ArrayList<String> list7 = new List<>(); // List is a Inteface, can't be instantiated
```

## Using an ArrayList

### add()

```boolean add(E element)```<br>
```void add(int index, E element)```

Eg:

```Java
ArrayList list = new ArrayList();
list.add("hawk"); // [hawk]
list.add(Boolean.TRUE); // [hawk, true]
System.out.println(list); // [hawk, true]

//we didn’t specify a type for ArrayList; therefore, the type is Object
```

```Java
4: List<String> birds = new ArrayList<>();
5: birds.add("hawk"); // [hawk]
6: birds.add(1, "robin"); // [hawk, robin]
7: birds.add(0, "blue jay"); // [blue jay, hawk, robin]
8: birds.add(1, "cardinal"); // [blue jay, cardinal, hawk, robin]
9: System.out.println(birds); // [blue jay, cardinal, hawk,
```

* line 5 adds "hawk" to the end of birds.
* Then line 6 adds "robin" to index 1 of birds, which happens to be the end.
* Line 7 adds "blue jay" to index 0, which happens to be the beginning of birds.
* Finally, line 8 adds "cardinal” to index 1, which is now near the middle of birds.

### remove()

The remove() methods remove the first matching value in the ArrayList or remove the
element at a specifed index:

```Java
boolean remove(Object object) E remove(int index)
```

Eg:

```Java
3: List<String> birds = new ArrayList<>();
4: birds.add("hawk"); // [hawk]
5: birds.add("hawk"); // [hawk, hawk]
6: System.out.println(birds.remove("cardinal")); // prints false
7: System.out.println(birds.remove("hawk")); // prints true
8: System.out.println(birds.remove(0)); // prints hawk
9: System.out.println(birds); // []
```

* Line 6 tries to remove an element that is not in birds. It returns false because no such element is found.
* Line 7 tries to remove an element that is in birds and so returns true. Notice that it removes only one match.
* Line 8 removes the element at index 0, which is the last remaining element in the ArrayList. 
* Since calling remove() with an int uses the index, an index that doesn’t exist will throw an  **IndexOutOfBoundsException**.

### set()

The set() method changes one of the elements of the ArrayList without changing the size.

```Java
E set(int index, E newElement)
```

Eg:

```Java
15: List<String> birds = new ArrayList<>();
16: birds.add("hawk"); // [hawk]
17: System.out.println(birds.size()); // 1
18: birds.set(0, "robin"); // [robin]
19: System.out.println(birds.size()); // 1
20: birds.set(1, "robin"); // IndexOutOfBoundsException
```

* Line 16 adds one element to the array, making the size 1. 
* Line 18 replaces that one element and the size stays at 1. 
* Line 20 tries to replace an element that isn’t in the ArrayList. Since the size is 1, the only valid index is 0.

### isEmpty() and size()

The isEmpty() and size() methods look at how many of the slots are in use. The method
signatures are as follows:

```Java
boolean isEmpty() int size()
```

Eg:

```java
System.out.println(birds.isEmpty()); // true
System.out.println(birds.size()); // 0
birds.add("hawk"); // [hawk]
birds.add("hawk"); // [hawk, hawk]
System.out.println(birds.isEmpty()); // false
System.out.println(birds.size()); // 2
```

### clear()

Discard all elements of the ArrayList.

```Java
void clear()
```

```Java
List<String> birds = new ArrayList<>();
birds.add("hawk"); // [hawk]
birds.add("hawk"); // [hawk, hawk]
System.out.println(birds.isEmpty()); // false
System.out.println(birds.size()); // 2
birds.clear(); // []
System.out.println(birds.isEmpty()); // true
System.out.println(birds.size()); // 0
```

### contains()

This method calls equals() on each element of the ArrayList to see whether there are
any matches.

```Java
boolean contains(Object object)
```

```Java
List<String> birds = new ArrayList<>();
birds.add("hawk"); // [hawk]
System.out.println(birds.contains("hawk")); // true
System.out.println(birds.contains("robin")); // false
```

### equals()

Compares two lists to see if they contain the same elements in the same order.

```Java
boolean equals(Object object)
```

```Java
31: List<String> one = new ArrayList<>();
32: List<String> two = new ArrayList<>();
33: System.out.println(one.equals(two)); // true
34: one.add("a"); // [a]
35: System.out.println(one.equals(two)); // false
36: two.add("a"); // [a]
37: System.out.println(one.equals(two)); // true
38: one.add("b"); // [a,b]
39: two.add(0, "b"); // [b,a]
40: System.out.println(one.equals(two)); // false
```

* On line 33, the two ArrayList objects are equal. An empty list is certainly the same elements in the same order.
* On line 35, the ArrayList objects are not equal because the size is different.
* On line 37, they are equal again because the same one element is in each.
* On line 40, they are not equal. The size is the same and the values are the same, but they are not in the same order.

### Sorting

```Java
List<Integer> numbers = new ArrayList<>();
numbers.add(99);
numbers.add(5);
numbers.add(81);
Collections.sort(numbers);
System.out.println(numbers); [5, 81, 99]
```
