# Basic Types

## Numbers

| Type   | Bit width |
|--------|-----------|
| Double |        64 |
| Float  |        32 |
| Long   |        64 |
| Int    |        32 |
| Short  |        16 |
| Byte   |         8 |

*Characters are not numbers in Kotlin.*

### Literal Constants

- Decimals: 123
- Long decimals: 123L (mayuscula)
- Hexadecimals: 0x0F
- Binaries: 0b00001011
- Doubles by default: 123.5, 123.5e10
- Floats are tagged by f or F: 123.5f

*Octal literals are not supported.*

### Conversions

In Kotlin smaller types are NOT implicitly converted to bigger types. This means that we cannot assign a value of type Byte to an Int variable without an explicit conversion.

Every number type supports the following explicit conversions:

```Java
toByte(): Byte
toShort(): Short
toInt(): Int
toLong(): Long
toFloat(): Float
toDouble(): Double
toChar(): Char
```

Absence of implicit conversions is rarely noticeable because the type is inferred from the context, and arithmetical operations are overloaded for appropriate conversions, for example:

```Java
val l = 1L + 3 // Long + Int => Long
```

## Characters

- Represented by the type *Char*. They can not be treated directly as numbers.
- Character literals go in sigle quotes: *'1'*

## Booleans

The type Boolean represents booleans, and has two values: `true` and `false`.

## Arrays

- Arrays in Kotlin are represented by the Array class
- Arrays have **get** and **set** functions, and **size** property,

To create an array, we can use a library function `arrayOf()` and pass the item values to it, so that `arrayOf(1, 2, 3)` creates an `array [1, 2, 3]`.

Kotlin also has specialized classes to represent arrays of primitive types without boxing overhead: `ByteArray, ShortArray, IntArray` and so on.