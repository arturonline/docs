# Null-coalescing operator

The `?? operator` is called the null-coalescing operator. The operator returns the left value if it’s not null; otherwise, the right operand.

```csharp
int? x = null;
int y = x ?? -1;

// -1 because x is null
```

In this case, the value of y is -1 because x is null.
You can also nest the null-coalescing operator, as Listing 1-59 shows.

```csharp
int? x = null;
int? z = null;
int y = x ?? z ?? -1;
```