# Defining variables

## Read-Only Variables

```Java
val a: Int = 1  // immediate assignment
val b = 2   // `Int` type is inferred
val c: Int  // Type required when no initializer is provided
c = 3       // deferred assignment

// a = 1, b = 2, c = 3
```

A read only variable does not mean the instance itself is automatically immutable. The instance may still allow its memeber variables to be changed via functions or properties, but the variable itself cannot change its value or be reassigned to another value.

## Mutable Variables

```Java
var x = 5 // `Int` type is inferred
x += 1

// x = 6
```