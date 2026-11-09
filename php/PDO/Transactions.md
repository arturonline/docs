---
Titulo: 'transactions'
Descripción: 'Running transactions'
tags: [php, pdo, transactions]
Fecha: 09/03/2023
---

# Transactions

Una transacción agrupa varias sentencias en una unidad **atómica**: o se aplican todas (`commit`) o ninguna (`rollBack`).

> Conexión: [Conexion.md](Conexion.md). Consultas: [Queries.md](Queries.md).

| método | uso |
| ------ | --- |
| `$pdo->beginTransaction()` | desactiva el autocommit e inicia la transacción |
| `$pdo->commit()` | confirma los cambios |
| `$pdo->rollBack()` | deshace los cambios desde `beginTransaction()` |
| `$pdo->inTransaction()` | `true` si hay una transacción activa |

> ⚠️ En MySQL solo funcionan con tablas **InnoDB** (MyISAM ignora las transacciones). Las sentencias DDL (`CREATE`, `ALTER`, `DROP`...) provocan un commit implícito en MySQL.

## Ejemplo básico

Insertar varios registros con una sentencia preparada (se prepara una vez y se ejecuta N veces):

```php
$clientes = [
    ['Leila Birdsall', 'Madrid'],
    ['Brice Osterberg', 'Teruel'],
    ['Latrisha Wagar', 'Valencia'],
    ['Hui Riojas', 'Madrid'],
    ['Frank Scarpa', 'Barcelona'],
];

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare('INSERT INTO Clientes (nombre, ciudad) VALUES (?, ?)');
    foreach ($clientes as [$nombre, $ciudad]) {
        $stmt->execute([$nombre, $ciudad]);
    }

    $pdo->commit();
    echo 'Se han introducido ' . count($clientes) . ' clientes';
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log($e->getMessage());
    echo 'Ha habido algún error';
}
// Se han introducido 5 clientes
```

> 💡 Además de la seguridad, envolver muchos INSERT en una transacción es mucho más rápido (un solo commit en disco).

## Ejemplo: transferencia bancaria

```php
<?php
declare(strict_types=1);

// CREATE TABLE accounts (id INT PRIMARY KEY, owner VARCHAR(50), balance DECIMAL(10,2) CHECK (balance >= 0));
// (1, 'Ana', 100), (2, 'Luis', 50)

function transfer(PDO $pdo, int $from, int $to, float $amount): void
{
    $pdo->beginTransaction();
    try {
        $pdo->prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?')->execute([$amount, $from]);
        $pdo->prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?')->execute([$amount, $to]);
        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;            // relanzar: quien llama decide qué mostrar
    }
}

transfer($pdo, 1, 2, 30);
print_r($pdo->query('SELECT owner, balance FROM accounts')->fetchAll(PDO::FETCH_KEY_PAIR));
// Array ( [Ana] => 70 [Luis] => 80 )

try {
    transfer($pdo, 1, 2, 500);  // el CHECK falla en el primer UPDATE
} catch (PDOException $e) {
    echo 'Rolled back: ' . $e->getMessage();
}
// Rolled back: SQLSTATE[23000]: Integrity constraint violation: ... CHECK constraint failed ...

print_r($pdo->query('SELECT owner, balance FROM accounts')->fetchAll(PDO::FETCH_KEY_PAIR));
// Array ( [Ana] => 70 [Luis] => 80 )   -> sin cambios
```

## Helper reutilizable

```php
/**
 * @template T
 * @param callable(PDO): T $fn
 * @return T
 */
function transaction(PDO $pdo, callable $fn): mixed
{
    $pdo->beginTransaction();
    try {
        $result = $fn($pdo);
        $pdo->commit();
        return $result;
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }
}

$orderId = transaction($pdo, function (PDO $pdo) use ($userId, $items): int {
    $pdo->prepare('INSERT INTO orders (user_id) VALUES (?)')->execute([$userId]);
    $id = (int) $pdo->lastInsertId();

    $stmt = $pdo->prepare('INSERT INTO order_items (order_id, product_id, qty) VALUES (?, ?, ?)');
    foreach ($items as $productId => $qty) {
        $stmt->execute([$id, $productId, $qty]);
    }
    return $id;
});
```

## Bloquear filas (SELECT ... FOR UPDATE)

Evita que dos peticiones lean el mismo stock a la vez y vendan de más (MySQL/PostgreSQL):

```php
transaction($pdo, function (PDO $pdo) use ($productId, $qty): void {
    $stmt = $pdo->prepare('SELECT stock FROM products WHERE id = ? FOR UPDATE'); // bloquea la fila hasta el commit
    $stmt->execute([$productId]);
    $stock = (int) $stmt->fetchColumn();

    if ($stock < $qty) {
        throw new RuntimeException('Not enough stock');  // -> rollBack
    }

    $pdo->prepare('UPDATE products SET stock = stock - ? WHERE id = ?')->execute([$qty, $productId]);
});
```

## Savepoints

PDO no tiene transacciones anidadas (`beginTransaction()` dentro de otra lanza una excepción), pero se pueden usar savepoints con SQL:

```php
$pdo->beginTransaction();
$pdo->exec("INSERT INTO Clientes (nombre) VALUES ('A')");
$pdo->exec('SAVEPOINT sp1');
$pdo->exec("INSERT INTO Clientes (nombre) VALUES ('B')");
$pdo->exec('ROLLBACK TO SAVEPOINT sp1');   // deshace solo 'B'
$pdo->commit();                            // se guarda 'A'
```

## Nivel de aislamiento

```php
// MySQL (antes de beginTransaction)
$pdo->exec('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
$pdo->beginTransaction();
```

Niveles: `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ` (por defecto en InnoDB), `SERIALIZABLE`.
