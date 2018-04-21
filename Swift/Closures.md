# Lambdas

[Kight order functions](https://useyourloaf.com/blog/swift-guide-to-map-filter-reduce/)

## Quick Summary

+ `map` returns an **Array** containing results of applying a transform to each item.
+ `filter` returns an **Array** containing only those items that match an include condition.
+ `reduce` returns a **single value** calculated by calling a combine closure for each item with an initial value.

## Map

Use `map` to loop over a collection and apply the `same operation` to each element in the collection. The map function returns an array containing the results of applying a mapping or transform function to each item:

```Swift
let names = ["Johnny", "Nellie", "Aaron", "Rachel"]

 // Creates a new array of full names by adding "Smith" to each first name
let fullNames = names.map { $0 + " Smith" }
```

Each of these examples will result in the same array of full names:

```Swift
0 "Johnny Smith"
1 "Nellie Smith"
2 "Aaron Smith"
3 "Rachel Smith”
```

## Filter

Use `filter` to loop over a collection and return an Array containing only those elements that match an include condition.

The filter method has `a single argument` that specifies the include condition. This is a closure that takes as an argument the element from the collection and must return a Bool indicating if the item should be included in the result.

```Swift
let digits = [1,4,10,15]
let even = digits.filter { $0 % 2 == 0 }
// [4, 10]
```

## Reduce

The `reduce()` function combine all items in a collection to create a single new value.. It takes a `starting value` and a `closure` that dictates how to combine the items.

```Swift
let numbers = [8, 6, 7, 5, 3, 0, 9]
var total = 0

// Bucle for
for number in numbers {
    total = total + number
}

// Reduce
return lista.reduce(0, { $0 + $1.weight })
```

## FlatMap

The simplest use is as the name suggests to `flatten a collection` of collections.

```Swift
let collections = [[5,2,7],[4,8],[9,1,3]]
let flat = collections.flatMap { $0 }
// [5, 2, 7, 4, 8, 9, 1, 3]
```

Even more usefully it `remove optionals`  from a collection.

```Swift
let people: [String?] = ["Tom",nil,"Peter",nil,"Harry"]
let valid = people.flatMap {$0}
// ["Tom", "Peter", "Harry"]
```