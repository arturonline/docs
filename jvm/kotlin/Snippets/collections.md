# Collections snippets

```Kotlin
// Type anotation: for constructor
val map : MutableMap<Int, MutableList<String>>
```

```Kotlin
// Initialization
val mutableListNames: MutableList<String> = mutableListOf<String>("Josh", "Kene", "Sanya")
val listNames: mutableListOf<String>("Josh", "kene", "Sanya")
val names: mutableListOf("josh", "kene", "sanya")
```

```Kotlin
// Declaration of an empty List
val emptyList: List<String> = emptyList<String>()
val map = mutableMapOf<Int, String>()
```

```Kotlin
// Declaration of an empty ArrayList (outside constructor)
private val list = ArrayList<ToBeStored>()
```