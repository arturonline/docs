# Boxing and UnBoxing

* Boxing is the conversion (copy and wrap) of a value type into a reference type.
* Unboxing is vice versa, the conversion of a reference type into a value type. Unboxing requires Cast.

```csharp
int age = 22;
object boxedAge = age; //Boxing
```

```csharp
int count = 1;
object countObject = count; // the count value was copied into the countObject variable, it was boxing
count += 1; // count equals 2 already, and the countObject value is still 1
count = (int)countObject; // now count also equals 1 – it was unboxing
```

The only other important thing to know is that when boxing and unboxing happen, you need to explicitly cast your object from a reference to a value type.

```csharp
int unboxedAge = (int)boxedAge; //Unboxing
```

## Confirming Conversion is valid: `is`, `as` operators

C# has both, the `is` operator and the `as` operator that can be used to check whether a type can be converted to another type and to do so in a safe way.

* The `is` operator returns `true` or `false`, depending on whether the conversion is allowed.
* The `as` operator explicitly returns the converted value or `null` if the conversion is not possible instead of raising an exception.

```csharp
void OpenConnection(DbConnection connection)
{
        if (connection is SqlConnection)
        {
        // run some special code
        }
}

void LogStream(Stream stream)
{
    MemoryStream memoryStream = stream as MemoryStream;
    if (memoryStream != null)
    {
    // ....
    }
}
```

Using the `as` operator is more effcient when you want to use the value afterward. If you only want to check whether your type is of a certain type, you can use the `is` operator.