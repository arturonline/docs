'use strict'
var readline = require('readline-sync');

// let name = readline.question("What is your name? ");
// let up = readline.questionInt("Up number? ")
// console.log("Hi " + name + ", nice to meet you.");

function getNumbers() {
    let sum = 0
    let numbersCount = 0
    let evenCount = 0
    let oddCount = 0

    console.log('Type a number: ')
    while (true) {
        let input = Number(readline.prompt());
        if (input == -1) {
            console.log('Thank you and see you later!')
            break;
        }
        if (input % 2 == 0) {
            evenCount += 1
        } else {
            oddCount += 1
        }
        sum += input
        numbersCount += 1
    }
    console.log('The sum is: ' + sum)
    console.log('Total numbers: ' + numbersCount);
    console.log('Average: ' + sum/numbersCount);
    console.log('Even Numbers: '+ evenCount);
    console.log('Odd Numbers: '+ oddCount);
    
    
}

let res = getNumbers()