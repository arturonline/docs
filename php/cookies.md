---
Titulo: 'cookies'
Descripción: 'Cookies in PHP'
tags: [php, cookies]
Fecha: 09/03/2023'
---

## Cookies

```php
// setcookie(name, value, expire, path, domain, secure, httponly);

setcookie("lastvisit", date("H:i:s"), time() + 60*60); 
// name = "lastvisit"
// value= date("h:i:s")
// expire = time() + 60 * 60 -> This cookie expires after one hour

// Retrieve cookis
if (isset($_COOKIE['lastvisit'])) {
    echo "Last visit: " . $_COOKIE['lastvisit'];
}

// Delete a cookie
setcookie("lastvisit", 0, 0);
```