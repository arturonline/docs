# PHP classes 1

> Next: [PHP classes 2](Advanced%20classes.md) (traits, interfaces, abstract, enums, readonly, property hooks, namespaces).

```php
<?php
declare(strict_types=1); // first statement: enables strict type checking for scalar types

class Person
{
    // typed properties
    private string $name = '';
    private ?string $address = null; // nullable

    // methods
    public function setName(string $name): void {
        $this->name = $name;
    }

    public function getName(): string {
        return $this->name;
    }
}

$onePerson = new Person();
$onePerson->setName("John Smith");
echo "The name of the person is " . $onePerson->getName();
// Output: The name of the person is John Smith
```

> Class names are case-insensitive (`new person()` works), but use `PascalCase` consistently: autoloaders (PSR-4) map class names to file names.

## constructor

```php
class Person
{
    private string $name;

    public function __construct(string $name) {
        $this->name = $name;
    }
}

$onePerson = new Person("John");
```

### Constructor property promotion (PHP 8.0)

Declares and assigns the properties directly in the constructor signature:

```php
class Point
{
    public function __construct(
        public readonly int $x = 0,
        public readonly int $y = 0,
    ) {}

    // "wither": readonly objects return a modified copy
    public function withX(int $x): static {
        return new static($x, $this->y);
    }
}

$p = new Point(y: 5);   // named arguments: skip $x (uses the default)
echo "$p->x,$p->y";     // Output: 0,5
echo $p->withX(7)->x;   // Output: 7

$p->x = 3;
// Error: Cannot modify readonly property Point::$x
```

⚠️ PHP does not support multiple constructors (overloading). Use default values, named arguments or static factory methods instead:

```php
class Temperature
{
    private function __construct(public readonly float $celsius) {}

    public static function fromCelsius(float $c): self    { return new self($c); }
    public static function fromFahrenheit(float $f): self { return new self(($f - 32) * 5 / 9); }
}

echo Temperature::fromFahrenheit(212)->celsius; // Output: 100
```

## access modifiers

- `public`: accessible from everywhere.
- `protected`: accessible from the class and its children.
- `private`: accessible only from the class itself.
- Methods without modifier are `public`. Properties must be declared with a modifier (or `var`, which is legacy and means `public`).
- PHP 8.4 adds asymmetric visibility (`public private(set)`), see [Advanced classes](Advanced%20classes.md#asymmetric-visibility-php-84).

## inheritance

```php
// Parent class (base class)
class Rectangle
{
    public function __construct(
        protected float $width,
        protected float $height,
    ) {}

    public function area(): float {
        return $this->width * $this->height;
    }
}

// Child class (derived class)
class Square extends Rectangle
{
    public function __construct(float $side) {
        parent::__construct($side, $side);
    }

    #[\Override] // PHP 8.3: error if the parent doesn't have this method
    public function area(): float {
        return parent::area();
    }
}

$sq = new Square(3);
echo $sq->area();                   // Output: 9
var_dump($sq instanceof Rectangle); // Output: bool(true)
```

A child class inherits the constructor method from its parent class. The constructor is automatically invoked when an object (both of parent or child classes) is created. However, when the child class has its own constructor the parent constructor is not automatically invoked. So, if we need to do this, we must do it explicitly with `parent::__construct()`.

```php
class Teacher extends Person
{
    public function __construct(
        string $name,
        private string $speciality,
    ) {
        parent::__construct($name);
    }
}
```

A class in PHP may only inherit from one parent class (use [traits](Advanced%20classes.md#traits) or [interfaces](Advanced%20classes.md#interfaces) for more). With an autoloader the order of definition doesn't matter; without one, the parent must be defined (or included) before the child.

## destructor method

A destructor is automatically called when the last reference to an object is removed, or the script ends.

```php
class Connection
{
    public function __construct(public string $name) { echo "create $name\n"; }
    public function __destruct() { echo "destroy $this->name\n"; }
}

$c = new Connection('a');
unset($c);       // removes the (last) reference
echo "after\n";

// Output:
// create a
// destroy a
// after
```

## Final

By using `final` we prevent a method from being overridden, a class from being extended or (PHP 8.1) a constant from being overridden.

```php
final class Money {}
class Euro extends Money {} // Fatal error: Class Euro cannot extend final class Money
```

## class constant

```php
class Product
{
    const IVA = 21;
    public const string CURRENCY = 'EUR';      // typed constant (PHP 8.3)
    final public const int MAX_STOCK = 1000;   // cannot be overridden by children
}
```

To access the class constant from outside the class (inside: `self::IVA` or `static::IVA`):

```php
echo Product::IVA;      // Output: 21
echo Product::CURRENCY; // Output: EUR
```

## Object comparison

- `===` → both variables reference the same instance.
- `==` → both objects are of the same class and have equal property values.

```php
$a = new Point(1, 2);
$b = new Point(1, 2);
$c = $a;          // objects are assigned by handle (not copied)
$d = clone $a;    // shallow copy (calls __clone() if defined)

var_dump($a == $b);  // bool(true)
var_dump($a === $b); // bool(false)
var_dump($a === $c); // bool(true)
var_dump($a === $d); // bool(false)
```

## Static

```php
class WorkTable
{
    // public by default
    static function jumpALine(): void {
        echo "<br/>";
    }
}
WorkTable::jumpALine();
```

Static properties are shared by all instances:

```php
class Counter
{
    private static int $count = 0;

    public static function increment(): int {
        return ++self::$count;
    }
}

Counter::increment();
echo Counter::increment(); // Output: 2
```

Access static property from a child class:

```php
class MathThings
{
    public static float $valueOfPi = 3.14159;

    public function getPI(): float {
        return self::$valueOfPi;
    }
}

class ChildMathThings extends MathThings
{
    public function getPI(): float {
        return parent::$valueOfPi;
    }
}
```

`self` vs `static` (late static binding): `self` refers to the class where the code is written, `static` to the class that was called.

```php
class Model
{
    public static function create(): static {
        return new static();
    }
}
class User extends Model {}

echo get_class(User::create()); // Output: User  (with `new self()` it would be Model)
```

## Nullsafe operator `?->` (PHP 8.0)

```php
class Address { public string $city = 'Valencia'; }
class Customer { public ?Address $address = null; }

$c = new Customer();
var_dump($c->address?->city); // Output: NULL (no error)

$c->address = new Address();
echo $c->address?->city;      // Output: Valencia
```
