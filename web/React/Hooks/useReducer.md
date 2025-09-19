# useReducer Hook

The useReducer hook is an alternative to useState for managing more complex state or state transitions, especially when state depends on previous values or multiple related state variables must be grouped together.

```js
const [state, dispatch] = useReducer(reducer, initialState);
``` 

- **state** is the current state value.
- **dispatch** is a function used to send actions to the reducer to update the state.
- **reducer** is a function that specifies how the state changes in response to actions. It follows the signature:

    ```js
    function reducer(state, action) {
    // return newState
    }
    ```

- **initialState** is the state value for the initial render.

## Example

```js
import React, { useReducer } from 'react';

const counterReducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>Decrement</button>
    </div>
  );
}
```

- The reducer function processes actions and returns a new state.

- dispatch triggers state changes by specifying action objects (typically with a type and possibly other properties).

## When to Use useReducer

- When you need to manage multiple values that are related or state transitions that depend on previous state.

- When state logic is complex or will be shared and reused across components.

- For organizing state updates, especially with many different types of actions.

- This hook is especially useful for scenarios similar to Redux patterns, but works entirely within the local component context.

