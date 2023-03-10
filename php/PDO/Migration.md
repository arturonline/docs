---
Titulo: 'Migración PDO'
Descripción: 'Migración de mysql a PDO'
tags: [php, mysql, pdo, migración]
Fecha: 09/03/2023'
---

# Migración

## mysql_result

`mysql_result` -> Retrieves the contents of one cell from a MySQL result set.

Ex:

```php
$result = mysql_query('SELECT name FROM work.employee');
echo mysql_result($result, 2); // outputs third employee's name
```

### Conversion

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