# Context

Here's a basic example of creating a context containing the active theme.

```ts
import { createContext } from "react";

type ThemeContextType = "light" | "dark";

const ThemeContext = createContext<ThemeContextType>("light");
```

Wrap the components that need the context with a context provider:

```ts
import { useState } from "react";

const App = () => {
  const [theme, setTheme] = useState<ThemeContextType>("light");

  return (
    <ThemeContext.Provider value={theme}>
      <MyComponent />
    </ThemeContext.Provider>
  );
};
```

Call useContext to read and subscribe to the context.

```ts
import { useContext } from "react";

const MyComponent = () => {
  const theme = useContext(ThemeContext);

  return <p>The current theme is {theme}.</p>;
};
```