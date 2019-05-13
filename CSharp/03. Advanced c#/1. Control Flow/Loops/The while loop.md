# The while loops

## While loop

```csharp
int[] values = { 1, 2, 3, 4, 5, 6 };
{
  int index = 0;
  while (index < values.Length)
  {
    Console.Write(values[index]);
    index++;
  }
}
```

## do-while loop

```csharp
do
{
  Console.WriteLine(“Executed once!”);
}
while (false);
```