# Functions

## Arrow Function

```Javascript
function double(x) { return x * 2; } // Traditional way
console.log(double(2)) // 4
```

```Javascript
const double = x => x * 2; // Same function written as an arrow function with implicit return
console.log(double(2)) // 4
```

When there is no argument provided to an arrow function, you need to provide parentheses, or it won't be valid syntax.

```Javascript
() => { // parentheses are provided, everything is fine
  const x = 2;
  return x;
}
```

```Javascript
=> { // No parentheses, this won't work!
  const x = 2;
  return x;
}
```
