# Nullable types

Ordinary value types cannot have a value of `null`. However, you can create nullable value types by affixing a `?` after the type. For example, `int?` is an int type that can also have the value null.

```csharp
bool? isMarried = null;
isMarried = true;
```

## ?? Operator

The `null-coalescing operator` or `??` is used to assign a value to an underlying type based on a value of the nullable type:

```Csharp
bool? isMarried = null;
bool married = isMarried ?? false;
```

Important Points

• `Nullable<T>` is an alternative of `?` operator. The above example can be written as `Nullable<bool> isMarried = null;`.
• Value type is **boxed** whenever it becomes nullable.