---
Titulo: Migración PDO
Descripción: Migración de mysql a PDO
tags: [php, mysql, pdo, migración]
Fecha: 09/03/2023
---

- [mysql\_connect](#mysql_connect)
- [mysql\_select\_db](#mysql_select_db)
- [mysql\_query](#mysql_query)
- [vsprintf (sustitición de parámetros)](#vsprintf-sustitición-de-parámetros)
- [mysql\_fetch\_assoc](#mysql_fetch_assoc)
- [mysql\_fetch\_row](#mysql_fetch_row)
- [mysql\_num\_fields](#mysql_num_fields)
- [mysql\_result](#mysql_result)


## mysql_connect

```php
# mysql

// PARAMETROS
$DB_HOST = 'localhost';
$DB_USER = 'wshop_user_golo';
$DB_PASS = '#W3B*Sh0pUs3r-G0lo%';
$DB_NAME = 'WEBSHOP_CORE_GOLOSAL';

// CONEXION
$DB_LINK_SRV = mysql_connect($DB_HOST, $DB_USER, $DB_PASS);
define('DB_LINK_SRV', $DB_LINK_SRV);

// SELECCIONO BASE DATOS
if(!DB_LINK_SRV){
    die( include("errors/errorDBC.php") );
}
else{
    mysql_select_db($DB_NAME, DB_LINK_SRV);
}
```

```php
# pdo

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

## mysql_select_db

Sets the current active database on the server that's associated with the specified link identifier. Every subsequent call to `mysql_query()` will be made on the active database.

```php
$con = mysql_connect( $dbHost, $dbUser, $dbPassword ) or die( mysql_error() );
```

In PDO we select DataBase in the connection command. To change it, we have to open a new connection.

```php
$dsn = "mysql:host={$dbHost};dbname={$dbName}";
$dbh = new PDO( $dsn, $dbUser, $dbPassword );
```

>💡  To perform queries in a different database without create a new connection, in PDO we can use this MySQL syntax:
>
> `INSERT INTO databasename.tablename ...`
> `SELECT FROM databasename.tablename ...`

## mysql_query

```php
# pdo
$query = $db->query('SELECT defe FROM information WHERE term = 1');  

# if you want to prepare it (may be for security reasons) , you need to execute it:
$query = $db->prepare('SELECT defe FROM information WHERE term = 1');  
$query->execute();  
```

## vsprintf (sustitición de parámetros)

```php
$comment = "Good idea!";

$cQuery = "INSERT INTO comments values ( '%2$.s')";
$cQuery = vsprintf($cSentencia, $comment);
$oRes = mysql_query($cSentencia, DB_LINK);
```

```php
$comment = "Good idea!";

$sql = 'INSERT INTO comments values (:commenttext)';
$stmt = $pdo->prepare($sql);
$stmt -> execute([':commenttext' => $_POST['commenttext']]);
```

## mysql_fetch_assoc

```php
# mysql
$row = mysql_fetch_assoc( $result );              
```

```php
# pdo
$row = $stmt->fetch( PDO::FETCH_ASSOC );
``` 

## mysql_fetch_row

```php
# mysql
$row = mysql_fetch_row( $result );
while($oRow = mysql_fetch_row($oRes))
{ ... }
```

```php
# pdo
$row = $stmt->fetch( PDO::FETCH_NUM );
```

## mysql_num_fields

Get number of fields in result.

```php
# mysql
$columnCount = mysql_num_fields( $result );
```

```php
# pdo
$columnCount = $dbh->columnCount();
```

## mysql_result

Outputs 1st employee's name:

```php
# mysql
$result = mysql_result(mysql_query("SELECT name FROM work.employee"), 0);

# pdo
$result = $pdo->query('SELECT name FROM cars WHERE id = 3')->fetchColumn();
```

Outputs third employee's name:

```php
# mysql
$result = mysql_result(mysql_query("SELECT name FROM work.employee"), 2);

# pdo
$result = $pdo->query('SELECT name FROM cars WHERE id = 3')->fetchColumn(2);
```