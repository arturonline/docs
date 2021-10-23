# PHP Sessions

Session variables are stored in associative array called `$_SESSION[]`. These variables can be accessed during lifetime of a session.

## Start a Session

A PHP session is easily started by making a call to the `session_start()` function.This function first checks if a session is already started and if none is started then it starts one. It is recommended to put the call to `session_start()` at the beginning of the page.

```php
<?php
session_start();

?>
```

## Create a Session and a Session variable

The following example starts a session then register a variable called **counter** that is incremented each time the page is visited during the session.

Make use of `isset()` function to check if session variable is already set or not.

```php
<?php
// start a session
session_start();
  
// initialize session variables
$_SESSION['logged_in_user_id'] = '1';
$_SESSION['logged_in_user_name'] = 'Tutsplus';
  
// access session variables
echo $_SESSION['logged_in_user_id'];
echo $_SESSION['logged_in_user_name'];
?>
```

## Modify Session variable

```php
<?php
session_start();
  
if (!isset($_SESSION['count'])) {
  $_SESSION['count'] = 1;
}
else {
  ++$_SESSION['count'];
}
  
echo $_SESSION['count'];
?>
```

## Destroy a Session variable

If you want to destroy a single session variable then you can use unset() function to unset a session variable.

```php
<?php
   unset($_SESSION['counter']);
?>
```

## End a Session

A PHP session can be destroyed by `session_destroy()` function.

```php
<?php
   session_destroy();
?>
```