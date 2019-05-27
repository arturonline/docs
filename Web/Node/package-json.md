# The package.json file

The package.json file is kind of a manifest for your project. It can do a lot of things, completely unrelated.

## Properties

- **name** sets the application/package name
- **version** indicates the current version
- **description** is a brief description of the app/package
- **main** set the entry point for the application
- **private** if set to true prevents the app/package to be accidentally published on npm
- **scripts** defines a set of node scripts you can run
- **dependencies** sets a list of npm packages installed as dependencies
- **devDependencies** sets a list of npm packages installed as development dependencies
- **engines** sets which versions of Node this package/app works on
- **browserslist** is used to tell which browsers (and their versions) you want to support

All those properties are used by either npm or other tools that we can use.

Example:

```json
{
  "name": "test-project",
  "version": "1.0.0",
  "description": "A Vue.js project",
  "main": "src/main.js",
  "private": true,
  "scripts": {
    "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
    "start": "npm run dev",
    "unit": "jest --config test/unit/jest.conf.js --coverage",
    "test": "npm run unit",
    "lint": "eslint --ext .js,.vue src test/unit",
    "build": "node build/build.js"
  },
  "dependencies": {
    "vue": "^2.5.2"
  },
  "devDependencies": {
    "babel-core": "^6.22.1",
    "babel-preset-env": "^1.3.2",

  },
  "engines": {
    "node": ">= 6.0.0",
    "npm": ">= 3.0.0"
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ]
}
```