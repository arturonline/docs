# Creating a TypeScript Project

To create a TypeScript project, everything that we need is a `tsconfig.json` file. The presence of this file in a directory denotes that this directory is the root of a TypeScript project. This file, among other things, instructs the compiler on which files to compile, which files to ignore, and what environment to target (e.g. ECMAScript 3).

Example:

## Setting Up a TypeScript Project

In any directory of your choice, create a ts3 directory and make it your current directory:

```shell
mkdir ts3
cd ts3
```

Once ts3 is the current working directory, initialize a Node project with default values:

```shell
npm init -y
```

Next, install core packages that are needed to compile and monitor changes in TypeScript files:

```shell
npm i typescript nodemon ts-node --save-dev
```

A TypeScript project needs a `tsconfig.json` file. This can be done in two ways: using the global tsc command or using npx tsc. I recommend using npx.

The npx command is available in npm >= 5.2 and it lets you create a `tsconfig.json` file as follows:

```shell
npx tsc --init
```

Here, npx executes the local typescript package that has been installed locally.

```shell
tsc --init
```

You will see the following message in the command line once's that done:

```shell
Successfully created a tsconfig.json file.
```

You will also have a `tsconfig.json` file with sensible started defaults enabled.

## TypeScript Configuration

Besides configuring the compiler to target ECMAScript 2015, we will also configure other four characteristics:

- **module**, to instruct TypeScript to use the CommonJS module format.
- **removeComments**, to avoid adding comments in the generated JavaScript files.
- **sourceMap**, to help us debugging the code generated.
- **outDir**, to define where the compiled code will reside.

We will also tell the compiler to process files under *./src*, a directory that we will create to add our TypeScript source code. To perform these configurations, let's open the `tsconfig.json` file and add the following content to it:

```typescript
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2015",
    "removeComments": true,
    "outDir": "./bin"
  },
  "include": ["src/**/*"]
}
```

## Compiling, Running, and Watching TypeScript

This can be done through nodemon and ts-node:

- **nodemon**: It's a tool that monitors for any changes in a Node application directory and automatically restarts the server.
- **ts-node**: It's a TypeScript execution and REPL for Node, with source map support.

The executables of these two packages need to be run together through an npm script. In your code editor or IDE, update the package.json as follows:

```typescript
{
  // ...
  "scripts": {
    "watch": "nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/index.ts"
  }
  // ...
}
```

The watch script is doing a lot of hard work:

```typescript
nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/index.ts
```

The nodemon executable takes a `--watch` argument. The `--watch` option is followed by a string that specifies the directories that need to be watched and follows the glob pattern.

Next, the `--exec` option is passed. The `--exec` option is used to run non-node scripts. nodemon will read the file extension of the script being run and monitor that extension instead of .js. In this case, `--exec` runs ts-node.

ts-node executes any passed TypeScript files as node + tsc. In this case, it receives and executes `src/index.ts`.

In some other setups, two different shells may be used: One to compile and watch the TypeScript files and another one to run resultant JavaScript file through node or nodemon.

Finally, create a src folder under the project directory, ts3, and create `index.ts` within it.

## Running a TypeScript Project

With all dependencies installed and scripts set up, you are ready to run the project. Execute the following command in the shell:

```typescript
npm run watch
```

Messages about nodemon will come up. Since `index.ts` is empty as of now, there's no other output in the shell.

You are all set up! Now join me in exploring what new features come with TypeScript 3.