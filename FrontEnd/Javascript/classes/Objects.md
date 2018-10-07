# Creating Objects

## Object literals

An object in JavaScript is a collection of key-value pairs. Each key-value pair is called as a property. A property can be a function, an array, an object itself or any primitive data type i.e. integer, string, etc. Functions in object are called as methods.

```Javascript
var human = {
    firstName: "Virat",
    lastName: "Kohli",
    age: 30,
    fullName: function(){
        return this.firstName + " " + this.lastName
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

## Properties

To add a property to an instance of an object:

```Javascript
myHuman.nationality = 'English';
```

To delete a property from an object. `‘delete’` operator returns true if the delete was successful. It also return true if the property to delete was non-existent or the property could not be deleted.

```Javascript
delete human.firstName; // return true
```

To add a Method to an instance of an object

```Javascript
myHuman.name = function () {
    return this.firstName + " " + this.lastName;
};
```