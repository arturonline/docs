# Java Lambda Expressions

A Java lambda expression is a function which can be created without belonging to any class. A Java lambda expression can be passed around as if it was an object and executed on demand.

```java
parameter -> expression
(parameter) -> expresion // try to avoid parentheses around a single parameter

(param1, param2) -> expression // try to avoid specifying param tipes
(param p1, param p2) -> expression

p -> { code block }

String::toLowerCase; // try to use method references
```

## Functional intefaces

How does lambda expressions fit into Javas type system? Each lambda corresponds to a given type, specified by an interface. A so called **functional interface** must contain exactly one abstract method declaration. Each lambda expression of that type will be matched to this abstract method.

The lambda expression should have the **same number of parameters** and the **same return type** as that method. Since default methods are not abstract you're free to add default methods to your functional interface.

### Built-in Functional Interfaces

The JDK 1.8 API contains many built-in functional interfaces, which you can find in the package [`java.util.function`](https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html). The interface [`Predicate<T>`](https://docs.oracle.com/javase/8/docs/api/java/util/function/Predicate.html) is an example of a generic interface:

```java
public static void printPersonsWithPredicate(
    List<Person> roster, Predicate<Person> tester) {
    for (Person p : roster) {
        if (tester.test(p)) {
            p.printPerson();
        }
    }
}
```

### `@FunctionalInterface` annotation

To ensure that your interface meet the requirements, you should add the `@FunctionalInterface` annotation. The compiler is aware of this annotation and throws a compiler error as soon as you try to add a second abstract method declaration to the interface.

Example:

```java
@FunctionalInterface
interface Converter<F, T> {
    T convert(F from);
}

Converter<String, Integer> converter = (from) -> Integer.valueOf(from);
Integer converted = converter.convert("123");
System.out.println(converted);    // 123
```

Keep in mind that the code is also valid if the `@FunctionalInterface` annotation would be ommited.

## Method references as Lambdas

In the case where all your lambda expression does is to call another method with the parameters passed to the lambda, the Java lambda implementation provides a shorter way to express the method call.

```java
MyPrinter myPrinter = s -> System.out.println(s);
MyPrinter myPrinter = System.out::println;
```

Notice the double colons `::`. These signal to the Java compiler that this is a method reference. The method referenced is what comes after the double colons. Whatever class or object that owns the referenced method comes before the double colons.

It is possible to reference a constructor of a class. You do that by writing the class name followed by `::new`, like this:

```java
Factory factory = chars -> new String(chars);
Factory factory = String::new;
```