# Using Arrays

```Java
String[] mammals = {"monkey", "chimp", "donkey"};
System.out.println(mammals.length); // 3
System.out.println(mammals[0]); // monkey
System.out.println(mammals[1]); // chimp
System.out.println(mammals[2]); // donkey
```

## Iterating an Array

The exam will test whether you are being observant by trying to access elements that are not in the array:

```java
int[] numbers = new int[10];
for (int i = 0; i < numbers.length; i++)
numbers[i] = i + 5;
```

```Java
numbers[10] = 3;
numbers[numbers.length] = 5;
for (int i = 0; i <= numbers.length; i++) numbers[i] = i + 5;
```

* The first one is trying to see if you know that indexes start with 0. Since we have 10 elements in our array, this means only numbers[0] through numbers[9] are valid.

* The second example assumes you are clever enough to know 10 is invalid and disguises it by using the length variable. However, the length is always one more than the maximum valid index.

* Finally, the for loop incorrectly uses <= instead of <, which is also a way of referring to that 10th element.

## Sorting

Numbers sort before letters and uppercase sorts before lowercase.

```Java
int[] numbers = { 6, 9, 1 };
Arrays.sort(numbers);
for (int i = 0; i < numbers.length; i++)
    System.out.print (numbers[i] + " ");
// 1 6 9
```

## Searching

### BinarySearch

* Needs a sorted array
* returns the index of element found
* if it is not found returns an index where should be inserted in the following way:

```Java
index where shoud be inserted = i
i * (-1) - 1
```

exemple:

```Java
3: int[] numbers = {2,4,6,8};
4: System.out.println(Arrays.binarySearch(numbers, 2)); // 0
5: System.out.println(Arrays.binarySearch(numbers, 4)); // 1
6: System.out.println(Arrays.binarySearch(numbers, 1)); // -1
7: System.out.println(Arrays.binarySearch(numbers, 3)); // -2
8: System.out.println(Arrays.binarySearch(numbers, 9)); // -5
```

Take note of the fact that line 3 is a **sorted array**. If it weren’t, we couldn’t apply either of the other rules.

* Line 4 searches for the index of 2. The answer is index 0. Line 5 searches for the index of 4, which is 1.

* Line 5 searches for the index of 1. Although 1 isn’t in the list, the search can determine that it should be inserted at element 0 to preserve the sorted order. Since 0 already means something for array indexes, Java needs to subtract 1 to give us the answer of –1.

* Line 7 is similar. Although 3 isn’t in the list, it would need to be inserted at element 1 to preserve the sorted order. We negate and subtract 1 for consistency, getting –1 –1, also known as –2.

* Finally, line 8 wants to tell us that 9 should be inserted at index 4. We again negate and subtract 1, getting –4 –1, also known as –5.