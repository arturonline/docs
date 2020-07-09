# Common Built-in Delegates

C# provides many built-in delegates that are useful for common purposes. These built-in types provide a shorthand notation that virtually eliminates the need to declare delegate types.

Some common built-in delegates are:

* `Action`
* `Action<>`
* `Func<>`
* `Predicate<>`

## Action

`Action` is a built-in delegate type that can be used with methods that don’t return a value and have no parameter list.

Example:

```csharp
using System;
class MyClass
{
    static void voidMethod()
    {
        Console.WriteLine("Void Method");
    }

    static void emptyMethod()
    {
        Console.WriteLine("Empty Method");
    }

    static void Main(string[] args)
    {
        Action act = voidMethod;
        act += emptyMethod;
        act();
    }
}
// Void Method
// Empty Method
```

## Action<>

`Action<>` is a generic delegate. It can be used with methods that at least have one argument and don’t return a value. `Action<>` delegate comes with 16 generic overloads, which means it can take up to 16 arguments of void method.

Example:

```csharp
using System;

class MyClass
{
    static void myintMethod(int i)
    {
        Console.WriteLine("myintMethod: i = {0}", i);
    }

    static void myintStringMethod(int i, string s)
    {
        Console.WriteLine("myintStringMethod: i = {0} s = {1}", i, s);
    }

    static void Main(string[] args)
    {
        Action<int> myIntAct = myintMethod;
        Action<int, string> myIntStringAct = myintStringMethod;
        myIntAct(22);
        myIntStringAct(22, "Ali");
    }
}
// myintMethod: i = 22
// myintStringMethod: i = 22 s = Ali
```

## Func<>

`Func<>` is a generic delegate. It can be used with methods that return a value and may have a parameter list. The last parameter of `Func<>` determines the method’s return type and the remaining parameters are used for a method’s argument list. `Func<> delegate` comes with 17 generic overloads, which means it uses the last parameter as a method’s return type and the remaining 16 can be used as a method’s argument list. Also, if the `Func<>` has only one parameter, then its first parameter would be considered as a method’s return type.

Example:

```csharp
using System;

class MyClass
{
    static int Add(int x, int y)
    {
        Console.Write("{0} + {1} = ", x, y);
        return (x + y);
    }

    static int Min(int x, int y)
    {
        Console.Write("{0} - {1} = ", x, y);
        return (x - y);
    }

    static int Mul(int x, int y)
    {
        Console.Write("{0} * {1} = ", x, y);
        return (x * y);
    }

    static string Name()
    {
        Console.Write("My name is = ");
        return "Artur";
    }

    static string DynamicName(string name)
    {
        Console.Write("My name is = ");
        return name;
    }

    static void Main(string[] args)
    {
        //return string value
        Func<string> info = Name;
        Console.WriteLine(info());

        //return string, and take string as parameter
        Func<string, string> dynamicInfo = DynamicName;
        Console.WriteLine(dynamicInfo("Ana"));

        //return int, and take two int as parameter
        Func<int, int, int> calculate = Add;
        calculate += Min;
        calculate += Mul;

        foreach (Func<int, int, int> item in calculate.GetInvocationList())
        {
            Console.WriteLine(item(10,5));
        }
    }
}
// My name is = Artur
// My name is = Ana
// 10 + 5 = 15
// 10 - 5 = 10
// 10 * 5 = 50
```

## `Predicate<T>`

A `predicate delegate` represents a method that takes one input parameter and returns a bool value on the basis of some criteria.

Syntax

```csharp
public delegate bool Predicate<T>()
```

```csharp
// Use Predicate to determine if a number is even or not
using System;

class MyClass
{
    static bool Even (int i)
    {
        return (i % 2 == 0);
    }

    static void Main(string[] args)
    {
        Predicate<int> isEven = Even;
        Console.WriteLine(isEven(7));
    }
}
// False
```