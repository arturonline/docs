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

## Three Ways to Insert CSS

There are three ways of inserting a style sheet:

### 1. External style sheet

Each page must include a reference to the external style sheet file inside the `<link>` element. The `<link>` element goes inside the `<head>` section:

Example:

```html
<head>
<link rel="stylesheet" type="text/css" href="mystyle.css">
</head>
```

### 2. Internal style sheet

Internal styles are defined within the `<style>` element, inside the `<head>` section of an HTML page:

Example

```html
<head>
<style>
body {
    background-color: linen;
}

h1 {
    color: maroon;
    margin-left: 40px;
}
</style>
</head>
```

### 3. Inline style

An inline style may be used to apply a unique style for a single element:

```html
<h1 style="color:blue;margin-left:30px;">This is a heading</h1>
```

## Selecting multiple elements

```CSS
p, li, h1 {
    color: red;
}
```