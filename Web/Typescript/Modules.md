# Modules

When Typescript transpiles to the ES6 uses the ES6 syntax.
And when Typescript transpiles to ES5 it uses the CommonJS module loading system from node.

## ES6 syntax

Exporting:

```typescript
// utils.ts
function square(x) {
    return Math.pow(x,2)
}

function cow() {
    console.log("Mooooo!!!")
}

export {square, cow};
```

Importing:

```typescript
// script.ts
import {square, cow} from './utils';

console.log(square(2));
cow();
```

Note:
`{square, cow}` is just destructuring syntax and is short for {square: square, cow: cow}.

## Aliases

We may want to import a function with one name but then use it via another name. Perhaps to avoid name collisions or just to have a more convenient naming, like so:

```typescript
import {square as sqr} from './utils';
sqr(2);
```

Or we can import everything in a file like so:

```typescript
import * as utils from './utils';
console.log(utils.square(2));
utils.cow();
```

## Alternative export syntax

We can also export functions or variables as they are defined by prepended the word export to the front of their declarations:

```typescript
export function square(x) {
    return Math.pow(x,2)
}
```

## Default exports

If a module defines one export which is the most common, we can take advantage of the default export syntax, like so:

```typescript
export default function square(x) {
    return Math.pow(x,2)
}
```

And then when we import it we don’t need to use { }, like so:

```typescript
import square from './utils';
```

Or, if we want to import the default export as well as some other exports, we can use:

```typescript
import square, { cow } from './utils';
```