---
Titulo: 'Queries'
Descripción: 'Running queries'
tags: [php, pdo, queries]
Fecha: 09/03/2023'
---

- [1. Running Queries with 'query'](#1-running-queries-with-query)
- [2. Preparing statements](#2-preparing-statements)
  - [With named variables](#with-named-variables)
  - [With positional Question marks](#with-positional-question-marks)
- [3. Getting the results](#3-getting-the-results)
  - [With foreach](#with-foreach)
  - [With 'fetch' and 'fetchall'](#with-fetch-and-fetchall)
    - [FETCH\_ASSOC](#fetch_assoc)
    - [FETCH\_OBJ](#fetch_obj)
    - [FETCH\_NUM](#fetch_num)
    - [FETCH\_COLUMN](#fetch_column)
- [4. Running INSERT, UPDATE or DELETE statements](#4-running-insert-update-or-delete-statements)
- [5. Otras utilidades](#5-otras-utilidades)


## 1. Running Queries with 'query'

```php
$stmt = $pdo->query('SELECT name FROM users');
```

## 2. Preparing statements

### With named variables

```php
// With Variables
$sql = 'INSERT INTO comment values (:commenttext,CURDATE())';

$stmt = $pdo->prepare($sql);
$stmt -> bindValue(':commenttext', $_POST['commenttext']);
$stmt -> execute();

// or more consice
$stmt -> execute([':commenttext' => $_POST['commenttext']]);
```

### With positional Question marks

```php
// With question mark
$sql = 'INSERT INTO comment values (?,?)';
$stmt = $dbh -> prepare($sql);

$comment = "Good idea!";
$date = "CURDATE()";

$stmt -> bindParam(1, $comment);
$stmt -> bindParam(2, $date);
$stmt -> execute();

// or more concise
$sql = 'INSERT INTO comment values (?,?)';
$stmt = $dbh -> prepare($sql);

$comment = "Good idea!";
$date = "CURDATE()";

$stmt->execute([$comment,$date]);
```

## 3. Getting the results 

### With foreach

```php
$stmt = $pdo->query('SELECT name FROM users');
foreach ($stmt as $row)
{
    echo $row['name'] . "\n";
}
```

This method is memory-friendly, as it doesn't load all the resulting rows in the memory but delivers them one by one (though keep in mind this issue).

### With 'fetch' and 'fetchall'

To fetch results in PDO, you have the option of `$stmt->fetch()` or `$stmt->fetchAll()`. The former is more versatile, as it can be used to fetch one row, or all if used in a loop. The latter is basically syntactic sugar, as it lets fetch your entire result set in an array with that one command. It is preferred to use $stmt->fetch() in a loop if you are modifying that array, as it saves you from having to "re-loop" it.

There are many fetch modes in PDO:

- `PDO::FETCH_NUM` returns enumerated array. Devuelve un array indexado cuyos keys son números.
- `PDO::FETCH_ASSOC` When only one row is expected. Devuelve un array indexado cuyos keys son el nombre de las columnas.
- `PDO::FETCH_BOTH` Devuelve un array indexado cuyos keys son tanto el nombre de las columnas como números.
- `PDO::FETCH_COLUMN` Fetch just one column from the next row of a result set. Scalar if `fetch()` is used or 1d array if `fetchAll()` is used.
- `PDO::FETCH_OBJ` Devuelve un objeto anónimo con nombres de propiedades que corresponden a las columnas.
- `PDO::FETCH_CLASS`  asigna los valores de las columnas a propiedades de una clase.

Examples:

#### FETCH_ASSOC

```php
// FETCH_ASSOC
$stmt = $dbh->prepare("SELECT * FROM Clientes");
$stmt->setFetchMode(PDO::FETCH_ASSOC);
$stmt->execute();

// Mostramos los resultados
while ($row = $stmt->fetch()){
    echo "Nombre: {$row["nombre"]} <br>";
    echo "Ciudad: {$row["ciudad"]} <br><br>";
}
```

#### FETCH_OBJ

```php
// FETCH_OBJ
$stmt = $dbh->prepare("SELECT * FROM Clientes");
// Ejecutamos
$stmt->execute();
// Ahora vamos a indicar el fetch mode cuando llamamos a fetch:
while($row = $stmt->fetch(PDO::FETCH_OBJ)){
    echo "Nombre: " . $row->nombre . "<br>";
    echo "Ciudad: " . $row->ciudad . "<br>";
}
```

#### FETCH_NUM

```php
// FETCH_NUM
$stmt = $pdo->prepare("SELECT first_name, squat, bench_press FROM myTable WHERE weight > ?");
$stmt->execute([200]);
$arr = $stmt->fetchAll(PDO::FETCH_NUM);

if(!$arr) exit('No rows');
var_export($arr);
$stmt = null;

// output:
// [
//   ['Thad', 305, 250], 
//   ['Larry', 225, 180]
// ]
```

#### FETCH_COLUMN

```php
// FETCH_COLUMN
$sth = $dbh->prepare("SELECT name, colour FROM fruit");
$sth->execute();

/* Fetch the first column from the next row in the result set */
print("Fetch the first column from the next row in the result set:\n");
$result = $sth->fetchColumn();
print("name = $result\n");

print("Fetch the second column from the next row in the result set:\n");
$result = $sth->fetchColumn(1);
print("colour = $result\n");
```

## 4. Running INSERT, UPDATE or DELETE statements

Just like it was shown above, what you need is to prepare a query with placeholders, and then execute it. 

```php
$sql = "UPDATE users SET name = ? WHERE id = ?";
$pdo->prepare($sql)->execute([$name, $id]);
```

However, if you want to get the number of affected rows, the code will have to be the same boresome three lines:

```php
$stmt = $pdo->prepare("DELETE FROM goods WHERE category = ?");
$stmt->execute([$cat]);
$deleted = $stmt->rowCount();
```

## 5. Otras utilidades

- `execute()` ejecuta una sentencia preparada lo que permite enlazar parámetros y evitar tener que escapar los parámetros.
- `exec()` ejecuta una sentencia SQL y devuelve el número de filas afectadas. Devuelve el número de filas modificadas o borradas, no devuelve resultados de una secuencia SELECT.
- `lastInsertId()` Este método devuelve el id autoincrementado del último registro en esa conexión.
- `rowCount()` Devuelve el número de filas afectadas por la última sentencia SQL.