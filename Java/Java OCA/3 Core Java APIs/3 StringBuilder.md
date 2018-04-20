# Using StringBuilder Class

* String is inmutables
* StringBuilder is mutable

## Creating a StringBuilder

There are three ways to construct a StringBuilder:

```Java
StringBuilder sb1 = new StringBuilder();
StringBuilder sb2 = new StringBuilder("animal");
StringBuilder sb3 = new StringBuilder(10);
```

1. The first says to create a StringBuilder containing an empty sequence of characters and assign sb1 to point to it.
1. The second says to create a StringBuilder containing a specific value and assign sb2 to point to it. For the first two, it tells Java to manage the implementation details.
1. The final example tells Java that we have some idea of how big the eventual value will be and would like the StringBuilder to reserve a certain number of slots for characters.

### Exemple1

```Java
5: String a = "abc";
6: String b = a.toUpperCase();
7: b = b.replace("B", "2").replace('C', '3');
8: System.out.println("a=" + a);
9: System.out.println("b=" + b);
```

* On line 5, we set a to point to "abc" and never pointed a to anything else. Since we are dealing with an immutable object, none of the code on lines 6 or 7 changes a.
* b is a little trickier. Line 6 has b pointing to "ABC", which is straightforward. On line 7, we have method chaining. First, “ABC".replace("B", "2") is called. This returns "A2C". Next, "A2C".replace("'C', '3') is called. This returns "A23".
* Finally, b changes to point to this returned String. When line 9 executes, b is "A23".

### Exemple2

```Java
StringBuilder a = new StringBuilder("abc");
StringBuilder b = a.append("de");
b = b.append("f").append("g");
System.out.println("a=" + a);
System.out.println("b=" + b);
// a=abcdefg
// b=abcdefg
```

* There’s only one StringBuilder object here. We know that because new StringBuilder() was **called only once**.
* On line 5, there are two variables referring to that object, which has a value of "abcde". On line 6, those two variables are still referring to that same object, which now has a value of "abcdefg". Incidentally, the assignment back to b does absolutely nothing. b is already pointing to that StringBuilder.

## StringBuilder methods

### charAt(), indexOf(), length(), and substring()

These four methods work exactly the same as in the String class. Be sure you can identify
the output of this example:

```Java
StringBuilder sb = new StringBuilder("animals");
String sub = sb.substring(sb.indexOf("a"), sb.indexOf("al")); // 0 4
int len = sb.length();
char ch = sb.charAt(6);
System.out.println(sub + " " + len + " " + ch);
// anim 7 s
```

### append()

```Java
StringBuilder sb = new StringBuilder().append(1).append('c');
sb.append("-").append(true);
System.out.println(sb); 
// 1c-true
```

### insert()

```Java
StringBuilder sb = new StringBuilder("animals");
sb.insert(7, "-"); // animals-
sb.insert(0, "-"); // -animals-
sb.insert(4, "-"); // -ani-mals-
System.out.println(sb);
```

As we add and remove characters, their indexes change.

### delete() deleteCharAt()

```java
StringBuilder sb = new StringBuilder("abcdef");
sb.delete(1, 3); // sb = adef
sb.deleteCharAt(5); // throws an exception => the remaining value is only four characters long.
```

### reverse()

```Java
StringBuilder sb = new StringBuilder("ABC"); 
sb.reverse();
System.out.println(sb);
// CBA
```