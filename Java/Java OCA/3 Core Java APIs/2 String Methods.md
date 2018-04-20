# String Methods

Almost every method, applied to a String object in order to modify it, creates new String object.

```java
String string = "animals";
```

## length()

```java
System.out.println(string.length()); // 7
```

## charAt()

```java
System.out.println(String.charAt(0)); // a
System.out.println(String.charAt(6)); // s
System.out.println(String.chartAt(7)); // throws exception
```

## indexOf()

```java
System.out.println(string.indexOf('a')); // 0
System.out.println(string.indexOf("al")) // 4
System.out.println(string.indexOf('a', 4)); // 4, Java
// shouldn’t even look at the characters until it gets to index 4
System.out.println(string.indexOf("al", 5)); // -1,  indexOf() returns –1 when no match is found.
```

## substring()

```java
System.out.println(string.substring(3)); // mals; The first parameter is the index to start with for the returned string.
System.out.println(string.substring(string.indexOf('m'))); // mals
System.out.println(string.substring(3, 4)); // m;
// There is an optional second parameter,
// which is the end index you want to stop at,
//but not including it.
System.out.println(string.substring(3, 7)); // mals

System.out.println(string.substring(3, 3)); // empty string
System.out.println(string.substring(3, 2)); // throws exception
System.out.println(string.substring(3, 8)); // throws exception
```

## equals() and equalsIgnoreCase()

```Java
System.out.println("abc".equals("ABC")); // false
System.out.println("ABC".equals("ABC")); // true
System.out.println("abc".equalsIgnoreCase("ABC")); // true
```
