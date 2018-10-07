# Wrapper Classes

To use primitives with ArrayLists we use  wrapper classes:

![Wrapper Classes](resources/wrapper.png)

The parse methods, such as **parseInt()**, return a primitive, and the **valueOf()** method returns a wrapper class. 

This is easy to remember because the name of the returned primitive is in the method name:

```int primitive = Integer.parseInt("123");```<br>
```Integer wrapper = Integer.valueOf("123");```

The first line converts a String to an int primitive. The second converts a String to an Integer wrapper class. If the String passed in is not valid for the given type, Java throws an exception:

```Java
int bad1 = Integer.parseInt("a"); // throws NumberFormatException
Integer bad2 = Integer.valueOf("123.45"); // throws NumberFormatException
```

![Wrapper Classes](resources/convert.png)

The Character class doesn’t participate in the parse/
valueOf methods. Since a String is made up of characters, you can just call charAt()
normally.

# Autoboxing 

Since Java 5, you can just type the primitive value and Java will convert it to the relevant wrapper class for you. This is called autoboxing:

```Java
4: List<Double> weights = new ArrayList<>();
5: weights.add(50.5); // [50.5]
6: weights.add(new Double(60)); // [50.5, 60.0]
7: weights.remove(50.5); // [60.0]
8: double first = weights.get(0); // 60.0
```

* Line 5 autoboxes the double primitive into a Double object and adds that to the List.
* Line 6 shows that you can still write code the long way and pass in a wrapper object.
* Line 7 again autoboxes into the wrapper object and passes it to remove().
* Line 8 retrieves the Double and unboxes it into a double primitive.

What do you think happens if you try to unbox a null?

```Java
3: List<Integer> heights = new ArrayList<>();
4: heights.add(null);
5: int h = heights.get(0); // NullPointerException
```

* On line 4, we add a null to the list. This is legal because a null reference can be assigned to any reference variable. 
* On line 5, we try to unbox that null to an int primitive. This is a problem. Java tries to get the int value of null. Since calling any method on null gives a NullPointerException, that is just what we get. Be careful when you see null in relation to autoboxing.

Be careful when autoboxing into Integer. What do you think this code outputs?

```Java
List<Integer> numbers = new ArrayList<>();
numbers.add(1);
numbers.add(2);
numbers.remove(1);
System.out.println(numbers);
```

* It actually outputs 1. After adding the two values, the List contains [1, 2].
* We then request the element with index 1 be removed. That’s right: index 1. Because there’s already a remove() method that takes an int parameter, Java calls that method rather than autoboxing. If you want to remove the 2, you can write numbers.remove(new Integer(2)) to force wrapper class use.