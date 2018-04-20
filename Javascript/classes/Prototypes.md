# JavaScript Object Prototypes

[https://hackernoon.com/prototypes-in-javascript-5bba2990e04b](link)

When a function is created in JavaScript, JavaScript engine adds a prototype property to the function.

Every Javascript function has a `prototype property` (empty by default), and you attach properties and methods on this prototype property when you want to implement inheritance. This prototype property points to an object, `a prototype object`.

## property vs __proto__

`__proto__` is the actual object that is used in the lookup chain to resolve methods, etc.
`prototype` is the object that is used to build `__proto__` when you create an object with new:

```Javascript
( new Foo ).__proto__ === Foo.prototype
( new Foo ).prototype === undefined
```

prototype is only available on functions since they are derived from Function and Object but in anything else it is not. However, `__proto__` is available everywhere

```Javascript
function Human(firstName, lastName) {
    this.firstName = firstName,
    this.lastName = lastName,
    this.fullName = function() {
        return this.firstName + " " + this.lastName;
    }
}

//Create an object person1 using the Human constructor function
var person1 = new Human("Virat", "Kohli");
Human.prototype === person1.__proto__ //true

var person2 = new Human("Sachin", "Tendulkar");
Human.prototype === person2.__proto__ //true
person1.__proto__ === person2.__proto__ //true
```

## Add new propertys to the constructor function

```Javascript
//Dot notation
Human.prototype.name = "Ashwin";
console.log(Human.prototype.name)//Output: Ashwin

//Square bracket notation
Human.prototype["age"] = 26;
console.log(Human.prototype["age"]); //Output: 26
console.log(Human.prototype);
```

## Example

```Javascript
//Create an empty constructor function
function Person(){

}
//Add property name, age to the prototype property of the Person constructor function
Person.prototype.name = "Ashwin" ;
Person.prototype.age = 26;
Person.prototype.sayName = function(){
    console.log(this.name);
}

//Create an object using the Person constructor function
var person1 = new Person();
//Access the name property using the person object
console.log(person1.name)// Output" Ashwin

```