# Symbols

Object property keys used to be of type string. That was problematic because strings can't prevent name clashes:

```javascript
let user = { name: "John" };

// our script uses "id" property
user.id = "ID Value";

// ...if later another script the uses "id" for its purposes...
user.id = "Their id value"
// boom! overwritten! it did not mean to harm the colleague, but did it!
```

To solve this problem ECMAScript 6 introduced a new primitive type: `symbols`. Symbols allow us to create _tokens_ that serve as unique identifier. This way, no other part of code can occasionally access or overwrite their .

## Symbol type

```Javascript
// id is a new symbol
let id = Symbol();

// id is a symbol with the description "id"
let id = Symbol("id");
```

Even if we create many symbols with the same description, they are different values. The description is just a label that doesn’t affect anything:

```Javascript
let id1 = Symbol("id");
let id2 = Symbol("id");

alert(id1 == id2); // false
```

## Symbols as property keys

Symbols can be use as property keys:

```Javascript
const MY_KEY = Symbol();
let obj = {};

obj[MY_KEY] = 123;
console.log(obj[MY_KEY]); // 123
```

## Symbols as methods definition

```Javascript
const FOO = Symbol();
let obj = {
    [FOO]() {
        return 'bar';
    }
};
console.log(obj[FOO]()); // bar
```

Symbolic properties do not participate in `for..in` loop. If another script or a library loops over our object, it won’t unexpectedly access a symbolic property.

```javascript
let id = Symbol("id");
let user = {
  name: "John",
  age: 30,
  [id]: 123
};

for (let key in user) alert(key); // name, age (no symbols)

// the direct access by the symbol works
alert( "Direct: " + user[id] );
```

In contrast, `Object.assign` copies both string and symbol properties:

```javascript
let id = Symbol("id");
let user = {
  [id]: 123
};

let clone = Object.assign({}, user);

alert( clone[id] ); // 123
```

That’s by design. The idea is that when we clone an object or merge objects, we usually want all properties to be copied (including symbols like id).

## Global symbols

As we’ve seen, usually all symbols are different, even if they have the same names. But sometimes we want same-named symbols to be same entities.

For instance, different parts of our application want to access symbol "id" meaning exactly the same property.

To achieve that, there exists a global symbol registry. We can create symbols in it and access them later, and it guarantees that repeated accesses by the same name return exactly the same symbol.

In order to create or read a symbol in the registry, use Symbol.for(key).

That call checks the global registry, and if there’s a symbol described as key, then returns it, otherwise creates a new symbol Symbol(key) and stores it in the registry by the given key.

For instance:

```Javascript
 // read from the global registry
let id = Symbol.for("id"); // if the symbol did not exist, it is created

// read it again
let idAgain = Symbol.for("id");

// the same symbol
alert( id === idAgain ); // true
```