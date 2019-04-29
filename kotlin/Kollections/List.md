# List

A list in Kotlin is equal to arrayList in Java

```Java
val list: kotlin.collections.List<String> = java.util.ArrayList()
```

## Constructor

To create a list with elements, we need to use the `listOf(vararg elements: T)` method:

```Java
val list = listOf()
val listTwo = listOf("One")
val listThree = listOf<String>("one", "two")
```

The first method calls `emptyList()`, and the second one returns an immutable list with one element.

```Kotlin
// Type anotation: for constructor
val map : MutableMap<Int, MutableList<String>>
val mutableListNames: MutableList<String> = mutableListOf<String>("Josh", "Kene", "Sanya")
```

## Inmutable Methods

```Java
override val size: Int
override fun isEmpty(): Boolean
override fun contains(element: @UnsafeVariance E): Boolean
override fun iterator(): Iterator<E>
override fun containsAll(elements: Collection<@UnsafeVariance E>): Boolean
public operator fun get(index: Int): E
public fun indexOf(element: @UnsafeVariance E): Int
public fun lastIndexOf(element: @UnsafeVariance E): Int
public fun listIterator(): ListIterator<E>
public fun listIterator(index: Int): ListIterator<E>
public fun subList(fromIndex: Int, toIndex: Int): List<E>
```

## Mutable Methods

```Java
override fun add(element: E): Boolean
override fun remove(element: E): Boolean
override fun addAll(elements: Collection<E>): Boolean
public fun addAll(index: Int, elements: Collection<E>): Boolean
override fun removeAll(elements: Collection<E>): Boolean
override fun retainAll(elements: Collection<E>): Boolean
override fun clear(): Unit
public operator fun set(index: Int, element: E): E
public fun add(index: Int, element: E): Unit
public fun removeAt(index: Int): E
override fun listIterator(): MutableListIterator<E>
override fun listIterator(index: Int): MutableListIterator<E>
override fun subList(fromIndex: Int, toIndex: Int): MutableList<E>
```
