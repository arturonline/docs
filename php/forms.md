# php forms

> Next: [forms 2](forms2.md) (validation flow, redirects, keeping values, CSRF). See also [Sessions](Sessions.md), [Filesystem uploads](Filesystem.md#upload-files), [PDO prepared statements](PDO/Queries.md).

```html
<!-- Main.html -->
<body>
  <form action="prove.php" method="POST">
    Name: <input type="text" name="name" /><br />
    Surname: <input type="text" name="surname" /><br />
    <input type="submit" value="Send" />
  </form>
</body>
```

```php
<?php
// prove.php
$name    = $_POST['name'] ?? '';     // ?? avoids "Undefined array key" warnings
$name    = $_REQUEST['name'] ?? '';  // $_GET + $_POST (+ $_COOKIE): avoid, be explicit
$surname = $_POST['surname'] ?? '';

// ALWAYS escape user data when printing it in HTML (prevents XSS)
echo 'Hello ' . htmlspecialchars($name) . ' ' . htmlspecialchars($surname);
// Input: <script>alert(1)</script>  ->  Output: Hello &lt;script&gt;alert(1)&lt;/script&gt;
```

## Request vs get vs post

- You should use `$_GET` (`method="GET"`) when someone is requesting data from your application (search, filters, pagination). Parameters go in the URL, so they can be bookmarked; never use it for passwords.
- And you should use `$_POST` when someone is pushing (inserting or updating; or deleting) data to your application.
- `$_REQUEST` mixes both, so you don't know where the data came from. Prefer `$_GET`/`$_POST`.

```php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // the form was submitted
}
```

## Data validation

We need to test data from the form before using it. **Validate input, escape output.**

- `isset($var)` -> var exists and is not null
- `is_null($var)` -> var is null
- `empty($var)` -> var is empty (`null`, `0`, `"0"`, `false`, `""`, `[]`) or does not exist. ⚠️ `empty("0")` is `true`.
- `trim($var)` -> remove whitespace before checking for empty strings.

Escaping / cleaning:

- `htmlspecialchars($var)` -> converts `& < > " '` to HTML entities. Use it every time you print user data in HTML. Since PHP 8.1 the defaults are `ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML401` and `UTF-8`, so the explicit form `htmlspecialchars($_GET["nombre"], ENT_QUOTES, 'UTF-8')` is only needed for older versions.
- `strip_tags($var)` -> removes HTML and PHP tags from var (not a security measure on its own).

```php
echo htmlspecialchars("O'Reilly & <b>"); // O&#039;Reilly &amp; &lt;b&gt;
echo strip_tags('<h1>Hello World!</h1>'); // Hello World!
```

> 💡 Helper for templates: `function e(?string $s): string { return htmlspecialchars($s ?? ''); }` → `<?= e($name) ?>`

## filters

PHP filters are used to validate and sanitize external input.

The `filter_var()` function filters a single variable with a specified filter. It takes these pieces of data:

- The variable you want to check
- The type of check to use
- Optional options/flags

It returns the filtered value, or `false` if validation fails.

> ⚠️ `FILTER_SANITIZE_STRING` is **deprecated since PHP 8.1**. Use `htmlspecialchars()` when printing, or `strip_tags()` if you need to remove tags.

```php
$email = "john.doe@example.com";

// Validate e-mail
if (filter_var($email, FILTER_VALIDATE_EMAIL) !== false) {
    echo "$email is a valid email address";
} else {
    echo "$email is not a valid email address";
}
// john.doe@example.com is a valid email address
```

```php
filter_var('42',  FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 120]]); // int(42)
filter_var('130', FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 120]]); // false
filter_var('abc', FILTER_VALIDATE_INT);                                                         // false
filter_var('3.5', FILTER_VALIDATE_FLOAT);                                                       // float(3.5)
filter_var('yes', FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE);  // true  ("yes", "on", "1", "true")
filter_var('https://php.net', FILTER_VALIDATE_URL);               // "https://php.net"
filter_var('192.168.1.1', FILTER_VALIDATE_IP);                    // "192.168.1.1"
```

Read and validate directly from the request with `filter_input()` (returns `null` if the field doesn't exist):

```php
$age = filter_input(INPUT_POST, 'age', FILTER_VALIDATE_INT);
if ($age === null || $age === false) {
    $errors['age'] = 'Age must be a number';
}
```

Validate several fields at once:

```php
$data = filter_var_array($_POST, [
    'name'  => ['filter' => FILTER_CALLBACK, 'options' => 'trim'],
    'age'   => ['filter' => FILTER_VALIDATE_INT, 'options' => ['min_range' => 0]],
    'email' => FILTER_VALIDATE_EMAIL,
]);
// $_POST = ['name' => '  Ana  ', 'age' => '30', 'email' => 'bad']
// $data  = ['name' => 'Ana', 'age' => 30, 'email' => false]
```

> 📝 [Filter list](https://www.php.net/manual/es/filter.filters.validate.php)

## Regex

The HTML `pattern` attribute only validates in the browser (it can be bypassed): **always validate again on the server**.

```html
<!-- form.html -->
<form action="follow.php" method="POST">
  Name: <input type="text" name="name" required /><br />
  NIF: <input type="text" pattern="[0-9]{8}[A-Z]" name="dni" required /><br />
  <input type="submit" name="button" value="Send">
</form>
```

```php
<?php
// follow.php
declare(strict_types=1);

function validNif(string $nif): bool {
    if (!preg_match('/^(\d{8})([A-Z])$/', strtoupper($nif), $m)) {
        return false;
    }
    return 'TRWAGMYFPDXBNJZSQVHLCKE'[(int) $m[1] % 23] === $m[2]; // control letter
}

$name = trim($_POST['name'] ?? '');
$dni  = trim($_POST['dni'] ?? '');

if (validNif($dni)) {
    echo 'Hello, ' . htmlspecialchars($name) . '. Correct NIF';
} else {
    echo 'Invalid NIF';
}
// validNif('12345678Z') -> true, validNif('12345678A') -> false
```

## Input types

### text

```html
<label for="fname">First name</label><br />
<input type="text" id="fname" name="fname" /><br />
```

```php
$fname = $_POST['fname'] ?? '';
echo htmlspecialchars($fname);
```

### Password

```html
<input type="password" name="password" autocomplete="current-password" />
```

```php
// Never echo or store a password in plain text: hash it
$hash = password_hash($_POST['password'], PASSWORD_DEFAULT); // store $hash in the DB

// Login: compare against the stored hash
if (password_verify($_POST['password'], $hashFromDb)) {
    // correct password
}
```

### checkbox

```html
<fieldset>
  <legend>Please select which sports you like</legend>
  <label>
    Baseball
    <input type="checkbox" name="sports[]" value="baseball" />
  </label><br />
  <label>
    Basketball
    <input type="checkbox" name="sports[]" value="basketball" />
  </label>
</fieldset>
```

```php
// Unchecked checkboxes are NOT sent at all
$allowed = ['baseball', 'basketball'];
$sports  = array_intersect($_POST['sports'] ?? [], $allowed); // keep only valid values

echo $sports ? 'You play ' . implode(', ', $sports) : 'No sports';
// You play baseball, basketball

// Single checkbox
$accept = isset($_POST['accept']);
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
$lang = $_POST['fav_language'] ?? null;
if (in_array($lang, ['HTML', 'CSS', 'JavaScript'], true)) {
    echo htmlspecialchars($lang);
}
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
$car = $_POST['cars'] ?? '';
echo "<b>You have a " . htmlspecialchars($car) . "</b>";
?>
```

Generate the options from an array and keep the selected one:

```php
<?php $cars = ['volvo' => 'Volvo', 'saab' => 'Saab', 'fiat' => 'Fiat', 'audi' => 'Audi']; ?>
<select name="cars">
  <?php foreach ($cars as $value => $label): ?>
    <option value="<?= htmlspecialchars($value) ?>" <?= ($_POST['cars'] ?? '') === $value ? 'selected' : '' ?>>
      <?= htmlspecialchars($label) ?>
    </option>
  <?php endforeach ?>
</select>
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
$cars = $_POST['cars'] ?? [];   // array (thanks to the [] in the name)
foreach ($cars as $car) {
    echo htmlspecialchars($car) . "<br>\n";
}
```

### Other HTML5 types

`email`, `number`, `date`, `url`, `tel`, `range`, `color`... They help the user but **don't replace server-side validation**:

```php
$date = DateTimeImmutable::createFromFormat('!Y-m-d', $_POST['birth'] ?? ''); // <input type="date"> sends Y-m-d
$qty  = filter_input(INPUT_POST, 'qty', FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
```

### File

See [Upload Files](Filesystem.md#upload-files).
