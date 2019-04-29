# Passing Data Among Methods

Java uses **pass-by-value** to get data into a method. Assigning a new primitive or reference to a parameter doesn’t change the caller. Calling methods on a reference to an object does affect the caller.

**Primitive** exemple:

```Java
2: public static void main(String[] args) {
3:  int num = 4;
4:  newNumber(5);
5:  System.out.println(num); // 4
6: }
7: public static void newNumber(int num) {
8:  num = 8;
9: }

// The variable on line 3 never changes because no assignments are made to it.
```

**Reference** exemple:

```Java
public static void main(String[] args) {
    String name = "Webby";
    speak(name);
    System.out.println(name); // Webby
}
public static void speak(String name) {
    name = "Sparky";
}

// The variable assignment is only to the method parameter and doesn’t affect the caller
```

Another example:

```Java
1: public class ReturningValues {
2: public static void main(String[] args) {
3:  int number = 1; // 1
4:  String letters = "abc"; // abc
5:  number(number); // 1
6:  letters = letters(letters); // abcd
7:  System.out.println(number + letters); // 1abcd
8: }
9: public static int number(int number) {
10:     number++;
11:     return number;
12: }
13: public static String letters(String letters) {
14:     letters += "d";
15:     return letters;
16:     }
17: }

```

This is a tricky one because there is a lot to keep track of. When you see such questions on the exam, write down the values of each variable.

- Lines 3 and 4 are straightforward assignments.
- Line 5 calls a method.
- Line 10 increments the method parameter to 2 but leaves the numbers variable in the main() method as 1. While line 11 returns the value, the caller ignores it.
- The method call on line 6 doesn’t ignore the result so letters becomes "abcd". Remember that this is happening because of the returned value and not the method parameter.
