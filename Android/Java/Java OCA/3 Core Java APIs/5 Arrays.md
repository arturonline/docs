# Arrays

import java.util.Arrays; or java.util.*

* An array is an area of memory on the heap with space for a **designated** number of elements.
* It is an ordered list.
* It can contain duplicates.
* The default value of an int is 0.
* The equals() method on arrays does not look at the elements of the array. It looks reference.

## Initializations

![alt text](resources/arrays.png "Arrays")

```Java
int[] numbers2 = new int[] {42, 55, 99};
String[] birds = new String[6];
int[] numbers2 = {42, 55, 99};

// you can type the [] before or after the name, and adding a space is optional.
// This means that all four of these statements do the exact same thing:

int[] numAnimals;
int [] numAnimals2;
int numAnimals3[];
int numAnimals4 [];
``` 

## Multiple array declaration

What types of reference variables do you think the following code creates?

```java
int[] ids, types;
```

The correct answer is two variables of type **int[]**. This seems logical enough. After all, int a, b; created two int variables. 
What about this example?

```Java
int ids[], types;
```

All we did was move the brackets, but it changed the behavior. This time we get one variable of type int[] and one variable of type int.