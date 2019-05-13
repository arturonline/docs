# classes

```csharp
using System;

public class Person
{
    // Constructor that takes no arguments:
    public Person()
    {
        Name = "unknown";
    }

    // Constructor that takes one argument:
    public Person(string name)
    {
        Name = name;
    }

    // Auto-implemented readonly property:
    public string Name { get; }

    // Method that overrides the base class (System.Object) implementation.
    public override string ToString()
    {
        return Name;
    }
}
class TestPerson
{
    static void Main()
    {
        // Call the constructor that has no parameters.
        var person1 = new Person();
        Console.WriteLine(person1.Name);

        // Call the constructor that has one parameter.
        var person2 = new Person("Sarah Jones");
        Console.WriteLine(person2.Name);
        // Get the string representation of the person2 instance.
        Console.WriteLine(person2);
    }
}
// Output:
// unknown
// Sarah Jones
// Sarah Jones
```

## Nested Classes

A class defined within another class is called nested. By default, the nested class is private.

```csharp
class Container  
{  
    class Nested  
    {  
        // Add code here.  
    }  
}  
```

To create an instance of the nested class, use the name of the container class followed by the dot and then followed by the name of the nested class:

```csharp
Container.Nested nestedInstance = new Container.Nested()
```

## Anonymous Types

Anonymous types enable you to create objects without writing a class definition for the data type. Instead, the compiler generates a class for you. The class has no usable name and contains the properties you specify in declaring the object.

To create an instance of an anonymous type:

```csharp
// sampleObject is an instance of a simple anonymous type.  
var sampleObject =
    new { FirstProperty = "A", SecondProperty = "B" };
```

## Overriding Members

By default, a derived class inherits all members from its base class. If you want to change the behavior of the inherited member, you need to override it. That is, you can define a new implementation of the method, property or event in the derived class.

The following modifiers are used to control how properties and methods are overridden:

| C# Modifier  | Definition                                                          |
| ------------ | ------------------------------------------------------------------- |
| virtual      | Allows a class member to be overridden in a derived class.          |
| override     | Overrides a virtual (overridable) member defined in the base class. |
| abstract     | Requires that a class member to be overridden in the derived class. |
| new Modifier | Hides a member inherited from a base class                          |

## Partial Class

A class definition can be split into multiple source files. At compile time, these multiple parts are combined.

```csharp
// File: Animal.gen.cs
public partial class Animal
{

}

// File: Animal.cs
public partial class Animal
{

}