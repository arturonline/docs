# Iterables

In JavaScript an iterator is an object which defines a sequence and potentially a return value upon its termination. Objects that can be used in `for..of` loop are called iterables.

More specifically an iterator is any object which implements the `Iterator protocol` by having a `next()` method which returns an object with two properties: `value`, the next value in the sequence; and `done`, which is true if the last value in the sequence has already been consumed. If value is present alongside done, it is the iterator's return value.

## How to

To make an object iterable (and thus let `for..of` work) we need to add a method to the object named `Symbol.iterator`.

When `for..of` starts, it calls that method. The method must return an `iterator` – an object with the method `next`.
When `for..of` wants the next value, it calls `next()` on that object.
The result of `next()` must have the form `{done: Boolean, value: any}`, where done=true means that the iteration is finished, otherwise value must be the new value.

Example:

```Javascript
let range = {
  from: 1,
  to: 5
};

// We want the for..of to work:
// for(let num of range) ... num=1,2,3,4,5
```

```Javascript
let range = {
  from: 1,
  to: 5
};

// 1. call to for..of initially calls this
range[Symbol.iterator] = function() {

  // 2. ...it returns the iterator:
  return {
    current: this.from,
    last: this.to,

    // 3. next() is called on each iteration by the for..of loop
    next() {
      // 4. it should return the value as an object {done:.., value :...}
      if (this.current <= this.last) {
        return { done: false, value: this.current++ };
      } else {
        return { done: true };
      }
    }
  };
};

// now it works!
for (let num of range) {
  alert(num); // 1, then 2, 3, 4, 5
}
```

There is an important separation of concerns in this code:

* The range itself does not have the `next()` method.
* Instead, another object, a so-called “iterator” is created by the call to `range[Symbol.iterator]()`, and it handles the iteration.

So, the iterator object is separate from the object it iterates over.