# php arrays

Arrays in PHP are ordered maps: they consist of key-value pairs. Keys are `int` or `string`; values can be anything.

There are three types of arrays that you can create. These are:

- **Indexed** — An array with a numeric key.
- **Associative** — An array where each key has its own specific value.
- **Multidimensional** — An array containing one or more arrays within itself.

> Related: [strings](strings.md) (`explode`/`implode`), [functions](func.md) (callbacks, arrow functions).

## Indexed

```php
$colors = array();                       // empty (old syntax)
$colors = [];                            // empty (short syntax, preferred)

$colors = array("Red", "Green", "Blue");
$colors = ["Red", "Green", "Blue"];

$colors[] = "Yellow";                    // append
echo $colors[0];                         // Output: Red
echo $colors[array_key_last($colors)];   // Output: Yellow
```

## Associative

```php
$ages = ["Peter" => 22, "Clark" => 32, "John" => 28];

$ages["Bruce"] = 40;        // add / update
unset($ages["Clark"]);      // remove

echo $ages["Peter"];                    // Output: 22
echo $ages["Nobody"] ?? 'unknown';      // Output: unknown (no warning)
var_dump(array_key_exists("John", $ages)); // Output: bool(true)
```

> `isset($ages['x'])` returns `false` if the key exists but its value is `null`; `array_key_exists()` doesn't.

## Looping

```php
$numbers = [1, 2, 3, 4, 5];

foreach ($numbers as $value) {
    echo "Value is $value <br />";
}

foreach ($numbers as $key => $value) {
    echo "key is $key and value is $value <br />";
}

// Modify in place: loop by reference and unset the reference afterwards
foreach ($numbers as &$value) {
    $value *= 2;
}
unset($value);
print_r($numbers); // [2, 4, 6, 8, 10]
```

## Destructuring

```php
[$x, , $z] = [1, 2, 3];               // skip elements
['name' => $name] = ['name' => 'Ana']; // by key

$a = 1; $b = 2;
[$a, $b] = [$b, $a];                   // swap

echo "$x $z $name $a$b"; // Output: 1 3 Ana 21

foreach ([[1, 'Ana'], [2, 'Luis']] as [$id, $user]) {
    echo "$id:$user ";
}
// Output: 1:Ana 2:Luis
```

## Spread and union

```php
$a = [1, 2];
$b = [...$a, 3, ...['k' => 4]];   // string keys allowed since PHP 8.1
print_r($b);
// Array ( [0] => 1 [1] => 2 [2] => 3 [k] => 4 )

// `+` keeps the keys of the left array (does NOT overwrite)
print_r(['a' => 'a', 'b' => 'b'] + ['a' => 'A', 'x' => 'X']);
// Array ( [a] => a [b] => b [x] => X )
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
print_r(array_keys($array));   // ['sky', 'grass', 'orange']
print_r(array_values($array)); // ['blue', 'green', 'orange']
print_r(array_flip($array));

// Array
// (
//     [blue] => sky
//     [green] => grass
//     [orange] => orange
// )
```

- `array_key_first()` / `array_key_last()`, `in_array()`, `array_search()`:

```php
$arr = ['x' => 1, 'y' => 2];
echo array_key_first($arr); // Output: x
echo array_key_last($arr);  // Output: y

var_dump(in_array('1', [1, 2, 3], true)); // Output: bool(false) — strict: '1' !== 1
var_dump(array_search(3, [1, 2, 3]));     // Output: int(2) — false if not found
```

> ⚠️ `array_search()` can return `0`: compare with `!== false`.

- `array_is_list()` (PHP 8.1): `true` if keys are `0, 1, 2...` in order.

```php
var_dump(array_is_list([1, 2]));    // Output: bool(true)
var_dump(array_is_list([1 => 1]));  // Output: bool(false)
```

## Multidimensional

```php
$contacts = [
    ["name" => "Peter Parker", "email" => "peterparker@mail.com"],
    ["name" => "Clark Kent",   "email" => "clarkkent@mail.com"],
    ["name" => "Harry Potter", "email" => "harrypotter@mail.com"],
];

// Access nested value
echo "Peter Parker's Email-id is: " . $contacts[0]["email"];
// Output: Peter Parker's Email-id is: peterparker@mail.com
```

- `array_column()` extracts one column (optionally indexed by another):

```php
$users = [
    ['id' => 1, 'name' => 'Ana',  'age' => 30],
    ['id' => 2, 'name' => 'Luis', 'age' => 25],
    ['id' => 3, 'name' => 'Eva',  'age' => 35],
];

print_r(array_column($users, 'name', 'id'));
// Array ( [1] => Ana [2] => Luis [3] => Eva )
```

## Methods

- `print_r`

```php
$cities = ["London", "Paris", "New York"];
print_r($cities);

// Array ( [0] => London [1] => Paris [2] => New York )
```

- `count()`

```php
$cars = ["Volvo", "BMW", "Toyota"];
echo count($cars); // Output: 3
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

- `array_merge()`: later string keys overwrite earlier ones; numeric keys are renumbered.

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

- `array_chunk()`, `array_unique()`, `range()`, `array_fill_keys()`:

```php
print_r(array_chunk([1, 2, 3, 4, 5], 2));  // [[1, 2], [3, 4], [5]]
print_r(array_unique([1, 2, 2, 3]));        // [0 => 1, 1 => 2, 3 => 3] (keys preserved)
print_r(range('a', 'e', 2));                // ['a', 'c', 'e']
print_r(array_fill_keys(['a', 'b'], 0));    // ['a' => 0, 'b' => 0]
```

- `array_diff()`: remove array values from another array.

```php
$array1 = [1, 2, 3, 4];
$array2 = [3, 4, 5, 6];

$diff = array_diff($array1, $array2);
print_r($diff); // [0 => 1, 1 => 2]
```

- `array_intersect()`: To get values which are present in given arrays.

```php
$array1 = [1, 2, 3, 4];
$array2 = [3, 4, 5, 6];

$intersect = array_intersect($array1, $array2);
print_r($intersect);  // [2 => 3, 3 => 4]
```

- `array_sum()` to get a sum of array values, `array_product()` to multiply them, or create your own formula with `array_reduce()`:

```php
$numbers = [1, 2, 3, 4, 5];

echo array_sum($numbers);     // 15
echo array_product($numbers); // 120

// array_reduce(array, callback(carry, item), initial)
echo array_reduce($numbers, fn($carry, $item) => $carry + $item * $item, 0);
// 55 = 1 + 4 + 9 + 16 + 25
```

🔗 [More methods](https://www.php.net/manual/en/ref.array.php)

## Sorting

All sort functions work **in place** and return `true`.

| function | sorts by | keeps keys |
| -------- | -------- | ---------- |
| `sort` / `rsort` | value asc / desc | no |
| `asort` / `arsort` | value asc / desc | yes |
| `ksort` / `krsort` | key asc / desc | yes |
| `usort` / `uasort` / `uksort` | custom callback | no / yes / yes |

```php
// Sort by a field using the spaceship operator <=>
usort($users, fn($a, $b) => $a['age'] <=> $b['age']);
echo implode(', ', array_column($users, 'name'));
// Output: Luis, Ana, Eva
```

## Filtering

### `array_filter()`

Pass the array as the first param and a callback as the second param. Return true in the callback if you want to keep this element in the array, and false if you don't:

```php
$numbers = [20, -3, 50, -99, 55];

$positive = array_filter($numbers, fn($number) => $number > 0);

print_r($positive); // [0 => 20, 2 => 50, 4 => 55]  (keys preserved)
print_r(array_values($positive)); // [20, 50, 55] (reindexed)
```

Also, you can call `array_filter()` without a callback to remove all "empty" values (`0`, `''`, `null`, `false`, `[]`):

```php
$numbers = [-1, 0, 1];
$not_empty = array_filter($numbers);

print_r($not_empty); // [0 => -1, 2 => 1]
```

Filter by key with `ARRAY_FILTER_USE_KEY` (or `ARRAY_FILTER_USE_BOTH`):

```php
print_r(array_filter(['a' => 1, 'b' => 2, 'c' => 3], fn($k) => $k !== 'b', ARRAY_FILTER_USE_KEY));
// [a => 1, c => 3]
```

### `array_map()`

Using `array_map()`, you can apply a callback to every element of an array. You can pass a function name, a first-class callable (`strtolower(...)`) or an anonymous function:

```php
$cities = ['Berlin', 'KYIV', 'Amsterdam', 'Riga'];
$aliases = array_map(strtolower(...), $cities);

print_r($aliases); // ['berlin', 'kyiv', 'amsterdam', 'riga']

$numbers = [1, -2, 3, -4, 5];
$squares = array_map(fn($number) => $number ** 2, $numbers);

print_r($squares);  // [1, 4, 9, 16, 25]

// Several arrays at once
print_r(array_map(fn($a, $b) => $a . $b, ['a', 'b'], ['1', '2'])); // ['a1', 'b2']
```

### Searching with callbacks (PHP 8.4)

```php
$nums = [1, 5, 8, 12];

var_dump(array_find($nums, fn($n) => $n > 6));                    // int(8)  — null if none
var_dump(array_find_key(['a' => 1, 'b' => 9], fn($n) => $n > 6)); // string(1) "b"
var_dump(array_any([1, 3, 4], fn($n) => $n % 2 === 0));           // bool(true)
var_dump(array_all([1, 3, 4], fn($n) => $n % 2 === 1));           // bool(false)
```

⚠️ [More info](https://code.tutsplus.com/tutorials/working-with-php-arrays-in-the-right-way--cms-28606)
