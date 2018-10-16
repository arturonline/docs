# Getters and Setters

ES6 classes brings a new syntax for getters and setters on object properties. Get and set allows us to run code on the reading or writing of a property. So let’s create a get and set for our name property.

```Javascript
// ES6 get and set
class Person {
  constructor(name) {
    this._name = name;
  }

  get name() {
    return this._name.toUpperCase();
  }

  set name(newName) {
    this._name = newName;   // validation could be checked here such as only allowing non numerical values
  }

  walk() {
    console.log(this._name + ' is walking.');
  }
}

let bob = new Person('Bob');
console.log(bob.name);  // Outputs 'BOB'
```

In our class above we have a getter and setter for our name property. We use `_ convention` to create a backing field to store our name property. Without this every time get or set is called it would cause a stack overflow. The get would be called and which would cause the get to be called again over and over creating an infinite loop.

Something to note is that our backing field `this._name` is not private. Someone could still access `bob._name` and retrieve the property. To achieve private state on objects, you would use ES6 symbol and module to create true encapsulation and private state. Private methods can be created using module or traditional closures using an IIFE. Using languages like TypeScript you can get compile-time enforcement of private properties and methods.
