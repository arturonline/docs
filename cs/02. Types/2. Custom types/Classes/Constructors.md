# Constructors

Constructor is a method, called and executed first by runtime soon after its type’s instance is created on memory. It doesn’t have a return type. It is used to initialize data members that protect the application from any garbage computation error.

- Whenever a class or struct is created, its constructor is called.
- A class or struct may have multiple constructors that take different arguments.
- If you don't provide a constructor for your class, C# creates one by default that instantiates the object and sets member variables to the default values.

## Syntax

```csharp
public class Person
{
   private string last;
   private string first;

   public Person(string lastName, string firstName)
   {
      last = lastName;
      first = firstName;
   }

   // Remaining implementation of Person class.
}
```

```csharp
// If a constructor can be implemented as a single statement, you can use an expression body definition.
public class Location
{
   private string locationName;

   public Location(string name) => Name = name;

   public string Name
   {
      get => locationName;
      set => locationName = value;
   }
}
```

```csharp
public class Employee
{
    public Employee(string s, int i) => (Name, ID) = (s, i);
    public string Name { get; set; }
    public int ID { get; set; }
}
```

## Static constructor

The previous examples have all shown instance constructors, which create a new object. A class or struct can also have a static constructor, which initializes static members of the type. Static constructors are parameterless. If you don't provide a static constructor to initialize static fields, the C# compiler will supply a default static constructor that initializes static fields to their default value as listed in the Default Values Table.

The following example uses a static constructor to initialize a static field.

```csharp
public class Adult : Person
{
   private static int minimumAge;

   public Adult(string lastName, string firstName) : base(lastName, firstName)
   { }

   static Adult()
   {
      minimumAge = 18;
   }

   // Remaining implementation of Adult class.
}
```

Static constructors have the following properties:

- A static constructor does not take access modifiers or have parameters.
- A static constructor is called automatically to initialize the class before the first instance is created or any static members are referenced.
- A static constructor cannot be called directly.

## Base class, Inheritance

If a base class has a parameterized constructor, its derived class must pass values to initialize its base class’s constructor. A constructor can use the `base` keyword to call the constructor of a base class.

### Example 1

In this example, the constructor for the base class is called before the block for the constructor is executed. The base keyword can be used with or without parameters. Any parameters to the constructor can be used as parameters to base, or as part of an expression.

```csharp
public class Manager : Employee
{
    public Manager(int annualSalary) : base(annualSalary)
    {
        //Add further instructions here.
    }
}
```

In C#, calling the base constructor is a bit more explicit (or rather explicitly separate)

While in Java it would look like just any statement that could be reordered with the other statements in the body, it's moved outside the normal constructor body in C#.

### Example 2

In this example, both the base class, Person, and the derived class, Employee, have a method named Getinfo. By using the base keyword, it is possible to call the Getinfo method on the base class, from within the derived class.

```csharp
public class Person
{
    protected string ssn = "444-55-6666";
    protected string name = "John L. Malgraine";

    public virtual void GetInfo()
    {
        Console.WriteLine("Name: {0}", name);
        Console.WriteLine("SSN: {0}", ssn);
    }
}
class Employee : Person
{
    public string id = "ABC567EFG";
    public override void GetInfo()
    {
        // Calling the base class GetInfo method:
        base.GetInfo();
        Console.WriteLine("Employee ID: {0}", id);
    }
}

class TestClass
{
    static void Main()
    {
        Employee E = new Employee();
        E.GetInfo();
    }
}
/*
Output
Name: John L. Malgraine
SSN: 444-55-6666
Employee ID: ABC567EFG
*/
```

In a derived class, if a base-class constructor is not called explicitly by using the base keyword, the default constructor, if there is one, is called implicitly.
