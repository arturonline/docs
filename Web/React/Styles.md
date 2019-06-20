# Styles

Using the style attribute as the primary means of styling elements is generally not recommended. In most cases, `className` should be used to reference classes defined in an external CSS stylesheet. style is most often used in React applications to add dynamically-computed styles at render time.

## #1. Inline Styles

- React lets you add CSS inline, written as attributes and passed to elements directly:

  ```jsx
  style={{color: 'pink'}}
  ```

  The style attribute accepts a JavaScript object with camelCased properties rather than a CSS string.

- An alternative that’s often nicer is to store a style object in a variable, and then inject that variable into JSX.

  ```jsx
  // and then injected on line 11.
  import React from "react";

  // style object:
  const styles = {
    color: "darkcyan",
    background: "mintcream"
  };

  export class StyledClass extends React.Component {
    render() {
      return (
        // Injecte styled variable
        <h1 style={styles}>Hello world</h1>
      );
    }
  }
  ```

  Defining a variable named style in the top-level scope would be an extremely bad idea in many JavaScript environments! In React, however, it’s totally fine because every file is invisible to every other file, except for what you choose to expose via `module.exports`.

### Style Name Syntax

In regular JavaScript, style names are written in hyphenated-lowercase:

```jsx
//css example
const styles = {
  "margin-top": "20px",
  "background-color": "green"
};
```

In React, those same names are instead written in camelCase:

```jsx
// react css
const styles = {
  marginTop: "20px",
  backgroundColor: "green"
};
```

This has zero effect on style property values, only on style property names.

### Style value syntax

React will automatically append a “px” suffix to certain numeric inline style properties. If you want to use units other than “px”, specify the value as a string with the desired unit.

```css
 {
  font-size: "30px";
}
```

```jsx
// react:
{
  fontSize: 30;
}
```

Specifying “px” with a string will still work, although it’s redundant.

## #2. Share Styles Across Multiple Components

What if you want to reuse styles for several different components?

One way to make styles reusable is to keep them in a separate JavaScript file. This file should export the styles that you want to reuse, via export. You can then import your styles into any component that wants them.

Example:

```jsx
// styles.js
const fontFamily = "Comic Sans MS, Lucida Handwriting, cursive";
const background =
  'pink url("https://media.giphy.com/media/oyr89uTOBNVbG/giphy.gif") fixed';
const fontSize = "4em";
const padding = "45px 0";
const color = "green";
```

```jsx
// Component.js
import React from "react";
import ReactDOM from "react-dom";
import { colorStyles } from "./facebookStyles";

let divStyle = {
  backgroundColor: styles.darkBlue,
  color: styles.white
};

export class Wow extends React.Component {
  render() {
    return <div style={divStyle}>Wow, I stole these colors from Facebook!</div>;
  }
}

ReactDOM.render(<Wow />, document.getElementById("app"));
```

## #3 External CSS Stylesheet

Writing styles in an external CSS file and importing them in your components is another approach used in React, through which we can create a separate stylesheet for each component.

```css
.roundedButton {
  color: #fff;
  background-color: rgb(225, 0, 80);
  border-radius: 10px;
  padding: 10px 20px;
  border: 0;
  cursor: pointer;
}

.roundedButton:hover {
  background-color: rgb(181, 2, 66);
}
```

```jsx
import React from "react";
import "./RoundedButton.css";

const RoundedButton = props => (
  <button className="roundedButton">{props.children}</button>
);

export default RoundedButton;
```
