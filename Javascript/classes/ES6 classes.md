# ES6 Classes

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