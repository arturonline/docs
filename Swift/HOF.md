# High order functions

[Hight order functions](https://useyourloaf.com/blog/swift-guide-to-map-filter-reduce/)

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

## compactMap

The simplest use is as the name suggests to `flatten a collection` of collections.

```Swift
let collections = [[5,2,7],[4,8],[9,1,3]]
let flat = collections.compactMap { $0 }
// [5, 2, 7, 4, 8, 9, 1, 3]
```

Even more usefully it remove `optionals`  from a collection:

```Swift
let people: [String?] = ["Tom",nil,"Peter",nil,"Harry"]
let valid = people.compactMap {$0}
// ["Tom", "Peter", "Harry"]
```

## sorted

`sorted` is used to rearrange the elements in the Array:

### sorted Numbers

```Swift
let randomNumbers:[Int] = [1 ,3,45,6743,4673,435,4162,6657,2431,658,686,56,3456,8875,325,46,2,66537,6]

let sortednumber = randomNumbers.sorted()
print(sortednumber)

// [1, 2, 3, 6, 45, 46, 56, 325, 435, 658, 686, 2431, 3456, 4162, 4673, 6657, 6743, 8875, 66537]
```

### sorted Strings

Note: The strings are sorted based on their ASCII Value A-Z(65–90 ) and a-z(97–122)

```Swift
let alphabets:[Character] = [“V” ,”I” ,”S” , “H” ,”W” ,”A” ,”S” , “v” ,”i” ,”s” ,”h” , “w” ,”a” ,”s”]

let sortedAlphabets = alphabets.sorted()
print(sortedAlphabets)

// [“A”, “H”, “I”, “S”, “S”, “V”, “W”, “a”, “h”, “i”, “s”, “s”, “v”, “w”]
```

sorting can be done based on `<` (lesser than), `>` (greater than)

```Swift
let greaterThanArray = randomNumbers.sorted(by: >)
let lesserThanArray = randomNumbers.sorted(by: <)
print(greaterThanArray)
print(lesserThanArray)

// greater than
[66537, 8875, 6743, 6657, 4673, 4162, 3456, 2431, 686, 658, 435, 325, 56, 46, 45, 6, 3, 2, 1]

// lesser than
[1, 2, 3, 6, 45, 46, 56, 325, 435, 658, 686, 2431, 3456, 4162, 4673, 6657, 6743, 8875, 66537]
```

### custom sorted

```Swift
let evenFirstSorted = randomNumbers.sorted 
{ (a, b) -> Bool in
    return a % 2 == 0
}
print(evenFirstSorted)
// [6, 2, 46, 3456, 56, 686, 658, 4162, 1, 3, 45, 6743, 4673, 435, 6657, 2431, 8875, 325, 66537]
```