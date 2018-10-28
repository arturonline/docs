# Typescript

TypeScript is a super-set of ES6. That means whatever features we have in ES6 are also in TypeScript with some extra features on top, such as static typing and richer syntax.

Browser can’t run TypeScript so we first need to transpile it into JavaScript.

## Installation

We can install typescript via npm

```Typescript
npm install -g typescript
```

## Running

Create a file called `hello.ts`.
We can compile a typescript file into a javascript file by calling:

```Typescript
tsc hello.ts
```

This generates a file called `hello.js` And we can execute that file by using node.

We can watch a typescript file for changes and compile it automatically with:

```Typescript
tsc -w hello.ts
```

We can provide configuration on the command line, like so:

```Typescript
tsc -t ES6 -w hello.ts
```