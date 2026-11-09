# Merge

Dialect: SQL Server (2008+). See also: [inserted / OUTPUT](inserted.md), [Transactions](Transactions.md), [Basic CRUD](Basic%20CRUD.md#upsert-inserir-o-actualitzar).

Synchronizes a target table with a source: insert, update and/or delete in a single statement.

## Sintaxis

```sql
MERGE target_table WITH (HOLDLOCK) AS target
USING source_table AS source
ON merge_condition

WHEN MATCHED [AND extra_condition] THEN
    -- UPDATE or DELETE
WHEN NOT MATCHED [BY TARGET] [AND extra_condition] THEN
    -- INSERT (row exists in source, not in target)
WHEN NOT MATCHED BY SOURCE [AND extra_condition] THEN
    -- UPDATE or DELETE (row exists in target, not in source)
[OUTPUT $action, inserted.*, deleted.*];   -- optional
-- ⚠ MERGE must end with a semicolon
```

## Example 1

```sql
CREATE TABLE products     (product_id INT PRIMARY KEY, product_name NVARCHAR(50), price DECIMAL(10,2));
CREATE TABLE new_products (product_id INT PRIMARY KEY, product_name NVARCHAR(50), price DECIMAL(10,2));

INSERT INTO products     VALUES (1, 'Pen', 1.00), (2, 'Pencil', 0.50), (3, 'Eraser', 0.30);
INSERT INTO new_products VALUES (1, 'Pen', 1.20), (2, 'Pencil', 0.50), (4, 'Ruler', 2.00);

MERGE products WITH (HOLDLOCK) AS target
USING new_products AS source
ON target.product_id = source.product_id
WHEN MATCHED AND (target.product_name <> source.product_name OR target.price <> source.price) THEN
    UPDATE SET target.product_name = source.product_name,
               target.price        = source.price
WHEN NOT MATCHED BY TARGET THEN
    INSERT (product_id, product_name, price)
    VALUES (source.product_id, source.product_name, source.price)
WHEN NOT MATCHED BY SOURCE THEN
    DELETE
OUTPUT $action, deleted.product_id AS old_id, inserted.product_id AS new_id, inserted.price;
```

| $action | old_id | new_id | price |
| ------- | ------ | ------ | ----- |
| UPDATE  | 1      | 1      | 1.20  |
| DELETE  | 3      | NULL   | NULL  |
| INSERT  | NULL   | 4      | 2.00  |

Product 2 is unchanged, so the `AND (...)` condition skips a useless update. (Output row order is not guaranteed.)

> ⚠ `<>` does not detect changes from/to `NULL`. For nullable columns use the null-safe pattern:
> `WHEN MATCHED AND EXISTS (SELECT source.col1, source.col2 EXCEPT SELECT target.col1, target.col2) THEN ...`
> (SQL Server 2022+: `target.col IS DISTINCT FROM source.col`).

## Example 2

Sync employees from a view; delete only the target rows that came from that origin.

```sql
MERGE [RRHH].[Empleados] WITH (HOLDLOCK) AS Tar
USING [Kais].[vw_DameRWEmpleados] AS Src
ON Tar.CodEmpleado = Src.CodEmpleado

WHEN MATCHED THEN
    UPDATE SET
        Tar.RefExterna        =  Src.RefExterna
    ,   Tar.nEstado           =  Src.nEstado
    -- CodEmpleado is the join key: no need to update it
    ,   Tar.NomEmpleado       =  Src.NomEmpleado
    ,   Tar.ApeEmpleado       =  Src.ApeEmpleado
    ,   Tar.Telefono          =  Src.Telefono
    ,   Tar.Movil             =  Src.Movil
    ,   Tar.Nif               =  Src.Nif
    ,   Tar.Direccion         =  Src.Direccion
    ,   Tar.CodPostal         =  Src.CodPostal
    ,   Tar.Poblacion         =  Src.Poblacion
    ,   Tar.CodProvin         =  Src.CodProvin
    ,   Tar.Provincia         =  Src.Provincia
    ,   Tar.CodPais           =  Src.CodPais
    ,   Tar.Mail              =  Src.Mail
    ,   Tar.Observa           =  Src.Observa
    ,   Tar.feAlta            =  Src.feAlta
    ,   Tar.feNacimiento      =  Src.feNacimiento
    ,   Tar.feBaja            =  Src.feBaja
WHEN NOT MATCHED BY SOURCE AND (Tar.Origen = '1') THEN DELETE;
```

## Caveats

- **Duplicate keys in the source** -> error *"The MERGE statement attempted to UPDATE or DELETE the same row more than once"*. Deduplicate the source first (e.g. CTE with `ROW_NUMBER()`).
- **Concurrency**: without `WITH (HOLDLOCK)` (or `SERIALIZABLE`) two concurrent MERGEs can both decide "not matched" and insert duplicates / violate the PK.
- **Filtering the target**: do not put target filters in `ON` (e.g. `ON t.id = s.id AND t.active = 1`): non-matching rows are treated as "not matched" and can be inserted/deleted unexpectedly. Filter with a CTE as target instead:

```sql
WITH ActiveTarget AS (SELECT * FROM dbo.Products WHERE active = 1)
MERGE ActiveTarget AS t
USING dbo.NewProducts AS s ON t.product_id = s.product_id
WHEN MATCHED THEN UPDATE SET t.price = s.price;
```

- Triggers fire once per action type (insert/update/delete), and `@@ROWCOUNT` is the total.
- MERGE has had a number of bugs over the years (filtered indexes, indexed views, triggers, partitioning). Many teams prefer, for simple upserts, a separate `UPDATE` + `INSERT` inside a transaction:

```sql
SET XACT_ABORT ON;
BEGIN TRANSACTION;

UPDATE t WITH (UPDLOCK, SERIALIZABLE)
SET t.price = s.price
FROM dbo.products t
JOIN dbo.new_products s ON s.product_id = t.product_id;

INSERT INTO dbo.products (product_id, product_name, price)
SELECT s.product_id, s.product_name, s.price
FROM dbo.new_products s
WHERE NOT EXISTS (SELECT 1 FROM dbo.products t WHERE t.product_id = s.product_id);

COMMIT TRANSACTION;
```

## Other dialects

- **MySQL**: no MERGE. Use `INSERT ... ON DUPLICATE KEY UPDATE` (or `REPLACE INTO`, which deletes + inserts).
- **PostgreSQL**: `MERGE` since v15 (`RETURNING` since v17); for upserts usually `INSERT ... ON CONFLICT (id) DO UPDATE SET ...`.
