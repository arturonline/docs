# Equality

==

* compares references.
* String and StringBuilders are different objects.

equals()

* Compare value inside the object

```java
StringBuilder one = new StringBuilder();
StringBuilder two = new StringBuilder();
StringBuilder three = one.append("a");
System.out.println(one == two); // false => different objects
System.out.println(one == three); // true => point to the same reference
```

```java
String x = "Hello World";
String y = "Hello World";
System.out.println(x == y);
// true
```

Remember that Strings are immutable and literals are pooled. The JVM created only one literal in memory. x and y both point to the same location in memory; therefore, the statement outputs true.

```java
String x = "Hello World";
String z = " Hello World".trim(); // Since it isn’t the same at compile-time, a new String object is created.
System.out.println(x == z);
// false
```

```java
String x = new String("Hello World");
String y = "Hello World";
System.out.println(x == y);
// false => different objetcs.
```

Since you have specifically requested a different String object, the pooled value isn’t shared.

```java
String x = "Hello World";
String z = " Hello World".trim();
System.out.println(x.equals(z));
// true
```

This works last example works because the authors of the String class implemented a standard method called equals to check the values inside the String rather than the String itself.

## Example

```java
public class Tiger {
String name;
public static void main(String[] args) {
    Tiger t1 = new Tiger();
    Tiger t2 = new Tiger();
    Tiger t3 = t1;
    System.out.println(t1 == t1); // true
    System.out.println(t1 == t2); // false
    System.out.println(t1.equals(t2)); // false
    }
}
```

The first two statements check object reference equality. Line 7 prints true because we are comparing references to the same object. Line 8 prints false because the two object references are different. Line 9 prints false since Tiger does not implement equals().