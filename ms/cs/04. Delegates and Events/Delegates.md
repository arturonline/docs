# Delegates

A delegate type represents references to methods with a particular parameter list and return type. Delegates make it possible to treat methods as variables and passed as parameters. A single delegate object can hold the reference of multiple methods that can be called on a single event.

We can declare a delegate anywhere with whatever access level required. And to use a delegate you have to have an instance of the delegate class.

## Create a delegate

### Declaration

```csharp
delegate int AdditionDelegate(int a, int b);
```

This delegate can hold reference to function which takes two integers and returns their sum. Any method from any accessible class or struct that matches the delegate type and signature can be assigned to the delegate.

### Anonymous Functions

```csharp
Func<int,int,int> demoDelegate = AddTwoNumbers;
```

`AddTwoNumbers` is a trivial function that just adds two numbers and returns the value. Do we really need a function to provide such a simple operation? It is small and is getting used here only. No need to keep it around. Enter anonymous functions:

```csharp
Func<int,int,int> demoDelegate = delegate(int x, int y) {return x + y;}
```

### Lambdas

Instead of anonymous functions we can use lambda:

```csharp
Func<int,int,int> demoDelegate = (x, y) => x + y;
```

If it takes no parameters then the lambda is like:

```csharp
() => 3
```

This one does not take a parameter and returns 3.
If it takes only single parameter then:

```csharp
x => x + 100;
```

This one increments the value of the passed variable by 100 and returns the result.

And if it takes two parameters then:

```csharp
(x, y) =>
{
    //something
    return x + y;
}
```

### Construction

To instantiate the delegate object you provide the method the delegate will wrap or an anonymous Method.

delegate declaration:

```csharp

delegate int AdditionDelegate(int a, int b);
```

Suppose you have a method:

```csharp
int AddTwoNumbers(int a,int b)
{
    return a+b;
}
```

Then we create and instantiate the delegate like this:

```csharp
AdditionDelegate demoDelegate = new AdditionDelegate(AddTwoNumbers);
```

.NET however allows a shorthand.

```csharp
AdditionDelegate demoDelegate = AddTwoNumbers
```

The c# compiler examine the parameters taken and the return type of the function `AddTwoNumbers`. Then it can decide that an instance of delegate need to be created and initialised.

And you can then invoke the function using delegate:

```csharp
var result = demoDelegate(5,5);
```

## Multicasting

A delegate can hold more than one method reference. This is referred to as multicasting. To add an extra method to the delegate's list of methods —the invocation list— simply use the assignment operators (`-=` or `+=`).

Example1:

```csharp
// declare a delegate
public delegate void Del();

// declare method with the same signature as the delegate
public void MethodOne()
{
    Console.WriteLine("MethodOne");
}

public void MethodTwo()
{
    Console.WriteLine("MethodTwo");
}

// Multicast delegate
public void Multicast()
{
    Del d = MethodOne;
    d += MethodTwo;

    // calling delegate
    d();
}
// Displays
// MethodOne
// MethodTwo
```

Example2:

```csharp
MethodClass obj = new MethodClass();
Del d1 = obj.Method1;
Del d2 = obj.Method2;
Del d3 = DelegateMethod;

//Both types of assignment are valid.
Del allMethodsDelegate = d1 + d2;
allMethodsDelegate += d3;
```

At this point `allMethodsDelegate` contains three methods in its invocation list: `Method1`, `Method2`, and `DelegateMethod`. The original three delegates, d1, d2, and d3, remain unchanged. When `allMethodsDelegate` is invoked, all three methods are called in order.

To remove a method from the invocation list, use the decrement or decrement assignment operator ('-' or '-='). For example:

```csharp
//remove Method1
allMethodsDelegate -= d1;

// copy AllMethodsDelegate while removing d2
Del oneMethodDelegate = allMethodsDelegate - d2;
```

To find out how many methods a multicast delegate is going to call, you can
use the following code:

```csharp
int invocationCount = del.GetInvocationList().GetLength(0);
```

## Differences between delegate and event

An Event declaration adds a layer of abstraction and protection on the delegate instance. This protection prevents clients of the delegate from resetting the delegate and its invocation list and only allows adding or removing targets from the invocation list.

1. Event encapsulates a delegate; it avoids overwriting of a method reference by restricting the use of assignment `=` operator.
2. Unlike delegate, event cannot be invoked outside the class is created, which makes sure event will only invoke when a certain codition satisfies.



## Variance in Delegates

With variance in delegates, the method doesn’t need to match the delegate type.

## Convariance

Covariance is applied on a method’s return type. With covariance, a delegate can hold a reference of a method, whose return value is a derived type of the return type in the delegate signature.

Example:

```csharp
using System;

class Parent { }

class Child : Parent { }

delegate Parent CovarianceHandle();

class Program
{
    static Child CovarianceMethod()
    {
        Console.WriteLine("Covariance Method");
        return new Child();
    }
    static void Main(string[] args)
    {
        //Covariance
        CovarianceHandle del = CovarianceMethod;
        del();
    }
}
// Output:
// Covariance Method
```

## Contravariance

Contravariance is applied on a method’s parameter type. With contravariance, a delegate can hold a reference of a method whose parameter value is a base type of the delegate signature parameter type.

```csharp

using System;

class Parent { }

class Child : Parent { }

delegate void ContravarianceHandle(Child c);

class Program
{
    static void ContravarianceMethod(Parent p)
    {
        Child ch = p as Child;
        Console.WriteLine("Contravariance Method");
    }

    static void Main(string[] args)
    {
        ContravarianceHandle del = ContravarianceMethod;
        Child child = new Child();

        //Contravariance
        del(child);
    }
}
// Output:
// Contravariance Method
```