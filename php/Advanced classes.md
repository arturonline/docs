# PHP Classes 2

> Previous: [PHP classes 1](classes.md) (properties, constructors, inheritance, static). See also [Exceptions](Exceptions.md).

## Traits

Reusable blocks of methods (and properties) that are copied into the class that "uses" the trait. A way around single inheritance.

```php
trait EnglishMessages {
    public function welcomeEnglish(): string {
        return "Welcome!";
    }
}

// Using the trait EnglishMessages
class Messages {
    use EnglishMessages;
}

$message = new Messages();
echo $message->welcomeEnglish(); // Output: Welcome!
```

Multiple traits:

```php
trait SpanishMessages {
    public function welcomeSpanish(): string {
        return "¡Bienvenido!";
    }
}

class Messages {
    use EnglishMessages, SpanishMessages;
}

$message = new Messages();
echo $message->welcomeEnglish() . ' ' . $message->welcomeSpanish();
// Output: Welcome! ¡Bienvenido!
```

Resolving name conflicts:

```php
trait A { public function hello(): string { return 'A'; } }
trait B { public function hello(): string { return 'B'; } }

class C {
    use A, B {
        A::hello insteadof B;  // use A's version
        B::hello as helloB;    // keep B's version under another name
    }
}

echo (new C)->hello() . (new C)->helloB(); // Output: AB
```

> Traits can also declare properties, `abstract` methods (the class must implement them), static methods and (PHP 8.2) constants.

## Interfaces

- Declare public methods without body (a contract). They can also contain constants.
- When a class implements an interface it must implement all its methods.
- A class can implement several interfaces.

```php
interface Shape {
    public function area(): float;
}

interface HasName {
    public function name(): string;
}

final class Circle implements Shape, HasName {
    public function __construct(private float $r) {}

    public function area(): float { return round(M_PI * $this->r ** 2, 2); }
    public function name(): string { return 'circle'; }
}

// Intersection type (PHP 8.1): the argument must implement BOTH interfaces
function describe(Shape&HasName $s): string {
    return "{$s->name()}: {$s->area()}";
}

echo describe(new Circle(2)); // Output: circle: 12.57
```

Useful built-in interfaces: `Stringable`, `Countable`, `IteratorAggregate`, `ArrayAccess`, `JsonSerializable`.

## Abstract Classes

- Cannot be instantiated.
- Can include abstract methods (no body) and normal methods.
- Abstract methods must be implemented in the (non-abstract) child class.
- Non abstract methods are inherited by the child class.

```php
abstract class Animal {
    public function __construct(protected string $name) {}

    abstract protected function sound(): string;

    public function speak(): string {
        return "$this->name says {$this->sound()}";
    }
}

class Dog extends Animal {
    protected function sound(): string {
        return 'Woof';
    }
}

echo (new Dog('Rex'))->speak(); // Output: Rex says Woof
new Animal('x');                // Error: Cannot instantiate abstract class Animal
```

## Anonymous classes

Can be used when only a single, throwaway object is needed (e.g. a quick implementation of an interface in a test).

```php
$obj = new class('Hi') {
    public function __construct(public string $x) {}
};

echo $obj->x; // Output: Hi
```

## Enums (PHP 8.1)

A closed set of possible values. Each case is a singleton object.

```php
// Pure enum
enum Status {
    case Active;
    case Inactive;
}

// Backed enum (string|int), useful to store in a DB / JSON
enum Suit: string {
    case Hearts = 'H';
    case Spades = 'S';

    public function color(): string {
        return match ($this) {
            self::Hearts => 'Red',
            self::Spades => 'Black',
        };
    }
}

echo Suit::Hearts->value;    // Output: H
echo Suit::Hearts->name;     // Output: Hearts
echo Suit::Hearts->color();  // Output: Red

var_dump(Suit::from('S'));    // Output: enum(Suit::Spades)
var_dump(Suit::tryFrom('X')); // Output: NULL   (from() would throw ValueError)
echo implode(',', array_map(fn($c) => $c->name, Suit::cases())); // Output: Hearts,Spades

var_dump(Suit::Hearts === Suit::from('H')); // Output: bool(true)

function setStatus(Status $s): void { /* only Status::Active or Status::Inactive allowed */ }
```

> Enums can implement interfaces and have constants and static methods, but no state (properties).

## Readonly properties and classes

- `readonly` property (PHP 8.1): can only be initialized once, from inside the class.
- `readonly class` (PHP 8.2): all properties are readonly.

```php
readonly class Money {
    public function __construct(
        public int $amount,
        public string $currency,
    ) {}

    public function add(Money $other): static {
        return new static($this->amount + $other->amount, $this->currency);
    }
}

$m = new Money(10, 'EUR');
echo $m->add(new Money(5, 'EUR'))->amount; // Output: 15

$m->amount = 1; // Error: Cannot modify readonly property Money::$amount
```

## Property hooks (PHP 8.4)

`get`/`set` logic attached directly to a property (no more boilerplate getters/setters).

```php
class User {
    // virtual property: only "get", no stored value
    public string $fullName {
        get => "$this->first $this->last";
    }

    public string $email {
        set(string $value) {
            if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                throw new InvalidArgumentException('Invalid email');
            }
            $this->email = strtolower($value);
        }
    }

    public function __construct(public string $first, public string $last) {}
}

$u = new User('Ana', 'Pérez');
echo $u->fullName;          // Output: Ana Pérez
$u->email = 'ANA@Mail.com';
echo $u->email;             // Output: ana@mail.com
$u->email = 'nope';         // InvalidArgumentException: Invalid email
```

## Asymmetric visibility (PHP 8.4)

Different visibility for reading and writing.

```php
class Account {
    public private(set) float $balance = 0;

    public function deposit(float $amount): void {
        $this->balance += $amount;
    }
}

$acc = new Account();
$acc->deposit(50);
echo $acc->balance;     // Output: 50
$acc->balance = 1000;   // Error: Cannot modify private(set) property Account::$balance from global scope
```

## Magic methods

| method | called when |
| ------ | ----------- |
| `__construct()` / `__destruct()` | object created / destroyed |
| `__get($name)` / `__set($name, $value)` | reading / writing an inaccessible property |
| `__isset($name)` / `__unset($name)` | `isset()` / `unset()` on an inaccessible property |
| `__call($name, $args)` / `__callStatic()` | calling an inaccessible method |
| `__toString()` | object used as a string (class implements `Stringable` automatically) |
| `__invoke(...)` | object called as a function |
| `__clone()` | after `clone $obj` |
| `__serialize()` / `__unserialize()` | `serialize()` / `unserialize()` |

```php
class Temp {
    public function __construct(private float $c) {}
    public function __toString(): string { return "{$this->c}°C"; }
    public function __invoke(float $delta): float { return $this->c + $delta; }
}

$t = new Temp(21.5);
echo $t;      // Output: 21.5°C
echo $t(1);   // Output: 22.5
```

## Namespaces

- Namespaces allow defining more than one class with the same name (in different namespaces).
- `namespace` must be the first statement in a PHP file (only `declare(strict_types=1)` can go before).
- Convention (PSR-4): the namespace mirrors the folder structure, and Composer autoloads the classes (no `include` needed).

```php
<?php
// FILE src/Group01/SameName.php
namespace Group01;

class SameName {
    // ...
}
```

```php
<?php
// FILE src/Group02/SameName.php
namespace Group02;

class SameName {
    // ...
}
```

```php
<?php
// FILE index.php
require 'src/Group01/SameName.php'; // or: require 'vendor/autoload.php'; (Composer)
require 'src/Group02/SameName.php';

use Group01\SameName;              // import a class
use Group02\SameName as Other;     // alias to avoid the clash
use Group01 as G1;                 // alias for the namespace

$object01 = new SameName();        // Group01\SameName
$object02 = new Other();           // Group02\SameName
$object03 = new G1\SameName();     // Group01\SameName

echo Other::class; // Output: Group02\SameName
```

> Global functions/classes inside a namespace: `\strlen()`, `new \DateTimeImmutable()`. Without the leading `\`, PHP falls back to the global function, but not to global classes.

## Objects useful functions

```php
is_object($var);            // true if $var is an object.
get_class($obj);            // Returns the name of the class. Also: $obj::class
$obj instanceof SomeClass;  // true if $obj is SomeClass, a child, or implements it
method_exists($obj, $meth); // Returns true if the obj has the specified method.
property_exists($obj, $p);  // Returns true if the class has the property.
get_object_vars($obj);      // Returns an array with the accessible properties and their values.
get_parent_class($obj);     // Returns the name of the parent class or false if there is none.
```

```php
print_r(get_object_vars(new Money(10, 'EUR')));
// Array ( [amount] => 10 [currency] => EUR )

var_dump(get_parent_class(new Dog('Rex'))); // Output: string(6) "Animal"
```
