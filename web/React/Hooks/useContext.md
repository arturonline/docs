# Context

Context is designed to share data that can be considered “global” for a tree of React components, such as the current authenticated user, theme, or preferred language without having to use props.

## Example

### #1. Create a context

We do this with a call to `React.createContext()`, this will return a `Context object` that exposes a `Provider Component` as well as a `Consumer Component`

```jsx
// ThemeContext.js
import React, { createContext, Component } from "react";

export const ThemeContext = createContext();
```

### #2. Declare a Provider

Every Context object should come with a *Provider React component* that allows consuming components to subscribe to context changes.

To declare a provider:

```jsx
<MyContext.Provider value={/* some value */}>
```

Example:

```jsx
// ThemeContext.js
import React, { createContext, Component } from "react";

export const ThemeContext = createContext();

class ThemeContextProvider extends Component {
  state = {
    isLightTheme: true,
    light: { syntax: "#555", ui: "#ddd", bg: "#eee" },
    dark: { syntax: "#ddd", ui: "#333", bg: "#555" }
  };
  toggleTheme = () => {
    this.setState({ isLightTheme: !this.state.isLightTheme });
  };
  render() {
    return (
      <ThemeContext.Provider value={{ ...this.state, toggleTheme: this.toggleTheme }}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

export default ThemeContextProvider;
```

### #3. declare a consumer

A Consumer is a React component that subscribes to context changes. Requires a function as a child. The function receives the current context value and returns a React node.

Syntax:

```jsx
<MyContext.Consumer>
  {value => /* render something based on the context value */}
</MyContext.Consumer>
```

Example:

```jsx
// Booklist.js
import React from "react";
import { ThemeContext } from "../contexts/ThemeContext";

const Booklist = () => {
  return (
    <ThemeContext.Consumer>
      {context => {
        const { isLightTheme, light, dark } = context;
        const theme = isLightTheme ? light : dark;

        return (
          <div
            className="book-list"
            style={{ color: theme.syntax, background: theme.bg }}
          >
            <ul>
              <li style={{ background: theme.ui }}>The uay of kings</li>
              <li style={{ background: theme.ui }}>The name of the uind</li>
              <li style={{ background: theme.ui }}>The lord of the rings</li>
            </ul>
          </div>
        );
      }}
    </ThemeContext.Consumer>
  );
};

export default Booklist;
```

### #4 Wrapping

All consumers that are descendants of a Provider will re-render whenever the Provider’s value prop changes.

```jsx
// App.js
import React from 'react';
import Navbar from './components/Navbar';
import Booklist from './components/Booklist';
import ThemeContextProvider from './contexts/ThemeContext';
import AuthContextProvider from './contexts/AuthContext';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <div className="App">
      <ThemeContextProvider>
        <Booklist />
      </ThemeContextProvider>

    </div>
  );
}

export default App;
```

## #5. useContext

We can consume contexts with the `useContext` hook.

```jsx
// Context
import React from 'react';

export const UserContext = React.createContext();

export default function App() {
  return (
    <UserContext.Provider value="Reed">
      <User />
    </UserContext.Provider>
  )
}
```

```jsx
// user.js
function User() {
  const value = React.useContext(UserContext);  
    
  return <h1>{value}</h1>;
}
```

```jsx
// app.js
import React from 'react';

export const UserContext = React.createContext();

export default function App() {
  return (
    <UserContext.Provider value="Reed">
      <User />
    </UserContext.Provider>
  )
}
```