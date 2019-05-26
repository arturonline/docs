# High Order Functions

>💡[Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Iteration_methods)

## The .forEach() Method

- Syntax:

  ```javascript
  function printGrocery(element){
    console.log(element);
  }

  groceries.forEach(printGrocery);
  ```

- Shorter:

  ```javascript
  const groceries = ['brown sugar', 'salt', 'cranberries', 'walnuts'];

  groceries.forEach(function(groceryItem) {
    console.log(groceryItem);
  });
  ```

- Arrow function syntax:

  ```javascript
  groceries.forEach(groceryItem => console.log(groceryItem));
  ```

## The .map() Method

- Syntax:

  ```Javascript
  var arr = ['a', 'b', 'c'];

  var arr2 = arr.map(function(item) {
    return item.toUpperCase();
    });

  console.log(arr2); // logs ['A', 'B', 'C']
  ```

- Arrow function syntax:

  ```javascript
  const numbers = [1, 2, 3, 4, 5];

  const bigNumbers = numbers.map(number => {
    return number * 10;
  });
  ```

## The .filter() Method

```Javascript
var a1 = ['a', 10, 'b', 20, 'c', 30];

var a2 = a1.filter(function(item) { 
  return typeof item === 'number'; 
  });

console.log(a2); // logs [10, 20, 30]
```

## The .every() Method

Returns true if callback returns true for every item in the array.

```Javascript
function isNumber(value) {
  return typeof value === 'number';
}

var a1 = [1, 2, 3];
console.log(a1.every(isNumber)); // logs true

var a2 = [1, '2', 3];
console.log(a2.every(isNumber)); // logs false
```

## The .some() Method

Returns true if callback returns true for at least one item in the array.

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

## The .reduce() Method

Applies `callback(firstValue, secondValue)` to reduce the list of items down to a single value and returns that value.

```Javascript
var a = [10, 20, 30];
var total = a.reduce(function(first, second) {
  return first + second; }, 0);

console.log(total) // Prints 60
```

## The .reduceRight() Method

Works like `reduce()`, but starts with the last element.