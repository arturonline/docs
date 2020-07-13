# Type Coercion

Coercion is the process of converting a value from one type into another.

Type coercion can be *explicit* and *implicit*:

- When a developer expresses the intention to convert between types by writing the appropriate code, like `Number(value)`, it’s called **explicit type coercion** (or type casting).
- Since JavaScript is a weakly-typed language, values can also be converted between different types automatically, and it is called **implicit type coercion**.

```javascript
String(123) // explicit
123 + ''    // implicit
```

## Arithmetic conversions

The unary *plus* and *minus* operators force the value to a number. If the value is not a number, *NaN* is generated.

```javascript
const s = "text";
console.log(-s); // NaN
```

### Numeric conversion rules

Value          | Becomes…
---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------
undefined      | NaN
null           | 0
true and false | 1 and 0
string         | Whitespaces from the start and end are removed. If the remaining string is empty, the result is 0. Otherwise, the number is “read” from the string. An error gives NaN.

### `+` operator

If the type of the two values provided to the arithmetic `+` operator is different JavaScript will use type coercion to change one of the values before evaluating the entire statement to a more meaningful result.

- If both values are integers, arithmetic operation is performed. If one of them is a string then coercion happens and string addition is invoked.
- when it sees that one of the values is a string, it invokes the string addition operator. It makes no difference whether the string is on the left or right side. The statement still evaluates to a string:

    ```javascript
    "1" + 1 // "11"
    1 + "1" // "11"
    ```

### Adding multiple Values

```javascript
1 + 1 + 1 + 2 + "" // ?
```

First, all of the purely numeric values will be combined, ending up with the sum of `5` on the left hand side and `""` on the right hand side:

```javascript
5 + ""
```

Adding a numeric value to a string value will coerce the numeric value to a string and then add them together:

```javascript
"5" + "" // "5"
```

## Operator precedence

```javascript
1 + 1 + 1 + 2 * "" // ?
```

The string `""` will coerce to `0` and `2 * 0` will evaluate to `0`.

```javascript
1 + 1 + 1 + 2 * 0
1 + 1 + 1 + 0
```

After multiplication, the numbers 1 + 1 + 1 will be added up to produce 3.

```javascript
3 + 0 // 3
```

## String to Number Comparison

When it comes to equality operator == numeric strings are evaluated to numbers:

```javascript
1 == "1" // 1 == 1
"1" == 1 // 1 == 1
```

With non-numeric string values:

```javascript
1 == "a" // 1 == NaN // false
```

## null vs undefined

`null` is not an object. Think of `null` as a unique type for explicitly assigning a ”nothing” or ”empty” value to a variable. This way it doesn’t end up undefined.

If the value is unknown at the time of variable definition it is always best to use null instead of undefined.

In a real-case scenario the `null` value can help us determine whether the data needs to be initialized for the first time, or existing data merely needs to be updated.

Example:

```javascript
let bike = null

class Motorcycle {
    constructor (make, model, year) {
        this.make = make;
        this.model = model;
        this.year = year;
    }
    getFeatures() {
        if(this.features == null) {
            this.features = { /* get features from db for the first time */ }
        } else {
            this.features = { /* just update features from db */ }
        }
    }
}
```

## Boolean conversion

As there are only 2 possible results of boolean conversion: true or false, it’s just easier to remember the list of falsy values.

```javascript
Boolean('')           // false
Boolean(0)            // false
Boolean(-0)           // false
Boolean(NaN)          // false
Boolean(null)         // false
Boolean(undefined)    // false
Boolean(false)        // false
```

Any value that is not in the list is converted to true, including object, function, Array, Date, user-defined type, and so on. Symbols are truthy values. Empty object and arrays are truthy values as well:

```javascript
Boolean({})             // true
Boolean([])             // true
Boolean(Symbol())       // true
!!Symbol()              // true
Boolean(function() {})  // true
```

There are two special rules to remember:

1. When applying `==` to null or undefined, numeric conversion does not happen. `null` equals only to `null` or `undefined`, and does not equal to anything else.

    ```javascript
    null == 0               // false, null is not converted to 0
    null == null            // true
    undefined == undefined  // true
    null == undefined       // true
    ```

2. `NaN` does not equal to anything even itself:

    ```javascript
    if (value !== value) { console.log("we're dealing with NaN here") }
    ```

## Examples of type Coercion

```javascript
true + 1 // 1 + 1
true + true // 1 + 1
true + false // 1 + 0
"hello" + " " + "there." // "hello there."
"Username" + 12345 // Username12345
1 / "strintg" // NaN
NaN === NaN // false
[1] + [2] //"12"<String>
Infinity // Infinity
[] + [] // "" <String>
[] + {} // [Object Object]
```

```javascript
12 / "6"                 // 2
[1] > null               // true
"foo" + + "bar"          // 'fooNaN'
'true' == true           // false
false == 'false'         // false
null == ''               // false
!!"false" == !!"true"    // true
['x'] == 'x'             // true
[] + null + 1            // 'null1'
[1,2,3] == [1,2,3]       // false
{}+[]+{}+[1]             // '0[object Object]1'
!+[]+[]+![]              // 'truefalse'
new Date(0) - 0          // 0
new Date(0) + 0          // 'Thu Jan 01 1970 02:00:00(EET)0'
```
