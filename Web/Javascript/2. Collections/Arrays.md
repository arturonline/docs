# Arrays

In Javascript Array is:

- Grow and shrink dynamically
- Can store different data types.
- Arrays are passed by reference.

## Creating an Array

```Javascript
var arr = new Array(1, 2, 3);
var arr = Array('casa', 'piso', '1,10');
var arr = [true, 'log', NaN, new Date(), {a:1, b:2}];
```

## Array without elements

```Javascript
var arr = [42];      // Creates an array with only one element: 42;
var arr = Array(42); // Creates an array with arr.length set to 42; This is equivalent to:

var arr = [];
arr.length = 42;
```

## Populating an Array

```Javascript
// on creation
var myArray = new Array('Hello', myVar, 3.14159);
var myArray = ['Mango', 'Apple', 'Orange'];
```

```Javascript
var emp = [];
emp[0] = 'Casey Jones';
emp[1] = 'Phil Lesh';
emp[2] = 'August West';

// ['Casey Jones', 'Phil Lesh', 'August West']
```

## Accesing to array elements

```Javascript
var arr = ['one', 'two', 'three'];
arr[2];  // three
arr['length'];  // 3
```

## Assign array

Elements in an array declared with `const` can change the contents of a const array, but cannot reassign a new array.

```javascript
const numbers = [1, 2, 3];
const letters = ['a', 'b', 'c'];

numbers.push('a') // [1, 2, 3, "a"]
numbers = letters; // TypeError: Attempted to assign to readonly property.
```

## Understanding length

You can also assign to the length property. Writing a value that is shorter than the number of stored items truncates the array; writing 0 empties it entirely:

```Javascript
var cats = ['Dusty', 'Misty', 'Twiggy'];
console.log(cats.length); // 3

cats.length = 2;
console.log(cats); // logs "Dusty, Misty" - Twiggy has been removed
```

## Iterating over an array

```Javascript
// Sequential for loop
var colors = ['red', 'green', 'blue'];
for (var i = 0; i < colors.length; i++) {
  console.log(colors[i]);
}
// red
// green
// blue
```

```Javascript
// with ES6 for...of
var colors = ['red', 'green', 'blue'];
for (const color of colors) {
  console.log(color);
});
// red
// green
// blue
```

```Javascript
// with ES6 forEach
var colors = ['red', 'green', 'blue'];
colors.forEach(function(color) {
  console.log(color);
});
// red
// green
// blue
```

```Javascript
// with ES6 Arrow Functions
var colors = ['red', 'green', 'blue'];
colors.forEach(color => console.log(color)); 
// red
// green
// blue
```

> ⚠️ `for...in` doesn't work as expected!

```javascript
var colors = ['red', 'green', 'blue'];
for (const color in colors) {
  console.log(color);
});
// 0
// 1
// 2
```

## Array methods

`concat()` joins two arrays and returns a new array.

  ```Javascript
  var myArray = new Array('1', '2', '3');
  myArray = myArray.concat('a', 'b', 'c'); 
  // myArray is now ["1", "2", "3", "a", "b", "c"]
  ```

`join(deliminator = ',')` joins all elements of an array into a string.

  ```Javascript
  var myArray = new Array('Wind', 'Rain', 'Fire');
  var list = myArray.join(' - '); // list is "Wind - Rain - Fire"
  ```

`push()` adds one or more elements to the end of an array and returns the resulting length of the array.

  ```Javascript
  var myArray = new Array('1', '2');
  myArray.push('3'); // myArray is now ["1", "2", "3"]
  ```

`pop()` removes the last element from an array and returns that element.

  ```Javascript
  var myArray = new Array('1', '2', '3');
  var last = myArray.pop(); 
  // myArray is now ["1", "2"], last = "3"
  ```

`shift()` removes the first element from an array and returns that element.

  ```Javascript
  var myArray = new Array('1', '2', '3');
  var first = myArray.shift();
  // myArray is now ["2", "3"], first is "1"
  ```

`unshift()` adds one or more elements to the front of an array and returns the new length of the array.

  ```Javascript
  var myArray = new Array('1', '2', '3');
  myArray.unshift('4', '5'); 
  // myArray becomes ["4", "5", "1", "2", "3"]
  ```

`slice(start_index, upto_index)` extracts a section of an array and returns a new array.

  ```Javascript
  var myArray = new Array('a', 'b', 'c', 'd', 'e');
  myArray = myArray.slice(1, 4); // starts at index 1 and extracts all elements
                                // until index 3, returning [ "b", "c", "d"]
  ```

`splice(index, count_to_remove, addElement1, addElement2, ...)` removes elements from an array and (optionally) replaces them. It returns the items which were removed from the array.

  ```Javascript
  var myArray = new Array('1', '2', '3', '4', '5');
  myArray.splice(1, 3, 'a', 'b', 'c', 'd');
  // myArray is now ["1", "a", "b", "c", "d", "5"]
  // This code started at index one (or where the "2" was),
  // removed 3 elements there, and then inserted all consecutive
  // elements in its place.
  ```

`reverse()` transposes the elements of an array, in place: the first array element becomes the last and the last becomes the first. It returns a reference to the array.

  ```Javascript
  var myArray = new Array('1', '2', '3');
  myArray.reverse();
  // transposes the array so that myArray = ["3", "2", "1"]
  ```

`sort()` sorts the elements of an array in place, and returns a reference to the array.

  ```Javascript
  var myArray = new Array('Wind', 'Rain', 'Fire');
  myArray.sort();
  // sorts the array so that myArray = ["Fire", "Rain", "Wind"]
  ```

  `sort()` can also take a callback function to determine how array elements are compared.

  The sort method and other methods below that take a callback are known as iterative methods, because they iterate over the entire array in some fashion. Each one takes an optional second argument called `thisObject`. If provided, `thisObject` becomes the value of the this keyword inside the body of the callback function. If not provided, as with other cases where a function is invoked outside of an explicit object context, this will refer to the global object (window).

  The callback function is called with two arguments, that are array's elements.

  The function below compares two values and returns one of three values:

  ```Javascript
  var sortFn = function(a, b) {
    if (a[a.length - 1] < b[b.length - 1]) return -1;
    if (a[a.length - 1] > b[b.length - 1]) return 1;
    if (a[a.length - 1] == b[b.length - 1]) return 0;
  }
  myArray.sort(sortFn);
  // sorts the array so that myArray = ["Wind","Fire","Rain"]
  ```

  if a is less than b by the sorting system, return -1 (or any negative number)
  if a is greater than b by the sorting system, return 1 (or any positive number)
  if a and b are considered equivalent, return 0.

`indexOf(searchElement[, fromIndex])` searches the array for searchElement and returns the index of the first match.

  ```Javascript
  var a = ['a', 'b', 'a', 'b', 'a'];
  console.log(a.indexOf('b')); // logs 1
  // Now try again, starting from after the last match
  console.log(a.indexOf('b', 2)); // logs 3
  console.log(a.indexOf('z')); // logs -1, because 'z' was not found
  ```

`lastIndexOf(searchElement[, fromIndex])` works like indexOf, but starts at the end and searches backwards.

  ```Javascript
  var a = ['a', 'b', 'c', 'd', 'a', 'b'];
  console.log(a.lastIndexOf('b')); // logs 5
  // Now try again, starting from before the last match
  console.log(a.lastIndexOf('b', 4)); // logs 1
  console.log(a.lastIndexOf('z')); // logs -1
  ```
