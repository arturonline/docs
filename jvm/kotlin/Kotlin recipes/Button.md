# Buttons in kotlin

The simplest way to reference a view in a property is to use a nullable type.

```java
var button: Button? = null
```

## Better option 1

```java
private lateinit var button: Button
```

## Better option 2

```java
private val button by lazy {
    findViewById(R.id.button) as Button
}
```
