# php forms

```php
// Main.html
<body>
  <form action="prove.php" method="POST">
    Name: <input type="text" name="name" /><br />
    Surname: <input type="text" name="surname" /><br />
    <input type="submit" value="Send" />
  </form>
</body>
```

```php
// prove.php
$name = $_POST['name'];
$name = $_REQUEST['name'];

$surname = $_POST['surname'];
```

## Request vs get vs post

- You should use `$_GET` when someone is requesting data from your application.
- And you should use `$_POST` when someone is pushing (inserting or updating ; or deleting) data to your application.

## Data validation

We need to test data from the form before use it.

- `isset($var)` -> var is not null
- `is_null($var)` -> var is null
- `empty($var)` -> var is empty (null, 0, false, "") or does not exist.

- `strip_tags($var)` -> removes html and php tags from var
- `htmlspecialchars($_GET["nombre"], ENT_QUOTES, 'UTF-8'));`

## filters

PHP filters are used to validate and sanitize external input.

The `filter_var()` function filters a single variable with a specified filter. It takes two pieces of data:

- The variable you want to check
- The type of check to use

```php
$str = "<h1>Hello World!</h1>";
$newstr = filter_var($str, FILTER_SANITIZE_STRING);
echo $newstr;

// Hello World!
```

```php
$email = "john.doe@example.com";

// Remove all illegal characters from email
$email = filter_var($email, FILTER_SANITIZE_EMAIL);

// Validate e-mail
if (!filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
  echo("$email is a valid email address");
} else {
  echo("$email is not a valid email address");
}

// john.doe@example.com is a valid email address
```

## Regex

```php
// form.html
<form action="follow.php" method="POST">
Name: <input type="text" name="name"/><br />
NIF: <input type="text" pattern="[0-9]{8}[A-Z]{1}" name="dni" /><br />
<input type="submit" name="button" value="Send">
</form>

// follow.php
$name=$_POST['name'];
echo "Hello, $name. Correct Nif";
```

> 📝 [Filter list](https://www.php.net/manual/es/filter.filters.validate.php)

## Input types

### text

```html
<label for="fname">First name</label><br />
<input type="text" name="fname" /><br />
```

```php
$fname = $_REQUEST['fname'];
echo $fname;
```

### Password

```html
<input type="password" name="ssn" />
```

```php
$ssn = $_REQUEST['ssn'];
echo $ssn;
```

### checkbox

```html
<fieldset>
  <legend>Please select which sports you like</legend>
  <label>
    Baseball
    <input type="checkbox" name="baseball" /><br />
  </label>
  <label>
    Basketball
    <input type="checkbox" name="basketball" /><br />
  </label>
</fieldset>
```

```php
echo "You play ";
if (isset($_POST['basketball'])) echo 'basketball<br>';
if (isset($_POST['baseball'])) echo 'baseball';

```

### Radio

```html
<input type="radio" id="html" name="fav_language" value="HTML" />
<label for="html">HTML</label><br />
<input type="radio" id="css" name="fav_language" value="CSS" />
<label for="css">CSS</label><br />
<input type="radio" id="javascript" name="fav_language" value="JavaScript" />
<label for="javascript">JavaScript</label>
```

```php
echo $_POST['fav_language'];
```

### Select

```html
<label for="cars">Choose a car:</label>
<select id="cars" name="cars">
  <option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
  <option value="fiat">Fiat</option>
  <option value="audi">Audi</option>
</select>
```

```php
<?php
echo "<b>You have a ".$_POST['cars'];
?>
```

### multiple select

```html
<label for="cars">Choose a car:</label>
<select id="cars" name="cars[]" size="4" multiple>
  <option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
  <option value="fiat">Fiat</option>
  <option value="audi">Audi</option>
</select>
```

```php
$cars = $_REQUEST['cars'];
foreach ($cars as $car)
echo "$car<BR>\n";
```
