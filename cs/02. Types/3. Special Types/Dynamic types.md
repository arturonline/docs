# Dynamic Types

Dynamic type is used to store and manipulate any data whose types definition and operation errors are determined at runtime. It ignores compile-time checks. Therefore, it is easy to access COM and DOM APIs.

Syntax:

```csharp
dynamic price = 20;
Console.WriteLine(price.GetType());

dynamic name = "Ali";
Console.WriteLine(name.GetType());

//Output
System.Int32
System.String
```

Unlike implicit type (var keyword), dynamic type can store values of different types with the same dynamic variable. Therefore, a dynamic variable can change its type at runtime:

```csharp
dynamic i = "Ali";
Console.WriteLine(i.GetType());

i = 22;
Console.WriteLine(i.GetType());

//Output
System.String
System.Int32
```