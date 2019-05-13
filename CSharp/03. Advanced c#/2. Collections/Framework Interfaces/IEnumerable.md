# `IEnumerable` & `IEnumerable<T>`

## IEnumerable

IEnumerable is the base interface for collections in `System.Collections` namespace. It helps us to create a customized nongeneric collection. Collections that implement `IEnumerable` can be enumerated by using the `foreach` statement.

IEnumerable contains a single method that you must implement when implementing this interface; `GetEnumerator`, which returns an `IEnumerator` object. The returned `IEnumerator` provides the ability to iterate through the collection by exposing a Current property.

```csharp
public interface IEnumerable
{
    IEnumerator GetEnumerator();
}
```

## How to implement IEnumerable

```csharp
// First you implement IEnumerable interface
public class People : IEnumerable
{
    IEnumerator IEnumerable.GetEnumerator()
    {
        // return a PeopleEnumerator
    }
}
// The GetEnumerator() method returns a reference to yet another interface named System.Collections.IEnumerator to implement:

public class PeopleEnumerator : IEnumerator
{
    public void Reset()...

    public bool MoveNext()...

    public object Current...
}
```

Example:

```csharp
// Define custom ArrayList

using System;
using System.Collections;

class myArrayList : IEnumerable
{
    object[] array = new object[4];
    int index = -1;

    public void Add(object o)
    {
        if(++index < array.Length)
        {
            array[index] = o;
        }
    }

    public IEnumerator GetEnumerator()
    {
        for(int i = 0; i < array.Length; i++)
        {
            yield return array[i];
        }
    }
}

class Program
{
    static void Main(string[] args)
    {
        myArrayList list = new myArrayList();

        //stores object data in myArraylist
        list.Add("Ali");
        list.Add(22);
        list.Add("Sundus");
        list.Add(21);

        foreach (var item in list)
        {
            Console.WriteLine(item);
        }
    }
}
//Output:
// Ali
// 22
// Sundus
// 21
```

## `IEnumerable<T>`

`IEnumerable<T>` is a type-safe interface defined in `System.Collections.Generic` namespace. It is used to create a custom type-safe collection.

```csharp
public interface IEnumerable<out T> : IEnumerable
{
    IEnumerator<T> GetEnumerator();
}
```

Example:

```csharp
using System;
using System.Collections;
using System.Collections.Generic;

class myList<T> : IEnumerable<T>
{
    List<T> list = new List<T>();

    //Get length of list<T>
    public int Length
    {
        get { return list.Count; }
    }

    public void Add (T data)
    {
        list.Add(data);
    }

    public IEnumerator<T> GetEnumerator()
    {
        foreach (var item in list)
        {
            yield return item;
        }
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
        //return IEnumerator<T> GetEnumerator()
        return this.GetEnumerator();
    }
}

class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
}

class Program
{
    static void Main(string[] args)
    {
        myList<Person> people = new myList<Person>();

        people.Add(new Person { Name = "Ali", Age = 22 });
        people.Add(new Person { Name = "Sundus", Age = 21 });
        people.Add(new Person { Name = "Hogi", Age = 12 });
        Console.WriteLine("Total person: {0} \n", people.Length);

        foreach (Person person in people)
        {
            Console.WriteLine("Name:{0} Age:{1}", person.Name, person.Age);
        }
    }
}
//Output:
// Total Person: 3
// Name:Ali Age:22
// Name:Sundus Age:21
// Name: Hogi Age:12
```