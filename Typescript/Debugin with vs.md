# Debugin TS with VS Code

## Project distribution

```
|-- .vscode
    |----- launch.json
|-- bin
    |----- app.js
    |----- app.js.map
|-- src
    |----- app.ts
|-- node_modules
    |-- [..]
|-- tsconfig.json
|-- [...]
```

## TSConfig.json

The presence of a tsconfig.json file in a directory indicates that the directory is the root of a TypeScript project. The tsconfig.json file specifies the root files and the compiler options required to compile the project.

```Javascript
{
  "compilerOptions": {
      "target": "ES6",
      "outDir": "bin",
      "rootDir": "src",
      "sourceMap": true
  },
  "exclude": [
    "node_modules"
  ]
}
```

To compile, `cntrl + shift + B`

## Launch.json

```javascript
{
  "version": "0.2.0",
  "configurations": [{
          "type": "node",
          "request": "launch",
          "name": "Launch",
          "sourceMaps": true,
          "stopOnEntry": true,
          "console": "internalConsole",
          "cwd": "${workspaceRoot}",
          "program": "${workspaceRoot}/src/app.ts",
          "outFiles": ["${workspaceRoot}/bin/*.js"]
      },
      {
          "type": "node",
          "request": "attach",
          "name": "Attach to Process",
          "port": 5858,
          "outFiles": []
      }
  ]
}
```
