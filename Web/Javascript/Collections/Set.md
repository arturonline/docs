# Keyed collections

## Sets

* Set objects are collections of values.
* You can iterate its elements in insertion order.
* A value in a Set may only occur once.

### Methods

The following code shows some basic operations with a Set. See also the Set reference page for more examples and the complete API.

```Javascript
var mySet = new Set();
mySet.add(1);
mySet.add('some text');
mySet.add('foo');

mySet.has(1); // true
mySet.delete('foo');
mySet.size; // 2

for (let item of mySet) console.log(item);
// 1
// "some text"
```

### Converting between Array and Set

You can create an Array from a Set using Array.from or the spread operator. Also, the Set constructor accepts an Array to convert in the other direction. Note again that Set objects store unique values, so any duplicate elements from an Array are deleted when converting.

```javascript
Array.from(mySet);
[...mySet2];

mySet2 = new Set([1, 2, 3, 4]);
```