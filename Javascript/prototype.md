# Prototype Objects

When a function is created in JavaScript, JavaScript engine adds a `prototype property` to the function. This prototype property is an object (called as prototype object).

When an object is created (instantiated) in JavaScript, JavaScript engine adds a `__proto__` property to the newly created object which points to the prototype object of the constructor function.

As `prototype object` is an object, we can attach properties and methods to the prototype object. Thus, enabling all the objects created using the constructor function to share the properties and methods.

New property can be added to the constructor function's prototype property using either the dot notation or square bracket notation as shown below:

```Javascript
//Dot notation
Human.prototype.name = "Ashwin";
console.log(Human.prototype.name)//Output: Ashwin
//Square bracket notation
Human.prototype["age"] = 26;
console.log(Human.prototype["age"]); //Output: 26
console.log(Human.prototype);
```

`Prototype object` of the constructor function is shared among all the objects created using the constructor function. All properties on the prototype are shared among all the objects created using the constructor function, which is ideal for functions. Properties that contain primitive values also tend to work well where it’s possible to hide the prototype property by assigning a property of the same name to the object. The real problem occurs when a prototype object contains a property of reference type.