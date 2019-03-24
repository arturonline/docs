# Arrays

An array is an ordered set of values that you refer to with a name and an index. Array objects grow and shrink dynamically and can have any JavaScript value.

## Creating an Array

```Javascript
var arr = new Array(element0, element1, ..., elementN);
var arr = Array(element0, element1, ..., elementN);
var arr = [element0, element1, ..., elementN];
```

## Array without elements

```Javascript
var arr = new Array(arrayLength);
var arr = Array(arrayLength);

// This has exactly the same effect
var arr = [];
arr.length = arrayLength;

// arrayLength must be a Number
```

```Javascript
var arr = [42];      // Creates an array with only one element:
                     // the number 42.

var arr = Array(42); // Creates an array with no elements
                     // and arr.length set to 42; this is
                     // equivalent to:
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
```

## Accesing to array elements

```Javascript
var arr = ['one', 'two', 'three'];
arr[2];  // three
arr['length'];  // 3
```

## Understanding length

At the implementation level, JavaScript's arrays actually store their elements as standard object properties, using the array index as the property name. The length property is special; it always returns the index of the last element plus one (in the following example, Dusty is indexed at 30, so cats.length returns 30 + 1). Remember, JavaScript Array indexes are 0-based: they start at 0, not 1. This means that the length property will be one more than the highest index stored in the array:

```Javascript
var cats = [];
cats[30] = ['Dusty'];
console.log(cats.length); // 31
```

You can also assign to the length property. Writing a value that is shorter than the number of stored items truncates the array; writing 0 empties it entirely:

```Javascript
var cats = ['Dusty', 'Misty', 'Twiggy'];
console.log(cats.length); // 3

cats.length = 2;
console.log(cats); // logs "Dusty, Misty" - Twiggy has been removed
```

## Iterating over an array

Since JavaScript elements are saved as standard object properties, it is not advisable to iterate through JavaScript arrays using for...in loops because normal elements and all enumerable properties will be listed.

```Javascript
var colors = ['red', 'green', 'blue'];
for (var i = 0; i < colors.length; i++) {
  console.log(colors[i]);
}
```

```Javascript
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

## Array methods

The Array object has the following methods:

- concat() joins two arrays and returns a new array.

```Javascript
var myArray = new Array('1', '2', '3');
myArray = myArray.concat('a', 'b', 'c'); 
// myArray is now ["1", "2", "3", "a", "b", "c"]
```

- join(deliminator = ',') joins all elements of an array into a string.

```Javascript
var myArray = new Array('Wind', 'Rain', 'Fire');
var list = myArray.join(' - '); // list is "Wind - Rain - Fire"
```

- push() adds one or more elements to the end of an array and returns the resulting length of the array.

```Javascript
var myArray = new Array('1', '2');
myArray.push('3'); // myArray is now ["1", "2", "3"]
```

- pop() removes the last element from an array and returns that element.

```Javascript
var myArray = new Array('1', '2', '3');
var last = myArray.pop(); 
// myArray is now ["1", "2"], last = "3"
```

- shift() removes the first element from an array and returns that element.

```Javascript
var myArray = new Array('1', '2', '3');
var first = myArray.shift();
// myArray is now ["2", "3"], first is "1"
```

- unshift() adds one or more elements to the front of an array and returns the new length of the array.

```Javascript
var myArray = new Array('1', '2', '3');
myArray.unshift('4', '5'); 
// myArray becomes ["4", "5", "1", "2", "3"]
```

- slice(start_index, upto_index) extracts a section of an array and returns a new array.

```Javascript
var myArray = new Array('a', 'b', 'c', 'd', 'e');
myArray = myArray.slice(1, 4); // starts at index 1 and extracts all elements
                               // until index 3, returning [ "b", "c", "d"]
```

- splice(index, count_to_remove, addElement1, addElement2, ...) removes elements from an array and (optionally) replaces them. It returns the items which were removed from the array.

```Javascript
var myArray = new Array('1', '2', '3', '4', '5');
myArray.splice(1, 3, 'a', 'b', 'c', 'd'); 
// myArray is now ["1", "a", "b", "c", "d", "5"]
// This code started at index one (or where the "2" was), 
// removed 3 elements there, and then inserted all consecutive
// elements in its place.
```

- reverse() transposes the elements of an array, in place: the first array element becomes the last and the last becomes the first. It returns a reference to the array.

```Javascript
var myArray = new Array('1', '2', '3');
myArray.reverse();
// transposes the array so that myArray = ["3", "2", "1"]
```

- sort() sorts the elements of an array in place, and returns a reference to the array.

```Javascript
var myArray = new Array('Wind', 'Rain', 'Fire');
myArray.sort(); 
// sorts the array so that myArray = ["Fire", "Rain", "Wind"]
```

sort() can also take a callback function to determine how array elements are compared.

The sort method and other methods below that take a callback are known as iterative methods, because they iterate over the entire array in some fashion. Each one takes an optional second argument called thisObject. If provided, thisObject becomes the value of the this keyword inside the body of the callback function. If not provided, as with other cases where a function is invoked outside of an explicit object context, this will refer to the global object (window).

The callback function is called with two arguments, that are array's elements.

The function below compares two values and returns one of three values:

For instance, the following will sort by the last letter of a string:

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

- indexOf(searchElement[, fromIndex]) searches the array for searchElement and returns the index of the first match.

```Javascript
var a = ['a', 'b', 'a', 'b', 'a'];
console.log(a.indexOf('b')); // logs 1
// Now try again, starting from after the last match
console.log(a.indexOf('b', 2)); // logs 3
console.log(a.indexOf('z')); // logs -1, because 'z' was not found
```

- lastIndexOf(searchElement[, fromIndex]) works like indexOf, but starts at the end and searches backwards.

```Javascript
var a = ['a', 'b', 'c', 'd', 'a', 'b'];
console.log(a.lastIndexOf('b')); // logs 5
// Now try again, starting from before the last match
console.log(a.lastIndexOf('b', 4)); // logs 1
console.log(a.lastIndexOf('z')); // logs -1
```

- forEach(callback[, thisObject]) executes callback on every array item and returns undefined.

```Javascript
var a = ['a', 'b', 'c'];
a.forEach(function(element) { console.log(element); }); 
// logs each item in turn
```

- map(callback[, thisObject]) returns a new array of the return value from executing callback on every array item.

```Javascript
var a1 = ['a', 'b', 'c'];
var a2 = a1.map(function(item) { return item.toUpperCase(); });
console.log(a2); // logs ['A', 'B', 'C']
```

- filter(callback[, thisObject]) returns a new array containing the items for which callback returned true.

```Javascript
var a1 = ['a', 10, 'b', 20, 'c', 30];
var a2 = a1.filter(function(item) { return typeof item === 'number'; });
console.log(a2); // logs [10, 20, 30]
```

- every(callback[, thisObject]) returns true if callback returns true for every item in the array.

```Javascript
function isNumber(value) {
  return typeof value === 'number';
}
var a1 = [1, 2, 3];
console.log(a1.every(isNumber)); // logs true
var a2 = [1, '2', 3];
console.log(a2.every(isNumber)); // logs false
```

- some(callback[, thisObject]) returns true if callback returns true for at least one item in the array.

```Javascript
function isNumber(value) {
  return typeof value === 'number';
}
var a1 = [1, 2, 3];
console.log(a1.some(isNumber)); // logs true
var a2 = [1, '2', 3];
console.log(a2.some(isNumber)); // logs true
var a3 = ['1', '2', '3'];
console.log(a3.some(isNumber)); // logs false
```

- reduce(callback[, initialValue]) applies callback(firstValue, secondValue) to reduce the list of items down to a single value and returns that value.

```Javascript
var a = [10, 20, 30];
var total = a.reduce(function(first, second) { return first + second; }, 0);
console.log(total) // Prints 60
```

- reduceRight(callback[, initialValue]) works like reduce(), but starts with the last element.

reduce and reduceRight are the least obvious of the iterative array methods. They should be used for algorithms that combine two values recursively in order to reduce a sequence down to a single value.