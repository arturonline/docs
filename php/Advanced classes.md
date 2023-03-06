# PHP Classes 2

## Traits

Contains only implemented methods that can be called in the class that "uses" the trait.

```php
trait EnglishMessages {
    function WelcomeEnglish() {
        echo "Welcome!";
    }
}

// Using the trait EnglishMessages
class Messages {
    use EnglishMessages;
}

$message = new Messages();
echo $message -> WelcomeEnglish();
```

Multiple traits:

```php
trait EnglishMessages {
    function WelcomeEnglish() {
        echo "<br/>Welcome!";
    }
}

trait SpanishMessages {
    function WelcomeSpanish() {
    echo "<br/>Bienvenida!";
    }
} 

class Messages {
    use EnglishMessages, SpanishMessages;
}

$message = new Messages();
echo $message -> WelcomeEnglish();
echo $message -> WelcomeSpanish();
```

## Interfaces

- Contains only empty methods.
- When a class implements an interface must implement all its methods.

```php
interface Worktable {
    function jumAline();
}

class MyTable implements WorkTable {
    function jumpAline() {
        // implementation
    }
}
```

## Abstract Classes

- Must include at least 1 abstract method.
- Can include non-abstract methods
- Parent abstract methods must be implemented in the child class.
- Non abstract methods are inherited by the child class.

```php
abstract class WorkTable {
    abstract function jumpALine();
}

class MyTable extends WorkTable
{
    function jumpALine(){
        // the code goes here
    }
}
```

## Anonymous classes

Can be used when only a single and throwable object is needed.

```php
$obj = new class('Hi') {
    public $x;
    
    public function __construct($a) {
        $this -> x = $a;
    }
};

echo $obj -> x; // "Hi";
```

## Namespaces

- Namespaces allow defining more than a class with the same name.
- first sentence in a php file.

```php
<?php
// FILE namespace01.php
namespace group01;

class SameName {
    …
}
?>

<?php
// FILE namespace02.php
namespace group02;

class SameName {
    …
}
?>

//
<?php
include 'namespace01.php'; // including the external file
include 'namespace02.php'; // including the external file

use group01 as g1; // an alias for the namespace
use group02 as g2; // an alias for the namespace

$object01 = new g1\SameName(); // using external namespace
$object02 = new g2\SameName(); // using external namespace
?>
```

## Objects useful functions

```php
is_object($var); // true if $var is an object.
get_class($obj); // Returns the name of the class.
method_exists($obj, $meth) // Returns true if the obj has the specified method.
get_object_vars($obj) // Returns an array with the object properties and their values.
get_parent_class($obj) // Returns the name of the parent class or false if there is none.
```
