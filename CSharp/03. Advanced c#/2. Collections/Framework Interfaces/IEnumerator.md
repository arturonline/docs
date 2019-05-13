# IEnumerator

`IEnumerator` interface has methods and properties that a collection must implement to define its iteration.

```csharp
public interface IEnumerator
{
    //Gets value of current index of collection
    object Current { get; }

    //Move to the next index of the collection
    bool MoveNext();

    //Move to the initial position of index = -1
    void Reset();
}
```

Example:

```csharp
using System;
using System.Collections;
using System.Collections.Generic;

class People : IEnumerable
{
    Person[] people;
    int index = -1;

    public void Add(Person per)
    {
        if (++index < people.Length)
        {
            people[index] = per;
        }
    }

    public People(int size)
    {
        people = new Person[size];
    }

    public IEnumerator GetEnumerator()
    {
        return new PersonEnum(people);
    }
}

//Implement IEnumerator
class PersonEnum : IEnumerator
{
    Person[] _people;
    int index = -1;

    public PersonEnum(Person[] people)
    {
        _people = people;
    }

    //Check whether foreach can move to next iteration or not
    public bool MoveNext()
    {
        return (++index < _people.Length);
    }

    //Reset the iteration
    public void Reset()
    {
        index = -1;
    }

    //Get current value
    public object Current
    {
        get
        {
            return _people[index];
        }
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
        People people = new People(3);

        people.Add(new Person { Name = "Ali", Age = 22 });
        people.Add(new Person { Name = "Sundus", Age = 21 });
        people.Add(new Person { Name = "Hogi", Age = 12 });
        foreach (var item in people)
        {
            //Cast from object to Person
            Person person = (Person)item;
            Console.WriteLine("Name:{0} Age:{1}", person.Name, person.Age);
        }
    }
}

//Output:
// Name:Ali Age:22
// Name:Sundus Age:21
// Name: Hogi Age:12
```

## `IEnumerator<T>`

`IEnumerator<T>` inherits `IDisposable` and `IEnumerator` interfaces. Therefore, a type
which implements `IEnumerator <T>` must implement these interfaces too

```csharp
public interface IEnumerator<out T> : IDisposable, IEnumerator
{
    //element in the collection at the current position of the enumerator.
    T Current { get; }
}
```

Example:

```csharp
using System;
using System.Collections;
using System.Collections.Generic;

class myList<T> : IEnumerable<T>
{
    T[] list;
    int index = -1;

    public void Add(T obj)
    {
        if (++index < list.Length)
        {
            list[index] = obj;
        }
    }

    public IEnumerator<T> GetEnumerator()
    {
        return new TEnum<T>(list);
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
        return this.GetEnumerator();
    }

    public myList(int size)
    {
        list = new T[size];
    }
}

//Implement IEnumerator
class TEnum<T> : IEnumerator<T>
{
    T[] _list;
    int index = -1;

    public TEnum(T[] objs)
    {
        _list = objs;
    }

    //Return if foreach can iterate to next index or not
    public bool MoveNext()
    {
        return (++index < _list.Length);
    }

    public void Reset()
    {
        index = -1;
    }

    //Get type-safe value of current array's index
    //Its the Implementation of IEnumerator<T>
    public T Current
    {
        get
        {
            return _list[index];
        }
    }
//It's the implementation of 'IEnumerator'
    object IEnumerator.Current
    {
        get
        {
            //return T Current
            return this.Current;
        }
    }

    //It's the implementation of IDispose interface
    public void Dispose()
    {
    //Write code to dispose un-needed resource
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
        myList<Person> people = new myList<Person>(3);

        people.Add(new Person { Name = "Ali", Age = 22 });
        people.Add(new Person { Name = "Sundus", Age = 21 });
        people.Add(new Person { Name = "Hogi", Age = 12 });

        foreach (var item in people)
        {
            //No need to cast
            Console.WriteLine("Name:{0} Age:{1}", item.Name, item.Age);
        }
    }
}
//Output:
// Name:Ali Age:22
// Name:Sundus Age:21
// Name: Hogi Age:12
```
