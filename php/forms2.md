# forms 2

## form validation

### 1. En tres pasos

`[ Formulario.html ] <-> [ Validacion.php ] -> [ Resultado.php ]`

- **Pagina formulario**: es la pagina con el formulario.
- **Pagina validacion** solo tiene una funcion, validar el contenido de un formulario.
- **Pagina resultado**: recibe el formulario ya validado y realiza las acciones pertinentes.

### 2. En dos pasos

`[ Formulario.html ] <-> [ Resultado.php (+ validacion) ]`

La validación se hace en la misma pagina de resultado

### 3. En un paso

Lo hacemos todo en la página de formulario.

## Navegar entre paginas PHP

Podemos navegar entre páginas con la instrucción `header`:

```php
header("Location: http://www.example.com/"); /* Redirect browser */
// Make sure that code below does not get executed when we redirect with exit;
exit; 
```

`header()` is used to send a raw HTTP header.

## Pasar parametros entre scripts php

Para pasar parametros sin formulario tenemos dos opciones:

### 1. Usamos la funcion header

```php
header(“Location:follow.php?name=$name”);
```

### 2. Con variables de Session

```php
<?php session_start(); ?>
```

With the session started, the `$_SESSION` array is used to store session data as
well as retrieve it.

```php
$_SESSION["password"] = $pw;
```

To read the session variable we use the array `$_SESSION`

```php
if($_SESSION["password"] == "1234")
```

For removing all session variables, there is the session_destroy function.

```php
session_destroy();
```

## keep the values in the form

To show the values in the input fields after the user hits the submit button, we add a little PHP script inside the value attribute of the input fields:

```php
Name: <input type="text" name="name" value="<?php echo $name;?>">

E-mail: <input type="text" name="email" value="<?php echo $email;?>">

Website: <input type="text" name="website" value="<?php echo $website;?>">

Comment: <textarea name="comment" rows="5" cols="40"><?php echo $comment;?></textarea>

Gender:
<input type="radio" name="gender"
<?php if (isset($gender) && $gender=="female") echo "checked";?>

value="female">Female
<input type="radio" name="gender"
<?php if (isset($gender) && $gender=="male") echo "checked";?>

value="male">Male
<input type="radio" name="gender"
<?php if (isset($gender) && $gender=="other") echo "checked";?>
value="other">Other
```
