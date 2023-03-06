# php Functions

```php
function myfunc() {
    echo "hola mundo";
}

myfunc();
// hola mundo
```

## parameters

```php
$hola = "hello ";
$mundo = "world";

function myfunc($hola, $mundo) {
    echo $hola . $mundo;
}
// hello world
```

Arguments are passed by value. To pass arguments by reference we use the `&` operator:

```php
function addstring(&$cad1, $cad2) {
    $cad1 = $cad1.$cad2;
}

$cad1='hello ';
$cad2='world';
addstring($cad1,$cad2);

echo $cad1;
//hello world. The variable $cad1 has been modified
```

## variable parameter list

A function cannot be called with fewer arguments than is specified in its declaration, but it may be called with more arguments. This allows for the passing of a variable number of arguments, which can then be accessed using three built-in functions: `func_get_arg()`, `func_num_args()`, `func_get_args()`.

### func_num_args

Returns the number of arguments passed to the function:

```php
function fsum()
{
    if(func_num_args() == 0) {
        return false;
    }
    else
    {
        $tot=0;
        for($i = 0; $i<func_num_args(); $i++) {
            $tot = $tot + func_get_arg($i);
        }
        return $tot;
    }
}
```

### func_get_arg

Returns an item from the argument list:

```php
function myArgs() {
    $x = func_get_arg(0);
    $y = func_get_arg(1);
    $z = func_get_arg(2);
    echo $x . $y . $z;
}

myArgs('Fee', 'Fi', 'Fo'); // "FeeFiFo"
```

### func_get_args

Returns an array containing all arguments:

```php
function myArgs2() {
    $num = func_num_args();
    $args = func_get_args();

    for ($i = 0; $i < $num; $i++) {
        echo $args[$i];
    }
}

myArgs2('Fee', 'Fi', 'Fo'); // "FeeFiFo"
```

## Anonymous function

Example1:

```php
$greet = function($name)
{
    printf("Hello %s\r\n", $name);
};

$greet('World');
$greet('PHP');
```

Example2:

```php
function add () {
    echo "Add";
}

function subs () {
    echo "Subs";
}

$operation = 1;

if($operation == 1) {
    $function="add";
} else {
    $function="subs";
}

$function();
```

## scope

By default, any variable used inside a function is limited to this local scope. Once the scope of the function ends, the local variable is destroyed. We can access global variables, and modify them, if we declare them with global inside the function.

An alternative way to access variables from the global scope is by using the predefined `$GLOBALS` array.

```php
function myFunc() {
    $GLOBALS['x'] = ' World'; // change global $x
}
```

## Libraries

The `include` statement takes all the text in the specified file and includes it in the script, as if the code had been copied to that location We can use include to have a library of functions, and include it every time in our pages.

In addition to include, there are three other language constructs available for importing the content of one file into another: `require`, `include_once` and `require_once`.

- The **require** construct includes and evaluates the specified file. It is identical to include, except if a file import fails, require halts the script with an error; whereas include only issues a warning.
- The **require_once** statement works like require, but it does not import a file if it has already been imported.
- The **include_once** statement behaves like include, except that if the specified file has already been included, it is not included again.

We can think of using **include** when the file to be inserted is not decisive regarding the operation of our program and **require** when the file is necessary for the correct operation of our program.
Finally, the variants with _\_once_ should be used when our program has considerable dimensions and it may be the case that the inclusion of the file occurs several times.

```php
<html>
    <head>
    <title>Example 1</title>
    </head>
    <body>
        <?php include("library.php") ?>

        <?php Header(); ?>

        Page 1
        <BR><BR><BR><BR><BR>
        Content <BR><BR>
        end<BR><BR>

        <?php Footer(); ?>

    </body>
</html>
```
