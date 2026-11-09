---
Titulo: 'Exceptions'
Descripción: 'Exceptions in php'
tags: [exceptions, php]
Fecha: 09/03/2023
---

## Hierarchy

Since PHP 7 both exceptions and internal errors implement the `Throwable` interface:

```txt
Throwable
├── Error                       (engine errors, normally bugs)
│   ├── TypeError
│   │   └── ArgumentCountError
│   ├── ValueError              (PHP 8)
│   ├── ArithmeticError
│   │   └── DivisionByZeroError
│   └── UnhandledMatchError     (PHP 8)
└── Exception                   (conditions the program may recover from)
    ├── ErrorException
    ├── JsonException
    ├── LogicException          → InvalidArgumentException, DomainException, LengthException, OutOfRangeException
    └── RuntimeException        → PDOException, OutOfBoundsException, OverflowException, UnexpectedValueException...
```

## Handle exceptions

```php
try {
    // Code that may cause an Exception or Error.
} catch (Exception $e) {
    // Only exceptions (not Error)
} catch (Throwable $t) {
    // Anything else: Error and Exception
} finally {
    // Always executed (even after return), e.g. to close resources
}
```

> The first matching `catch` wins, so put the most specific types first.

## Handle specific exceptions

```php
// We can handle specific exceptions:
try {
    intdiv(1, 0);
} catch (DivisionByZeroError $e) {
    echo get_class($e);
} catch (ArithmeticError $e) {
    // ...
}
// Output: DivisionByZeroError

// Several types in one catch (PHP 7.1)
try {
    strlen();
} catch (ArgumentCountError | TypeError $e) {
    echo $e->getMessage();
}
// Output: strlen() expects exactly 1 argument, 0 given

// Catch without a variable (PHP 8.0)
try {
    $data = json_decode('{bad json', flags: JSON_THROW_ON_ERROR);
} catch (JsonException) {
    $data = null;
}
```

With `declare(strict_types=1)`, passing a wrong scalar type throws a `TypeError`:

```php
function double(int $x): int { return $x * 2; }

try {
    double("5");
} catch (TypeError $e) {
    echo $e->getMessage();
}
// Output: double(): Argument #1 ($x) must be of type int, string given, called in ... on line ...
```

## Methods

```php
$e->getMessage();       // returns the message of the exception
$e->getCode();          // returns the code of the exception
$e->getFile();          // returns the name of the file where the exception happened
$e->getLine();          // returns the line where the exception happened
$e->getPrevious();      // returns the previous (chained) exception or null
$e->getTrace();         // stack trace as array
$e->getTraceAsString(); // stack trace as string
$e->__toString();       // returns the exception in String format
```

```php
<?php
$number = 0;
try {
    $inverseNumber = 1 / $number;
    echo "<h2>The inverse of $number is $inverseNumber</h2>";
} catch (Throwable $t) {
    echo "An error {$t->getMessage()} happened<br/>";
    echo "In line {$t->getLine()} of file {$t->getFile()}<br/>";
}

// An error Division by zero happened
// In line 4 of file C:\xampp\htdocs\exceptionsFile.php
```

> ⚠️ In production, don't show `getMessage()`/`getFile()` to the user (information leak): log them and show a generic message.

## Throw

```php
function withdraw(float $balance, float $amount): float {
    if ($amount <= 0) {
        throw new InvalidArgumentException('Amount must be positive');
    }
    return $balance - $amount;
}

// throw is an expression since PHP 8.0
$id = $_GET['id'] ?? throw new InvalidArgumentException('id required');
$user = findUser($id) ?: throw new RuntimeException('User not found');

// never return type (PHP 8.1): the function always throws or exits
function fail(string $msg): never {
    throw new RuntimeException($msg);
}
```

## Custom exceptions

```php
class InsufficientFundsException extends DomainException
{
    public function __construct(
        public readonly float $missing,
        ?Throwable $previous = null,
    ) {
        parent::__construct(sprintf('Insufficient funds: %.2f missing', $missing), 1001, $previous);
    }
}

function withdraw(float $balance, float $amount): float {
    if ($amount > $balance) {
        throw new InsufficientFundsException($amount - $balance);
    }
    return $balance - $amount;
}

try {
    withdraw(50, 80);
} catch (InsufficientFundsException $e) {
    echo $e->getMessage() . ' (code ' . $e->getCode() . ')';
} finally {
    echo ' - done';
}
// Output: Insufficient funds: 30.00 missing (code 1001) - done
```

## Chaining (rethrow)

Wrap a low-level exception in a higher-level one without losing the original:

```php
try {
    try {
        throw new RuntimeException('Config missing');
    } catch (RuntimeException $e) {
        throw new LogicException('App failed', 0, $e); // 3rd param: previous
    }
} catch (LogicException $e) {
    echo $e->getMessage() . ' <- ' . $e->getPrevious()?->getMessage();
}
// Output: App failed <- Config missing
```

## finally

```php
function test(): string {
    try {
        return "try";
    } finally {
        echo "cleanup ";   // runs before the function actually returns
    }
}
echo test();
// Output: cleanup try
```

## warnings

A warning (or notice) can't be handled by the try ... catch block unless we transform it into an exception. Use the built-in `ErrorException`:

```php
<?php
set_error_handler(function (int $errno, string $errstr, string $errfile, int $errline): bool {
    // respect the @ operator and error_reporting()
    if (!(error_reporting() & $errno)) {
        return false;
    }
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
});

try {
    $content = file_get_contents('missing.txt');
} catch (ErrorException $e) {
    echo "Caught: {$e->getMessage()}";
}
// Output: Caught: file_get_contents(missing.txt): Failed to open stream: No such file or directory

try {
    echo $undefined;
} catch (ErrorException $e) {
    echo "Caught: {$e->getMessage()}";
}
// Output: Caught: Undefined variable $undefined

restore_error_handler(); // restore the previous error handler when done
```

## Global handler (uncaught exceptions)

```php
set_exception_handler(function (Throwable $e): void {
    error_log((string) $e);                  // full details to the log
    http_response_code(500);
    echo 'Something went wrong. Please try again later.';
});

throw new RuntimeException('boom');
// Output: Something went wrong. Please try again later.
```

## Log errors in a file

```php
function logError(Throwable $e): void {
    $message = sprintf(
        "[%s] %s in %s:%d | User: %s | IP: %s\n",
        (new DateTimeImmutable())->format('Y-m-d H:i:s'),
        $e->getMessage(),
        $e->getFile(),
        $e->getLine(),
        get_current_user(),
        $_SERVER['REMOTE_ADDR'] ?? 'cli',
    );

    // message - type 3 = append to file - file route/name
    error_log($message, 3, __DIR__ . '/logs/user_errors.log');
}
```

Recommended `php.ini` settings for production:

```ini
display_errors = Off
log_errors = On
error_log = /var/log/php/error.log
error_reporting = E_ALL
```
