# Java Collections

## Hierarchy

!["Collections Hierarchi](resources/collection-Hierarchy.png)

## Wich collection to choose

Always start with **ArrayList** and **HashSet** and **HashMap** (i.e. not LinkedList or TreeMap).
Type declarations should always be an interface (i.e. List, Set, Map) so if a profiler or code review proves otherwise you can change the implementation without breaking anything.

!["choose"](resources/choose.png)

## Useful Collection methods

| Method  |  Description |
| ------- | ------------ |
| Collections.**copy**(list, list) | Copy a collection to another |
| Collections.**reverse**(list) | Reverse the order of the list |
| Collections.**shuffle**(list) | Shuffle the list |
| Collections.**sort**(list) | Sort the list |

## Methods of Collection interface

| No. | Method                                       | Description                                                                                |
| --- | -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 1   | public boolean **add(Object element)**       | is used to insert an element in this collection.                                           |
| 2   | public boolean **addAll(Collection c)**      | is used to insert the specified collection elements in the invoking collection.            |
| 3   | public boolean **remove(Object element)**    | is used to delete an element from this collection.                                         |
| 4   | public boolean **removeAll(Collection c)**   | is used to delete all the elements of specified collection from the invoking collection.   |
| 5   | public boolean **retainAll(Collection c)**   | is used to delete all the elements of invoking collection except the specified collection. |
| 6   | public int **size()**                        | return the total number of elements in the collection.                                     |
| 7   | public void **clear()**                      | removes the total no of element from the collection.                                       |
| 8   | public boolean **contains(Object element)**  | is used to search an element.                                                              |
| 9   | public boolean **containsAll(Collection c)** | is used to search the specified collection in this collection.                             |
| 10  | public Iterator **iterator()**               | returns an iterator.                                                                       |
| 11  | public Object[] **toArray()**                | converts collection into array.                                                            |
| 12  | public boolean **isEmpty()**                 | checks if collection is empty.                                                             |
| 13  | public boolean **equals(Object element)**    | matches two collection.                                                                    |
| 14  | public int **hashCode()**                    | returns the hashcode number for collection.                                                |

## Methods of Iterator interface

| No. | Method                   | Description                                                               |
| --- | ------------------------ | ------------------------------------------------------------------------- |
| 1   | public boolean hasNext() | It returns true if iterator has more elements.                            |
| 2   | public Object next()     | It returns the element and moves the cursor pointer to the next element.  |
| 3   | public void remove()     | It removes the last elements returned by the iterator. It is rarely used. |

## Iterate the element of collection in java

### Iterate by Iterator interface

```Java
ArrayList<Student> al = new ArrayList<Student>();
  al.add(s1);//adding Student class object
  al.add(s2);
  al.add(s3);

  //Getting Iterator
  Iterator itr=al.iterator();

  //traversing elements of ArrayList object
  while(itr.hasNext()) {
    Student st=(Student)itr.next();
    System.out.println(st.rollno + " " + st.name + " " + st.age);
  }
```

### Iterating through for-each loop

```Java
ArrayList<String> al=new ArrayList<String>();
  al.add("Ravi");
  al.add("Vijay");
  al.add("Ravi");

  for(String obj:al)
    System.out.println(obj);
```

## Generics

Java collection framework was non-generic before JDK 1.5. Since 1.5, it is generic.

Java new generic collection allows you to have only one type of object in collection. Now it is type safe so typecasting is not required at run time.

Let's see the old non-generic example of creating java collection.

```Java
ArrayList al=new ArrayList();//creating old non-generic arraylist
```

Let's see the new generic example of creating java collection.

```Java
ArrayList<String> al=new ArrayList<String>();//creating new generic arraylist
```

In generic collection, we specify the type in angular braces. Now ArrayList is forced to have only specified type of objects in it. If you try to add another type of object, it gives compile time error.