# Modules

A module is a JavaScript file that exports one or more values (objects, functions or variables), using the export keyword.

Everything declared inside a module is local to the module, by default. If you want something declared in a module to be public, so that other modules can use it, you must export that feature.

There are a two kinds of exports: **named exports**  and **default exports**:

## Named exports (several per module)

```javascript
// lib.js
export const sqrt = Math.sqrt;
export function square(x) {
    return x * x;
}
export function diag(x, y) {
    return sqrt(square(x) + square(y));
}
```

```javascript
import { square, diag } from 'lib';
console.log(square(11)); // 121
console.log(diag(4, 3)); // 5
```

You can also import the complete module:

```javascript
import * as lib from 'lib';
console.log(lib.square(11)); // 121
console.log(lib.diag(4, 3)); // 5
```

## Default exports (one per module)

`export default` is used to export a single class, function or primitive from a script file.

```javascript
// uppercase.js
export default str => str.toUpperCase()
```

In this example, the `uppercase.js` module defines a `default export`, so when we import it, we can assign it a name we prefer:

```javascript
import toUpperCase from './uppercase.js'
```

and we can use it:

```javascript
toUpperCase('test') //'TEST'
```

You can also use an absolute path for the module import, to reference modules defined on another domain:

```javascript
import toUpperCase from 'https://flavio-es-modules-example.glitch.me/uppercase.js'
```

Or you can use a relative path:

```javascript
import { toUpperCase } from '/uppercase.js'
import { toUpperCase } from '../uppercase.js'
```

## Export list

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

## CommonJS

It's easiest to just look at what the three different ES6 import/export styles compile down to in CommonJS:

```javascript
// Three different export styles
export foo;
export default foo;
export = foo;

// The three matching import styles
import {foo} from 'blah';
import foo from 'blah';
import * as foo from 'blah';
```

Roughly compiles to:

```javascript
exports.foo = foo;
exports['default'] = foo;
module.exports = foo;

var foo = require('blah').foo;
var foo = require('blah')['default'];
var foo = require('blah');
```

(Actual compiler output may differ)