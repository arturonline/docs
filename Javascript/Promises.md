# Promises

JavaScript is single threaded, meaning that two bits of script cannot run at the same time; they have to run one after another.

The `Promise object` represents the eventual completion (or failure) of an asynchronous operation. It is a placeholder into which the successful result value or reason for failure will materialize.

```Javascript
var promise = new Promise(function(resolve, reject) {
  // do a thing, possibly async, then…

  if (/* everything turned out fine */) {
    resolve("Stuff worked!"); // invoque a resolve function created by you
  }
  else {
    reject(Error("It broke")); // invoque a reject function created by you
  }
});
```

Observe that the constructor accepts a function with two parameters. The parameters conventionally named `resolve` and `reject` are functions themselves and are used to send back values.

When the computation is successful or the future value is ready, we send the value back using the first function, in our case the `resolve()`.

If the computation fails or encounters an error, we signal that by passing the error object in the second function, the `reject()`. reject accepts any value. However, it is recommended to pass an Error object since it helps in debugging by viewing the stacktrace.

Example:

```Javascript
function resolve(result) {
  console.log("It succeeded with " + result);
}

function reject(error) {
  console.log("It failed with " + error);
}

var doSomethingOldStyle = new Promise(function(resolve, reject) {
  console.log("It is done.");
  // Succeed half of the time.
  if (Math.random() > .5) {
    resolve("SUCCESS")
  } else {
    reject("FAILURE")
  }
});

doSomethingOldStyle(resolve, reject);
```

## Chaining

A common need is to execute two or more asynchronous operations back to back, where each subsequent operation starts when the previous operation succeeds, with the result from the previous step. We accomplish this by creating a promise chain.

For than we use the `then()` function. `then()` takes two arguments, a callback for a success case, and another for the failure case. Both are optional, so you can add a callback for the success or failure case only.

Example:

```Javascript
promise.then(function(result) {
  console.log(result); // "Stuff worked!"
}, function(err) {
  console.log(err); // Error: "It broke"
});
```

Example:

```Javascript
const myPromise = new Promise((resolve, reject) => {
    if (Math.random() * 100 < 90) {
        console.log('resolving the promise ...');
        resolve('Hello, Promises!');
    }
    reject(new Error('In 10% of the cases, I fail. Miserably.'));
});

// we create two functions
const onResolved = (resolvedValue) => console.log(resolvedValue);
const onRejected = (error) => console.log(error);

// and we use them as parameters
myPromise.then(onResolved, onRejected);

// Same as above, written concisely
myPromise.then((resolvedValue) => {
    console.log(resolvedValue);
}, (error) => {
    console.log(error);
});

// Output (in 90% of the cases)

// resolving the promise ...
// Hello, Promises!
// Hello, Promises!
```

Once the promise reaches a final state, the state won’t change (that is, the computation will not be done again ) even if you attach .thenhandler multiple times.

## Errors: Catching Promises

When an error occurs, the second callback of .then(), that is, onRejected is executed.

```Javascript
const myProimse = new Promise((resolve, reject) => {
  if (Math.random() * 100 < 90) {
    reject(new Error('The promise was rejected by using reject function.'));
  }
  throw new Error('The promise was rejected by throwing an error');
});

myProimse.then(
  () => console.log('resolved'),
  (error) => console.log(error.message)
);

// Output (in 90% of cases)

// The promise was rejected by using reject function.
```

Since error handling is a necessity for robust programs, a shortcut is given for such a case. Instead of writing `.then(null, () => {...})` when we want to handle an error, we can use `.catch(onRejected)` which accepts one callback: `onRejected:`

```Javascript
myProimse.catch(
  (error) => console.log(error.message)
);
```

Remember that `.catch` is just a syntactical sugar for `.then(undefined, onRejected)`.

## Chaining Promises

.then() and .catch() methods always return a promise. So you can chain multiple .then calls together.

```Javascript
const delay = (ms) => new Promise(
  (resolve) => setTimeout(resolve, ms)
);
```

In this example, we are using a function to wrap our promise so that it does not execute immediately. The delay function accepts the time in milliseconds as a parameter. The executor function has access to the ms parameter due to closure.

```Javascript
delay(5000).then(() => console.log('Resolved after 5 seconds'));
```

The statements in the .then callback will run only after delay(5000)resolves. When you run the above code, you’ll see Resolved after 5 secondsprinted five seconds later.

Here’s how we can chain multiple .then() calls:

```Javascript
const delay = (ms) => new Promise(
  (resolve) => setTimeout(resolve, ms)
);

delay(2000)
  .then(() => {
    console.log('Resolved after 2 seconds')
    return delay(1500);
  })
  .then(() => {
    console.log('Resolved after 1.5 seconds');
    return delay(3000);
  }).then(() => {
    console.log('Resolved after 3 seconds');
    throw new Error();
  }).catch(() => {
    console.log('Caught an error.');
  }).then(() => {
    console.log('Done.');
  });

// Resolved after 2 seconds
// Resolved after 1.5 seconds
// Resolved after 3 seconds
// Caught an error.
// Done.
```

We begin at line 5. The steps undertaken are —

* The delay(2000) function returns a promise that gets resolved after two seconds.
* The first .then() executes. It logs a sentence Resolved after 2 seconds. Then, it return another promise by calling delay(1500). If a .then()returns a promise, the resolution (technically called settlement) of the that promise is forwarded to next .then call.
* This continues as long as the chain is.

Also note line 15. We are throwing an error in the .then. That means the current promise is rejected, and is caught in the next .catch handler.Hence, Caught an error gets printed. However, a .catch itself is alwaysresolved as a promise, and not rejected (unless you intentionally throw an error). That’s why the .then following .catch is executed.

It is recommended to use .catch and not .then with both onResolved and onRejected parameters. Here’s a case explaining why —

```Javascript
const promiseThatResolves = () => new Promise((resolve, reject) => {
  resolve();
});

// Leads to UnhandledPromiseRejection
promiseThatResolves().then(
  () => { throw new Error },
  (err) => console.log(err),
);

// Proper error handling
promiseThatResolves()
  .then(() => {
    throw new Error();
  })
  .catch(err => console.log(err));
```

Line 1 creates a promise that always resolves. When you have a .then with two callbacks, onResolved and onRejected, you can only handle errors and rejections of the executor function. Suppose that the handler in .then also throws an error. It won’t lead to the execution of onRejected callback as shown on lines 6–9.

But if you have a .catch a level below the .then, then the .catch catches errors of executor function and the errors of .then handler too. It makes sense because .then always returns a promise. It is shown on line 12–16.

to continues: https://codeburst.io/a-simple-guide-to-es6-promises-d71bacd2e13a