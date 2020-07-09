# Extension Methods

Extension methods enable you to "add" methods to existing types without creating a new derived type. Extension methods are a special kind of static method, but they are called as if they were instance methods on the extended type.

## Define extension methods

Extension methods are defined as static methods inside a static class and are called by using instance method syntax:

* Extension methods are always defined inside static class.
* The first parameter of extension method must have “this” operator, which tells on whose instance this extension method should give access.
* The extension method should be defined in the same namespace in which it is used, or import the namespace in which the extension method was defined.

Example:

```csharp
using System.Linq;
using System.Text;
using System;

namespace CustomExtensions
{
    //Extension methods must be defined in a static class
    public static class StringExtension
    {
        // This is the extension method.
        // The first parameter takes the "this" modifier
        // and specifies the type for which the method is defined.
        public static int WordCount(this String str)
        {
            return str.Split(new char[] {' ', '.','?'}, StringSplitOptions.RemoveEmptyEntries).Length;
        }
    }
}

namespace Extension_Methods_Simple
{
    //Import the extension method namespace.
    using CustomExtensions;
    class Program
    {
        static void Main(string[] args)
        {
            string s = "The quick brown fox jumped over the lazy dog.";
            //  Call the method as if it were an 
            //  instance method on the type. Note that the first
            //  parameter is not specified by the calling code.
            int i = s.WordCount();
            System.Console.WriteLine("Word count of s is {0}", i);
        }
    }
}
```

## Name colision

You can use extension methods to extend a class or interface, but not to override them.

If a type has a method named Process(int i), and you have an extension method with the same signature, the compiler will always bind to the instance method.

## Example

```csharp
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace EnumExtension
{
    // Define an extension method in a non-nested static class.
    public static class Extensions
    {
        public static Grades minPassing = Grades.D;
        public static bool Passing(this Grades grade)
        {
            return grade >= minPassing;
        }
    }

    public enum Grades { F = 0, D=1, C=2, B=3, A=4 };
    class Program
    {
        static void Main(string[] args)
        {
            Grades g1 = Grades.D;
            Grades g2 = Grades.F;
            Console.WriteLine("First {0} a passing grade.", g1.Passing() ? "is" : "is not");
            Console.WriteLine("Second {0} a passing grade.", g2.Passing() ? "is" : "is not");

            Extensions.minPassing = Grades.C;
            Console.WriteLine("\r\nRaising the bar!\r\n");
            Console.WriteLine("First {0} a passing grade.", g1.Passing() ? "is" : "is not");
            Console.WriteLine("Second {0} a passing grade.", g2.Passing() ? "is" : "is not");
        }
    }
  }
/* Output:
    First is a passing grade.
    Second is not a passing grade.

    Raising the bar!

    First is not a passing grade.
    Second is not a passing grade.
 */
```