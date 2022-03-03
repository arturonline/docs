# switch

The switch statement is often used as an alternative to an if-else construct if a single expression is tested against three or more conditions.

```csharp
using System;

public class Example
{
   public static void Main()
   {
      int caseSwitch = 1;

      switch (caseSwitch)
      {
          case 1:
              Console.WriteLine("Case 1");
              break;
          case 2:
              Console.WriteLine("Case 2");
              break;
          default:
              Console.WriteLine("Default case");
              break;
      }
   }
}
// The example displays the following output:
//       Case 1
```

## The match expression

In C# 6, the match expression must be an expression that returns a value of the following types:

* a char.
* a string.
* a bool.
* an integral value, such as an int or a long.
* an enum value.
* Starting with C# 7.0, the match expression can be any non-null expression.

Control is transferred to the switch section that contains the first matching case label.

## The switch section

* No two case labels may contain the same expression.
* Only one switch section in a switch statement executes. C# does not allow execution to continue from one switch section to the next. This requirement is usually met by explicitly exiting the switch section by using a break, goto, or return statement.

## The default case

The default case specifies the switch section to execute if the match expression does not match any other case label. If a default case is not present and the match expression does not match any other case label, program flow falls through the switch statement.

The default case can appear in any order in the switch statement. Regardless of its order in the source code, it is always evaluated last, after all case labels have been evaluated.

## The when clause
