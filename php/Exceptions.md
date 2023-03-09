---
Titulo: 'Exceptions'
Descripción: 'Exceptions in php'
tags: [exceptions, php]
Fecha: 09/03/2023'
---

## Handle exceptions

```php
try
{
 // Code that may cause an Exception or Error.
}
catch (Throwable $t) {
 // Executed only in PHP 7, will not match in PHP 5
}
catch (Exception $e) {
 // Executed only in PHP 5, will not be reached in PHP 7
}
```

## Handle especific exceptions

```php
// We can handle specific exceptions:
try {
 ...
} catch (DivisionByZeroError $t) {
 ...
} catch (ArithmeticError $e) {
 …
}
```

## Methods

```php
getMessage(); // returns the name of the exception
getCode(); // returns de code of the exception
getFile(); // returns the name of the file where de exception happened
getLine(); // returns the line where the excepcion happened
__toString(); // returns the exception in String format

<?php 
 $number=0;
 try {
 $anverseNumber=1/$number;
 echo "<h2>The inverse of $number is $anverseNumber</h2>";
 }
 catch(Throwable $t) {
 echo "An error {$t->getMessage()} happened<br/>";
 echo "In line {$t->getLine()} of file {$t->getFile()}<br/>";
 }
?>

// An error Division by zero happened
// In line 17 of file C:\xampp\htdocs\exceptionsFile.php
```

## warnings

A warning can’t be handled by the try ... catch block unless we transform them into exceptions:

```php
<?php 

// define out handling error function
function handlingErrors($eLevel, $eMessage, $eFile, $eLine) 
{
    // both warnings and exceptions will be thrown
     throw new Exception("Error ".$eMessage." in line ".$eLine." of ".$eFile); 
}

function anverse($number) 
{
     $anverseNumber = 1 / $number;
     return $anverseumber;
}

// set our error handling function
set_error_handler("handlingErrors"); 

try 
{
     $number=10;
     echo "<h2>The inverse of $number is ".anverse($number)."</h2>";
}
catch (Throwable $t) 
{
     echo "An error {$t->getMessage()} happened<br/>";
}

restore_error_handler(); // we should restore the automatic error handler at the end
?>
```

## Log errors in a file

```php
function handlingErrors($eLevel, $eMessage, $eFile, $eLine) {
    $newMessage = "Date: ".date("H:i d-m-Y ").$eMessage. 
                    " in file ".$eFile." line ".$eLine.
                    " User: ".get_current_user().
                    " from IP: ".   $_SERVER['REMOTE_ADDR'];

    // message - append mode - file route/name
    error_log("$newMessage in $eFile, line $eLine", 3, 	"c:/xampp/apache/logs/user_errors");
}
```



