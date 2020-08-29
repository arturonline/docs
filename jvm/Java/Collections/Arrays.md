# Arrays

The array stores a fixed-size sequential collection of elements of the same type.

- We can store only fixed set of elements in a java array. It doesn't grow its size at runtime.
- An array is an ordered list.
- It can contain duplicates
- The array does not allocate space for the String objects. Instead, it allocates space for a reference to where the objects are really stored

## Initialization

```Java
int[] numbers1 = new int[3];
int[] numbers2 = new int[] {42, 55, 99};
int[] numbers2 = {42, 55, 99};
```

you can type the [] before or after the name, and adding a space is optional:

```Java
int[] numAnimals; // prefered way
int [] numAnimals2;
int numAnimals3[];
int numAnimals4 [];
```

## Methods

The java.util.Arrays class contains various static methods for sorting and searching arrays, comparing arrays, and filling array elements. These methods are overloaded for all primitive types.

| Sr.No. | Method                                                 | Description                                                                                                                                                                                                                                                                                                                                                              |
| ------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1      | public static int binarySearch(Object[] a, Object key) | Searches the specified array of Object ( Byte, Int , double, etc.) for the specified value using the binary search algorithm. The array must be sorted prior to making this call. This returns index of the search key, if it is contained in the list; otherwise, it returns ( – (insertion point + 1)).                                                                |
| 2      | public static boolean equals(long[] a, long[] a2)      | Returns true if the two specified arrays of longs are equal to one another. Two arrays are considered equal if both arrays contain the same number of elements, and all corresponding pairs of elements in the two arrays are equal. This returns true if the two arrays are equal. Same method could be used by all other primitive data types (Byte, short, Int, etc.) |
| 3      | public static void fill(int[] a, int val)              | Assigns the specified int value to each element of the specified array of ints. The same method could be used by all other primitive data types (Byte, short, Int, etc.)                                                                                                                                                                                                 |
| 4      | public static void sort(Object[] a)                    | Sorts the specified array of objects into an ascending order, according to the natural ordering of its elements. The same method could be used by all other primitive data types ( Byte, short, Int, etc.)                                                                                                                                                               |

## Iterating an array

```Java
// for loop
for (int i = 0; i < arr.length; i++)
  System.out.println("Element at index " + i + " : " + arr[i]);
```

```Java
// for-each loop
public static int maximum(int[] numbers)
    {
        int maxSoFar = numbers[0];

        // for each loop
        for (int num : numbers)
        {
            if (num > maxSoFar)
            {
                maxSoFar = num;
            }
        }
    return maxSoFar;
```
