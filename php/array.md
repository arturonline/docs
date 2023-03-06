# php arrays

Arrays in PHP consist of key-value pairs.

There are three types of arrays that you can create. These are:

- **Indexed** — An array with a numeric key.
- **Associative** — An array where each key has its own specific value.
- **Multidimensional** — An array containing one or more arrays within itself.

## Indexed

```php
$colors = array();

$colors = array("Red", "Green", "Blue");
$colors = ["Red", "Green", "Blue"];
```

## Associative

```php
$ages = array("Peter"=>22, "Clark"=>32, "John"=>28);
```

## Looping

```php
$numbers = array( 1, 2, 3, 4, 5);

foreach( $numbers as $value ) {
    echo "Value is $value <br />";
}

foreach( $numbers as $key => $value ) {
    echo "key is $key and value is $value <br />";
}
```

## Working with keys and Values

- `array_combine()`, which creates an array using one array for keys and another for its values:

```php
$keys = ['sky', 'grass', 'orange'];
$values = ['blue', 'green', 'orange'];

$array = array_combine($keys, $values);
print_r($array);

// Array
// (
//     [sky] => blue
//     [grass] => green
//     [orange] => orange
// )
```

- `array_values()` function returns an indexed array of values
- `array_keys()` returns an array of keys of a given array
- `array_flip()` exchanges keys with values:

```php
print_r(array_keys($array)); // ['sky', 'grass', 'orange']
print_r(array_values($array)); // ['blue', 'green', 'orange']
print_r(array_flip($array));

// Array
// (
//     [blue] => sky
//     [green] => grass
//     [orange] => orange
// )
```

## Multidimensional

```php
// Define a multidimensional array
$contacts = array(
    array(
        "name" => "Peter Parker",
        "email" => "peterparker@mail.com",
    ),
    array(
        "name" => "Clark Kent",
        "email" => "clarkkent@mail.com",
    ),
    array(
        "name" => "Harry Potter",
        "email" => "harrypotter@mail.com",
    )
);
// Access nested value
echo "Peter Parker's Email-id is: " . $contacts[0]["email"];
```

## Methods

- `print_r`

```php
$cities = array("London", "Paris", "New York");
print_r($cities);

// Array ( [0] => London [1] => Paris [2] => New York )
```

- `count()`

```php
$cars = array("Volvo", "BMW", "Toyota");
echo count($cars);
```

- `array_count_values()`: to count all the values of an array:

```php
$things = ['apple', 'apple', 'banana', 'tree', 'tree', 'tree'];
$values = array_count_values($things);

print_r($values);

// Array
// (
//     [apple] => 2
//     [banana] => 1
//     [tree] => 3
// )
```

- `array_merge()`

```php
$array1 = ['a' => 'a', 'b' => 'b', 'c' => 'c'];
$array2 = ['a' => 'A', 'b' => 'B', 'D' => 'D'];

$merge = array_merge($array1, $array2);
print_r($merge);
// Array
// (
//     [a] => A
//     [b] => B
//     [c] => c
//     [D] => D
// )
```

- `array_slice()`

```php
$numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
$top = array_slice($numbers, 0, 3);
print_r($top); // [1, 2, 3]
```

- `array_diff()` :remove array values from another array.

```php
$array1 = [1, 2, 3, 4];
$array2 = [3, 4, 5, 6];

$diff = array_diff($array1, $array2);
print_r($diff); // [0 => 1, 1 => 2]
```

- `array_intersect()` : To get values which are present in given arrays.

```php
$array1 = [1, 2, 3, 4];
$array2 = [3, 4, 5, 6];

$intersect = array_intersect($array1, $array2);
print_r($intersect);  // [2 => 3, 3 => 4]
```

- `array_sum()` to get a sum of array values, `array_product()` to multiply them, or create your own formula with `array_reduce()`:

```php
$numbers = [1, 2, 3, 4, 5];

echo(array_sum($numbers)); // 15
echo(array_product($numbers)); // 120

echo(array_reduce($numbers, function($carry, $item) {
    return $carry ? $carry / $item : 1;
})); // 0.0083 = 1/2/3/4/5
```

🔗 [More methods](https://www.w3schools.com/php/php_ref_array.asp)

## Filtering

### `array_filter()`

Pass the array as the first param and an anonymous function as the second param. Return true in a callback function if you want to leave this element in the array, and false if you don't:

```php
$numbers = [20, -3, 50, -99, 55];

$positive = array_filter($numbers, function($number) {
    return $number > 0;
});

print_r($positive); // [0 => 20, 2 => 50, 4 => 55]
````

Also, you can call `array_filter()` without a callback to remove all empty values:

```php
$numbers = [-1, 0, 1];
$not_empty = array_filter($numbers);

print_r($not_empty); // [0 => -1, 2 => 1];
```

### `array_map()`

Using `array_map()`, you can apply a callback to every element of an array. You can pass a function name or anonymous function to get a new array based on the given array:

```php
$cities = ['Berlin', 'KYIV', 'Amsterdam', 'Riga'];
$aliases = array_map('strtolower', $cities);

print_r($aliases); // ['berlin', 'kyiv, 'amsterdam', 'riga']

$numbers = [1, -2, 3, -4, 5];
$squares = array_map(function($number) {
    return $number ** 2;
}, $numbers);

print_r($squares);  // [1, 4, 9, 16, 25]
```

⚠️ [More info](https://code.tutsplus.com/tutorials/working-with-php-arrays-in-the-right-way--cms-28606)