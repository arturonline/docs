# IO

## Read String

```Kotlin
val stringInput = readLine()!!
println("You entered: $stringInput")
```

## Read Int

```Kotlin
var age = Integer.valueOf(readLine())
```

```Kotlin
println("Type a number")
var num = readLine()?.toInt() ?: throw IllegalArgumentException("num expected")
```

