# Objects

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

Properties of the object can be accessed using the following two notations:

## Dot notation

```Javascript
human.firstName; //Output: Virat
```

```Javascript
human.fullName(); //Output: Virat Kohli
```

New properties can be added using the dot notation as shown below:

```Javascript
human.age = 27
human.getAge = function(){
    return this.age;
}
```

## Square bracket notation

```Javascript
human["firstName"]; //Output: Virat
```

```Javascript
human["fullName"](); //Output: Virat Kohli
```

New properties can be added using the Square bracket notation as shown below:

```Javascript
human["weight"] = 65
human.getWeight = function(){
    return this.weight;
}
```

Properties can also be accessed using a variable having value equal to the property name as shown below:

```Javascript
var firstNameProperty = "firstName";
console.log(human[firstNameProperty]) // Output: Virat
```

Note: Above method of using variable to access property names cannot be used to access properties of the object using dot notation.

```Javascript
Console.log(human.firstNameProperty) //Output: undefined
```

An object property name can be any valid JavaScript string, or anything that can be converted to a string, including the empty string. However, any property name that is not a valid Javascript identifier (for example, a property name that has a space or a hyphen, or that starts with a number) can only be accessed and added to the object property using the square bracket notation

## Add a property to an instance of an object

```Javascript
myHuman.nationality = 'English';
```

## Delete a property from an object

To delete a property from an object we can use the delete operator. You cannot delete properties that were inherited, nor can you delete properties with their attributes set to configurable.

‘delete’ operator returns true if the delete was successful. It also return true if the property to delete was non-existent or the property could not be deleted.

```Javascript
delete human.firstName; // return true
```

```Javascript
console.log(human.fullName());// undefined Kohli
```

## Add a Method to an instance of an object

```Javascript
myHuman.name = function () {
    return this.firstName + " " + this.lastName;
};
```

## Add a property to a Constructor

You can NOT. Just modify the constructor function

## Add a method to a Constructor

```Javascript
string firstName = "Bob";

String.prototype.SayHi = function SayHi() {
    return "Hi " + this + "!";
};
string hi = firstName.SayHi();
```