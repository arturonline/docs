---
Titulo: Migración PDO
Descripción: Migración de mysql a PDO
tags: [php, mysql, pdo, migración]
Fecha: 09/03/2023
---

> ⚠️ La extensión `mysql_*` se marcó obsoleta en PHP 5.5 y **se eliminó en PHP 7.0**: el código que la usa no funciona en ninguna versión soportada. Alternativas: PDO (recomendado, multi-motor) o `mysqli`.
>
> Ver: [Conexion.md](Conexion.md), [Queries.md](Queries.md), [Transactions.md](Transactions.md).

- [Tabla de equivalencias](#tabla-de-equivalencias)
- [mysql\_connect](#mysql_connect)
- [mysql\_select\_db](#mysql_select_db)
- [mysql\_query](#mysql_query)
- [vsprintf / mysql\_real\_escape\_string (sustitución de parámetros)](#vsprintf--mysql_real_escape_string-sustitución-de-parámetros)
- [mysql\_fetch\_assoc](#mysql_fetch_assoc)
- [mysql\_fetch\_row](#mysql_fetch_row)
- [mysql\_num\_rows](#mysql_num_rows)
- [mysql\_num\_fields](#mysql_num_fields)
- [mysql\_result](#mysql_result)
- [mysql\_insert\_id y mysql\_affected\_rows](#mysql_insert_id-y-mysql_affected_rows)
- [mysql\_error](#mysql_error)

## Tabla de equivalencias

| mysql_* | PDO |
| ------- | --- |
| `mysql_connect()` + `mysql_select_db()` | `new PDO($dsn, $user, $pass, $options)` |
| `mysql_query($sql)` | `$pdo->query($sql)` (sin datos) / `$pdo->prepare($sql)->execute($params)` |
| `mysql_real_escape_string($v)` | sentencias preparadas (no hace falta escapar) |
| `mysql_fetch_assoc($r)` | `$stmt->fetch(PDO::FETCH_ASSOC)` |
| `mysql_fetch_row($r)` | `$stmt->fetch(PDO::FETCH_NUM)` |
| `mysql_fetch_array($r)` | `$stmt->fetch(PDO::FETCH_BOTH)` |
| `mysql_fetch_object($r)` | `$stmt->fetch(PDO::FETCH_OBJ)` / `$stmt->fetchObject(Clase::class)` |
| `mysql_num_rows($r)` | `count($stmt->fetchAll())` o `SELECT COUNT(*)` |
| `mysql_num_fields($r)` | `$stmt->columnCount()` |
| `mysql_result($r, $fila, $col)` | `$stmt->fetchColumn($col)` (fila siguiente) |
| `mysql_insert_id()` | `$pdo->lastInsertId()` |
| `mysql_affected_rows()` | `$stmt->rowCount()` |
| `mysql_error()` | `PDOException` (`$e->getMessage()`, `$e->errorInfo`) |
| `mysql_close()` | `$pdo = null;` |

## mysql_connect

```php
# mysql (obsoleto)

// PARAMETROS
$DB_HOST = 'localhost';
$DB_USER = 'app_user';
$DB_PASS = '********';
$DB_NAME = 'APP_DB';

// CONEXION
$DB_LINK_SRV = mysql_connect($DB_HOST, $DB_USER, $DB_PASS);
define('DB_LINK_SRV', $DB_LINK_SRV);

// SELECCIONO BASE DATOS
if (!DB_LINK_SRV) {
    die(include("errors/errorDBC.php"));
} else {
    mysql_select_db($DB_NAME, DB_LINK_SRV);
}
```

```php
# pdo

$host    = '127.0.0.1';
$db      = 'test';
$user    = 'root';
$pass    = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];
try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    exit(include 'errors/errorDBC.php');
}
```

> 🔒 Credenciales: nunca en el código ni en la documentación; usar variables de entorno (ver [Conexion.md](Conexion.md#credenciales-fuera-del-código)).

## mysql_select_db

Sets the current active database on the server that's associated with the specified link identifier. Every subsequent call to `mysql_query()` will be made on the active database.

```php
# mysql
$con = mysql_connect($dbHost, $dbUser, $dbPassword) or die(mysql_error());
mysql_select_db($dbName, $con);
```

In PDO we select the database in the connection DSN. To change it, open a new connection or (MySQL) run `USE`:

```php
# pdo
$dsn = "mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4";
$pdo = new PDO($dsn, $dbUser, $dbPassword, $options);

$pdo->exec('USE otra_bd'); // MySQL: change the active database on the same connection
```

>💡 To perform queries in a different database without creating a new connection, in MySQL we can also qualify the table name:
>
> `INSERT INTO databasename.tablename ...`
> `SELECT ... FROM databasename.tablename ...`

## mysql_query

```php
# mysql
$result = mysql_query('SELECT defe FROM information WHERE term = 1', DB_LINK_SRV);

# pdo: query without user data
$stmt = $pdo->query('SELECT defe FROM information WHERE term = 1');

# pdo: with data, ALWAYS prepare and execute
$stmt = $pdo->prepare('SELECT defe FROM information WHERE term = ?');
$stmt->execute([$term]);
```

## vsprintf / mysql_real_escape_string (sustitución de parámetros)

```php
# mysql: build the SQL string by hand -> SQL injection risk if a value is not escaped
$comment = mysql_real_escape_string($_POST['commenttext'], DB_LINK_SRV);

$cSentencia = vsprintf("INSERT INTO comments (text) VALUES ('%s')", [$comment]);
$oRes = mysql_query($cSentencia, DB_LINK_SRV);
```

```php
# pdo: placeholders, no escaping needed
$sql = 'INSERT INTO comments (text) VALUES (:commenttext)';
$stmt = $pdo->prepare($sql);
$stmt->execute(['commenttext' => $_POST['commenttext']]);
```

## mysql_fetch_assoc

```php
# mysql
while ($row = mysql_fetch_assoc($result)) {
    echo $row['name'];
}
```

```php
# pdo
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo $row['name'];
}

// or simply (the statement is iterable)
foreach ($stmt as $row) {
    echo $row['name'];
}
```

## mysql_fetch_row

```php
# mysql
while ($oRow = mysql_fetch_row($oRes)) {
    echo $oRow[0];
}
```

```php
# pdo
while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
    echo $row[0];
}
```

## mysql_num_rows

```php
# mysql
$total = mysql_num_rows($result);
```

```php
# pdo: rowCount() is not reliable for SELECT in all drivers
$rows  = $stmt->fetchAll();
$total = count($rows);

// if you only need the number:
$stmt = $pdo->prepare('SELECT COUNT(*) FROM users WHERE city = ?');
$stmt->execute([$city]);
$total = (int) $stmt->fetchColumn();
```

## mysql_num_fields

Get number of fields in result.

```php
# mysql
$columnCount = mysql_num_fields($result);
```

```php
# pdo (it's a method of the statement, not of the connection)
$columnCount = $stmt->columnCount();
echo $pdo->query('SELECT name, city FROM users')->columnCount(); // 2
```

## mysql_result

Outputs 1st employee's name:

```php
# mysql
$result = mysql_result(mysql_query("SELECT name FROM work.employee"), 0);

# pdo
$result = $pdo->query('SELECT name FROM work.employee')->fetchColumn();
```

Outputs third employee's name:

```php
# mysql
$result = mysql_result(mysql_query("SELECT name FROM work.employee"), 2);

# pdo: ⚠️ fetchColumn(2) means "column 2", not "row 2"
$result = $pdo->query('SELECT name FROM work.employee LIMIT 1 OFFSET 2')->fetchColumn();
// or
$result = $pdo->query('SELECT name FROM work.employee')->fetchAll(PDO::FETCH_COLUMN)[2] ?? null;
```

## mysql_insert_id y mysql_affected_rows

```php
# mysql
mysql_query("INSERT INTO users (name) VALUES ('Ana')");
$id = mysql_insert_id();

mysql_query("DELETE FROM users WHERE city = 'Madrid'");
$deleted = mysql_affected_rows();
```

```php
# pdo
$pdo->prepare('INSERT INTO users (name) VALUES (?)')->execute(['Ana']);
$id = (int) $pdo->lastInsertId();

$stmt = $pdo->prepare('DELETE FROM users WHERE city = ?');
$stmt->execute(['Madrid']);
$deleted = $stmt->rowCount();
```

## mysql_error

```php
# mysql
$result = mysql_query($sql) or die(mysql_error());
```

```php
# pdo (ERRMODE_EXCEPTION)
try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
} catch (PDOException $e) {
    error_log($e->getMessage());      // details only in the log
    exit('Database error');           // generic message for the user
}
```
