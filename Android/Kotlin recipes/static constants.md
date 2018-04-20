# Equivalent of static final fields in Kotlin

```Java
private const val DATABASE_NAME = "MyDatabase.db"

private fun makeDatabase(context: Context): MyDatabase {
    return Room.databaseBuilder(
        context,
        MyDatabase::class.java,
        DATABASE_NAME).build()
    )
}
```

```Java
class Hello {
    companion object {
        const val MAX_LEN = 20
    }
}
```

Usage:

```Java
fun main(srgs: Array<String>) {
    println(Hello.MAX_LEN)
}
```

## const

const  essentially creates a constant, no accessors. Only works for top-level or object-level primitives and Strings.

```Java
// Top of the file Constansts.kt
@file:JvmName("Constants")

...

const val FOO = "foo"
```