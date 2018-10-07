# Kotlin

## Kotlin Expressions

Expressions consist of variables, operators etc that evaluates to a single value:

```Java
val score: Int
score = 90 + 25
```

Here, 90 + 25 is an expression that returns Int value.

In Kotlin, if is an expression unlike Java (In Java, if is a statement):

```java
fun main(args: Array<String>) {

    val a = 12
    val b = 13
    val max: Int

    max = if (a > b) a else b
    println("$max")
}
```

Here, if (a > b) a else b is an expression. Then value of the expression is assigned to max variable in the above program. Visit this page to learn more about Kotlin if expression.

## Kotlin Statements

Statements are everything that make up a complete unit of execution. For example,

```Java
val score = 90 + 25
```