# Yield keyword

When you use the yield keyword in a statement, you indicate that the method, operator, or get accessor in which it appears is an iterator. Using yield to define an iterator removes the need for an explicit extra class (the class that holds the state for an enumeration) when you implement the IEnumerable and IEnumerator pattern for a custom collection type.

The yield keyword is used to define a function which returns an IEnumerable or IEnumerator (as well as their derived generic variants) whose values are generated lazily as a caller iterates over the returned collection. Read more about the purpose in the remarks section.
The following example has a yield return statement that's inside a for loop.

```csharp
public static IEnumerable<int> Count(int start, int count)
{
    for (int i = 0; i <= count; i++)
    {
        yield return start + i;
    }
}
foreach (int value in Count(start: 4, count: 10))
{
    Console.WriteLine(value);
}

// 4
// 5
// 6
// ...
// 14
```

Each iteration of the foreach statement body creates a call to the Count iterator function. Each call to the iterator function proceeds to the next execution of the `yield return` statement, which occurs during the next iteration of the for loop.

## Early Termination

You can extend the functionality of existing yield methods by passing in one or more values or elements that could define a terminating condition within the function by calling a yield break to stop the inner loop from executing.

```csharp
public static IEnumerable<int> CountUntilAny(int start, HashSet<int> earlyTerminationSet)
{
    int curr = start;
    while (true)
    {
        if (earlyTerminationSet.Contains(curr))
        {
            // we've hit one of the ending values
            yield break;
        }
        yield return curr;
        if (curr == Int32.MaxValue)
        {
            // don't overflow if we get all the way to the end; just stop
            yield break;
        }
curr++; }
}
```