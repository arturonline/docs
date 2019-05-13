# Jump statements

A jump statement unconditionally transfers control to another location in your code.

## Goto

A goto statement is a jump statement which transfers its controls to a labeled statement. The goto statement requires the label to identify the place where control will go. A label is any valid identifier and must be followed by a colon. The label is placed before the statement where control is to be transferred.

```csharp
char character = 'e';
switch (character)
{
    case 'a':
    {
        Console.WriteLine("Character is a vowel.");
        break;
    }
    case 'e':
    {
        goto case 'a';
    }
    case 'i':
    {
        goto case 'a';
    }
    case 'o':
    {
        goto case 'a';
    }
    case 'u':
    {
        goto case 'a';
    }
    case 'y':
    {
        Console.WriteLine("Character is sometimes a vowel.");
        break;
    }
    default:
    {
        Console.WriteLine("Character is a consonant");
        break;
    }
}

// Output:
// Character is vowel
```

```csharp
int[] numbers = new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

for (int i = 0; i < 10; i++)
{
    if (numbers[i] == 8)
    {
        goto Control;
    }
}

Console.WriteLine("End of Loop");

Control:
Console.WriteLine("The number is 8");
// Output
// The number is 8
```

## Break

Break is a keyword that is also a jump statement, which terminates the program flow in loop or in switch statement (i.e., skips the current block and moves to outer block or code if any).

```csharp
int[] numbers = new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

for (int i = 0; i < 10; i++)
{
    if (numbers[i] == 3)
    {
        break;
    }
    Console.Write(numbers[i]);
}

Console.WriteLine("End of Loop");
```

## Continue

Continue statement is also a jump statement, which skips the current iteration and moves the control to the next iteration of loop.

```csharp
int[] numbers = new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

for (int i = 0; i < 10; i++)
{
    if (numbers[i] == 5)
    {
        continue;
    }
    Console.Write(numbers[i]);
}
Console.WriteLine("End of Loop");
```

## Return

Return is also a jump statement, which moves back the program control to calling method. It returns a value or nothing depending on the nature of method (i.e., return type of method).

```csharp
static int getAge()
{
    return 20;
}
static void Main(string[] args)
{
    Console.WriteLine("Welcome to Exam 70-483 Certification");
    int age = getAge();
    Console.WriteLine("Age is: " + age);
}
```