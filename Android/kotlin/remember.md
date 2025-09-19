# state

```java
var text by remember { mutableStateOf("") }
```

## Short version

This gives you a variable (text) that:

- Is preserved across recompositions (remember)
- Triggers UI updates when changed (mutableStateOf)

## remember 

> *remember* is a Jetpack Compose function that remembers the value across recompositions. It ensures that the state (the text in this case) is not reset every time the UI recomposes. Without remember, the value would be lost on every recomposition.

## mutableStateOf

> In Compose, UI elements automatically update when the state they read changes. *mutableStateOf* is how you create such a state: when you update its value, Compose knows to recompose (redraw) any UI that depends on it.

## by

This is Kotlin’s property delegate syntax. It allows you to use newTodoText directly instead of calling *getValue()* and *setValue()* on the state object.

So you can write `newTodoText = "Buy milk"` instead of `newTodoText.value = "Buy milk"`.