# The if statement

## IF statement

```csharp
// multiple if/else statements
bool b = false;
bool c = true;

if (b)
{
  Console.WriteLine(“b is true”);
}
else if (c)
{
  Console.WriteLine(“c is true”);
}
else
{
  Console.WriteLine(“b and c are false”);
}
```

```csharp
// nested if statements
if (x)
{
  if (y)
  {
    F();
  }
  else
  {
    G();
  }
}
```