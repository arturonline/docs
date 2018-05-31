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
