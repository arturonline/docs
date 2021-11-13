# HashSet

Java HashSet class is used to create a collection that uses a hash table for storage. 
The important points about Java HashSet class are:

- HashSet stores the elements by using a mechanism called hashing.
- HashSet contains unique elements only.
- List can contain duplicate elements whereas Set contains unique elements only.

## Constructor

Sr.No. | Constructor |Description
-------|-------------|-----------
1 | HashSet( ) | This constructor constructs a default HashSet.
2 | HashSet(Collection c) | This constructor initializes the hash set by using the elements of the collection c.
3 | HashSet(int capacity) | This constructor initializes the capacity of the hash set to the given integer value capacity. The capacity grows automatically as elements are added to the HashSet.
4 | HashSet(int capacity, float fillRatio) | This constructor initializes both the capacity and the fill ratio (also called load capacity) of the hash set from its arguments. Here the fill ratio must be between 0.0 and 1.0, and it determines how full the hash set can be before it is resized upward. Specifically, when the number of elements is greater than the capacity of the hash set multiplied by its fill ratio, the hash set is expanded.

## Methods

Apart from the methods inherited from its parent classes, HashSet defines following methods:

Sr.No. | Method                     | Description
-------|----------------------------|------------------------------------------------------------------------------------------
1      | boolean **add**(Object o)      | Adds the specified element to this set if it is not already present.
2      | void **clear**()               | Removes all of the elements from this set.
3      | Object **clone**()             | Returns a shallow copy of this HashSet instance: the elements themselves are not cloned.
4      | boolean **contains**(Object o) | Returns true if this set contains the specified element.
5      | boolean **isEmpty**()          | Returns true if this set contains no elements.
6      | Iterator **iterator**()        | Returns an iterator over the elements in this set.
7      | boolean **remove**(Object o)   | Removes the specified element from this set if it is present.
8      | int **size**()                 | Returns the number of elements in this set (its cardinality).

## Exemple

```Java
import java.util.*;
public class HashSetDemo {

   public static void main(String args[]) {
      // create a hash set
      HashSet hs = new HashSet();

      // add elements to the hash set
      hs.add("B");
      hs.add("A");
      hs.add("D");
      hs.add("E");
      hs.add("C");
      hs.add("F");
      System.out.println(hs);
   }
}

/* This will produce the following result −

Output
[A, B, C, D, E, F] */
```