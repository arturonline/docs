# Introduction to CSS

https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics

## Anatomy

!["Anatomy"](resources/css-declaration.png)

```CSS
p {
  color: red;
  width: 500px;
  border: 1px solid black;
}
```

Note the other important parts of the syntax:

- Each rule set (apart from the selector) must be wrapped in curly braces **{}**.
- Within each declaration, you must use a colon **:** to separate the property from its values.
- Within each rule set, you must use a semicolon **;** to separate each declaration from the next one.

## Selecting multiple elements

```CSS
p, li, h1 {
    color: red;
}
```

## Selectors

| Name          | selector    | selection                  |
| ------------- |-------------|----------------------------|
| element       | p           | `<p>`                      |
| ID            | `#my-id`    | `<p id="my-id">`           |
| Class         | `.my-class` | `<p class="my-class">`     | 
| Attribute     | `img[src]`  | `<img src="image.png">`    | 
| Pseudo-class  | `a:hover`   | `<a>` (when mouse is hover)|

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