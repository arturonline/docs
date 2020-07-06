# Babel

## Introduction

Babel is a **compiler**: it takes code written in one standard, and it transpiles it to code written into another standard.

## Plugins

Now, out of the box Babel doesn't do anything. It basically acts like `const babel = code => code`; by parsing the code and then generating the same code back out again. You will need to add **plugins** for Babel to do anything.

Example, to use arrow functions in every browser you can install this plugin:

```node
npm install --save-dev @babel/plugin-transform-es2015-arrow-functions
```

then we need to add to the `.babelrc file` this:

```json
{
  "plugins": ["transform-es2015-arrow-functions"]
}
```

Running `babel script.js` will convert all arrow functions to ES5 Functions.

## Presets

In Babel, a **preset** is a set of plugins used to support particular language features. You can assemble your own set of plugins in a preset or you can enable a set of official common presets:

- `@babel/preset-env`
- `@babel/preset-flow`
- `@babel/preset-react`
- `@babel/preset-typescript`

## Snippet

For future reference, here is a list of the steps needed to set up a project for transpilation:

1. Initialize your project using npm init and create a directory called **src**
2. Install babel locally by running:

    ```node
    npm install --save-dev @babel/core @babel/cli
    npm install --save-dev @babel/preset-env
    ```

3. Create a `.babelrc` file inside your project and add the following preset inside it:

    ```json
    {
    "presets": ["env"]
    }
    ```

4. Add the following script to your scripts object in `package.json`:

    ```node
    "build": "babel src -d lib"
    ```

5. Run `npm run build` whenever you want to transpile your code from your **src** to **lib** directories.