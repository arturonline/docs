# Understanding Java Arrays

- An array is an ordered list.
- It can contain duplicates
- The array does not allocate space for the String objects. Instead, it allocates space for a reference to where the objects are really stored

![arrays](resources/arrays.png)

## Creating arrays

```Java
int[] numbers1 = new int[3];
int[] numbers2 = new int[] {42, 55, 99};
int[] numbers2 = {42, 55, 99};
```

you can type the [] before or after the name, and adding a space is optional:

```Java
int[] numAnimals;
int [] numAnimals2;
int numAnimals3[];
int numAnimals4 [];
```

What types of reference variables do you think the following code creates?

```Java
int[] ids, types;
```

The correct answer is two variables of type int[]. This seems logical enough. After all, int a, b; created two int variables. What about this example?

```Java
int ids[], types;
```

This time we get one variable of type int[] and one variable of type int.

## Initialization

As a quick review, what do you think this array points to?

```Java
class Names {
String names[];
}
```

The answer is null. The code never instantiated the array so it is just a reference variable to null. Let’s
try that again—what do you think this array points to?

```Java
class Names {
String names[] = new String[2];
}
```

It is an array because it has brackets. It is an array of type String since that is the type mentioned in the declaration. It has two elements because the length is 2. Each of those two slots currently is null, but has the potential to point to a String object.

Remember casting from the previous chapter when you wanted to force a bigger type into a smaller type? You can do that with arrays too:

```Java
3: String[] strings = { "stringValue" };
4: Object[] objects = strings;
5: String[] againStrings = (String[]) objects;
6: againStrings[0] = new StringBuilder(); // DOES NOT COMPILE
7: objects[0] = new StringBuilder(); // careful!
```

- Line 3 creates an array of type String.
- Line 4 doesn’t require a cast because Object is a broader type than String. On line 5, a cast is needed because we are moving to a more specifc type.
- Line 6 doesn’t compile because a String[] only allows String objects and StringBuilder is not a String.
- Line 7 is where this gets interesting. From the point of view of the compiler, this is just fine. A StringBuilder object can clearly go in an Object[]. The problem is that we don’t actually have an Object[]. We have a String[] referred to from an Object[] variable. At runtime, the code throws an ArrayStoreException. You don’t need to memorize the name of this exception, but you do need to know that the code will throw an exception.