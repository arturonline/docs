# Lambdas

## Reduce

The `reduce()` function combines all of the values in an array into one value. It takes a `starting value` and a `closure` that dictates how to combine the items.

```Swift
let numbers = [8, 6, 7, 5, 3, 0, 9]
var total = 0

// Bucle for
for number in numbers {
    total = total + number
}

// Reduce
return lista.reduce(0, { $0 + $1.weight })
```