# Async / await

JavaScript is single threaded, meaning that two bits of script cannot run at the same time; they have to run one after another.

Async functions allow you to write promise-based code as if it were synchronous, but without blocking the main thread.

When you `await` a `promise`, the function is paused in a non-blocking way until the promise settles. If the promise fulfills, you get the value back. If the promise rejects, the rejected value is thrown.