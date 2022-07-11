# PHP classes 1

```php
class person
{
    // properties
    private $name;
    private $address;

    // methods
    function setName($name) {
        $this -> name = $name;
    }
    function getName() {
        return $this -> name;
    }
}

$onePerson = new Person();
$onePerson -> setName("John Smith");
echo "The name of the person is ".$onePerson -> getName();
```

## constructor

```php
class Person
{
    private $name;
    
    public function __construct($name) {
        $this -> name = $name;
    }
}

$onePerson = new Person("John");
```

⚠️ php does not support multiple constructors having diferent number of parameters.

## access modifiers

- `private`, `public`, `protected`
- By default, everything is public.

## inheritance

```php
// Parent class (base class)
class Rectangle {
    public $x, $y;
    function __construct($a, $b) {
        $this -> x = $a;
        $this -> y = $b;
    }
}
// Child class (derived class)
class Square extends Rectangle {}
```

A child class inherites the constructor method from its parent class. The constructor is automatically invoked when an object (both of parent or child classes) is created. Therefore, when the child class has its own constructor the parent constructor is not automatically invoked. So, if we need to do this, we must do it explicitly with `parent::__construct`.

```php
class Teacher extends Person
{
    private $speciality;
    function __construct($name, $surname, $speciality) {
        parent::__construct($name, $surname);
        $this -> speciality = $speciality;
    }
}
```

A class in php may only inherit from one parent class and must be defined before the child in the script file.

## destructor method

A destructor is automatically called when the last instance of an object is destructed or the script is stopped or exited.

```php
class Person
{
    function __destruct()
    {
        // the code goes here
    }
}
```

We can manually remove all references to an object by using the `unset` function:

```php
unset($object)
```

## Final

By using final we prevent a method from being overriden and a class from being extended.

## class constant

```php
class Product {
    const IVA = 21;
}
```

To access the class constant from outside the class:

```php
echo Product::IVA
```

## Object comparison

`===` -> Two objects reference the same instance
`==` -> Two objects properties have the same values and types.

## Static

```php
class WorkTable {
    // public by default
    static function jumpALine() {
    echo "<br/>";
    }
}
WorkTable::jumpALine();
```

Access static property from a child class:

```php
class MathThings {
    public static $valueOfPi = 3.14159;
    function getPI() {
        return self::$valueOfPi;
    }
}

class ChildMathThings extends MathThings {
    function getPI() {
        return parent::$valueOfPi;
    }
}
```