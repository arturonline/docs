# Converting between Array and List

## ArrayList into an array

```Java
3: List<String> list = new ArrayList<>();
4: list.add("hawk");
5: list.add("robin");
6: Object[] objectArray = list.toArray();
7: System.out.println(objectArray.length); // 2
8: String[] stringArray = list.toArray(new String[0]);
9: System.out.println(stringArray.length); // 2
```

* Line 6 shows that an ArrayList knows how to convert itself to an array. The only problem is that it defaults to an array of class Object. This isn’t usually what you want. 
* Line 8 specifes the type of the array and does what we actually want. The advantage of specifying a size of 0 for the parameter is that Java will create a new array of the proper size for the return value. If you like, you can suggest a larger array to be used instead. If the ArrayList fits in that array, it will be returned. Otherwise, a new one will be created.

## Array to ArrayList:

The original array and created array backed List are linked. When a change is made to one, it is available in the other. It is a fxed-size list and is also known a backed List because the array changes with it. Pay careful attention to the values here:

```Java
20: String[] array = { "hawk", "robin" }; // [hawk, robin]
21: List<String> list = Arrays.asList(array); // returns fixed size list
22: System.out.println(list.size()); // 2
23: list.set(1, "test"); // [hawk, test]
24: array[0] = "new"; // [new, test]
25: for (String b : array) System.out.print(b + " "); // new test
26: list.remove(1); // throws UnsupportedOperation Exception
```

* Line 21 converts the array to a List. Note that it isn’t the java.util.ArrayList we’ve grown used to. It is a fixed-size, backed version of a List.
* Line 23 is okay because set() merely replaces an existing value. It updates both array and list because they point to the same data store. 
* Line 24 also changes both array and list. 
* Line 25 shows the array has changed to new test. 
* Line 26 throws an exception because we are not allowed to change the size of the list.