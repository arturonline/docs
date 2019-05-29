# Modules

A module is a JavaScript file that exports one or more values (objects, functions or variables), using the export keyword.

Everything declared inside a module is local to the module, by default. If you want something declared in a module to be public, so that other modules can use it, you must export that feature.

There are a two kinds of exports: **named exports**  and **default exports**:

## Named exports

Named exports allow us to export data through the use of variables:

```javascript
let specialty = '';
function isVegetarian() {
};
function isLowSodium() {
};

export { specialty, isVegetarian };
```

`export { specialty, isVegetarian };` exports objects by their variable names. `isLowSodium` is not exported, since it is not specified.

To import objects stored in a variable, we use the import keyword and include the variables in a set of {}.

```javascript
import { specialty, isVegetarian } from './menu';

console.log(specialty);
```

Here **specialty** and **isVegetarian** are imported. We can then use these objects as in within our code, so we would use `specialty` instead of `Menu.specialty`.

### Export before declarations

Named exports are also distinct in that they can be exported as soon as they are declared, by placing the keyword **export** in front of variable declarations.

```javascript
export let specialty = '';
export function isVegetarian() {
};
function isLowSodium() {
};
```

We no longer need an export statement at the bottom of our file, since this behavior is handled above.

To import variables that are declared, we simply use the original syntax that describes the variable name. In other words, exporting upon declaration does not have an impact on how we import the variables.

```javascript
import { specialty, isVegetarian } from 'menu';
```

## Default exports (one per module)

`export default` is used to export a single class, function or primitive from a script file.

```javascript
// uppercase.js
export default str => str.toUpperCase()
```

In this example, the `uppercase.js` module defines a `default export`, so when we import it, we can assign it a name we prefer:

```javascript
import toUpper from './uppercase.js'
```

and we can use it:

```javascript
toUpper('test') //'TEST'
```

You can also use an absolute path for the module import, to reference modules defined on another domain:

```javascript
import toUpper from 'https://flavio-es-modules-example.glitch.me/uppercase.js'
```

Or you can use a relative path:

```javascript
import { toUpper } from '/uppercase.js'
import { toUpper } from '../uppercase.js'
```

## Combining Export Statements

```javascript
let specialty = '';
function isVegetarian() {
};
function isLowSodium() {
};
function isGlutenFree() {
};

export { specialty as chefsSpecial, isVegetarian as isVeg };
export default isGlutenFree;
```

or:

```javascript
export let Menu = {};

export let specialty = '';
export let isVegetarian = function() {
};
export let isLowSodium = function() {
};
let isGlutenFree = function() {
};

export default isGlutenFree;
```

We can import both types of variables as such:

```javascript
import { specialty, isVegetarian, isLowSodium } from './menu';

import GlutenFree from './menu';
```

## Export lists

```javascript
const a = 1
const b = 2
const c = 3

export { a, b, c }
```

```javascript
import * from 'module'
```

or:

```javascript
import { a } from 'module'
import { a, b } from 'module'
```

## Renaming imports and exports

Once in a while, an imported name happens to collide with some other name that you also need to use. So ES6 lets you rename things when you import them:

```javascript
 // suburbia.js

// Both these modules export something named `flip`.
// To import them both, we must rename at least one.
import {flip as flipOmelet} from "eggs.js";
import {flip as flipHouse} from "real-estate.js";
...
```

Similarly, you can rename things when you export them. This is handy if you want to export the same value under two different names, which occasionally happens:

```javascript
 // unlicensed_nuclear_accelerator.js - media streaming without drm
// (not a real library, but maybe it should be)

function v1() { ... }
function v2() { ... }

export {
  v1 as streamV1,
  v2 as streamV2,
  v2 as streamLatestVersion
};
```

## Node case: CommonJS

It's easiest to just look at what the three different ES6 import/export styles compile down to in CommonJS:

```javascript
// ES6
export foo;
export default foo;
export = foo;

import {foo} from 'blah';
import foo from 'blah';
import * as foo from 'blah';
```

Roughly compiles to:

```javascript
// CommonJS
exports.foo = foo;
exports['default'] = foo;
module.exports = foo;

var foo = require('blah').foo;
var foo = require('blah')['default'];
var foo = require('blah');
```

(Actual compiler output may differ)