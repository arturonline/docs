# Constructor functions

```Javascript
function Person(name, position) {
  this.name = name;
  this.position = position;
}
```

## Methods

Methods can be defined on constructor functions by assigning a function to a property.

```Javascript
function Person(name) {
  this.name = name;
  this.hi = function() {
    console.log('Hi! My name is ' + this.name);
  };
}

let eminem = new Person('Slim Shady');
eminem.hi(); // Hi! my name is Slim Shady
```

Although methods can be defined this way, this approach does have a downside. Every time an instance of Person is created, a new function is defined and assigned to the hi property of that object. If we create 5 Person objects, they will all have their own hi methods that do the same thing. A more efficient way to do this is to define hi once, and have each Person object use that same function reference. To do this, we can use a function’s prototype.

```Javascript
function Person(name) {
  this.name = name;
}

Person.prototype.hi = function() {
  console.log('Hi! My name is ' + this.name);
};

let david = new Person('David');
david.hi(); // Hi! My name is David

let patrick = new Person('Patrick');
patrick.hi(); // Hi! My name is Patrick
```

Whenever a Person instance is created, the object will inherit any properties or methods defined on Person.prototype.

Anything on the prototype is shared across all object instances of that constructor, typically you only see methods defined on the prototype and properties stored on the constructed object itself.