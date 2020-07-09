# Kotlin Classes

```Kotlin
class Bird(private val name: String, private val latinName: String, private val ringingYear: Int) {

    override fun toString(): String {
        return this.latinName + "(" + this.ringingYear + ")"
    }
}
```