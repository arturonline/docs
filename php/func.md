# php Functions

> See also: [arrays](array.md) (`array_map`, `array_filter`, callbacks), [Exceptions](Exceptions.md).

```php
function myfunc(): void {
    echo "hola mundo";
}

myfunc();
// hola mundo
```

Function names are case-insensitive, but call them as declared.

## parameters

```php
function myfunc(string $hola, string $mundo): void {
    echo $hola . $mundo;
}

$hola = "hello ";
$mundo = "world";
myfunc($hola, $mundo);
// hello world
```

### Types and return types

With `declare(strict_types=1);` at the top of the file, scalar types are not converted automatically (`"5"` is not accepted as `int` → `TypeError`).

```php
declare(strict_types=1);

function find(array $users, int $id): ?array {      // nullable: array or null
    return $users[$id] ?? null;
}

function parse(string|int $v): int|float {          // union types (PHP 8.0)
    return is_int($v) ? $v : (float) $v;
}
var_dump(parse('2.5')); // float(2.5)

function logMessage(string $msg): void {}           // returns nothing
function fail(string $msg): never { throw new RuntimeException($msg); } // never returns (PHP 8.1)
function anything(mixed $v): mixed { return $v; }   // any type (PHP 8.0)
```

### Default values and named arguments (PHP 8.0)

```php
function greet(string $greeting, string $name = 'world'): string {
    return "$greeting $name";
}

echo greet('hello');                       // hello world
echo greet(name: 'PHP', greeting: 'hi');   // hi PHP  (any order)

// Very useful with built-in functions with many params:
echo htmlspecialchars($text, double_encode: false);
```

### By reference

Arguments are passed by value (objects: the handle is copied, so the same object is modified). To pass arguments by reference we use the `&` operator:

```php
function addstring(string &$cad1, string $cad2): void {
    $cad1 .= $cad2;
}

$cad1 = 'hello ';
$cad2 = 'world';
addstring($cad1, $cad2);

echo $cad1;
// hello world. The variable $cad1 has been modified
```

## variable parameter list

A function cannot be called with fewer arguments than its required parameters (`ArgumentCountError`), but it may be called with more arguments.

### Variadic parameters `...` (recommended)

```php
function sum(int ...$nums): int {   // $nums is an array
    return array_sum($nums);
}

echo sum(1, 2, 3);    // 6
echo sum(...[4, 5]);  // 9  (spread an array into arguments)
echo sum();           // 0

function tag(string $name, string ...$classes): string {
    return "<$name class=\"" . implode(' ', $classes) . "\">";
}
echo tag('div', 'a', 'b'); // <div class="a b">
```

### func_num_args, func_get_arg, func_get_args (legacy)

The extra arguments can also be accessed using three built-in functions. Prefer variadics: they are typed and visible in the signature.

```php
function myArgs() {
    $num  = func_num_args();   // number of arguments passed
    $x    = func_get_arg(0);   // one item from the argument list
    $args = func_get_args();   // array containing all arguments

    echo implode('', $args) . " ($num args)";
}

myArgs('Fee', 'Fi', 'Fo'); // FeeFiFo (3 args)
```

## Anonymous function

Example1 (closure):

```php
$greet = function (string $name): void {
    printf("Hello %s\n", $name);
};

$greet('World'); // Hello World
$greet('PHP');   // Hello PHP
```

Closures don't see outer variables unless you import them with `use` (by value, at definition time; `&` for by reference):

```php
$factor = 3;
$mul = function (int $x) use ($factor): int {
    return $x * $factor;
};
$factor = 10;
echo $mul(2); // 6  (it captured 3)

$total = 0;
$acc = function (int $x) use (&$total): void { $total += $x; };
$acc(5);
$acc(7);
echo $total; // 12
```

### Arrow functions (PHP 7.4)

Single expression, captures outer variables automatically (by value):

```php
$factor = 3;
$triple = fn(int $x): int => $x * $factor;
echo $triple(5); // 15

$prices = array_map(fn($p) => $p * 1.21, [10, 20]); // [12.1, 24.2]
```

### Variable functions and callables

Example2:

```php
function add(): void { echo "Add"; }
function subs(): void { echo "Subs"; }

$operation = 1;
$function = $operation === 1 ? 'add' : 'subs';

$function(); // Add
```

Safer alternative with an array of closures or `match`:

```php
$ops = [
    'add' => fn($a, $b) => $a + $b,
    'sub' => fn($a, $b) => $a - $b,
];
echo $ops['sub'](10, 4); // 6

$op = 'add';
echo match ($op) {
    'add'   => 1 + 1,
    'sub'   => 1 - 1,
    default => throw new InvalidArgumentException("Unknown op: $op"),
}; // 2
```

### First-class callable syntax (PHP 8.1)

`name(...)` creates a `Closure` from any function or method:

```php
$len = strlen(...);
echo $len('hola'); // 4

class MathOps {
    public static function square(int $x): int { return $x * $x; }
}
print_r(array_map(MathOps::square(...), [1, 2, 3])); // [1, 4, 9]

// Old style still works: 'strlen', [$obj, 'method'], [MathOps::class, 'square']
```

> PHP 8.5 adds the pipe operator: `$r = 'abc' |> strtoupper(...) |> strrev(...); // CBA`

## scope

By default, any variable used inside a function is limited to this local scope. Once the scope of the function ends, the local variable is destroyed. We can access global variables, and modify them, if we declare them with `global` inside the function.

An alternative way to access variables from the global scope is by using the predefined `$GLOBALS` array.

```php
$x = 'Hello';

function myFunc(): void {
    global $x;
    $x .= ' World';               // same as: $GLOBALS['x'] .= ' World';
}

myFunc();
echo $x; // Hello World
```

> Avoid globals: pass values as parameters and return results.

### Static variables

Keep their value between calls:

```php
function counter(): int {
    static $n = 0;
    return ++$n;
}

counter();
counter();
echo counter(); // 3
```

## Recursion

```php
function fact(int $n): int {
    return $n <= 1 ? 1 : $n * fact($n - 1);
}
echo fact(5); // 120
```

## Generators

A function with `yield` returns values lazily, one at a time (low memory):

```php
function squares(int $max): Generator {
    for ($i = 1; $i <= $max; $i++) {
        yield $i => $i * $i;  // key => value
    }
}

foreach (squares(3) as $k => $v) {
    echo "$k:$v ";
}
// 1:1 2:4 3:9
```

## Libraries

The `include` statement takes all the text in the specified file and includes it in the script, as if the code had been copied to that location. We can use include to have a library of functions, and include it every time in our pages.

In addition to include, there are three other language constructs available for importing the content of one file into another: `require`, `include_once` and `require_once`.

- The **require** construct includes and evaluates the specified file. It is identical to include, except if a file import fails, require halts the script with a fatal error; whereas include only issues a warning.
- The **require_once** statement works like require, but it does not import a file if it has already been imported.
- The **include_once** statement behaves like include, except that if the specified file has already been included, it is not included again.

We can think of using **include** when the file to be inserted is not decisive regarding the operation of our program and **require** when the file is necessary for the correct operation of our program.
Finally, the **_once** variants should be used for files that declare functions or classes: including them twice causes a *"Cannot redeclare"* fatal error.

> Use absolute paths: `require_once __DIR__ . '/library.php';`. Never include a path built from user input.
> In modern projects, classes are loaded automatically with Composer's autoloader (`require __DIR__ . '/vendor/autoload.php';`). See [namespaces](Advanced%20classes.md#namespaces).

```php
<?php
// library.php
function pageHeader(string $title): void {
    echo '<header><h1>' . htmlspecialchars($title) . '</h1></header>';
}

function pageFooter(): void {
    echo '<footer>&copy; ' . date('Y') . '</footer>';
}
```

```php
<?php require_once __DIR__ . '/library.php'; ?>
<html>
    <head>
        <title>Example 1</title>
    </head>
    <body>
        <?php pageHeader('Page 1'); ?>

        Content <br><br>
        end<br><br>

        <?php pageFooter(); ?>
    </body>
</html>
```

> ⚠️ Don't name them `Header()`/`Footer()`: function names are case-insensitive, so `Header()` clashes with the built-in `header()` ("Cannot redeclare").
