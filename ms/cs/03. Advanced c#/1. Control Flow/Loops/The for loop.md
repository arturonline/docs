# The for loop

```csharp
int[] values = { 1, 2, 3, 4, 5, 6 };

for (int index = 0; index < values.Length; index++)
{
  Console.Write(values[index]);
}
// Displays
// 123456
```

```csharp
int[] values = { 1, 2, 3, 4, 5, 6 };

for (int x = 0, y = values.Length - 1;
((x < values.Length) && (y >= 0));
x++, y--)
{
  Console.Write(values[x]);
  Console.Write(values[y]);
}
// Displays
// 162534435261
```

```csharp
int[] values = { 1, 2, 3, 4, 5, 6 };

for (int index = 0; index < values.Length; index += 2)
{
  Console.Write(values[index]);
}
// Displays
// 135
```

```csharp
int[] values = { 1, 2, 3, 4, 5, 6 };

for (int index = 0; index < values.Length; index++)
{
  if (values[index] == 4) break;
  Console.Write(values[index]);
}
// Displays
// 123
```

```csharp
int[] values = { 1, 2, 3, 4, 5, 6 };

for (int index = 0; index < values.Length; index++)
{
  if (values[index] == 4) continue;
  Console.Write(values[index]);
}
// Displays
// 12356
```