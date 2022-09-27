# useContext

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