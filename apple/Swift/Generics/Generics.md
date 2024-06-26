# Generics

> Original [Source](https://learnappmaking.com/generics-swift-how-to/)

Here’s a standard, nongeneric function called `swapTwoInts(_:_:)`, which swaps two Int values:

```swift
func swapTwoInts(_ a: inout Int, _ b: inout Int) {
    let temporaryA = a
    a = b
    b = temporaryA
}
```

Here's the `generic` version:

```swift
func swapTwoValues<T>(_ a: inout T, _ b: inout T) {
    let temporaryA = a
    a = b
    b = temporaryA
}
```

Example:

```swift
var someInt = 3
var anotherInt = 107

swapTwoValues(&someInt, &anotherInt)
// someInt is now 107, and anotherInt is now 3
```

```swift
var someString = "hello"
var anotherString = "world"

swapTwoValues(&someString, &anotherString)
// someString is now "world", and anotherString is now "hello"
```

## Type Constraints

Type constraints specify that a type parameter must:

* inherit from a specific **class**
* conform to a particular **protocol** or **protocol composition**.

### Syntax

```swift
func someFunction<T: SomeClass, U: SomeProtocol>(someT: T, someU: U) {
    // function body goes here
}
```

The hypothetical function above has two type parameters:

* The first type parameter, `T`, has a type constraint that requires `T` to be a subclass of `SomeClass`.
* The second type parameter, `U`, has a type constraint that requires `U` to conform to the protocol `SomeProtocol`.

Let’s look at another example. Here’s a generic function that can find the index of a value in an array:

```swift
func findIndex<T>(of foundItem: T, in items: [T]) -> Int? {
    for (index, item) in items.enumerated() {
        if item == foundItem {
            return index
        }
    }

    return nil
}

// Here's how you use the function:
let names = ["Ford", "Arthur", "Trillian", "Zaphod", "Deep Thought"]

if let result = findIndex(of: "Zaphod", in: names) {
    print(result)
}

// Output: 3
```

Unfortunately, the above function doesn’t compile! We need to set another type constraint on `T`. We’re using the equality operator `==` in the function to determine if two items are equal, and that means that `T` needs to conform to the Equatable protocol.

Like this:

```swift
findIndex<T: Equatable>(of foundItem: T, in items: [T]) -> Int?
```

## Associated Types

Think of the associated type as associating a generic type with a protocol without defining the type itself. The generic type itself is not yet defined, because that’s up to the class that adopts the protocol.

Example:

The protocol Storage declares two functions, one to store a book and one to retrieve a book, by its index. For the sake of completeness, assume that Book is a simple class that defines a title and author.

```swift
protocol Storage
{
    func store(item: Book)
    func retrieve(index: Int) -> Book
}
```

Any class can adopt the Storage protocol to store and retrieve books, such as Bookcase and Booktrunk classes. Like this:

```swift
class Bookcase: Storage {
    var books = [Book]()

    func store(item: Book) {
        books.append(item)
    }

    func retrieve(index: Int) {
        return books[index]
    }
}
```

But, You wanted to store any item in any storage. This is where generics come in. You can define a generic type in a protocol by using an associated type. It’s kinda like a placeholder type, as we’ve seen before, but for protocols.

Like this:

```swift
protocol Storage
{
    associatedtype Item
    func store(item: Item)
    func retrieve(index: Int) -> Item
}
```

See how that’s similar to the placeholder type? Instead of just books, the class that conforms to the Storage protocol can now store any type of item. Moreover, such a class can determine how it stores these items too.

```swift
class Trunk<Item>: Storage
{
    var items:[Item] = [Item]()

    func store(item: Item) {
        items.append(item)
    }

    func retrieve(index: Int) -> Item {
        return items[index]
    }
}
```

Here's how you use the function:

```swift
let bookTrunk = Trunk<Book>()

bookTrunk.store(item: Book(title: "1984", author: "George Orwell"))
bookTrunk.store(item: Book(title: "Brave New World", author: "Aldous Huxley"))

print(bookTrunk.retrieve(index: 1).title)

// Output: Brave New World
```

```swift
let shoeTrunk = Trunk<Shoe>()

shoeTrunk.store(item: Shoe(size: 42, brand: "Nike"))
shoeTrunk.store(item: Shoe(size: 99, brand: "Adidas"))

print(shoeTrunk.retrieve(index: 0).brand)

// Output: Nike
```

## Adding Constraints to an Associated Type

You can add type constraints to an associated type in a protocol to require that conforming types satisfy those constraints. For example, the following code defines a version of Container that requires the items in the container to be equatable.

```swift
protocol Container {
    associatedtype Item: Equatable
    mutating func append(_ item: Item)
    var count: Int { get }
    subscript(i: Int) -> Item { get }
}
```

## Generic Where Clauses

 A generic where clause enables you to require that an associated type must conform to a certain protocol, or that certain type parameters and associated types must be the same. A generic where clause starts with the where keyword, followed by constraints for associated types or equality relationships between types and associated types. You write a generic where clause right before the opening curly brace of a type or function’s body.

```swift
func allItemsMatch<C1: Container, C2: Container>
    (_ someContainer: C1, _ anotherContainer: C2) -> Bool
    where C1.Item == C2.Item, C1.Item: Equatable {

        // Check that both containers contain the same number of items.
        if someContainer.count != anotherContainer.count {
            return false
        }

        // Check each pair of items to see if they're equivalent.
        for i in 0..<someContainer.count {
            if someContainer[i] != anotherContainer[i] {
                return false
            }
        }

        // All items match, so return true.
        return true
}
```

```swift
var stackOfStrings = Stack<String>()
stackOfStrings.push("uno")
stackOfStrings.push("dos")
stackOfStrings.push("tres")

var arrayOfStrings = ["uno", "dos", "tres"]

if allItemsMatch(stackOfStrings, arrayOfStrings) {
    print("All items match.")
} else {
    print("Not all items match.")
}
// Prints "All items match."
```
