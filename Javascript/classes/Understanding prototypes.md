# Understanding prototypes

Almost all objects in JavaScript are instances of `Object`.

Objects in Javascript act as wrappers for properties, meaning that the object directly contains them. When trying to access a property it does not own, the `prototype chain` is traversed.



## Prototype chain

When you attempt to access a property or method of an object, JavaScript will first search on the object itself, and if it is not found, it will search the object's `[[Prototype]]`.

>When a function is created in JavaScript, JavaScript engine adds a new object know as `[[prototype]]` to the function.

If after consulting both the object and its `[[Prototype]]` still no match is found, JavaScript will check the prototype of the linked object, and continue searching until the end of the prototype chain is reached.

## Constructors

A constructor function is just a regular function. It becomes a constructor when it is called on by an instance with the `new` keyword.

```javascript
function Hero(name, level) {
  this.name = name;
  this.level = level;
}
```

The this keyword will refer to the new instance that is created, so setting `this.name` to the name parameter ensures the new object will have a name property set.

## Methods and inheritance

Every Javascript function has a `prototype property`, that points to the `[[Prototype]]` object. We can attach properties and methods on this `prototype property`.

Example, we add a `greet()` method to Hero using prototype:

```Javascript
// Add greet method to the Hero prototype
Hero.prototype.greet = function () {
  return `${this.name} says hello.`;
}
```

If you inspect the `[[Prototype]]` of Hero, you will see `greet()` as an available option now. Since `greet()` is in the prototype of Hero, any instance of Hero, will have the method available to use.