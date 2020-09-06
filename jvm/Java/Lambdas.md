# Java Lambda Expressions

A Java lambda expression is a function which can be created without belonging to any class. A Java lambda expression can be passed around as if it was an object and executed on demand.

## Syntaxis

```java
(parameter list) -> { code block }
```

Other ways to represent a lambda expression:

```java
(parameter) -> expresion // try to avoid parentheses around a single parameter
parameter -> expression

(param p1, param p2) -> expression // try to avoid specifying param types
(param1, param2) -> expression

p -> { code block }

String::toLowerCase; // try to use method references
```

Despite its concise syntax, lambdas should precisely express the functionality they provide. If possible, use one line constructions instead of a large block of code. Remember lambdas should be an expression, not a narrative.

### Method references as Lambdas

In the case where all your lambda expression does is to call another method with the parameters passed to the lambda, the Java lambda implementation provides a shorter way to express the method call.

```java
Consumer<String> myPrinter = s -> System.out.println(s);
Consumer<String> myPrinter = System.out::println;
```

Notice the double colons `::`, these signal to the Java compiler that this is a method reference. The method referenced is what comes after the double colons.

It is possible to reference a constructor of a class. You do that by writing the class name followed by `::new`, like this:

```java
Factory factory = chars -> new String(chars);
Factory factory = String::new;
```

## Type of a Lambda expression

Java is a Typed language. In order to define the type of a lambda expression we use an interface with a single method:

```java
public interface MyFunction {
    public void apply(String s);


MyFunction myFunction = text -> System.out.println(text);
myFunction.apply("hola"),
```

### Functional intefaces

Each lambda corresponds to a given type, specified by a **functional interface**. A functional interface must contain exactly **one abstract method declaration**, with the same number of parameters and the same return type, and each lambda expression of that type will be matched to this abstract method.

⚠ Since default methods are not abstract you're free to add default methods to your functional interface.

### Built-in Functional Interfaces

The JDK 1.8 API contains many built-in functional interfaces, which you can find in the package [`java.util.function`](https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html).

#### Examples

- [`Consumer <T>`](https://docs.oracle.com/javase/8/docs/api/java/util/function/Consumer.html)

Represents an operation that accepts a single input argument and returns no result:

```java
Consumer<String> printText = (p) -> System.out.println(p);
printText.accept("hola");
```

- [`Predicate<T>`](https://docs.oracle.com/javase/8/docs/api/java/util/function/Predicate.html)

Represents a predicate (boolean-valued function) of one argument:

```java
Predicate<String> cond = (s)-> s.length() > 5;
System.out.println(cond.test("java2s.com "));
```

>💡 [more examples](http://www.java2s.com/Tutorials/Java/java.util.function/Consumer/index.htm)

## Annotation: `@FunctionalInterface`

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
