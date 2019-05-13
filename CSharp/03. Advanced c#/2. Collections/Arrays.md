# Arrays

- Array is a **fix size** collection or series of elements of the same type.
- Each element stores data which can be accessed by calling its index number with an array name.
- Arrays are zero indexed: an array with n elements is indexed from `0` to `n-1`.
- Array types are **reference types** derived from the abstract base type `Array`.
- Since this type implements `IEnumerable` and `IEnumerable<T>`, you can use foreach iteration on all arrays in C#.

An array can have three types:

1. Single Dimension Array
2. Multi Dimension Array
3. Jagged Array

## Single Dimensional Array

```csharp
string[] friends;

// Initializations
string[] friends = new string[4];
friends[0] = "Ali";
friends[1] = "Mubashar";

string[] friends = { "Ali", "Mubashar" };

string[] friends = new string[4] {"Ali", "Mubashar", "Lakhtey", "Hamza"};
```

## Multidimensional Array

2D array can be thought of as a table, which has rows and columns.

```csharp
// Declare 2D array of int, having 2 rows and 5 columns
int[,] numbers = new int[2,5];

// Initialize 2D Array with Values
int[,] numbers = new int[2, 5]
{
    {2,4,6,8,10},
    {1,3,5,7,9}
};

// Access
int[,] numbers = new int[2, 5]
{
    {2,4,6,8,10},
    {1,3,5,7,9}
};

for (int row = 0; row < numbers.GetLength(0); row++)
{
    for (int col = 0; col < numbers.GetLength(1); col++)
    {
        Console.Write(numbers[row, col]);
    }
    Console.WriteLine();
}

//Output
246810
13579
```

## Jagged Array

It’s an array of an array, which means it’s a kind of array whose elements are also an array. Each element of a jagged array may have a different size.

```csharp
// Declare a jagged array having 4 rows
int[][] jagged = new int[4][];
jagged[0] = new int[2];
jagged[1] = new int[3];
jagged[2] = new int[4];
jagged[3] = new int[5];

// Initialize value on the jagged array index
jagged[0][0] = 4;
jagged[0][1] = 5;

// Or
jagged[0] = new int[] { 4, 5 };
jagged[1] = new int[] { 6, 7, 8 };

int[][] jagged =
    {
    new int[]{4,5},
    new int[]{6,7,8},
    new int[]{9,10,11},
    new int[]{12,13,14,15}
    };

// Access
Console.WriteLine(jagged[0][0]);
Console.WriteLine(jagged[0][1]);

// Loop
for (int i = 0; i < jagged.Length; i++)
{
    for (int j = 0; j < jagged[i].Length; j++)
    {
        Console.Write(jagged[i][j]);
    }
    Console.WriteLine();
}

```