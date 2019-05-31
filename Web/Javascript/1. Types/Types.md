# Types

## Literals

- The literal representation of a number can be the digit 1, 25, 100 and so on.
- A string literal can be *"some text"*;

There is a literal value for just about everything in JavaScript:

literal       | value               | typeof   | constructor
--------------|---------------------|----------|------------
1             | numeric literal     | number   | Number()
"Some text"   | string literal      | string   | String()
[]            | array literal       | object   | Array()
{}            | object literal      | object   | Object()
true          | boolean literal     | boolean  | Boolean()
function() {} | function is a value | function | Function()

## Basic Types

There are 7 basic types in JavaScript.

- **number** for numbers of any kind: integer or floating-point.
- **string** for strings. A string may have one or more characters, there’s no separate single-character type.
- **boolean** for true/false.
- **null** for unknown values – a standalone type that has a single value null.
- **undefined** for unassigned values – a standalone type that has a single value undefined.
- **object** for more complex data structures.
- **symbol** for unique identifiers.

The typeof operator allows us to see which type is stored in a variable.

- Two forms: `typeof` x or `typeof(x)`.
- Returns a string with the name of the type, like *"string"*.
- For null returns *"object"* – this is an error in the language, it’s not actually an object.