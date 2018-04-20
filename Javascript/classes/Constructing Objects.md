# Constructing Objects

## Object literals

```Javascript
var Person = {

 name: "Bob Benson" , // setting property
 greet () { // declare function
     console.log("Hello, I'm " + this.name); // 'this' refers to current object
    }
}
```

## Factory Functions

```Javascript
function createPerson(name){
   return {
    name: name,
    greet: function() {console.log("Hello, I'm" + this.name);}
  }
}
var person = createPerson("Jack Johnson");
```

## Constructor Functions

```Javascript
function Person(name) {
    this.name = name;
    this.greet = function() {
        console.log("Hello, I'm " + this.name);
    }
}

var person = new Person("Jack Johnson");
```

When you use new , it binds the current object person to the this keyword within the called constructor function. This binding allows the person object to reference all the functionality from within the constructor function.

## ES6 Classes

An important difference between function declarations and class declarations is that function declarations are hoisted and class declarations are NOT. You first need to declare your class and then access it, otherwise your code will throw a RefrenceError.

```Javascript
class Person {
    constructor(name){
        this.name = name;
    }
   greet() {
    console.log("Hello, I'm " + this.name);
    }
}

// To implement inheritance
class Athlete extends Person {
    constructor(name,sport) {
        super(name)
        this.sport = sport // You have to call super() before you invoke "this"
    }
}
```