# IO

## Read String

```java
val stringInput = readLine()!!
println("You entered: $stringInput")
```

## Read Int

```java
var age = Integer.valueOf(readLine())
```

```java
println("Type a number")
var num = readLine()?.toInt() ?: throw IllegalArgumentException("num expected")
```

