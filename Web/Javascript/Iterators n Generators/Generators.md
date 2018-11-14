# Generators

## Definition

Normally, once a function starts running, it will always run to completion before any other JS code can run.

ES6 generators are functions that may be paused many times, and resumed later, allowing other code to run during these paused periods.

## Syntax

Generator functions are written using the `function*` syntax:

```Javascript
// Declaration:
function* generator(i) {
  yield i;
  yield i + 10;
}
```

## Generator object

When called initially, a generator function do not execute any of their code, instead it returns a type of iterator called a `Generator`. This Generator object needs to be assigned to a variable to keep track of the subsequent `next()` methods called on itself.

```Javascript
// initially called: creates a Generator
var gen = generator(10);

console.log(gen.next().value); // output: 10
console.log(gen.next().value); // output: 20
```

## Yield statement

Generator functions are able to freeze and save its context after each call using the keyword `yield` as a stopping point. Each execution cycle is triggered by means of `next()` method on the generator.

## for .. of

ES6 also embraces this iterator pattern at the syntactic level, by providing direct support for running iterators to completion: the `for..of` loop.