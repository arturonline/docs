# forms 2

> Anterior: [php forms](forms.md) (inputs, filtros, escape). Ver también [Sessions](Sessions.md), [cookies](cookies.md).

## form validation

### 1. En tres pasos

`[ Formulario.html ] <-> [ Validacion.php ] -> [ Resultado.php ]`

- **Pagina formulario**: es la pagina con el formulario.
- **Pagina validacion** solo tiene una funcion, validar el contenido de un formulario.
- **Pagina resultado**: recibe el formulario ya validado y realiza las acciones pertinentes.

### 2. En dos pasos

`[ Formulario.html ] <-> [ Resultado.php (+ validacion) ]`

La validación se hace en la misma pagina de resultado.

### 3. En un paso

Lo hacemos todo en la página de formulario (el formulario se envía a sí mismo). Ver el [ejemplo completo](#ejemplo-completo-formulario-en-un-paso).

> ⚠️ La validación en el navegador (`required`, `pattern`, `type="email"`) es solo comodidad para el usuario: **siempre** hay que validar en el servidor.

## Navegar entre paginas PHP

Podemos navegar entre páginas con la instrucción `header`:

```php
header("Location: https://www.example.com/"); /* Redirect browser */
// Make sure that code below does not get executed when we redirect with exit;
exit;
```

`header()` is used to send a raw HTTP header. It must be called **before any output** (HTML, `echo`, espacios antes de `<?php`...), si no: *"Cannot modify header information - headers already sent"*.

### Patrón Post/Redirect/Get (PRG)

Después de procesar un POST correcto, redirigir: así recargar la página (F5) no reenvía el formulario.

```php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$errors) {
    saveData($data);
    header('Location: gracias.php', true, 303); // 303 See Other -> el navegador hace GET
    exit;
}
```

## Pasar parametros entre scripts php

Para pasar parametros sin formulario tenemos dos opciones:

### 1. Usamos la funcion header (query string)

```php
// Codificar SIEMPRE los valores (espacios, &, acentos...)
header('Location: follow.php?' . http_build_query(['name' => $name, 'id' => 5]));
exit;
// $name = 'Ana María' -> follow.php?name=Ana+Mar%C3%ADa&id=5

// o para un único valor:
header('Location: follow.php?name=' . urlencode($name)); // 'Ana & co' -> Ana+%26+co
```

```php
// follow.php -> el valor llega en $_GET y es visible/modificable por el usuario
$name = $_GET['name'] ?? '';
echo htmlspecialchars($name);
```

### 2. Con variables de Session

Los datos se guardan en el servidor (el usuario no los ve ni los puede modificar).

```php
<?php session_start(); ?>
```

With the session started, the `$_SESSION` array is used to store session data as
well as retrieve it.

```php
$_SESSION['user'] = $name;
```

To read the session variable we use the array `$_SESSION`:

```php
// ⚠️ Nunca guardar ni comparar contraseñas en claro: usar password_hash()/password_verify()
if (isset($_SESSION['user'])) {
    echo 'Hola ' . htmlspecialchars($_SESSION['user']);
}
```

For removing all session variables and ending the session, see [Sessions → End a Session](Sessions.md#end-a-session).

```php
$_SESSION = [];
session_destroy();
```

### Mensajes flash

Mensaje que se muestra una sola vez después de una redirección:

```php
// página que procesa
$_SESSION['flash'] = 'Datos guardados';
header('Location: index.php', true, 303);
exit;

// index.php
if (isset($_SESSION['flash'])) {
    echo '<p>' . htmlspecialchars($_SESSION['flash']) . '</p>';
    unset($_SESSION['flash']);
}
```

## CSRF protection

Un ataque CSRF hace que el navegador del usuario (con su sesión iniciada) envíe un formulario desde otra web. Defensa: un token aleatorio guardado en la sesión que se incluye en cada formulario POST y se comprueba al recibirlo.

```php
<?php
// csrf.php
function csrfToken(): string {
    return $_SESSION['csrf'] ??= bin2hex(random_bytes(32)); // 64 caracteres hex
}

function checkCsrf(): void {
    // hash_equals: comparación en tiempo constante
    if (!hash_equals($_SESSION['csrf'] ?? '', (string) ($_POST['csrf'] ?? ''))) {
        http_response_code(403);
        exit('Invalid CSRF token');
    }
}
```

```php
<form method="post">
    <input type="hidden" name="csrf" value="<?= htmlspecialchars(csrfToken()) ?>">
    ...
</form>
```

```php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    checkCsrf(); // antes de procesar nada
    // ...
}
```

> Complemento: cookies con `SameSite=Lax` (ver [cookies](cookies.md)). Los frameworks (Laravel, Symfony) ya incluyen protección CSRF.

## keep the values in the form

To show the values in the input fields after the user hits the submit button, we add a little PHP script inside the value attribute of the input fields. **Escape them** with `htmlspecialchars()` (si no, un valor como `"><script>...` rompe el HTML: XSS):

```php
Name: <input type="text" name="name" value="<?= htmlspecialchars($name ?? '') ?>">

E-mail: <input type="email" name="email" value="<?= htmlspecialchars($email ?? '') ?>">

Website: <input type="url" name="website" value="<?= htmlspecialchars($website ?? '') ?>">

Comment: <textarea name="comment" rows="5" cols="40"><?= htmlspecialchars($comment ?? '') ?></textarea>

Gender:
<?php foreach (['female' => 'Female', 'male' => 'Male', 'other' => 'Other'] as $value => $label): ?>
    <label>
        <input type="radio" name="gender" value="<?= $value ?>" <?= ($gender ?? '') === $value ? 'checked' : '' ?>>
        <?= $label ?>
    </label>
<?php endforeach ?>
```

> `<?= ... ?>` es la forma corta de `<?php echo ...; ?>` (siempre disponible).

## Ejemplo completo: formulario en un paso

```php
<?php
declare(strict_types=1);
session_start();
require 'csrf.php';

$errors = [];
$name = $email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    checkCsrf();

    $name  = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');

    if ($name === '') {
        $errors['name'] = 'Name is required';
    } elseif (mb_strlen($name) > 50) {
        $errors['name'] = 'Max 50 characters';
    }

    if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        $errors['email'] = 'Invalid email';
    }

    if (!$errors) {
        // guardar con PDO + sentencia preparada (ver PDO/Queries.md)
        $_SESSION['flash'] = "Thanks, $name!";
        header('Location: ' . $_SERVER['PHP_SELF'], true, 303); // PRG
        exit;
    }
}

function e(?string $s): string { return htmlspecialchars($s ?? ''); }
?>
<?php if (isset($_SESSION['flash'])): ?>
    <p class="ok"><?= e($_SESSION['flash']) ?></p>
    <?php unset($_SESSION['flash']) ?>
<?php endif ?>

<form method="post" novalidate>
    <input type="hidden" name="csrf" value="<?= e(csrfToken()) ?>">

    <label>Name <input name="name" value="<?= e($name) ?>"></label>
    <span class="error"><?= e($errors['name'] ?? '') ?></span><br>

    <label>Email <input name="email" type="email" value="<?= e($email) ?>"></label>
    <span class="error"><?= e($errors['email'] ?? '') ?></span><br>

    <button>Send</button>
</form>
<!-- Envío con name vacío -> "Name is required" junto al campo, y el email introducido se conserva -->
```

Ver [PDO / Queries](PDO/Queries.md) para guardar los datos con sentencias preparadas.
