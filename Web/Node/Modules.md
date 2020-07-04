# Modules

In Node each file is a module. Functions and objects are added to the root of a module by specifying additional properties on the special exports object. Variables local to the module will be private. In this example, the variable `PI` is private to `circle.js`.

On the first line, `bar.js` loads the module `circle.js` that is in the same directory as `foo.js`:

Example:

```Javascript
// circle.js

const { PI } = Math;

exports.area = (r) => PI * r ** 2;
exports.circumference = (r) => 2 * PI * r;
```

```Javascript
// bar.js

const circle = require('./circle.js');

console.log(`The area of a circle of radius 4 is ${circle.area(4)}`);
```

Example 2:

```Javascript
// foo.js

const Square = require('./square.js');

const mySquare = new Square(2);
console.log(`The area of mySquare is ${mySquare.area()}`);
```

```Javascript
// square.js

// assigning to exports will not modify module, must use module.exports
module.exports = class Square {
  constructor(width) {
    this.width = width;
  }

  area() {
    return this.width ** 2;
  }
};
```

## exports shortcut

In node there exists a shorthand way of exporting things from modules. This shorthand uses just `exports` insted of `module.exports`.

```Javascript
module { exports{} };
exports = module.exports;
```

The key thing to notice here, however, is that like any variable, you should assign your new values as properties of the shortcut export object, and not assign objects directly to overwrite the value of export itself.

```Javascript
// Good: assign as properties
exports.film01 = film01

// Wrong: assign as object, reference to module lost.
exports = film01
```

```Javascript
// Good
module.exports = {
    film101: film101,
    film102: film102
}
// wrong
exports = {
    film101: film101,
    film102: film102
}
```
