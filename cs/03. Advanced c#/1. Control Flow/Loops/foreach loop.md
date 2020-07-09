# The foreach loop

```csharp
int[] values = { 1, 2, 3, 4, 5, 6 };

foreach (int i in values)
{
  Console.Write(i);
}
// Displays 123456
```

```csharp
class Person
{
  public string FirstName { get; set; }
  public string LastName { get; set; }
}

void CannotChangeForeachIterationVariable()
{
  var people = new List<Person>
  {
    new Person() { FirstName = “John”, LastName = “Doe”},
    new Person() { FirstName = “Jane”, LastName = “Doe”},
  };

  foreach (Person p in people)
  {
    p.LastName = “Changed”; // This is allowed
    // p = new Person(); // This gives a compile error
  }
}

// The loop variable cannot be modifed. You can make modifcations to the object that the variable points to, but you can’t assign a new value to it.
```