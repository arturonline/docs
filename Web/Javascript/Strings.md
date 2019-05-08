# Javascript Strings

In JavaScript, the textual data is stored as strings. There is no separate type for a single character. Javascript strings are inmutable.

```javascript
let single = "single-quoted";
let double = "double-quoted";
```

## String interpolation

```javascript
function sum(a, b) {
  return a + b;
}

alert(`1 + 2 = ${sum(1, 2)}.`); // 1 + 2 = 3.
```

## multiple lines

```javascript
let guestList = `Guests:
 * John
 * Pete
 * Mary
`;

alert(guestList); // a list of guests, multiple lines
```

## Indexing

```javascript
let str = `Hello`;

// the first character
str[0]; // H
str.charAt(0); // H

// the last character
str[str.length - 1]; // o
for (let char of "Hello") {
  char; // H,e,l,l,o (char becomes "H", then "e", then "l" etc)
}
```

```javascript
for (let char of "Hello") {
  char; // H,e,l,l,o (char becomes "H", then "e", then "l" etc)
}
```

```javascript
let str = "Widget with id";

str.indexOf("Widget"); // 0, because 'Widget' is found at the beginning
str.indexOf("widget"); // -1, not found, the search is case-sensitive

str.indexOf("id"); // 1, "id" is found at the position 1 (..idget with id)
```

## Slicing

| method                  | selects…                              | negatives              |
| ----------------------- | ------------------------------------- | ---------------------- |
| `slice(start, end)`     | from start to end (not including end) | allows negatives       |
| `substring(start, end)` | between start and end                 | negative values mean 0 |
| `substr(start, length)` | from start get length characters      | allows negative start  |

```javascript
let str = "stringify";
str.slice(0, 5); // 'strin', the substring from 0 to 5 (not including 5)
str.slice(0, 1); // 's', from 0 to 1, but not including 1, so only character at 0
```

```javascript
let str = "stringify";
str.slice(2); // ringify, from the 2nd position till the end
```

```javascript
let str = "stringify";

// start at the 4th position from the right, end at the 1st from the right
str.slice(-4, -1); // gif
```

>💡 Slice is probably the better option.

## Methods

### `includes()`, `startsWith()`, `endsWith()`

The more modern method `str.includes(substr, pos)` returns `true/false` depending on whether str contains substr within.

It’s the right choice if we need to test for the match, but don’t need its position:

```javascript
"Widget with id".includes("Widget"); // true
"Hello".includes("Bye"); // false
```

The optional second argument of `str.includes` is the position to start searching from:

```javascript
"Midget".includes("id"); // true
"Midget".includes("id", 3); // false, from position 3 there is no "id"
```

The methods `str.startsWith` and `str.endsWith` do exactly what they say:

```javascript
"Widget".startsWith("Wid"); // true, "Widget" starts with "Wid"
"Widget".endsWith("get");   // true, "Widget" ends with "get"
```

### `Split()`

```javascript
const str = 'JavaScript is amazing';
const strNew = 'JavaScript-is-amazing';

console.log(str.split()); // ["JavaScript is amazing"]

// Separator string used to determine where to make each split
console.log(str.split('S')); // ["Java", "cript is amazing"]
console.log(str.split('is')); // ["JavaScript ", " amazing"]
console.log(str.split(' ')); // ["JavaScript", "is", "amazing"]
console.log(strNew.split('-')); // ["JavaScript", "is", "amazing"]
```

### `replace()`

```javascript
const str = 'JavaScript is amazing';

console.log(str.replace('JavaScript', 'Node.js')); // 'Node.js is amazing'

// replace() method is case sensitive
// replace will not work
console.log(str.replace('Javascript', 'Node.js')); // 'JavaScript is amazing'

// use regular expression for case insensitive
console.log(str.replace(/Javascript/i, 'Node.js')); // 'Node.js is amazing'

// replace() method replaces only the first match
console.log(str.replace('a', 'A')); // 'JAvaScript is amazing'

// to replace all matches, use regular expression
console.log(str.replace(/a/g, 'A')); // 'JAvAScript is AmAzing'
```

```javascript
```
