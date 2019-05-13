# ICollection & ICollection`<T>`

## ICollection

`ICollection` is an interface defined in `System.Collections` to extend the definition of a custom non-generic collection. It defines size, enumerators, and synchronization methods for all nongeneric collections.

```csharp
public interface ICollection : IEnumerable
{
    // Gets the number of elements contained in the ICollection.
    int Count { get; }

    // Gets a value indicating whether access to the ICollection
    // is synchronized (thread safe).
    bool IsSynchronized { get; }

    //Gets an object that can be used to synchronize access to the ICollection.
    object SyncRoot { get; }

    // Copies the elements of the ICollection to an Array,
    // starting at a particular System.Array index.
    void CopyTo(Array array, int index);
}
```

ICollection inherits from IEnumerable. Therefore, all members of the IEnumerable interface must be implemented in all classes that implement the ICollection interface.

## `ICollection<T>`

`ICollection<T>` is a type-safe interface defined in `System.Collections.Generic`. It extends the functionality of generic collections.

```csharp
public interface ICollection<T> : IEnumerable<T>, IEnumerable
{
    // Gets the number of elements contained in the `Generic.ICollection`.
    int Count { get; }

    // Gets a value indicating whether the `Generic.ICollection`
    // is read-only.
    bool IsReadOnly { get; }

    // Adds an item to the `System.Collections.Generic.ICollection`.
    void Add(T item);

    // Removes all items from the `Generic.ICollection`.
    void Clear();

    // Determines whether the `System.Collections.Generic.ICollection`
    // contains a specific value.
    bool Contains(T item);

    // Copies the elements of the `Generic.ICollection` to an Array,
    // starting at a particular System.Array index.
    void CopyTo(T[] array, int arrayIndex);

    // Removes the first occurrence of an object from the `Generic.ICollection`.
    bool Remove(T item);
}
```

It doesn’t look exactly like a non-generic ICollection. The new definition of `ICollection<T>` has some more methods like `Add`, `Remove`, and `Clear`.