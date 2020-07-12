# Structs

A struct type is a value type that is typically used to encapsulate small groups of related variables, such as the coordinates of a rectangle or the characteristics of an item in an inventory. The following example shows a simple struct declaration:

```csharp
struct Vector
{
    public int x;
    public int y;
}

class Program
{
    static void Main(string[] args)
    {
        Vector vector = new Vector();
        vector.x = 5;
        vector.y = 10;

        Console.WriteLine("x = {0}", vector.x);
        Console.WriteLine("y = {0}", vector.y);
    }
}
```

## Struct constructor

It is an error to define a default (parameterless) constructor for a struct:

```csharp
    public struct coOrds // Error
    {
        public int x, y;
        public coOrds()
        {

        }
    }
```

- Struct constructor must initialize all data members.
- It is also an error to initialize an instance field in a struct body. You can initialize externally accessible struct members only by using a parameterized constructor, the implicit, default constructor, an object initializer, or by accessing the members individually after the struct is declared.
- Any private or otherwise inaccessible members require the use of constructors exclusively.
- If you instantiate a struct object using the default, parameterless constructor, all members are assigned according to their default values.

```csharp
struct Vector
{
    //Constructor
    public Vector(int a, int b)
    {
        //Initialize Fields
        x = a;
        y = b;
    }
    //Fields
    public int x;
    public int y;
}
class Program
{
    static void Main(string[] args)
    {
        //Initialize Vector, by passing 5,10 value to its constructor
        Vector vector = new Vector(5, 10);

        Console.WriteLine("x = {0}", vector.x);
        Console.WriteLine("y = {0}", vector.y);
    }
}
```

## Struct without *new*

When you create a struct object using the new operator, it gets created and the appropriate constructor is called according to the constructor's signature. Unlike classes, structs can be instantiated without using the new operator. In such a case, there is no constructor call, which makes the allocation more efficient. However, the fields will remain unassigned and the object cannot be used until all of the fields are initialized. This includes the inability to get or set values through auto-implemented properties.

```csharp
public struct CoOrds
{
    public int x, y;

    public CoOrds(int p1, int p2)
    {
        x = p1;
        y = p2;
    }
}

// Declare a struct object without "new."
class TestCoOrdsNoNew
{
    static void Main()
    {
        // Declare an object:
        CoOrds coords1;

        // Initialize:
        coords1.x = 10;
        coords1.y = 20;

        // Display results:
        Console.Write("CoOrds 1: ");
        Console.WriteLine("x = {0}, y = {1}", coords1.x, coords1.y);

        // Keep the console window open in debug mode.
        Console.WriteLine("Press any key to exit.");
        Console.ReadKey();
    }
}
// Output: CoOrds 1: x = 10, y = 20
```

## When to use Structs

- Use structs if:
  - Instances of the type are small
  - The struct is commonly embedded in another type
  - The struct logically represent a single value
  - The values don't change (immutable)
  - It is rarely "Boxed"