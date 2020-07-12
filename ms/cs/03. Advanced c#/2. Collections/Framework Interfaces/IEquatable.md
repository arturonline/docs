# `IEquatable<T>`

`IEquatable<T>` is an interface implemented by types whose values can be equated (for example, the numeric and string classes). But for most reference types using IEquatable is avoided because, if you do, you need to override `Object.Equals(Object)` and `GetHashCode` methods. Therefore, their behavior is consistent with the `IEquatable.Equals` method.

Definition:

```csharp
public interface IEquatable<T>
{
    // Indicates whether the current object is equal to
    // another object of the same type.
    bool Equals(T other);
}
```

Example:

```csharp
using System;

class Person : IEquatable<Person>
{
    public string Name { get; set; }
    public int Age { get; set; }

    public bool Equals(Person other)
    {
            if(this.Name.CompareTo(other.Name) == 0 && this.Age == other.Age)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    public override bool Equals(object obj)
    {
        Person other = (Person)obj;
        return this.Equals(other);
    }

    public override int GetHashCode()
    {
        //custom implementation of hashcode
        string hash = this.Name + this.Age;
        return hash.GetHashCode();
    }

    public static bool operator ==(Person person1, Person person2)
    {
        if (((object)person1) == null || ((object)person2) == null)
            return Object.Equals(person1, person2);
        return person1.Equals(person2);
    }

    public static bool operator !=(Person person1, Person person2)
    {
        if (((object)person1) == null || ((object)person2) == null)
            return !Object.Equals(person1, person2);
        return !(person1.Equals(person2));
    }

}

class Program
{
    static void Main(string[] args)
    {
        Person person1 = new Person();
        person1.Age = 22;
        person1.Name = "Ali";

        Person person2 = new Person();
        person2.Age = 22;
        person2.Name = "Ali";

        Console.WriteLine(person1 == person2);
    }
}
// Output:
// True
```
