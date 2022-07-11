# css and js

## CSS

We have the file '`resources/css/app.css`', or '`resources/sass/app.scss`' (depending on the version of Laravel we use), where we can define our own CSS styles

## JS

We have the file '`resources/js/app.js`' to include our own functions in JavaScript, or even external functionalities (through jQuery, for example).

## to reference public files

```php
{{ url }}/css/app.css
{{ url }}/js/app.js
```

## Automatic generation of CSS and JavaScript

These two files need to be processed with `npm run dev`.