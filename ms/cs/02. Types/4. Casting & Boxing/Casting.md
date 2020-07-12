# Casting and Type Conversions

You might sometimes need to copy a value into a variable or method parameter of another type.

## 1. Implicit conversions

Implicit conversion happens automatically by the compiler itself. No special syntax is required because the conversion is type safe and no data will be lost. Examples include conversions from smaller to larger integral types, and conversions from derived classes to base classes. [Implicit numeric conversions table.](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/implicit-numeric-conversions-table)

Remarks

- Any integral type is implicitly convertible to any floating-point type.
- Precision but not magnitude might be lost in the conversions from int, uint, long, or ulong to float and from long or ulong to double.
- There are no implicit conversions to the char, byte, and sbyte types.
- There are no implicit conversions from the double and decimal types.
- There are no implicit conversions between the decimal type and the float or double types.
- A value of a constant expression of type int (for example, a value represented by an integral literal) can be converted to sbyte, byte, short, ushort, uint, or ulong, provided it's within the range of the destination type.

```csharp
int i = 10;
double d = i;

// Implicit conversion of derived to base type
object o = new Program();
 ```

```csharp
// conversion of derived class to base class.
class A {...}
class B : A {...}
A a = new B()
```

## 2. Explicit conversions

Explicit conversions require a `cast operator`. Casting is required when information might be lost in the conversion, or when the conversion might not succeed for other reasons. Typical examples include numeric conversion to a type that has less precision or a smaller range, and conversion of a base-class instance to a derived class.

```csharp
double d = 3.1417;
int i = (int)d;
// use (type) to convert a type explicitly
```

## 3. User-defined conversions

User-defined conversions are performed by special methods that you can define to enable explicit and implicit conversions between custom types that do not have a base class–derived class relationship.

User can write their definition for type conversion by using implicit and explicit keyword with special static methods.

```csharp
// Implicit conversion
class Byte
{
    public int bits = 8;
    public static implicit operator int (Byte b)
    {
        return b.bits;
    }
}
class Program
{
    static void Main(string[] args)
    {
        Byte b = new Byte();
        int totalBits = b;
        Console.WriteLine(totalBits);
    }
}
//Output 8
```

```csharp
// Explicit conversion
class Person
{
    public int Age { get; set; }
    public string Name { get; set; }

    public static explicit operator string (Person per)
    {
        return per.Name;
    }
}

class Program
{
    static void Main(string[] args)
    {
        Person per = new Person { Age = 22, Name = "Ali" };
        string name = (string)per;
        Console.WriteLine(name);
    }
}
//Output Ali
```

## 4. Conversions with helper classes

To convert between non-compatible types, such as integers and `System.DateTime` objects, or hexadecimal strings and byte arrays, you can use the `System.BitConverter` class, the `Convert` class, and the `Parse` methods of the built-in numeric types, such as `Int32.Parse`.

```csharp
int value = Convert.ToInt32("42");
value = int.Parse("42");
bool success = int.TryParse("42", out value);
```