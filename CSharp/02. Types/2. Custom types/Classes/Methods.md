# Methods

```csharp
int Sum (int a, int b)
{
    int add = a + b;
    return add;
}

// ...

Sum (b: 5, a: 10);
```

## Optional argument

```csharp
int Sum(int a, int b = 1)
{
int add = a + b;
return add;
}
```

## Pass by reference with "ref"

The ref keyword indicates a value that is passed by reference, not by value. The effect of passing by reference is that any change to the argument in the called method is reflected in the calling method.

An argument that is passed to a ref or in parameter must be initialized before it is passed. This differs from out parameters, whose arguments do not have to be explicitly initialized before they are passed.

```csharp
// Pass by reference
class Program
{
    static void PassByRef(ref int i)
    {
        i = i + 1;
    }

    static void Main(string[] args)
    {
        int j = 0;
        PassByRef(ref j);
        Console.WriteLine(j); //j = 1
    }
}
```

## Pass by reference with "out"

The out keyword causes arguments to be passed by reference. It is like the ref keyword, except that ref requires that the variable be initialized before it is passed. It is also like the in keyword, except that in does not allow the called method to modify the argument value. To use an out parameter, both the method definition and the calling method must explicitly use the out keyword.

Variables passed as out arguments do not have to be initialized before being passed in a method call. However, the called method is required to assign a value before the method returns.

```csharp
class Program
{
    static void outMethod(out int i)
    {
        i = 1;
    }

    static void Main(string[] args)
    {
        int j;
        outMethod(out j);
        Console.WriteLine(j); // j = 1
    }
}
```

## Unlimited arguments

```csharp
int Sum(params int[] args)
{
    int add = 0;

    foreach (int item in args)
    {
        add = add + item;
    }

    return add;
}

//...

Sum (1, 2, 3, 4, 5); // returns 15
```