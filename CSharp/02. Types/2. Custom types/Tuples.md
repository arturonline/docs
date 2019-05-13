# Tuples

## unnamed

```csharp
var unnamed = ("one", "two");
```

## named

```csharp
var named = (first: "one", second: "two");
```

## Initializers

```csharp
var sum = 12.5;
var count = 5;
var accumulation = (count, sum);
```

```csharp
// initialization of only 1 field
var stringContent = "The answer to everything";
var mixedTuple = (42, stringContent);
```

## Field names

```csharp
var one = 1;
var five = 5;

var projections = (one, five);

// Accessing the first field:
Console.WriteLine(projections.one);
// Accessing the second field:
Console.WriteLine(projections.five);
```

```csharp
// xCoords is unnamed
var xCoords = (3, 4);

// To Access the first field:
Console.WriteLine(xCoords.Item1);
// To Access the second field:
Console.WriteLine(xCoords.Item2);
```

## Tuples as method return values

```csharp
private static (double, double, int) ComputeSumAndSumOfSquares(IEnumerable<double> sequence)
{
    double sum = 0;
    double sumOfSquares = 0;
    int count = 0;

    foreach (var item in sequence)
    {
        count++;
        sum += item;
        sumOfSquares += item * item;
    }

    return (sum, sumOfSquares, count);
}
```

## Deconstruction

Individual members of a ValueTuple can be retrieved by deconstructing it. A deconstructing declaration syntax splits a ValueTuple into its parts and assigns those parts individually to fresh variables.

There are three ways to deconstruct a tuple:

1. You can explicitly declare the type of each field inside parentheses. The following example uses this approach to deconstruct the 3-tuple returned by the QueryCityData method.

    ```csharp
    public static void Main()
    {
        private static (string, int, double) QueryCityData(string name)
        {
            if (name == "New York City")
                return (name, 8175133, 468.48);

            return ("", 0, 0);
        }

        (string city, int population, double area) = QueryCityData("New York City");
        // Do something with the data.
    }
    ```

2. You can use the var keyword so that C# infers the type of each variable. You place the var keyword outside of the parentheses.

    ```csharp
    public static void Main()
    {
        var (city, population, area) = QueryCityData("New York City");

        // Do something with the data.
    }
    ```

3. Lastly, you may deconstruct the tuple into variables that have already been declared.

    ```csharp
    public static void Main()
    {
        string city = "Raleigh";
        int population = 458880;
        double area = 144.8;

        (city, population, area) = QueryCityData("New York City");

        // Do something with the data.
    }
    ```

### Deconstructing tuple elements with discards

Often when deconstructing a tuple, you're interested in the values of only some elements. You can take advantage of C#'s support for discards, which are write-only variables whose values you've chosen to ignore.

In the next example, we're only interested in the two population values stored in the tuple, and can handle its remaining values as discards:

```csharp
using System;
using System.Collections.Generic;

public class Example
{
   public static void Main()
   {
       var (_, _, _, pop1, _, pop2) = QueryCityDataForYears("New York City", 1960, 2010);

       Console.WriteLine($"Population change, 1960 to 2010: {pop2 - pop1:N0}");
   }

   private static (string, double, int, int, int, int) QueryCityDataForYears(string name, int year1, int year2)
   {
      int population1 = 0, population2 = 0;
      double area = 0;

      if (name == "New York City") {
         area = 468.48;
         if (year1 == 1960) {
            population1 = 7781984;
         }
         if (year2 == 2010) {
            population2 = 8175133;
         }
      return (name, area, year1, population1, year2, population2);
      }

      return ("", 0, 0, 0, 0, 0);
   }
}
// The example displays the following output:
//      Population change, 1960 to 2010: 393,149
```