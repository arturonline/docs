# Async / await

The word `async` before a function means one simple thing: a function always returns a promise.

The keyword `await` makes JavaScript wait until that promise settles and returns its result.

If a promise resolves normally, then await promise returns the result. But in case of a rejection it throws the error, just if there were a throw statement at that line.

This code:

```Javascript
async function f() {
  await Promise.reject(new Error("Whoops!"));
}
```

…Is the same as this:

```Javascript
async function f() {
  throw new Error("Whoops!");
}
```

In real situations the promise may take some time before it rejects. So await will wait, and then throw an error.

We can catch that error using try..catch, the same way as a regular throw:

```Javascript
async function f() {

  try {
    let response = await fetch('http://no-such-url');
  } catch(err) {
    alert(err); // TypeError: failed to fetch
  }
}

f();
```

In case of an error, the control jumps to the catch block. We can also wrap multiple lines:

```Javascript
 async function f() {

  try {
    let response = await fetch('/no-user-here');
    let user = await response.json();
  } catch(err) {
    // catches errors both in fetch and response.json
    alert(err);
  }
}

f();
```
