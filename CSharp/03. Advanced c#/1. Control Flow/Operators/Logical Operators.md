# Logical Operators

## Operators

| Operand 1 | Operand 2 | OR `(||)` | AND `(&&)` |
| --------- | --------- | --------- | ---------- |
| true      | true      | true      | true       |
| true      | false     | true      | false      |
| false     | true      | true      | false      |
| false     | false     | false     | false      |

## Example

```Csharp
using System;

namespace Operator
{
  class LogicalOperator
  {
    public static void Main(string[] args)
    {
      bool result;
      int firstNumber = 10, secondNumber = 20;

      // OR operator
      result = (firstNumber == secondNumber) || (firstNumber > 5);
      Console.WriteLine(result);

      // AND operator
      result = (firstNumber == secondNumber) && (firstNumber > 5);
      Console.WriteLine(result);
    }
  }
}
```

## Short-circuiting

Short-circuit is a tricky method for evaluating logical operators AND and OR. In this method, the whole expression can be evaluated to true or false without evaluating all sub expressions.

The operation x && y corresponds to the operation x & y, except that y is evaluated only if x is true
...
The operation x && y is evaluated as (bool)x ? (bool)y : false. In other words, x is first evaluated and converted to type bool. Then, if x is true, y is evaluated and converted to type bool, and this becomes the result of the operation. Otherwise, the result of the operation is false.