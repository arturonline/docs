# Func component state: Hooks

Hooks are functions that let you *“hook into”* React state and lifecycle features from function components. Hooks don’t work inside classes — they let you use React without classes.

```jsx
import React from 'react';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <h1>Hello, World!</h1>
    </div>
  );
}

export default App;
```

Adding state:

```jsx
import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [name, setName] = useState('World');
  return (
    <div className="App">
      <h1>Hello, {name}!</h1>
      <button onClick={() => setName('James')}>
        Click me to change the name
      </button>
    </div>
  );
}

export default App;
```

How it works:

- Importing the `useState` hook from React.
- Creating a new constant that returns a pair of objects: *name* and *setName* from *useState*.
- Initializing the *useState* hook with a value of *‘World’*.
- Using the *‘name’* state property by inserting it after *‘Hello’*, `{name}`.
- Adding a button with an `onClick` handler that calls the `setName` function of useState with the value, *‘James’*.

## Using the Effect Hook

If you’ve written React class components before, you should be familiar with lifecycle methods like `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`. The `useEffect` Hook is all three of these lifecycle methods combined.

`useEffect` is run once when the component finishes loading for the first time, and then every time the component state is updated.

```jsx
...

const App = () => {
  const [name, setName] = useState('World');

  useEffect(() => {
    document.title = `Hello, ${name}`;
  });

  return (
    <div className="App">
      <h1>Hello, {name}!</h1>
      <button onClick={() => setName('James')}>
        Click me to change the name
      </button>
    </div>
  );
}

...
```

Everytime the button clicks the state is modified and the `useEffect` method runs.
