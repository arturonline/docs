---
Titulo: 'Conexión PDO'
Descripción: 'Conexión a base de datos con librería PDO'
tags: [php, sql, bbdd]
Fecha: 09/03/2023'
---

## Conexión 1

```php
try {
    $pdo = new PDO("mysql:host=localhost; dbname=ies","marta", "1234");

    // configure how our PDO object handles errors
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Change enconding
    $pdo->exec('SET NAMES "utf8"');

    echo 'Database connection established.';
} catch (PDOException $e) {
    echo 'Unable to connect to the database server ' . $e->getMessage();
    exit();
}

// Close 
$pdo = null;
```

> ⚠️ Do NOT use single quotes!

## Conexión 2

```php
$host = '127.0.0.1';
$db   = 'test';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];
try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
```

