# Selectors

https://www.w3schools.com/cssref/css_selectors.asp

| Name         | selector    | selection                   |
| ------------ | ----------- | --------------------------- |
| element      | p           | `<p>`                       |
| ID           | `#my-id`    | `<p id="my-id">`            |
| Class        | `.my-class` | `<p class="my-class">`      |  
| Attribute    | `img[src]`  | `<img src="image.png">`     |  
| Pseudo-class | `a:hover`   | `<a>` (when mouse is hover) |

* The only difference between class and ID is that one ID can be assigned to only one HTML element.

## Fonts and text

```CSS
html {
  font-size: 10px; /* px means 'pixels': the base font size is now 10 pixels high  */
  font-family: /*placeholder: this should be the rest of the output you got from Google fonts */
}

h1 {
  font-size: 60px;
  text-align: center;
}

p, li {
  font-size: 16px;
  line-height: 2;
  letter-spacing: 1px;
}
```