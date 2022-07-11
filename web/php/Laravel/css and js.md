# css and js

## CSS

We have the file '`resources/css/app.css`', or '`resources/sass/app.scss`' (depending on the version of Laravel we use), where we can define our own CSS styles

## JS

We have the file '`resources/js/app.js`' to include our own functions in JavaScript, or even external
functionalities (through jQuery, for example).

## Automatic generation of CSS and JavaScript

These two files need to be processed with '`webpack.mix.js`', which uses the **WebPack** tool to compile, package and minimize these CSS and JavaScript result files. This tool needs to be installed with `'npm install`’. And to generate the files we use `npm run dev`.