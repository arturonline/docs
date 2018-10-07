# class examples

- https://googlechrome.github.io/samples/classes-es6/

- https://scotch.io/tutorials/better-javascript-with-es6-pt-ii-a-deep-dive-into-classes
## ES6 class

Normal function class:

```Javascript
function Animal(name) {
    this.name = name;
}

Animal.prototype.sleep = function() {
    console.log(this.name + ': Zzz...');
}

function Dog(name) {
    this.name = name;
}

// Create a reference for the prototype
Dog.prototype = Object.create(new Animal());

Dog.prototype.bark = function() {
    console.log(this.name + ': Woof woof!');
}

Dog.prototype.sleep = function() {
    console.log(this.name + ': Overriding Zzzz....');
}

var dog = new Dog('Lassie');
dog.bark(); // Lassie: Woof woof!
dog.sleep(); // Lassie: Overriding Zzzz....
```

ES6: syntactic sugar for `prototypes`

```Javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  sleep () {
    console.log(`${this.name}: Zzz...`);
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name);
  }

  bark () {
    console.log(`${this.name}: Woof woof!`);
  }
}

dog = new Dog('Lassie');
dog.bark(); // Lassie: Woof woof!
dog.sleep(); // Lassie: Zzz...
```