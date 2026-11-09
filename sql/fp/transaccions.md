# MySQL: Transaccions

Una transacció és un conjunt de sentències INSERT, UPDATE i/o DELETE que constitueixen una operació única. És a dir: podrem fer que s'executen totes les sentències de la transacció o cap (atomicitat).

Propietats **ACID**: Atomicitat, Consistència, aIllament (*Isolation*) i Durabilitat.

⚠ En MySQL només els motors transaccionals (InnoDB, el motor per defecte) admeten transaccions. En taules MyISAM el ROLLBACK no desfà res.

Vegeu també: [Transactions en SQL Server](../Snippets/Transactions.md).

## Sintaxi

Les sentències que volem que formen part d'una transacció han de començar amb el
comandament `START TRANSACTION` (o `BEGIN`) i acabar amb `COMMIT` (per a que es facen
efectives les sentències) o `ROLLBACK` (per a anul·lar les sentències de la transacció):

| Es confirma         | S'anul·la           |
| ------------------- | ------------------- |
| START TRANSACTION;  | START TRANSACTION;  |
| (sentència 1);      | (sentència 1);      |
| (sentència 2);      | (sentència 2);      |
| ...                 | ...                 |
| COMMIT;             | ROLLBACK;           |

Taula d'exemple:

```sql
CREATE TABLE comptes (
    nom   VARCHAR(30) PRIMARY KEY,
    saldo DECIMAL(10,2) NOT NULL
) ENGINE = InnoDB;

INSERT INTO comptes VALUES ('Alícia', 500), ('Pep', 100), ('Maria', 0);
```

Exemple:

```sql
START TRANSACTION;
    UPDATE comptes SET saldo = saldo - 100 WHERE nom = 'Alícia';
    UPDATE comptes SET saldo = saldo + 100 WHERE nom = 'Pep';
COMMIT;
-- Alícia 400 | Pep 200 | Maria 0
```

Si després del 1r UPDATE es perdera la connexió amb la BD, no es faria el 2n UPDATE
però tampoc el COMMIT. Això fa que els efectes del 1r UPDATE no es facen efectius realment en la base de dades.

## AUTOCOMMIT

Per defecte MySQL està en mode `autocommit = 1`: cada sentència solta és una transacció que es confirma automàticament. `START TRANSACTION` el desactiva fins al COMMIT/ROLLBACK.

```sql
SELECT @@autocommit;     -- 1
SET autocommit = 0;      -- a partir d'ara cal fer COMMIT explícit en esta sessió
```

⚠ Les sentències DDL (`CREATE`, `ALTER`, `DROP`, `TRUNCATE`...) fan un **COMMIT implícit**: no es poden desfer amb ROLLBACK i a més confirmen el que hi haguera pendent.

## Rollback

```sql
START TRANSACTION;
UPDATE comptes
SET saldo = saldo - 100
WHERE nom = 'Alícia';
-- Ací ens adonem que el compte d'Alícia és negatiu.
-- Per tant, volem anul·lar l'update anterior, i farem el ROLLBACK
ROLLBACK;
```

## SAVEPOINTS

Els savepoints són "punts de salvament", que permeten descartar selectivament parts de la transacció (mantenint la resta de la transacció).

Suposem que traspassem 100 € del compte d'Alícia al compte de Pep, però que, només haver-ho fet, ens adonem que volíem traspassar-ho al compte de Maria i no al de Pep. Si ens haguérem curat en salut utilitzant transaccions i savepoints, podríem desfer només unes sentències de la transacció i no tota:

```sql
START TRANSACTION;

UPDATE comptes SET saldo = saldo - 100.00
    WHERE nom = 'Alícia';
SAVEPOINT seguretat1;

UPDATE comptes SET saldo = saldo + 100.00
    WHERE nom = 'Pep';
-- Ai, no! No li ho havia d'haver sumat a Pep, sinó a Maria.
ROLLBACK TO seguretat1;

UPDATE comptes SET saldo = saldo + 100.00
    WHERE nom = 'Maria';

COMMIT;
-- Alícia -100 | Pep sense canvis | Maria +100
```

Podem retrocedir a un savepoint sempre que vulguem:

```sql
START TRANSACTION;
    -- Acció 1;
    -- Acció 2;
    SAVEPOINT segur1;
    -- Acció 3;
    -- Acció 4;
    ROLLBACK TO segur1;   -- desfà 3 i 4
    -- Acció 5;
    ROLLBACK TO segur1;   -- desfà 5 (el savepoint continua existint)
    -- ...
COMMIT;
```

⚠ En retrocedir a un savepoint en concret, s'esborraran automàticament tots els savepoints definits després d'eixe savepoint. Açò ho fa el sistema per a alliberar recursos.

```sql
START TRANSACTION;
    -- Acció 1;
    -- Acció 2;
    SAVEPOINT segur1;
    -- Acció 3;
    -- Acció 4;
    SAVEPOINT segur2;
    -- Acció 5;
    ROLLBACK TO segur2;
    -- Acció 6;
    ROLLBACK TO segur1;   -- Ací s'esborrarà el SAVEPOINT segur2
    -- ...
COMMIT;
```

`RELEASE SAVEPOINT nom;` elimina un savepoint sense desfer res. COMMIT i ROLLBACK eliminen tots els savepoints.

## Transaccions dins de procediments (gestió d'errors)

Per a fer ROLLBACK automàticament si alguna sentència falla:

```sql
DELIMITER //
CREATE PROCEDURE traspassar(IN origen VARCHAR(30), IN desti VARCHAR(30), IN quantitat DECIMAL(10,2))
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;            -- torna a llançar l'error al client
    END;

    START TRANSACTION;
        UPDATE comptes SET saldo = saldo - quantitat WHERE nom = origen;
        IF (SELECT saldo FROM comptes WHERE nom = origen) < 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Saldo insuficient';
        END IF;
        UPDATE comptes SET saldo = saldo + quantitat WHERE nom = desti;
    COMMIT;
END //
DELIMITER ;

CALL traspassar('Alícia', 'Pep', 100);
```

## Nivells d'aïllament i bloquejos

Determinen què veu una transacció dels canvis d'altres transaccions concurrents.

| Nivell             | Lectures brutes | Lectures no repetibles | Files fantasma |
| ------------------ | --------------- | ---------------------- | -------------- |
| `READ UNCOMMITTED` | Sí              | Sí                     | Sí             |
| `READ COMMITTED`   | No              | Sí                     | Sí             |
| `REPEATABLE READ`  | No              | No                     | Sí (*)         |
| `SERIALIZABLE`     | No              | No                     | No             |

(*) En InnoDB, `REPEATABLE READ` és el nivell per defecte i amb els seus bloquejos evita també la majoria de fantasmes. En SQL Server i PostgreSQL el nivell per defecte és `READ COMMITTED`.

```sql
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;   -- per a la pròxima transacció

START TRANSACTION;
SELECT saldo FROM comptes WHERE nom = 'Alícia' FOR UPDATE;   -- bloqueja la fila fins al COMMIT
UPDATE comptes SET saldo = saldo - 100 WHERE nom = 'Alícia';
COMMIT;
```

## DEFERRABLE

La propietat `DEFERRABLE` (SQL estàndard) fa que les comprovacions de restriccions (p. ex. claus alienes) es realitzen en el moment en què acaba la transacció (COMMIT) i no en cada sentència.

⚠ **MySQL no la suporta**: comprova les claus alienes sentència a sentència. Sí que existeix en PostgreSQL i Oracle:

```sql
-- PostgreSQL
ALTER TABLE matricules
    ADD CONSTRAINT fk_alu FOREIGN KEY (alu) REFERENCES alumnes (num)
    DEFERRABLE INITIALLY DEFERRED;
```

En MySQL, l'alternativa (només per a càrregues puntuals) és `SET FOREIGN_KEY_CHECKS = 0;` ... `SET FOREIGN_KEY_CHECKS = 1;`, que desactiva la comprovació (no la retarda).
