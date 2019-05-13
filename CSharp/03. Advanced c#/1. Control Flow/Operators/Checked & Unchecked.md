# Checked & Unchecked

By default, an expression that contains only constant values causes a compiler error if the expression produces a value that is outside the range of the destination type. If the expression contains one or more variables, the compiler does NOT detect the overflow.

```csharp
//  2147483647 is the maximum value for integers.

// The following example, does not cause a compiler error.
int ten = 10;
int i2 = 2147483647 + ten; // Because ten is a variable

Console.WriteLine(i2);
```

## Checked

The checked keyword is used to explicitly enable overflow checking for integral type arithmetic operations and conversions.

```csharp
// Checked expression.
Console.WriteLine(checked(2147483647 + ten));

// Checked block.
checked
{
    int i3 = 2147483647 + ten;
    Console.WriteLine(i3);
}
```

## unchecked

The unchecked keyword is used to suppress overflow-checking for integral-type arithmetic operations and conversions.

```csharp
unchecked
{
    int1 = 2147483647 + 10;
}
int1 = unchecked(ConstantMax + 10); // ConstantMax is a constant
```

If the unchecked is removed, a compilation error occurs. The overflow can be detected at compile time because all the terms of the expression are constants.