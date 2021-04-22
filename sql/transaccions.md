# MYSQL: Transaccions

Una transacció és un conjunt de sentències INSERT, UPDATE i/o DELETE que constitueixen una operació única. És a dir: podrem fer que s’executen totes les sentències de la transacció o cap.

## Sintaxis

Les sentències que volem que formen part d’una transacció han de començar amb el
comandament BEGIN (o START TRANSACTION) i acabar amb COMMIT (per a que es facen
efectives les sentències) o ROLLBACK (per a anul·lar les sentències de la transacció):

| Es confirma    | S'anul·la      |
| -------------- | -------------- |
| BEGIN;         | BEGIN;         |
| (sentencia 1); | (sentencia 1); |
| (sentencia 2); | (sentencia 2); |
| ...            | ...            |
| COMMIT;        | ROLLBACK       |

Example:

```sql
BEGIN;
    UPDATE comptes SET saldo = saldo – 100 WHERE nom = 'Alícia';
    UPDATE comptes SET saldo = saldo + 100 WHERE nom = 'Pep';
COMMIT;
```

Si després del 1r UPDATE es perdera la connexió amb la BD, no es faria el 2n UPDATE
però tampoc el COMMIT. Això fa que els efectes del 1r UPDATE no es facen efectius realment en la base de dades.

## DEFERRABLE

La propietat DEFERRABLE fa que les comprovacions d’existència es realitzen en el moment en que acabe la transacció.

## Rollback

```sql
BEGIN;
UPDATE comptes
SET saldo = saldo - 100
WHERE nom = 'Alícia';
-- Ací ens adonem que el compte d’Alícia és negatiu.
-- Per tant, volem anul·lar l’update anterior, i farem el ROLLBACK
ROLLBACK;
```

## SAVEPOINTS

Els savepoints són “punts de salvament”, que permeten descartar selectivament parts de la transacció (admetent la resta de la transacció).

Suposem que traspassem 100 € del compte d’Alícia al compte de Pep, però que, només haver-ho fet, ens adonem que volíem traspassar-ho al compte de Maria i no al de Pep. Si ens haguérem curat en salut utilitzant transaccions i savepoints, podríem desfer només unes sentències de la transacció i no tota:

```sql
BEGIN;

UPDATE comptes SET saldo = saldo - 100.00
    WHERE nom = 'Alícia';
SAVEPOINT seguretat1;

UPDATE comptes SET saldo = saldo + 100.00
    WHERE nom = 'Pep';
-- Ai, no! No li ho havia d’haver sumat a Pep, sinó a Maria.
ROLLBACK TO seguretat1;

UPDATE comptes SET saldo = saldo + 100.00
    WHERE nom = 'Maria';

COMMIT;
```

```sql
Podem retrocedir a un savepoint sempre que volguem:

BEGIN;
    Acció 1;
    Acció 2;
    SAVEPOINT segur1;
    Acció 3;
    Acció 4;
    ROLLBACK TO segur1;
    Acció 5;
    ROLLBACK TO segur1;
    ...
COMMIT;
```

⚠ Si retrocedint a un savepoint en concret, s’esborraran automàticament tots els savepoints definits després d’eixe savepoint. Açò ho fa el sistema per a alliberar recursos.

```sql
BEGIN;
    Acció 1;
    Acció 2;
    SAVEPOINT segur1;
    Acció 3;
    Acció 4;
    SAVEPOINT segur2;
    Acció 5;
    ROLLBACK TO segur2
    Acció 6;
    ROLLBACK TO segur1; -- Ací s’esborrarà el SAVEPOINT segur2
...
COMMIT;
```