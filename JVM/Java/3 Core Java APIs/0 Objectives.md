# Objectives

Strings are immutable sequences of characters. The new operator is optional. The concatenation operator (+) creates a new String with the content of the frst String followed by the content of the second String. If either operand involved in the + expression is a String, concatenation is used; otherwise, addition is used.

String literals are stored in the string pool. The String class has many methods. You need to know charAt(), concat(), endsWith(), equals(), equalsIgnoreCase(), indexOf(), length(), replace(), startsWith(), substring(), toLowerCase(), toUpperCase(), and trim().

StringBuilders are mutable sequences of characters. Most of the methods return a reference to the current object to allow method chaining. The StringBuilder class has many methods. You need to know append(), charAt(), delete(), deleteCharAt(), indexOf(), insert(), length(), reverse(), substring(), and toString(). StringBuffer is the same as StringBuilder except that it is thread safe.

Calling == on String objects will check whether they point to the same object in the pool. Calling == on StringBuilder references will check whether they are pointing to the same StringBuilder object. Calling equals() on String objects will check whether the
sequence of characters is the same. Calling equals() on StringBuilder objects will check whether they are pointing to the same object rather than looking at the values inside.

An array is a fixed-size area of memory on the heap that has space for primitives or pointers to objects. You specify the size when creating it—for example, int[] a = new int[6];. Indexes begin with 0 and elements are referred to using a[0]. The Arrays.sort()
method sorts an array. Arrays.binarySearch() searches a sorted array and returns the index of a match. If no match is found, it negates the position where the element would need to be inserted and subtracts 1.

Methods that are passed varargs (…) can be used as if a normal array was passed in. In a multidimensional array, the second-level arrays and beyond can be different sizes.

An ArrayList can change size over its life. It can be stored in an ArrayList or List reference. Generics can specify the type that goes in the ArrayList. You need to know the methods add(), clear(), contains(), equals(), isEmpty(), remove(), set(), and size(). Although an ArrayList is not allowed to contain primitives, Java will autobox parameters passed in to the proper wrapper type. Collections.sort() sorts an ArrayList.

A LocalDate contains just a date, a LocalTime contains just a time, and a LocalDateTime contains both a date and time. All three have private constructors and are created using LocalDate.now() or LocalDate.of() (or the equivalents for that class). 

Dates and times can be manipulated using plusXXX or minusXXX methods.

The Period class represents a number of days, months, or years to add or subtract from a LocalDate or LocalDateTime. DateTimeFormatter is used to output dates and times in the desired format. The date and time classes are all immutable, which means the return value must be used.

## Exam essentials

**Be able to determine the output of code using String**. Know the rules for concatenating Strings and how to use common String methods. Know that Strings are immutable. Pay special attention to the fact that indexes are zero based and that substring() gets the
string up until right before the index of the second parameter.

**Be able to determine the output of code using StringBuilder**. Know that StringBuilder is mutable and how to use common StringBuilder methods. Know that substring() does not change the value of a StringBuilder whereas append(), delete(), and insert() do change it. Also note that most StringBuilder methods return a reference to the current instance of StringBuilder.

**Understand the difference between == and equals**. == checks object equality. equals() depends on the implementation of the object it is being called on. For Strings, equals() checks the characters inside of it.

**Be able to determine the output of code using arrays**. Know how to declare and instantiate one-dimensional and multidimensional arrays. Be able to access each element and know when an index is out of bounds. Recognize correct and incorrect output when searching
and sorting.

**Be able to determine the output of code using ArrayList**. Know that ArrayList can increase in size. Be able to identify the different ways of declaring and instantiating an ArrayList. Identify correct output from ArrayList methods, including the impact of
autoboxing.

**Recognize invalid uses of dates and times**. LocalDate does not contain time felds and LocalTime does not contain date f elds. Watch for operations being performed on the wrong time. Also watch for adding or subtracting time and ignoring the result.