# Prototype Objects

[CLARIFYING THE DIFFERENCE BETWEEN `__PROTO__` AND `PROTOTYPE`](http://codethesite.com/difference-between-__proto__-and-prototype/)

## `__Proto__`

The `__proto__` property of an object is where the object inherits its properties from. It is the property that JavaScript engine will look at when it tries to search down the prototype chain to look for a property that the object itself does not possess.

```Javascript
function Person(name, age, height) {
    this.name = name,
    this.age = age,
    this.height = height
}

var john = new Person("John", 24, 175);

// Person object does not contain fact property
console.log(john.fact)     // undefined

// john's prototype (Person object) now has the fact property
john.__proto__.fact = "I am a humanly human!"
console.log(john.fact);    // "I am a humanly human!"

//  john itself has the fact property
john.fact = "John is cool"
console.log(john.fact);    // "John is cool"

// john.fact is still "John is cool" because the john object itself has the property
// No need to look down the prototype chain
john.__proto__.fact = "I can't overtake john.fact!"
console.log(john.fact);    // "John is cool"
// The JavaScript engine will look at the ‘__proto__’  of john when trying to access a property it does not contain. In the above example it does exists, so it doesn't try to look in the prototype chain
```

## `Prototype`

Objects created with a function constructor will inherit from the function constructor’s `prototype property`. The `prototype property` is an object. We can attach properties and methods to the prototype object. Thus, enabling all the objects created using the constructor function to share the properties and methods.

```Javascript
//Dot notation
Human.prototype.name = "Ashwin"; // prototype object
console.log(Human.prototype.name)//Output: Ashwin
//Square bracket notation
Human.prototype["age"] = 26;
console.log(Human.prototype["age"]); //Output: 26
console.log(Human.prototype);
```

`Prototype object` is shared among all the objects created using the constructor function.

```Javascript
console.log((new Person).__proto__ === Person.prototype)  // true
```

The following are equivalent since they both refer to the prototype of the object created by the function constructor:

```Javascript
john.__proto__.fact = "I am a humanly human!"
Person.prototype.fact = "I am a humanly human!"
```

But I recommend avoid adding properties to the prototype through `john.__proto__`. It gives the impression that you are modifying john itself, rather than its prototype, which affects all objects created with the same function constructor.