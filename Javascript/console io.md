# Console input & output (with node)

## Option 1

```Javascript
npm install readline-sync
```

```Javascript
let readline = require('readline-sync');

// Read Strings
let name = readline.question("What is your name? ");
console.log("Hi " + name + ", nice to meet you.");

// Read Numbers
let number = readline.questionInt("Which number? ")
console.log('Number is = ' + number)

// Read input until condition
function getNumbers() {
    console.log('Type a number: ')
    while (true) {
        let input = readline.prompt();
        if (input == -1) {
            console.log('Thank you and see you later!')
            break;
        }
    }
}

let res = getNumbers()

```

## Option 2

```Javascript
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('What do you think of Node.js? ', (answer) => {

    console.log(`Thank you for your valuable feedback: ${answer}`);

    rl.close();
  });
```