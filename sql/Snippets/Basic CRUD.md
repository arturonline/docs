# CRUD

Dialecte: SQL Server (T-SQL); les diferències amb MySQL/PostgreSQL s'indiquen al costat.
Vegeu també: [Obtindre l'Id inserit (OUTPUT)](inserted.md), [Merge (upsert)](Merge.md), [Transactions](Transactions.md), [Joins](Joins.md).

Taula d'exemple:

```sql
CREATE TABLE alumnes (
    codi  INT PRIMARY KEY,
    nom   NVARCHAR(30) NOT NULL,
    poble CHAR(5) NULL
);
```

⚠ Les cadenes van entre cometes **simples** (`'Pep'`). En SQL Server `"Pep"` és un identificador (nom de columna), no una cadena. Per a Unicode en SQL Server: `N'Pep'`.

## Inserir dades (Create)

```sql
-- Inserir una fila indicant quines columnes i en quin ordre es van a posar els valors
INSERT INTO alumnes (codi, nom) VALUES (25, 'Pep');

-- Sense indicar columnes: s'han d'introduir tots els valors i en l'ordre en què estan les columnes en la taula
INSERT INTO alumnes VALUES (26, 'Pepa', '46410');

-- Inserir diverses files en una sola sentència
INSERT INTO alumnes (codi, nom) VALUES
    (27, 'Pepet'),
    (28, 'Maria'),
    (29, 'Joan');

-- Insert into Select: inserir el resultat d'una consulta en una taula existent
INSERT INTO alumnes_backup (codi, nom, poble)
SELECT codi, nom, poble
FROM alumnes
WHERE poble IS NOT NULL;

-- Crear una taula nova a partir d'una consulta
SELECT codi, nom INTO alumnes_copia FROM alumnes;           -- SQL Server
-- CREATE TABLE alumnes_copia AS SELECT codi, nom FROM alumnes;   -- MySQL / PostgreSQL
```

## Llegir dades (Read)

```sql
SELECT codi, nom FROM alumnes WHERE poble = '46410' ORDER BY nom;

SELECT TOP (10) * FROM alumnes ORDER BY codi;                -- SQL Server
-- SELECT * FROM alumnes ORDER BY codi LIMIT 10;              -- MySQL / PostgreSQL

-- Paginació (SQL Server 2012+, també estàndard)
SELECT codi, nom FROM alumnes
ORDER BY codi
OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;
```

## Modificar dades (Update)

```sql
UPDATE alumnes
SET nom = 'Josep', poble = '46410'
WHERE nom = 'Pep';
```

Update amb JOIN (la sintaxi canvia segons el SGBD):

```sql
-- SQL Server
UPDATE a
SET a.poble = p.cp
FROM alumnes a
JOIN pobles p ON p.nom = a.nom_poble;

-- MySQL
-- UPDATE alumnes a JOIN pobles p ON p.nom = a.nom_poble SET a.poble = p.cp;

-- PostgreSQL
-- UPDATE alumnes a SET poble = p.cp FROM pobles p WHERE p.nom = a.nom_poble;
```

## Esborrar dades (Delete)

```sql
DELETE FROM alumnes WHERE codi = 25;

-- Delete amb JOIN (SQL Server): alumnes d'un poble concret
DELETE a
FROM alumnes a
JOIN pobles p ON p.cp = a.poble
WHERE p.nom = 'Sueca';

-- Buidar la taula (més ràpid, no es pot amb FKs que la referencien; reinicia IDENTITY)
TRUNCATE TABLE alumnes;
```

## Upsert (inserir o actualitzar)

| SGBD        | Sintaxi                                                     |
| ----------- | ----------------------------------------------------------- |
| SQL Server  | `MERGE` (vegeu [Merge](Merge.md)) o `UPDATE` + `INSERT ... WHERE NOT EXISTS` en una transacció |
| MySQL       | `INSERT ... ON DUPLICATE KEY UPDATE`                        |
| PostgreSQL  | `INSERT ... ON CONFLICT (codi) DO UPDATE SET ...`           |

## Bones pràctiques

- Abans d'un `UPDATE`/`DELETE`, executa un `SELECT` amb el mateix `WHERE` per a vore quines files canviaran.
- Sense `WHERE` es modifiquen/esborren **totes** les files.
- Per a canvis delicats, fes-los dins d'una transacció i comprova `@@ROWCOUNT` abans del `COMMIT` (vegeu [Transactions](Transactions.md)).
- `OUTPUT inserted.* / deleted.*` mostra què s'ha canviat (vegeu [inserted](inserted.md)).
