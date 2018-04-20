# Arrays

An array stores values of the same type in an ordered list. The same value can appear in an array multiple times at different positions.

## Initialization

```Swift
var names: [String] = ["Artur", "Ana", "Pilar"]
var names = ["Artur", "Ana", "Pilar"]
var array = [1, 2, 3]
```

## Empty array

```Swift
var array = Array<Int>()
var array = [Int]()
```

## Accessing and Modifying an Array

```Swift
var shoppingList = ["Eggs", "Milk"]

shoppingList.append("Flour")
// shoppingList now contains 3 items, and someone is making pancakes

shoppingList += ["Baking Powder"]
// shoppingList now contains 4 items
```

```Swift
var firstItem = shoppingList[0]
// firstItem is equal to "Eggs"

shoppingList[0] = "Six eggs"
// the first item in the list is now equal to "Six eggs" rather than "Eggs"
```

```Swift
//To insert an item into the array at a specified index, call the array’s insert(_:at:) method:

shoppingList.insert("Maple Syrup", at: 0)
```

```Swift
//Similarly, you remove an item from the array with the remove(at:) method.

let mapleSyrup = shoppingList.remove(at: 0)
```

```Swift
//If you want to remove the final item from an array, use the removeLast() method

let apples = shoppingList.removeLast()
```

## Iterating Over an Array

You can iterate over the entire set of values in an array with the for-in loop:

```Swift
for item in shoppingList {
    print(item)
}
// Six eggs
// Milk
// Flour
// Baking Powder
// Bananas
```

## Other methods

```Swift
let count = myArray.count
if myArray.isEmpty { }

var myNewArray = firstArray + secondArray

```