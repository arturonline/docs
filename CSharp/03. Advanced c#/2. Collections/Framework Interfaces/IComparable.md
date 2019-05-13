# `IComparable` & `IComparable<T>`

`IComparable` and `IComparable<T>` are interfaces used to define a comparison method for a type to order or sort its instances. The `CompareTo` method returns an `Int32` that has one of three values which have following meaning:

* Return zero, current instance will occur in the same position.
* Less than zero, current instance precedes the object specified by the `CompareTo` method in the sort order.
* Greater than zero, current instance follows the object specified by the `CompareTo` in the sort order.

## `IComparable`

IComparable takes an object as its parameter and returns a result as an `int32`.

```csharp
public interface IComparable
{
// Compares the current instance with another object of the same
// type and returns
// an integer that indicates whether the current instance precedes,
// follows, or
// occurs in the same position in the sort order as the other object.
int CompareTo(object obj);
}
```

Example:

```csharp
using System;
using System.Collections;

class Person : IComparable
{
    public string Name { get; set; }
    public int Age { get; set; }

    public int CompareTo(object obj)
    {
        Person next = (Person)obj;
        return this.Age.CompareTo(next.Age);
    }
}

class Program
{
    static void Main(string[] args)
    {
        ArrayList people = new ArrayList();

        people.Add(new Person { Name = "Sundus", Age = 21 });
        people.Add(new Person { Name = "Ali", Age = 22 });
        people.Add(new Person { Name = "Hogi", Age = 12 });

        //sort list of persons
        people.Sort();
        foreach(Person person in people)
        {
            Console.WriteLine(person.Age + " " + person.Name);
        }
    }
}
//Output:
// 12 Hogi
// 21 Sundus
// 22 Ali
```

## `IComparable<T>`

`IComparable<T>` is type-safe interface defined in System namespace. It takes a type-safe parameter and returns a result as an `int32`. Its implementation is the same as IComparable.

```csharp
public interface IComparable<in T>
{
    // Compares the current instance with another object of the same type
    // and returns an integer that indicates whether the current instance
    // precedes, follows, or occurs in the same position in the sort
    // order as the other object.
    int CompareTo(T other);
}
```

Example:

```csharp
using System;
using System.Collections.Generic;

class Person : IComparable<Person>
{
    public string Name { get; set; }
    public int Age { get; set; }

    public int CompareTo(Person other)
    {
        return this.Age.CompareTo(other.Age);
    }
}

class Program
{
    static void Main(string[] args)
    {
        List<Person> people = new List<Person>();

        people.Add(new Person { Name = "Sundus", Age = 21 });
        people.Add(new Person { Name = "Ali", Age = 22 });
        people.Add(new Person { Name = "Hogi", Age = 12 });

        //sort list of persons
        people.Sort();
        foreach(var person in people)
        {
        Console.WriteLine(person.Age + " " + person.Name);
        }
    }
}
//Output:
// 12 Hogi
// 21 Sundus
// 22 Ali
```
