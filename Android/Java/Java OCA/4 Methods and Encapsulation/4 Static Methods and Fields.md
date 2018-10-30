# Designing Static Methods and Fields

Static methods don’t require an instance of the class. They are shared among all users of the class.

You can use an instance of the object to call a static method:

```Java
public class Koala {
    public static int count = 0; // static variable

    public static void main(String[] args) { // static method
        Koala k = new Koala();
        System.out.println(k.count); // k is a Koala
        k = null;
        System.out.println(k.count); // k is still a Koala
    }
}
```

This code outputs 0 twice. Line 6 sees that k is a Koala and count is a
static variable, so it reads that static variable. Line 8 does the same thing.

One more time because this is really important: what does the following output?

```Java
Koala.count = 4;
Koala koala1 = new Koala();
Koala koala2 = new Koala();
koala1.count = 6;
koala2.count = 5;
System.out.println(Koala.count);
```

Hopefully, you answered 5. There is only one count variable since it is static. It is set to 4, then 6, and finally winds up as 5. All the Koala variables are just distractions.

## Static vs Instance

A static method or instance method can call a static method because static methods don’t require an object to use. Only an instance method can call another instance method on the same class without using a reference variable, because instance methods do require an object. Similar logic applies for the instance and static variables.

```Java
1: public class Gorilla {

2:  public static int count;

3:  public static void addGorilla() { count++; }
4:  public void babyGorilla() { count++; }
5:  public void announceBabies() {
6:      addGorilla();
7:      babyGorilla();
8: }
9: public static void announceBabiesToEveryone() {
10:     addGorilla();
11:     babyGorilla(); // DOES NOT COMPILE
12: }
13: public int total;
14: public static average = total / count; // DOES NOT COMPILE
15: }
```

- Lines 3 and 4 are fine because both static and instance methods can refer to a static variable.
- Lines 5–8 are fine because an instance method can call a static method.
- Line 11 doesn’t compile because a static method cannot call an instance method.
- Similarly, line 14 doesn’t compile because a static variable is trying to use an instance variable.

## Static variables

Some static variables are meant to change as the program runs:

```Java
private static int counter = 0
```

And other are meant to never change:

```Java
private static final int NUM_BUCKETS = 45;
```

Reference variables:

```Java
private static final ArrayList<String> values = new ArrayList<>();
public static void main(String[] args) {
    values.add("changed");
}
```

Values is a reference variable. We are allowed to call methods on reference variables. All the compiler can do is check that we don’t try to reassign the final values to point to a different object.

## Static initialization

Final variables aren’t allowed to be reassigned.

```Java
14: private static int one;
15: private static final int two;
16: private static final int three = 3;
17: private static final int four; // DOES NOT COMPILE
18: static {
19: one = 1;
20: two = 2;
21: three = 3; // DOES NOT COMPILE
22: two = 4; // DOES NOT COMPILE
23: }
```

- Line 14 declares a static variable that is not final. It can be assigned as many times as we like.
- Line 15 declares a final variable without initializing it. This means we can initialize it exactly once in a static block.
- Line 22 doesn’t compile because this is the second attempt.
- Line 16 declares a fnal variable and initializes it at the same time. We are not allowed to assign it again, so line 21 doesn’t compile.
- Line 17 declares a final variable that never gets initialized. The compiler gives a compiler error because it knows that the static blocks are the only place the variable could possibly get initialized. Since the programmer forgot, this is clearly an error.

## Static Imports

Regular imports are for importing classes. Static imports are for importing static members of classes, ex:

```Java
import java.util.List;
import static java.util.Arrays.asList; // static import
public class StaticImports {
public static void main(String[] args) {
List<String> list = asList("one", "two"); // no Arrays.
} }
```

This example shows almost everything you can do wrong:

```Java
1: import static java.util.Arrays; // DOES NOT COMPILE
2: import static java.util.Arrays.asList;
3: static import java.util.Arrays.*; // DOES NOT COMPILE
4: public class BadStaticImports {
5:  public static void main(String[] args) {
6:  Arrays.asList("one"); // DOES NOT COMPILE
7: } }
```

- **Line 1** tries to use a static import to import a class. Remember that static imports are only for importing static members. Regular imports are for importing a class.
- **Line 3** tries to see if you are paying attention to the order of keywords. The syntax is import static and not vice versa.
- **Line 6** is sneaky. We imported the asList method on line 2. However, we did not import the Arrays class anywhere. This makes it okay to write asList("one"); but not Arrays.asList("one");.

In Chapter 1, you learned that importing two classes with the same name gives a compiler error. This is true of static imports as well. The compiler will complain if you try to explicitly do a static import of two methods with the same name or two static variables with the same name. For example:

```Java
import static statics.A.TYPE;
import static statics.B.TYPE; // DOES NOT COMPILE
```