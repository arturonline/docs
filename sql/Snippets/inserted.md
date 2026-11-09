# Obtener Id elemento insertado

Dialecto: SQL Server. Ver también: [Basic CRUD](Basic%20CRUD.md), [Merge](Merge.md).

| SGBD       | Cómo obtener los valores generados                        |
| ---------- | --------------------------------------------------------- |
| SQL Server | `OUTPUT inserted.*` (recomendado) o `SCOPE_IDENTITY()`    |
| MySQL      | `LAST_INSERT_ID()` (primer id del último INSERT de la sesión) |
| PostgreSQL | `INSERT ... RETURNING id`                                 |

## 1. Usando OUTPUT

### 1.1 Creamos tablas de ejemplo

```sql
CREATE TABLE Empleados (
    EmpleadoID   INT IDENTITY(1,1) PRIMARY KEY,
    Nombre       NVARCHAR(50),
    Departamento NVARCHAR(50)
);

CREATE TABLE EmpleadoLog (
    EmpleadoID    INT,
    FechaRegistro DATETIME2 DEFAULT SYSDATETIME()
);
```

### 1.2 Declarar variable de tabla para recoger los IDs

```sql
DECLARE @NuevosEmpleados TABLE (
    EmpleadoID INT,
    Nombre     NVARCHAR(50)
);
```

### 1.3 Insertar y recoger los valores con OUTPUT

```sql
INSERT INTO Empleados (Nombre, Departamento)
OUTPUT inserted.EmpleadoID, inserted.Nombre INTO @NuevosEmpleados (EmpleadoID, Nombre)
VALUES ('Ana', 'Ventas'), ('Luis', 'Marketing'), ('Marta', 'Finanzas');

SELECT * FROM @NuevosEmpleados;
```

| EmpleadoID | Nombre |
| ---------- | ------ |
| 1          | Ana    |
| 2          | Luis   |
| 3          | Marta  |

> Sin `INTO`, `OUTPUT` devuelve las filas como resultado al cliente. ⚠ Si la tabla tiene triggers activos, `OUTPUT` sin `INTO` da error: hay que usar `OUTPUT ... INTO`.

### 1.4 Usamos los valores recogidos

```sql
INSERT INTO EmpleadoLog (EmpleadoID)
SELECT EmpleadoID
FROM @NuevosEmpleados;
```

## 2. OUTPUT en UPDATE, DELETE y MERGE

`inserted` = valores nuevos, `deleted` = valores anteriores.

```sql
-- UPDATE: valor antes y después
UPDATE Empleados
SET Departamento = 'Comercial'
OUTPUT deleted.EmpleadoID, deleted.Departamento AS Antes, inserted.Departamento AS Despues
WHERE Departamento = 'Ventas';
-- 1 | Ventas | Comercial

-- DELETE: lo que se ha borrado (útil para archivar)
DELETE FROM Empleados
OUTPUT deleted.* INTO EmpleadosHistorico
WHERE Departamento = 'Finanzas';
```

Con `MERGE` se puede devolver la acción (`$action`) y **columnas de la tabla origen**, algo que `INSERT ... SELECT` no permite. Útil para mapear Id antiguo -> Id nuevo al copiar datos:

```sql
DECLARE @Mapa TABLE (IdAntiguo INT, IdNuevo INT);

MERGE INTO Empleados AS t
USING EmpleadosImport AS s
ON 1 = 0                                -- nunca coincide: siempre inserta
WHEN NOT MATCHED THEN
    INSERT (Nombre, Departamento) VALUES (s.Nombre, s.Departamento)
OUTPUT s.IdImport, inserted.EmpleadoID INTO @Mapa (IdAntiguo, IdNuevo);
```

## 3. Usando SCOPE_IDENTITY()

Devuelve el último IDENTITY generado **en el ámbito actual** (procedimiento/lote). Solo sirve para inserts de una fila; para varias filas usar OUTPUT.

```sql
DECLARE @Id INT;

INSERT INTO Empleados (Nombre, Departamento) VALUES ('Pere', 'IT');

SET @Id = SCOPE_IDENTITY();
SELECT @Id;   -- 4
```

Dentro de un procedimiento, para devolverlo al llamante, usar un parámetro `OUTPUT` (ver [Return values](Return%20values.md)):

```sql
CREATE OR ALTER PROCEDURE dbo.CrearEmpleado
    @Nombre NVARCHAR(50),
    @Departamento NVARCHAR(50),
    @Id INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Empleados (Nombre, Departamento) VALUES (@Nombre, @Departamento);
    SET @Id = SCOPE_IDENTITY();
END;
```

| Función               | Devuelve                                                         |
| --------------------- | ---------------------------------------------------------------- |
| `SCOPE_IDENTITY()`    | Último identity de la sesión **y** del ámbito actual (correcto)  |
| `@@IDENTITY`          | Último de la sesión en cualquier ámbito: incluye los de triggers ⚠ |
| `IDENT_CURRENT('T')`  | Último de la tabla `T` en cualquier sesión ⚠ (no usar para esto) |

Nota: es preferible usar OUTPUT (funciona con varias filas, con `SEQUENCE`/defaults y no depende del ámbito).
