---
Titulo: 'Queries'
Descripción: 'Running queries'
tags: [php, pdo, queries]
Fecha: 09/03/2023
---

- [1. Running Queries with 'query'](#1-running-queries-with-query)
- [2. Preparing statements](#2-preparing-statements)
  - [With named variables](#with-named-variables)
  - [With positional Question marks](#with-positional-question-marks)
  - [bindValue vs bindParam](#bindvalue-vs-bindparam)
  - [IN, LIKE, LIMIT and ORDER BY](#in-like-limit-and-order-by)
- [3. Getting the results](#3-getting-the-results)
  - [With foreach](#with-foreach)
  - [With 'fetch' and 'fetchall'](#with-fetch-and-fetchall)
    - [FETCH\_ASSOC](#fetch_assoc)
    - [FETCH\_OBJ](#fetch_obj)
    - [FETCH\_CLASS](#fetch_class)
    - [FETCH\_NUM](#fetch_num)
    - [FETCH\_COLUMN](#fetch_column)
    - [FETCH\_KEY\_PAIR and FETCH\_GROUP](#fetch_key_pair-and-fetch_group)
- [4. Running INSERT, UPDATE or DELETE statements](#4-running-insert-update-or-delete-statements)
- [5. Error handling](#5-error-handling)
- [6. Otras utilidades](#6-otras-utilidades)

> Conexión: ver [Conexion.md](Conexion.md) (los ejemplos usan `$pdo` con `ERRMODE_EXCEPTION` y `FETCH_ASSOC` por defecto). Transacciones: [Transactions.md](Transactions.md).

Tabla de ejemplo (las salidas de los ejemplos se basan en estos datos):

```sql
CREATE TABLE users (
    id    INTEGER PRIMARY KEY AUTO_INCREMENT,
    name  VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    age   INT,
    city  VARCHAR(50)
);
-- (1, 'Ana', 'ana@x.com', 30, 'Madrid'), (2, 'Luis', 'luis@x.com', 25, 'Valencia'), (3, 'Eva', 'eva@x.com', 35, 'Madrid')
```

## 1. Running Queries with 'query'

Only for queries **without user data** (no variables in the SQL):

```php
$stmt = $pdo->query('SELECT name FROM users'); // PDOStatement
```

> ⚠️ Never concatenate user input into SQL: `"... WHERE id = $_GET[id]"` → SQL injection. Use prepared statements.

## 2. Preparing statements

The SQL and the data travel separately: the values are never interpreted as SQL.

### With named variables

```php
$sql = 'INSERT INTO comment (text, created_at) VALUES (:commenttext, CURDATE())';

$stmt = $pdo->prepare($sql);
$stmt->bindValue(':commenttext', $_POST['commenttext']);
$stmt->execute();

// or more concise (the leading ":" in the keys is optional)
$stmt->execute(['commenttext' => $_POST['commenttext']]);
```

### With positional Question marks

```php
$sql = 'INSERT INTO comment (text, created_at) VALUES (?, ?)';
$stmt = $pdo->prepare($sql);

$comment = "Good idea!";
$date = date('Y-m-d');   // ⚠️ "CURDATE()" as a parameter would be inserted as the literal text, not the function

$stmt->bindValue(1, $comment);
$stmt->bindValue(2, $date);
$stmt->execute();

// or more concise
$stmt->execute([$comment, $date]);
```

> Named and positional placeholders cannot be mixed in the same query. A placeholder can only replace a **value**, never a table/column name or SQL keyword.

### bindValue vs bindParam

- `bindValue()` binds the **value** at that moment.
- `bindParam()` binds the **variable** by reference: its value is read when `execute()` runs. Useful to reuse a statement in a loop.

```php
$stmt = $pdo->prepare('INSERT INTO users (name, email) VALUES (?, ?)');
$stmt->bindParam(1, $name);
$stmt->bindParam(2, $email);

foreach ([['X', 'x@x.com'], ['Y', 'y@x.com']] as [$name, $email]) {
    $stmt->execute(); // uses the current values of $name and $email
}
```

Optional third parameter: the type (`PDO::PARAM_INT`, `PDO::PARAM_STR`, `PDO::PARAM_BOOL`, `PDO::PARAM_NULL`, `PDO::PARAM_LOB`):

```php
$stmt = $pdo->prepare('SELECT name FROM users WHERE age BETWEEN :min AND :max');
$stmt->bindValue(':min', 20, PDO::PARAM_INT);
$stmt->bindValue(':max', 30, PDO::PARAM_INT);
$stmt->execute();
print_r($stmt->fetchAll(PDO::FETCH_COLUMN));
// Array ( [0] => Ana [1] => Luis )
```

### IN, LIKE, LIMIT and ORDER BY

```php
// IN: one placeholder per value
$ids = [1, 3];
$in  = implode(',', array_fill(0, count($ids), '?'));   // "?,?"
$stmt = $pdo->prepare("SELECT name FROM users WHERE id IN ($in)");
$stmt->execute($ids);
print_r($stmt->fetchAll(PDO::FETCH_COLUMN)); // Array ( [0] => Ana [1] => Eva )

// LIKE: the wildcards go in the value, not in the SQL
$stmt = $pdo->prepare('SELECT name FROM users WHERE name LIKE ?');
$stmt->execute(['%' . $search . '%']);   // $search = 'v' -> Array ( [0] => Eva )

// LIMIT/OFFSET: bind as integers (with emulated prepares, execute([...]) would quote them as strings)
$stmt = $pdo->prepare('SELECT name FROM users ORDER BY id LIMIT ? OFFSET ?');
$stmt->bindValue(1, 2, PDO::PARAM_INT);
$stmt->bindValue(2, 1, PDO::PARAM_INT);
$stmt->execute();
print_r($stmt->fetchAll(PDO::FETCH_COLUMN)); // Array ( [0] => Luis [1] => Eva )

// ORDER BY a column chosen by the user: placeholders can't be used -> allow-list
$allowed = ['name', 'age'];
$sort = in_array($_GET['sort'] ?? '', $allowed, true) ? $_GET['sort'] : 'id';
$dir  = ($_GET['dir'] ?? '') === 'desc' ? 'DESC' : 'ASC';
$stmt = $pdo->query("SELECT name FROM users ORDER BY $sort $dir");
// ?sort=age -> Luis, Ana, Eva
```

## 3. Getting the results

### With foreach

```php
$stmt = $pdo->query('SELECT name FROM users');
foreach ($stmt as $row) {
    echo $row['name'] . "\n";
}
// Ana
// Luis
// Eva
```

This method is memory-friendly, as it delivers the rows one by one instead of building an array with all of them (but note that the MySQL driver buffers the whole result set on the client by default: `PDO::MYSQL_ATTR_USE_BUFFERED_QUERY`).

### With 'fetch' and 'fetchall'

To fetch results in PDO, you have the option of `$stmt->fetch()` or `$stmt->fetchAll()`. The former fetches one row (or `false` when there are no more rows), or all if used in a loop. The latter returns the entire result set in an array (empty array if no rows). Use `fetch()` in a loop for big results.

```php
$stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
$stmt->execute([2]);
$user = $stmt->fetch();
print_r($user);
// Array ( [id] => 2 [name] => Luis [email] => luis@x.com [age] => 25 [city] => Valencia )

$stmt->execute([99]);
var_dump($stmt->fetch()); // bool(false)  -> not found

if (!$user) {
    http_response_code(404);
}
```

There are many fetch modes in PDO:

- `PDO::FETCH_NUM` Devuelve un array indexado cuyos keys son números.
- `PDO::FETCH_ASSOC` Devuelve un array indexado cuyos keys son el nombre de las columnas.
- `PDO::FETCH_BOTH` (por defecto) Devuelve un array indexado cuyos keys son tanto el nombre de las columnas como números.
- `PDO::FETCH_COLUMN` Fetch just one column from the next row of a result set. Scalar if `fetch()` is used or 1d array if `fetchAll()` is used.
- `PDO::FETCH_OBJ` Devuelve un objeto anónimo (`stdClass`) con nombres de propiedades que corresponden a las columnas.
- `PDO::FETCH_CLASS` Asigna los valores de las columnas a propiedades de una clase.
- `PDO::FETCH_KEY_PAIR` Array `columna1 => columna2`.
- `PDO::FETCH_GROUP` Agrupa las filas por el valor de la primera columna.

Examples:

#### FETCH_ASSOC

```php
$stmt = $pdo->prepare("SELECT * FROM users");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$stmt->execute();

// Mostramos los resultados (escapando siempre al imprimir en HTML)
while ($row = $stmt->fetch()) {
    echo "Nombre: " . htmlspecialchars($row["name"]) . " <br>";
    echo "Ciudad: " . htmlspecialchars($row["city"]) . " <br><br>";
}
```

#### FETCH_OBJ

```php
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([1]);

// Indicamos el fetch mode cuando llamamos a fetch:
while ($row = $stmt->fetch(PDO::FETCH_OBJ)) {
    echo $row->name . " - " . $row->city;
}
// Ana - Madrid
```

#### FETCH_CLASS

```php
final class User
{
    public int $id;
    public string $name;
    public ?string $email = null;
    public ?int $age = null;
    public ?string $city = null;

    public function greet(): string {
        return "Hi, I'm $this->name";
    }
}

$users = $pdo->query('SELECT * FROM users')->fetchAll(PDO::FETCH_CLASS, User::class);
echo $users[0]->greet(); // Hi, I'm Ana

// One row
$stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
$stmt->execute([1]);
$user = $stmt->fetchObject(User::class); // User|false
```

> The properties are assigned **before** the constructor runs. Add `PDO::FETCH_PROPS_LATE` to call the constructor first. Column names must match property names (use `AS` aliases in the SQL).

#### FETCH_NUM

```php
$stmt = $pdo->prepare("SELECT name, age FROM users WHERE age > ?");
$stmt->execute([26]);
$arr = $stmt->fetchAll(PDO::FETCH_NUM);

if (!$arr) exit('No rows');
var_export($arr);
$stmt = null;

// output:
// [
//   ['Ana', 30],
//   ['Eva', 35],
// ]
```

#### FETCH_COLUMN

```php
$stmt = $pdo->query("SELECT name, city FROM users WHERE id = 1");

/* Fetch the second column (index 1) from the next row in the result set */
echo $stmt->fetchColumn(1); // Madrid

/* Single value (COUNT, MAX, exists...) */
echo $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn(); // 3

/* All the values of one column */
print_r($pdo->query('SELECT name FROM users ORDER BY name')->fetchAll(PDO::FETCH_COLUMN));
// Array ( [0] => Ana [1] => Eva [2] => Luis )
```

> ⚠️ Each `fetchColumn()` call moves to the **next row**: you can't read two columns of the same row with two calls.

#### FETCH_KEY_PAIR and FETCH_GROUP

```php
// Perfect for <select> options
print_r($pdo->query('SELECT id, name FROM users')->fetchAll(PDO::FETCH_KEY_PAIR));
// Array ( [1] => Ana [2] => Luis [3] => Eva )

print_r($pdo->query('SELECT city, name FROM users')->fetchAll(PDO::FETCH_GROUP | PDO::FETCH_COLUMN));
// Array ( [Madrid] => Array ( [0] => Ana [1] => Eva ) [Valencia] => Array ( [0] => Luis ) )
```

## 4. Running INSERT, UPDATE or DELETE statements

Just like it was shown above, what you need is to prepare a query with placeholders, and then execute it.

```php
$sql = "UPDATE users SET name = ? WHERE id = ?";
$pdo->prepare($sql)->execute([$name, $id]);
```

If you want to get the number of affected rows, keep the statement:

```php
$stmt = $pdo->prepare("UPDATE users SET city = ? WHERE city = ?");
$stmt->execute(['Barcelona', 'Madrid']);
echo $stmt->rowCount(); // 2
```

Get the generated id after an INSERT:

```php
$stmt = $pdo->prepare('INSERT INTO users (name, email) VALUES (:name, :email)');
$stmt->execute(['name' => 'Eva', 'email' => 'eva@x.com']);
echo $pdo->lastInsertId(); // "3" (string)
// PostgreSQL: lastInsertId('users_id_seq') or "INSERT ... RETURNING id"
```

Save a password (never in plain text):

```php
$stmt = $pdo->prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
$stmt->execute([$email, password_hash($password, PASSWORD_DEFAULT)]);
// login: password_verify($password, $row['password_hash'])  (see ../Sessions.md)
```

## 5. Error handling

With `ERRMODE_EXCEPTION` every error throws a `PDOException`:

```php
try {
    $pdo->prepare('INSERT INTO users (name, email) VALUES (?, ?)')->execute(['Dup', 'ana@x.com']);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') {   // SQLSTATE (string): integrity constraint violation
        echo 'This email is already registered';
    } else {
        throw $e;
    }
}
// $e->errorInfo = ['23000', 19, 'UNIQUE constraint failed: users.email']  (SQLSTATE, driver code, message)
// (in MySQL the driver code for a duplicate key is 1062)
```

## 6. Otras utilidades

- `execute()` ejecuta una sentencia preparada lo que permite enlazar parámetros y evitar tener que escapar los parámetros. Devuelve `true`/`false`.
- `exec()` ejecuta una sentencia SQL **sin parámetros** y devuelve el número de filas afectadas. No devuelve resultados de una sentencia SELECT. Útil para DDL (`CREATE TABLE`...).
- `lastInsertId()` Este método devuelve el id autoincrementado del último registro insertado en esa conexión.
- `rowCount()` Devuelve el número de filas afectadas por la última sentencia INSERT/UPDATE/DELETE de ese statement (con SELECT no es fiable: usa `COUNT(*)`).
- `columnCount()` Número de columnas del resultado.
- `closeCursor()` Libera el resultado para poder ejecutar otra consulta (algunos drivers lo necesitan si no se han leído todas las filas).
- `quote()` Escapa y entrecomilla un string (`$pdo->quote("O'Reilly")` → `'O''Reilly'`). Mejor usar sentencias preparadas.
- `debugDumpParams()` Muestra la SQL y los parámetros enlazados (depuración).
