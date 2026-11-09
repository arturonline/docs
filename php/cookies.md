---
Titulo: 'cookies'
Descripción: 'Cookies in PHP'
tags: [php, cookies]
Fecha: 09/03/2023
---

## Cookies

A cookie is a small piece of data (max ~4 KB) that the server asks the browser to store and send back on every request to the same site.

- They are sent in the HTTP headers, so `setcookie()` must be called **before any output** (HTML, `echo`, whitespace before `<?php`...).
- A cookie set in this request is only available in `$_COOKIE` on the **next** request.
- The user can read and modify them: never store passwords or trust their content. For private data use [sessions](Sessions.md).

## Create a cookie

```php
<?php
// setcookie(name, value, options): bool   (array syntax, PHP 7.3+)
setcookie('lastvisit', date('H:i:s'), [
    'expires'  => time() + 60 * 60, // expires after one hour (0 = when the browser closes)
    'path'     => '/',              // available in the whole site
    'domain'   => '',               // current domain only
    'secure'   => true,             // only sent over HTTPS
    'httponly' => true,             // not accessible from JavaScript (document.cookie) -> mitigates XSS theft
    'samesite' => 'Lax',            // 'Strict' | 'Lax' | 'None' (None requires secure) -> mitigates CSRF
]);
```

Old positional syntax (no `samesite`):

```php
// setcookie(name, value, expires, path, domain, secure, httponly);
setcookie('lastvisit', date('H:i:s'), time() + 3600, '/', '', true, true);
```

> 💡 Reuse the same options with a helper:
>
> ```php
> function cookieOptions(int $ttl = 3600): array {
>     return ['expires' => time() + $ttl, 'path' => '/', 'secure' => true, 'httponly' => true, 'samesite' => 'Lax'];
> }
> setcookie('theme', 'dark', cookieOptions(86400 * 30)); // 30 days
> ```

## Retrieve cookies

```php
// Always escape: the value comes from the client
if (isset($_COOKIE['lastvisit'])) {
    echo 'Last visit: ' . htmlspecialchars($_COOKIE['lastvisit'], ENT_QUOTES, 'UTF-8');
}

// With a default value
$theme = $_COOKIE['theme'] ?? 'light';

// Validate against an allow-list
$theme = in_array($theme, ['light', 'dark'], true) ? $theme : 'light';
```

## Delete a cookie

Set it again with an expiration date in the past, **with the same path and domain** used to create it:

```php
setcookie('lastvisit', '', [
    'expires'  => time() - 3600,
    'path'     => '/',
    'secure'   => true,
    'httponly' => true,
    'samesite' => 'Lax',
]);
unset($_COOKIE['lastvisit']); // also remove it from the current request
```

## Storing arrays

A cookie only holds strings. Use `json_encode()` (never `unserialize()` on user data: object injection):

```php
$cart = ['apple' => 2, 'pear' => 1];
setcookie('cart', json_encode($cart), ['expires' => time() + 86400, 'path' => '/', 'httponly' => true, 'samesite' => 'Lax']);

// next request
$cart = json_decode($_COOKIE['cart'] ?? '[]', true) ?: [];
print_r($cart);
// Output: Array ( [apple] => 2 [pear] => 1 )
```

## Example: visit counter

```php
<?php
declare(strict_types=1);

$visits = (int) ($_COOKIE['visits'] ?? 0) + 1;

setcookie('visits', (string) $visits, [
    'expires'  => time() + 60 * 60 * 24 * 365, // 1 year
    'path'     => '/',
    'httponly' => true,
    'samesite' => 'Lax',
]);
?>
<p><?= $visits === 1 ? 'Welcome!' : "Visit number $visits" ?></p>
<!-- Output (third visit): Visit number 3 -->
```

## Tamper-proof cookies (signed with HMAC)

If you need to trust a value the client stores, sign it with a secret key:

```php
const SECRET = 'change-me-long-random-string'; // keep it out of the repo (env var)

function signedValue(string $value): string {
    return $value . '|' . hash_hmac('sha256', $value, SECRET);
}

function verifySigned(?string $cookie): ?string {
    if ($cookie === null || !str_contains($cookie, '|')) {
        return null;
    }
    [$value, $mac] = explode('|', $cookie, 2);
    return hash_equals(hash_hmac('sha256', $value, SECRET), $mac) ? $value : null;
}

setcookie('uid', signedValue('42'), ['expires' => time() + 3600, 'path' => '/', 'httponly' => true, 'samesite' => 'Lax']);
$uid = verifySigned($_COOKIE['uid'] ?? null); // '42', or null if it was modified
```

## Session cookie options

The session ID is itself a cookie; configure it before `session_start()`. See [Sessions](Sessions.md#secure-session-cookie).

```php
session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => true, 'httponly' => true, 'samesite' => 'Lax']);
session_start();
```
