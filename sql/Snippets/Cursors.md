# Cursores

Dialecto: SQL Server (T-SQL). Ver también: [While](While.md), [Transactions](Transactions.md), [Errors](Errors.md).

Un cursor recorre un resultado **fila a fila**. Es lento comparado con una sentencia basada en conjuntos (*set-based*), así que úsalo solo cuando de verdad haya que hacer algo por cada fila que no se pueda expresar en una sola sentencia, por ejemplo:

- Llamar a un procedimiento almacenado por cada fila.
- Ejecutar SQL dinámico distinto por fila (p. ej. una operación por cada tabla o base de datos).
- Procesos con lógica muy secuencial (acumulados con reglas complejas).

Si solo hay que hacer `UPDATE`/`DELETE`/`INSERT`, casi siempre hay una alternativa *set-based* (ver abajo).

## Example 1

```sql
-- 1. Vamos a imaginar que generamos una tabla con "Id" y "Nombres" que queremos recorrer
-- 1.1 Declaramos una variable de tabla para guardar los objetos
DECLARE @Objects TABLE (Id BIGINT, Name NVARCHAR(50));

-- 1.2 Declaramos variables auxiliares (una por cada columna del cursor)
DECLARE @Id BIGINT;
DECLARE @Name NVARCHAR(50);

-- 1.3 Obtenemos el listado de objetos que vamos a eliminar
INSERT INTO @Objects (Id, Name)
SELECT Id, Name FROM [Auth].[Objetos] WHERE IdSeccion = 23;

-- 2. Una vez tenemos la estructura sobre la que vamos a iterar, creamos el cursor
--    LOCAL FAST_FORWARD = solo avance, solo lectura, visible solo en este lote (el más eficiente)
DECLARE list_cursor CURSOR LOCAL FAST_FORWARD FOR
    SELECT Id, Name FROM @Objects;
OPEN list_cursor;

-- 3. Recorremos la tabla fila a fila asignando los valores de cada fila a las variables auxiliares
--    (el FETCH debe tener las mismas columnas, en el mismo orden, que el SELECT del cursor)
FETCH NEXT FROM list_cursor INTO @Id, @Name;
WHILE @@FETCH_STATUS = 0
BEGIN
    -- Hacemos algo con los datos, por ejemplo eliminar sus permisos
    DELETE FROM [Auth].[Permisos] WHERE IdObjeto = @Id;
    PRINT CONCAT('Eliminados permisos de ', @Name);

    -- 3.1 Pasamos a la siguiente fila
    FETCH NEXT FROM list_cursor INTO @Id, @Name;
END;

-- 4. Finalmente, cerramos y liberamos el cursor
CLOSE list_cursor;
DEALLOCATE list_cursor;
```

**Alternativa set-based** (una sola sentencia, mucho más rápida):

```sql
DELETE p
FROM [Auth].[Permisos] p
JOIN [Auth].[Objetos] o ON o.Id = p.IdObjeto
WHERE o.IdSeccion = 23;
```

## Example 2

```sql
-- Declare variables used in cursor
DECLARE @city_name VARCHAR(128);
DECLARE @country_name VARCHAR(128);
DECLARE @city_id INT;

-- Declare cursor
DECLARE cursor_city_country CURSOR LOCAL FAST_FORWARD FOR
    SELECT city.id, TRIM(city.city_name), TRIM(country.country_name)
    FROM city
    INNER JOIN country ON city.country_id = country.id;

-- Open cursor
OPEN cursor_city_country;

-- Loop through the cursor
FETCH NEXT FROM cursor_city_country INTO @city_id, @city_name, @country_name;
WHILE @@FETCH_STATUS = 0
BEGIN
    PRINT CONCAT('city id: ', @city_id, ' / city name: ', @city_name, ' / country name: ', @country_name);
    FETCH NEXT FROM cursor_city_country INTO @city_id, @city_name, @country_name;
END;

-- Close and deallocate cursor
CLOSE cursor_city_country;
DEALLOCATE cursor_city_country;
```

**Alternativa set-based**: devolver las líneas como resultado, o concatenarlas en un único texto con `STRING_AGG` (SQL Server 2017+):

```sql
SELECT CONCAT('city id: ', city.id, ' / city name: ', TRIM(city.city_name),
              ' / country name: ', TRIM(country.country_name)) AS line
FROM city
JOIN country ON city.country_id = country.id;

-- Todo en un solo PRINT
DECLARE @txt NVARCHAR(MAX);
SELECT @txt = STRING_AGG(CAST(CONCAT(city.id, ' - ', TRIM(city.city_name)) AS NVARCHAR(MAX)), CHAR(10))
              WITHIN GROUP (ORDER BY city.id)
FROM city;
PRINT @txt;
```

## Example 3: ejecutar un procedimiento por fila (uso legítimo del cursor)

```sql
DECLARE @db SYSNAME, @sql NVARCHAR(MAX);

DECLARE db_cursor CURSOR LOCAL FAST_FORWARD FOR
    SELECT name FROM sys.databases WHERE database_id > 4 AND state_desc = 'ONLINE';

OPEN db_cursor;
FETCH NEXT FROM db_cursor INTO @db;
WHILE @@FETCH_STATUS = 0
BEGIN
    SET @sql = N'USE ' + QUOTENAME(@db) + N'; EXEC sp_updatestats;';
    EXEC sys.sp_executesql @sql;
    FETCH NEXT FROM db_cursor INTO @db;
END;
CLOSE db_cursor;
DEALLOCATE db_cursor;
```

## Notas

- `@@FETCH_STATUS`: `0` = fila leída, `-1` = no hay más filas, `-2` = la fila ya no existe.
- Declara el cursor `LOCAL`: si el lote falla a mitad, un cursor `GLOBAL` (el valor por defecto de la BD) queda abierto y el siguiente `DECLARE` con el mismo nombre falla.
- Si el cuerpo del bucle puede fallar, envuélvelo en `TRY/CATCH` y cierra/libera el cursor también en el `CATCH`:

```sql
IF CURSOR_STATUS('local', 'list_cursor') >= 0 CLOSE list_cursor;
IF CURSOR_STATUS('local', 'list_cursor') >= -1 DEALLOCATE list_cursor;
```

- MySQL: los cursores solo existen dentro de procedimientos (`DECLARE c CURSOR FOR ...`, `DECLARE CONTINUE HANDLER FOR NOT FOUND SET fin = 1`, `FETCH c INTO ...`).
