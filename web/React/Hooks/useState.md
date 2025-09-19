# useState Hook

Lets a component hold and update state values. Returns a state variable and a function to update it.

```js
const [state, setState] = useState(initialValue);
```

- **state** is the current value.
- **setState** is the function used to update the value.
- **initialValue** is the value that state has on the first render.

## Characteristics

Can be used multiple times to create multiple independent pieces of state.

Accepts any type as initial value: string, number, object, array, etc.

Only the current component is re-rendered when its state changes.

The state persists between renders. It is not reset unless the component is remounted.



## Example

```js
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```

When the button is clicked, setCount updates the value of count, and the component re-renders showing the new count.

