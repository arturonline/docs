---
Titulo: 'transactions'
Descripción: 'Running transactions'
tags: [php, pdo, transactions]
Fecha: 09/03/2023'
---

# Transactions

```php
try {
    $dbh->beginTransaction();
    $dbh->query("INSERT INTO Clientes (nombre, ciudad) VALUES ('Leila Birdsall', 'Madrid')");
    $dbh->query("INSERT INTO Clientes (nombre, ciudad) VALUES ('Brice Osterberg', 'Teruel')");
    $dbh->query("INSERT INTO Clientes (nombre, ciudad) VALUES ('Latrisha Wagar', 'Valencia')");
    $dbh->query("INSERT INTO Clientes (nombre, ciudad) VALUES ('Hui Riojas', 'Madrid')");
    $dbh->query("INSERT INTO Clientes (nombre, ciudad) VALUES ('Frank Scarpa', 'Barcelona')");
    $dbh->commit();
    echo "Se han introducido los nuevos clientes";
} catch (Exception $e){
    echo "Ha habido algún error";
    $dbh->rollback();
}
```