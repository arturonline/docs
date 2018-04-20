# Optionals

[guard likes](https://android.jlelse.eu/a-few-ways-to-implement-a-swift-like-guard-in-kotlin-ffd94027864e)

## Safe Calls

```Kotlin
b?.length
```

This returns b.length if b is not null, and null otherwise. The type of this expression is Int?

## The !! Operator

The not-null assertion operator (!!) converts any value to a non-null type and throws an exception if the value is null:

```Kotlin
val l = b!!.length
```

## Elvis Operator

```Java
// normal if null check
val l: Int = if (b != null) b.length else -1

// Elvis operator
val l = b?.length ?: -1
```

```Kotlin
fun foo(node: Node): String? {
    val parent = node.getParent() ?: return null
    val name = node.getName() ?: throw IllegalArgumentException("name expected")
    // ...
}
```

## Let

```Kotlin
var thing: String? = null
val something = thing?.let { "hello" }
```

y using the ? and the let function we can execute code only if the optional value is not null and return the last statement from within the let block parameter.

```Kotlin
var thing: String? = null
// Use the it keyword (referencing the value of thing) as the last statement in the let block to 
// return the value if not null
val something = thing?.let { it }
```

We could use the it as the last statement in the let block which would return the value of thing if it is not null, like this: