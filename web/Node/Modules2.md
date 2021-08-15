# Modules

## CommonJS Modules

Imports:

```js
const module = require('module_name');
const local_module = require('./Log.js');
```

Exports:

- Literals

    ```js
    // Message.js
    var myLogModule = require('./Log.js');

    //app.js
    const msg = require('./Message.js');
    ```

- Objects

    ```js
    // data.js
    module.exports = {
        firstName: 'James',
        lastName: 'Bond'
    }

    //app.js
    const person = require('./data.js');
    console.log(person.firstName + " " + person.lastName);
    ```