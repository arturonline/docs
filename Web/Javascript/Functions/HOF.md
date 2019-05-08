# High Order Functions

- `forEach(callback[, thisObject])` executes callback on every array item and returns undefined.

```Javascript
var a = ['a', 'b', 'c'];
a.forEach(function(element) { console.log(element); }); 
// logs each item in turn
```

- `map(callback[, thisObject])` returns a new array of the return value from executing callback on every array item.

```Javascript
var a1 = ['a', 'b', 'c'];
var a2 = a1.map(function(item) { return item.toUpperCase(); });
console.log(a2); // logs ['A', 'B', 'C']
```

- `filter(callback[, thisObject])` returns a new array containing the items for which callback returned true.

```Javascript
var a1 = ['a', 10, 'b', 20, 'c', 30];
var a2 = a1.filter(function(item) { return typeof item === 'number'; });
console.log(a2); // logs [10, 20, 30]
```

- `every(callback[, thisObject])` returns true if callback returns true for every item in the array.

```Javascript
function isNumber(value) {
  return typeof value === 'number';
}
var a1 = [1, 2, 3];
console.log(a1.every(isNumber)); // logs true
var a2 = [1, '2', 3];
console.log(a2.every(isNumber)); // logs false
```

- `some(callback[, thisObject])` returns true if callback returns true for at least one item in the array.

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

- `reduce(callback[, initialValue])` applies callback(firstValue, secondValue) to reduce the list of items down to a single value and returns that value.

```Javascript
var a = [10, 20, 30];
var total = a.reduce(function(first, second) { return first + second; }, 0);
console.log(total) // Prints 60
```

- `reduceRight(callback[, initialValue])` works like reduce(), but starts with the last element.

reduce and reduceRight are the least obvious of the iterative array methods. They should be used for algorithms that combine two values recursively in order to reduce a sequence down to a single value.