# `IList` & `IList<T>`

## IList

IList is an interface defined in `System.Collections`. IList implementations fall into three categories:

1. read-only, cannot be modified.
2. fixed-size, cannot grow or shrink, but its elements can be editable.
3. variable-size, allows addition, removal, and modification of elements.

IList represents a non-generic collection of objects that can be individually accessed by index.

```csharp
public interface IList : ICollection, IEnumerable
{
    // Gets or sets the element at the specified index.
    object this[int index] { get; set; }

    // Gets a value indicating whether the IList has a fixed size.
    bool IsFixedSize { get; }

    // Gets a value indicating whether the IList is read-only.
    bool IsReadOnly { get; }

    // Adds an item to the System.Collections.IList.
    int Add(object value);

    // Removes all items from the System.Collections.IList.
    void Clear();

    // Determines whether the IList contains a specific value.
    bool Contains(object value);

    // Determines the index of a specific item in the IList.
    int IndexOf(object value);

    // Inserts an item to the IList at the specified index.
    void Insert(int index, object value);

    // Removes the first occurrence of a specific object from the IList.
    void Remove(object value);

    // Removes the System.Collections.IList item at the specified index.
    void RemoveAt(int index);
}
```

`IList` inherits from `ICollection` and `IEnumerable`. Therefore, all members of the ICollection and
IEnumerable interfaces must be implemented in all classes that implement the IList interface.

## `IList<T>`

`IList<T>` is an interface defined in `System.Collections.Generic`. It is used to extend the custom generic collection. It doesn’t look exactly like a non-generic IList. The new definition of `IList<T>` is a bit shorter than the non-generic equivalent. We only have some new methods for accessing a collection with specific positioning.

```csharp
public interface IList<T> : ICollection<T>, IEnumerable<T>, IEnumerable
{
    // Gets or sets the element at the specified index.
    T this[int index] { get; set; }

    // Determines the index of a specific item in the `Generic.IList`1.
    int IndexOf(T item);

    // Inserts an item to the `IGeneric.IList`1 at the specified index.
    void Insert(int index, T item);

    // Removes the `SGeneric.IList` item at the specified index.
    void RemoveAt(int index);
}
```

`IList<T>` inherits from `ICollection<T>`, `IEnumerable<T>`, and `IEnumerable`. Therefore, all members of the `ICollection<T>`, `IEnumerable<T>`, and `IEnumerable` interfaces must be implemented in all classes that implement the `IList<T>` interface.