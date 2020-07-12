# Post and Pre increment operators

The increment (++) and decrement (--) operators can be used as prefix and postfix. If used as prefix, the change in value of variable is seen on the same line and if used as postfix, the change in value of variable is seen on the next line. This will be clear by the example below.

```csharp
using System;

namespace Operator
{
  class UnaryOperator
  {
    public static void Main(string[] args)
    {
      int number = 10;

      Console.WriteLine((number++));
      Console.WriteLine((number));

      Console.WriteLine((++number));
      Console.WriteLine((number));
    }
  }
}
```

When we run the program, the output will be:

```csharp
10
11
12
12
```

We can see the effect of using ++ as prefix and postfix. When ++ is used after the operand, the value is first evaluated and then it is incremented by 1. Hence the statement

```csharp
Console.WriteLine((number++));
```

prints 10 instead of 11. After the value is printed, the value of number is incremented by 1.

The process is opposite when ++ is used as prefix. The value is incremented before printing. Hence the statement

```csharp
Console.WriteLine((++number));
```

prints 12.

The case is same for decrement operator (--).