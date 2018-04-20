# This

```Javascript
var test = {
  prop: 42,
  func: function() {
    return this.prop;
  },
};

console.log(test.func());
// expected output: 42
```

## Global Context

```Javascript
// In web browsers, the window object is also the global object:
console.log(this === window); // true

a = 37;
console.log(window.a); // 37

this.b = "MDN";
console.log(window.b)  // "MDN"
console.log(b)         // "MDN"
```

## Function Context

A function's this keyword has some differences between strict mode and non-strict mode.

Inside a function, the value of this depends on how the function is called.

### Simple call

```Javascript
//non strict mode
function f1() {
  return this;
}
```

```Javascript
// In a browser:
f1() === window; // true

// In Node:
f1() === global; // true
```

```Javascript
// scrict mode
function f2() {
  'use strict'; // see strict mode
  return this;
}

f2() === undefined; // true
```