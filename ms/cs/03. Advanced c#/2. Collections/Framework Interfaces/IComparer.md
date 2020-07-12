# `IComparer` & `IComparer<T>`

`IComparer` and `IComparer<T>` are interfaces used to implement in a separate class that helps to sort the objects according to its field or property values.

## IComparer

IComparer is an interface defined in `System.Collections.Generic` namespace. It helps to compares two objects.

```csharp
public interface IComparer
{
    // Compares two objects and returns a value indicating whether one is
    // less than, equal to, or greater than the other.
    int Compare(object x, object y);
}
```

Example:

```csharp
using System;
using System.Collections;

class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
}

class sortAge : IComparer
{
    public int Compare(object x, object y)
    {
        Person first = (Person)x;
        Person second = (Person)y;
        return first.Age.CompareTo(second.Age);
    }
}

class SortName : IComparer
{
    public int Compare(object x, object y)
    {
        Person first = (Person)x;
        Person second = (Person)y;
        return first.Name.CompareTo(second.Name);
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

        //sort list according to age
        people.Sort(new sortAge());
        foreach(Person person in people)
        {
            Console.WriteLine(person.Age + " " + person.Name);
        }

        Console.WriteLine();

        //sort list according to name
        people.Sort(new SortName());
        foreach (Person person in people)
        {
            Console.WriteLine(person.Name + " " + person.Age);
        }
    }
}
// Output:
// 12 Hogi
// 21 Sundus
// 22 Ali
```

## `IComparer<T>`

```csharp
public interface IComparer<in T>
{
    // Compares two objects and returns a value indicating
    // whether one is less than, equal to, or greater than the other.
    int Compare(T x, T y);
}
```

Example:

```csharp
using System;
using System.Collections.Generic;

class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
}

class sortAge : IComparer<Person>
    {
    public int Compare(Person x, Person y)
    {
        return x.Age.CompareTo(y.Age);
    }
}

class SortName : IComparer<Person>
{
    public int Compare(Person x, Person y)
    {
        return x.Name.CompareTo(y.Name);
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

        //sort list according to age
        people.Sort(new sortAge());
        foreach(var person in people)
        {
            Console.WriteLine(person.Age + " " + person.Name);
        }
        Console.WriteLine();

        //sort list according to name
        people.Sort(new SortName());
        foreach (var person in people)
        {
            Console.WriteLine(person.Name + " " + person.Age);
        }
    }
}
// Output:
// 12 Hogi
// 21 Sundus
// 22 Ali
// Ali 22
// Hogi 12
// Sundus 21
```
