---
Titulo: 'Conexión PDO'
Descripción: 'Conexión a base de datos con librería PDO'
tags: [php, sql, bbdd]
Fecha: 09/03/2023
---

PDO (PHP Data Objects) es una capa de acceso común a varias bases de datos (MySQL/MariaDB, PostgreSQL, SQLite, SQL Server...). Solo cambia el DSN.

> Ver también: [Queries](Queries.md), [Transactions](Transactions.md), [Migración desde mysql_*](Migration.md).

## DSN por motor

```php
'mysql:host=localhost;port=3306;dbname=ies;charset=utf8mb4'   // MySQL / MariaDB
'pgsql:host=localhost;port=5432;dbname=ies'                   // PostgreSQL
'sqlsrv:Server=localhost,1433;Database=ies'                   // SQL Server (driver pdo_sqlsrv)
'sqlite:' . __DIR__ . '/data.sqlite'                          // SQLite (fichero)
'sqlite::memory:'                                             // SQLite en memoria (tests)
```

> Drivers instalados: `print_r(PDO::getAvailableDrivers());` → `Array ( [0] => mysql [1] => sqlite ... )`

## Conexión 1 (básica)

```php
try {
    // sin espacios en el DSN; charset en el DSN (no hace falta SET NAMES)
    $pdo = new PDO('mysql:host=localhost;dbname=ies;charset=utf8mb4', 'marta', '1234');

    // configure how our PDO object handles errors (ERRMODE_EXCEPTION is the default since PHP 8.0)
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo 'Database connection established.';
} catch (PDOException $e) {
    // ⚠️ don't show $e->getMessage() to the user: it can reveal host/user. Log it.
    error_log($e->getMessage());
    exit('Unable to connect to the database server');
}

// Close: PDO closes the connection when the object (and all its statements) are destroyed
$stmt = null;
$pdo = null;
```

> ⚠️ El charset correcto en MySQL es `utf8mb4` (`utf8` es un alias de `utf8mb3`, que no admite emojis ni algunos caracteres).

## Conexión 2 (recomendada)

```php
<?php
declare(strict_types=1);

$host    = '127.0.0.1';
$db      = 'test';
$user    = 'root';
$pass    = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // throw PDOException on errors
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // fetch() returns associative arrays
    PDO::ATTR_EMULATE_PREPARES   => false,                  // real prepared statements, native types (int stays int)
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    // rethrow without exposing the credentials in the stack trace
    throw new PDOException($e->getMessage(), (int) $e->getCode());
}
```

## Credenciales fuera del código

No guardar usuario/contraseña en el repositorio: usar variables de entorno (o un fichero de configuración ignorado por git).

```php
$pdo = new PDO(
    getenv('DB_DSN') ?: 'mysql:host=127.0.0.1;dbname=test;charset=utf8mb4',
    getenv('DB_USER') ?: 'root',
    getenv('DB_PASS') ?: '',
    $options,
);
```

## Función / clase reutilizable

Una sola conexión por petición:

```php
<?php
// db.php
declare(strict_types=1);

function db(): PDO {
    static $pdo = null;   // se crea la primera vez y se reutiliza

    return $pdo ??= new PDO(
        getenv('DB_DSN'),
        getenv('DB_USER') ?: null,
        getenv('DB_PASS') ?: null,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ],
    );
}

// uso
$stmt = db()->prepare('SELECT name FROM users WHERE id = ?');
$stmt->execute([1]);
echo $stmt->fetchColumn();
```

## Ejemplo ejecutable con SQLite en memoria

Útil para probar sin servidor:

```php
<?php
$pdo = new PDO('sqlite::memory:', options: [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);

$pdo->exec('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)');
$pdo->prepare('INSERT INTO users (name) VALUES (?)')->execute(['Ana']);

echo $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);                 // sqlite
echo $pdo->query('SELECT name FROM users')->fetchColumn();      // Ana
```

## PHP 8.4: subclases por driver

`PDO::connect()` devuelve una subclase específica del driver (`Pdo\Mysql`, `Pdo\Pgsql`, `Pdo\Sqlite`...) con sus métodos propios:

```php
$db = PDO::connect('sqlite::memory:');
echo get_class($db); // Pdo\Sqlite
```

## Opciones útiles

| atributo | uso |
| -------- | --- |
| `PDO::ATTR_ERRMODE` | `ERRMODE_EXCEPTION` (por defecto en PHP 8), `ERRMODE_WARNING`, `ERRMODE_SILENT` |
| `PDO::ATTR_DEFAULT_FETCH_MODE` | `FETCH_ASSOC`, `FETCH_OBJ`, `FETCH_BOTH` (por defecto)... |
| `PDO::ATTR_EMULATE_PREPARES` | `false` para usar sentencias preparadas nativas |
| `PDO::ATTR_PERSISTENT` | `true` reutiliza conexiones entre peticiones (con cuidado) |
| `PDO::ATTR_TIMEOUT` | segundos de espera (depende del driver) |
