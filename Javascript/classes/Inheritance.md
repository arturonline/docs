# Inheritance

```Javascript
function Animal() {}
Animal.prototype.eat = function() {
  console.log('eating');
};

function Cat() {}
Cat.prototype = new Animal();
Cat.prototype.constructor = Cat;
Cat.prototype.meow = function() {
  console.log('meowing');
};
```

## ES6

```Javascript
class Animal {
  eat() {
    console.log('eating');
  }
}

class Cat extends Animal {
  constructor() {
    super();
  }
  meow() {
    console.log('meowing');
  }
}
```