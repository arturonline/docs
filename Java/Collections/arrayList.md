# Java ArrayList class

Java ArrayList class uses a dynamic array for storing the elements.
The important points about Java arrayList class are:

- Java ArrayList class can contain duplicate elements.
- Java ArrayList class maintains insertion order.
- Java ArrayList class is non synchronized.
- Java ArrayList allows random access because array works at the index basis.
- In Java ArrayList class, manipulation is slow because a lot of shifting needs to be occurred if any element is removed from the array list.

## Constructors

No. | Constructor             | Description
----|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
1   | ArrayList( )            | This constructor builds an empty array list.
2   | ArrayList(Collection c) | This constructor builds an array list that is initialized with the elements of the collection c.
3   | ArrayList(int capacity) | This constructor builds an array list that has the specified initial capacity. The capacity is the size of the underlying array that is used to store the elements. The capacity grows automatically as elements are added to an array list.

## Methods

Apart from the methods inherited from its parent classes, arrayList defines following methods:

Method                                      | Description
--------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
void **add(int index, Object element)**     | It is used to insert the specified element at the specified position index in a list.
boolean **addAll(Collection c)**            | It is used to append all of the elements in the specified collection to the end of this list, in the order that they are returned by the specified collection's iterator.
void **clear()**                            | It is used to remove all of the elements from this list.
int **lastIndexOf(Object o)**               | It is used to return the index in this list of the last occurrence of the specified element, or -1 if the list does not contain this element.
Object[] **toArray()**                      | It is used to return an array containing all of the elements in this list in the correct order.
Object[] **toArray(Object[] a)**            | It is used to return an array containing all of the elements in this list in the correct order.
boolean **add(Object o)**                   | It is used to append the specified element to the end of a list.
boolean **addAll(int index, Collection c)** | It is used to insert all of the elements in the specified collection into this list, starting at the specified position.
Object **clone()**                          | It is used to return a shallow copy of an ArrayList.
int **indexOf(Object o)**                   | It is used to return the index in this list of the first occurrence of the specified element, or -1 if the List does not contain this element.
void **trimToSize()**                       | It is used to trim the capacity of this ArrayList instance to be the list's current size.

## Exemple

```Java
import java.util.*;
public class ArrayListDemo {

   public static void main(String args[]) {
      // create an array list
      ArrayList al = new ArrayList();
      System.out.println("Initial size of al: " + al.size());

      // add elements to the array list
      al.add("C");
      al.add("A");
      al.add("E");
      al.add("B");
      al.add("D");
      al.add("F");
      al.add(1, "A2");
      System.out.println("Size of al after additions: " + al.size());

      // display the array list
      System.out.println("Contents of al: " + al);

      // Remove elements from the array list
      al.remove("F");
      al.remove(2);
      System.out.println("Size of al after deletions: " + al.size());
      System.out.println("Contents of al: " + al);
   }
}
//This will produce the following result:

// Initial size of al: 0
// Size of al after additions: 7
// Contents of al: [C, A2, A, E, B, D, F]
// Size of al after deletions: 5
// Contents of al: [C, A2, E, B, D]
```