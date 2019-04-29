# This

>⚠️ tl,dr: If called in the form `obj.func()` "this" equals `"obj"` else "this" equals `"global"`

## Long story

[Original link](https://dmitripavlutin.com/gentle-explanation-of-this-in-javascript/)

The object that is executing the current function:

If that function is a `method` of an Obj -> `this` is the Obj
If that `function` is not part of an Obj -> `this` is window, global

There are 4 invocation types:

1. **Function** invocation: `alert('Hello World!')`
1. **Method** invocation: `console.log('Hello World!')`
1. **Constructor** invocation: `new RegExp('\\d')`
1. **Indirect** invocation: `alert.call(undefined, 'Hello` World!')

Each invocation type defines the context in its own way, so this behaves slight different than developer expects.

## 1. Function invocation

### Normal mode

>`this` is the global object in a function invocation:

<img src="resources/funcinvocation.png" width="400">

```Javascript
function sum(a, b) {
   this.myNumber = 20; // add 'myNumber' property to global object
   return a + b;
}
// sum() is invoked as a function
// this in sum() is a global object (window)
sum(15, 16);     // => 31
window.myNumber; // => 20
```

### Strict mode

>`this` is **undefined** in a function invocation in strict mode:

<img src="resources/funcinvocation2.png" width="400">

```Javascript
function multiply(a, b) {
  'use strict'; // enable the strict mode
  console.log(this === undefined); // => true
  return a * b;
}
// multiply() function invocation with strict mode enabled
// this in multiply() is undefined
multiply(2, 5); // => 10
```

### Inner function

>The context of the inner function depends only on invocation, but not on the outer function's context.

```Javascript
var numbers = {
   numberA: 5,
   numberB: 10,
   sum: function() {
     console.log(this === numbers); // => true
     function calculate() {
       // this is window or undefined in strict mode
       console.log(this === numbers); // => false
       return this.numberA + this.numberB;
     }
     return calculate();
   }
};
numbers.sum(); // => NaN or throws TypeError in strict mode
```

## 2. Method invocation

>When invoking a method on an object, this becomes the object itself.

<img src="resources/method_invocation.png" width="400">

```Javascript
var calc = {
  num: 0,
  increment: function() {
    console.log(this === calc); // => true
    this.num += 1;
    return this.num;
  }
};
// method invocation. this is calc
calc.increment(); // => 1
calc.increment(); // => 2
```

Calling `calc.increment()` makes the context of increment function to be calc object. So using `this.num` to increment the number property is working well.

### Separating the method from this object

In Javascript methods are separated from its objects when passed as a parameter:

```Javascript
var alone = myObj.myMethod
```

Why?

Looking closely, we may notice two operations in `myObj.method()` statement:

- First, the dot '.' retrieves the property `myObj.method` (detached from the object)
- Then parentheses () execute it.

When the method is called without an object a `function invocation` happens: where `this` is the _global object window_ or _undefined_ in strict mode.

```Javascript
setTimeout(myCat.logInfo, 1000);
```

You might think that setTimout will call the `myCat.logInfo()`, which should log the information about myCat object. Unfortunately the method is separated from its object when passed as a parameter: `setTimout(myCat.logInfo)`. The following cases are equivalent:

```Javascript
setTimout(myCat.logInfo);
// is equivalent to:
var extractedLogInfo = myCat.logInfo;
setTimout(extractedLogInfo);
```

## 3. Constructor invocation

>Constructor invocation is performed when `new` keyword is followed by an expression that evaluates to a function object. `this` is the newly created object in a constructor invocation

<img src="resources/constructor_invocation.png" width="400">

```Javascript
function Foo () {
  console.log(this instanceof Foo); // => true
  this.property = 'Default Value';
}
// Constructor invocation
var fooInstance = new Foo();
fooInstance.property; // => 'Default Value'
```

If we forget the new:

```Javascript
function Vehicle(type, wheelsCount) {
  this.type = type;
  this.wheelsCount = wheelsCount;
  return this;
}
// Function invocation
var car = Vehicle('Car', 4);
car.type;       // => 'Car'
car.wheelsCount // => 4
car === window  // => true
```

In the above example `this` is window object in a function invocation, as result `Vehicle('Car', 4)` is setting properties on the window object.

## 4. Indirect invocation

>`this` is the first argument of `.call()` or `.apply()` in an indirect invocation

Indirect invocation is performed when a function is called using `myFun.call()` or `myFun.apply()` methods.

<img src="resources/Indirect_invocation.png" width="400">

```Javascript
var rabbit = { name: 'White Rabbit' };
function concatName(string) {
  console.log(this === rabbit); // => true
  return string + this.name;
}
// Indirect invocations
concatName.call(rabbit, 'Hello ');  // => 'Hello White Rabbit'
concatName.apply(rabbit, ['Bye ']); // => 'Bye White Rabbit'
```

## 5. Bound Function

>`this` is the first argument of .bind() when invoking a bound function

Contrary to `.apply()` and `.call()` methods, which invokes the function right away, the `.bind()` method only returns a new function that it supposed to be invoked later with a pre-configured `this`.

```Javascript
function multiply(number) {
  'use strict';
  return this * number;
}
// create a bound function with context
var double = multiply.bind(2);
// invoke the bound function
double(3);  // => 6
double(10); // => 20
```

<img src="resources/bound_function.png" width="400">

```Javascript
var numbers = {
  array: [3, 5, 10],
  getNumbers: function() {
    return this.array;
  }
};
//case 1:
var boundGetNumbers = numbers.getNumbers.bind(numbers); // bound
boundGetNumbers(); // => [3, 5, 10]
// case 2:
var simpleGetNumbers = numbers.getNumbers; // unbound
simpleGetNumbers(); // => undefined or throws an error in strict mode
```

`.bind(` makes a permanent context link and will always keep it. A bound function cannot change its linked context when using `.call()` or `.apply()` with a different context, or even a rebound doesn't have any effect.

## 6. Arrow Function

>`this` is the enclosing context where the arrow function is defined

<img src="resources/arrow_function.png" width="400">

```Javascript
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  log() {
    console.log(this === myPoint); // => true
    setTimeout(()=> {
      console.log(this === myPoint);      // => true
      console.log(this.x + ':' + this.y); // => '95:165'
    }, 1000);
  }
}
var myPoint = new Point(95, 165);
myPoint.log();
```

If the arrow function is defined in the top most scope (outside any function), the context is always the global object (window in a browser).

You should never use arrow functions as method on an object.