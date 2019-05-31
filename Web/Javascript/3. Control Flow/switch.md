# The Switch keyword

```javascript
switch (groceryItem) {
  case 'tomato':
    console.log('Tomatoes are $0.49');
    break;
  case 'lime':
    console.log('Limes are $1.49');
    break;
  case 'papaya':
    console.log('Papayas are $1.29');
    break;
  default:
    console.log('Invalid item');
    break;
}

// Prints 'Papayas are $1.29'
```

- The switch keyword initiates the statement and is followed by `( ... )`, which contains the value that each case will compare. In the example, the value or expression of the switch statement is groceryItem.
- Inside the block, `{ ... }`, there are multiple cases. The case keyword checks if the expression matches the specified value that comes after it. The value following the first case is 'tomato'. If the value of groceryItem equalled 'tomato', that case‘s `console.log()` would run.
- The value of groceryItem is 'papaya', so the third case runs— Papayas are $1.29 is logged to the console.
- The `break` keyword tells the computer to exit the block and not execute any more code or check any other cases inside the code block. Note: Without the break keyword at the end of each case, the program would execute the code for all matching cases and the default code as well. This behavior is different from if/else conditional statements which execute only one block of code.
- At the end of each switch statement, there is a `default statement`. If none of the cases are true, then the code in the default statement will run.