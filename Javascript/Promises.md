# Promises

JavaScript is single threaded, meaning that two bits of script cannot run at the same time; they have to run one after another.

The `Promise object` represents the eventual completion (or failure) of an asynchronous operation, and its resulting value.

We start by instantiating a new Promise object and passing it a callback function. The callback takes two arguments, `resolve` and `reject`, which are both functions. All your asynchronous code goes inside that callback. If everything is successful, the promise is fulfilled by calling `resolve()`. In case of an error, `reject()` is called with an Error object. This indicates that the promise is rejected.

## Syntax

```Javascript
new Promise(/* executor */ function(resolve, reject) {...});
```

When the result is succesful, call `resolve(you_succes_value)`, if the result fails, call `reject(your_fail_value)` in your promise.

Here's how you create a promise:

```Javascript
var promise = new Promise(function(resolve, reject) {
  // do a thing, possibly async, then…

  if (/* everything turned out fine */) {
    resolve("Stuff worked!");
  }
  else {
    reject(Error("It broke"));
  }
});
```

Here's how you use that promise:

```Javascript
promise.then(function(result) {
  console.log(result); // "Stuff worked!"
}, function(err) {
  console.log(err); // Error: "It broke"
});
```

The `then()` method returns a Promise. It takes up to two arguments: callback functions for the success and failure cases of the Promise.
then() takes two arguments, a callback for a `success` case, and another for the `failure case`. Both are optional.

```Javascript
p.then(onFulfilled[, onRejected]);

p.then(function(value) {
  // fulfillment
}, function(reason) {
  // rejection
});
```

+ `onFulfilled` is a Function called if the Promise is fulfilled. This function has one argument, the fulfillment value.
+ `onRejected` (Optional) a Function called if the Promise is rejected. This function has one argument, the rejection reason.