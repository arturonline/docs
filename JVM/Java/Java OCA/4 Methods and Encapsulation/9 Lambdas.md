# Writing Simple Lambdas

A lambda expression is a block of code that gets passed around. It has parameters and a body just like full-ﬂedged methods do, but it doesn’t have a name like a real method. You can think of a lambda expression as an anonymous method.

## Lambda Syntax

![Java components naming conventions](resources/lambda1.png )
![Java components naming conventions 2](resources/lambda2.png)

- Java doesn’t require you to type return or use a semicolon when no braces are used. This special shortcut doesn’t work when we have two or more statements.
- The parentheses can only be omitted if there is a single parameter and its type is not explicitly stated.

Exemples:

```Java
3: print(() -> true); // 0 parameters
4: print(a -> a.startsWith("test")); // 1 parameter
5: print((String a) -> a.startsWith("test")); // 1 parameter
6: print((a, b) -> a.startsWith("test")); // 2 parameters
7: print((String a, String b) -> a.startsWith("test")); // 2 parameters
```

```Java
print(a, b -> a.startsWith("test")); // DOES NOT COMPILE
print(a -> { a.startsWith("test"); }); // DOES NOT COMPILE
print(a -> { return a.startsWith("test") }); // DOES NOT COMPILE
```

- The first line needs parentheses around the parameter list. Remember that the parentheses are only  optional when there is one parameter and it doesn’t have a type declared.
- The second line is missing the return keyword.
- The last line is missing the semicolon.

There is one more issue you might see with lambdas. We’ve been defining an argument list in our lambda expressions. Since Java doesn’t allow us to redeclare a local variable, the following is an issue:

```Java
(a, b) -> { int a = 0; return 5;} // DOES NOT COMPILE
```

We tried to redeclare a, which is not allowed. By contrast, the following line is okay because it uses a different variable name:

```Java
(a, b) -> { int c = 0; return 5;}
```

## Predicates

Lambdas work with interfaces that have only one method. You can imagine that we’d have to create lots of interfaces like this to use lambdas. Luckily, Java recognizes that this is a common problem and provides such an interface for us:

```Java
public interface Predicate<T> {
boolean test(T t);
}
```

This means we don’t need our own interface anymore and can put everything
related to our search in one class.

### removeIf()

Java 8 integrated the Predicate interface into some existing classes. There is only
one you need to know for the exam. ArrayList declares a removeIf() method that takes a
Predicate:

```Java
3: List<String> bunnies = new ArrayList<>();
4: bunnies.add("long ear");
5: bunnies.add("floppy");
6: bunnies.add("hoppy");
7: System.out.println(bunnies); // [long ear, floppy, hoppy]
8: bunnies.removeIf(s -> s.charAt(0) != 'h');
9: System.out.println(bunnies); // [hoppy]
```

Line 8 removes all of the bunny names that don’t begin with the letter h. 