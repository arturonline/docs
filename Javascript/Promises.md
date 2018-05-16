# Promises

JavaScript is single threaded, meaning that two bits of script cannot run at the same time; they have to run one after another.

The `Promise object` represents the eventual completion (or failure) of an asynchronous operation, and its resulting value.

```Javascript
new Promise(/* executor */ function(resolve, reject) {...});
```

Observe that the constructor accepts a function with two parameters. This function is called an `executor function` and it describes the computation to be done. The parameters conventionally named `resolve` and `reject` are functions themselves and are used to send back values to the promise object. When the computation is successful or the future value is ready, we send the value back using the resolve function.

If the computation fails or encounters an error, we signal that by passing the error object in the reject function. reject accepts any value. However, it is recommended to pass an Error object since it helps in debugging by viewing the stacktrace.

```Javascript
const myPromise = new Promise((resolve, reject) => {
    if (Math.random() * 100 <= 90) {
        resolve('Hello, Promises!');
    }
    reject(new Error('In 10% of the cases, I fail. Miserably.'));
});
```

## Using promises

All Promise instances have a `.then()` method on them. `.then()` accepts two callbacks. The first callback is invoked when the promise is resolved. The second callback is executed when the promise is rejected.

```Javascript
const myPromise = new Promise((resolve, reject) => {
    if (Math.random() * 100 < 90) {
        console.log('resolving the promise ...');
        resolve('Hello, Promises!');
    }
    reject(new Error('In 10% of the cases, I fail. Miserably.'));
});

// Two functions
const onResolved = (resolvedValue) => console.log(resolvedValue);
const onRejected = (error) => console.log(error);

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