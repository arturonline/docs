# String Concatenation

Combining two or more Strings together with **"+"**

1. If both operands are numeric, + means numeric addition.
1. If either operand is a String, + means concatenation.
1. The expression is evaluated left to right.

examples:

```Java
System.out.println(1 + 2); // 3
System.out.println("a" + "b"); // ab
System.out.println("a" + "b" + 3); // ab3
System.out.println(1 + 2 + "c"); // 3c
```

```Java
String s = "1"; // s currently holds "1"
s += "2"; // s currently holds "12"
s += 3; // s currently holds "123"
System.out.println(s); // 123
```

Combining two or more Strings together with **concat()**

```Java
String s1 = "1";
String s2 = s1.concat("2");
s2.concat("3");
System.out.println(s2);

//Did you say "12"? Good. The trick is to see if you forget that the String class is immutable by throwing a method at you.
```