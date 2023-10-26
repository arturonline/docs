# Cursores

## Example 1

```sql
--- 1. Vamos a imaginar que generamos una tabla con "Id" y "Nombres" que queremos recorrer
--- 1.1 Declare a table variable for storing objects
DECLARE @Objects TABLE (Id BIGINT);

--- 1.2 Declaramos Variables auxiliares
DECLARE @Id BigInt
DECLARE @Name NVARCHAR(50)

--- 1.3 Obtenemos listado de objetos que vamos a eliminar
INSERT INTO @Objects (Id, Name) SELECT Id, Name FROM [Auth].[Objetos] WHERE IdSeccion = 23 


--- 2. Una vez tenemos la estructura sobre la que vamos a iterar creamos un cursor
--- 2.1 Init cursor
DECLARE list_cursor CURSOR FOR SELECT Id FROM @Objects;
OPEN list_cursor;

--- 3. Una vez tenemos el cursor, podemos recorer la tabla fila a fila asignando los valores de cada fila a las variables auxiliares
FETCH NEXT FROM list_cursor INTO @Id, @Name
WHILE @@FETCH_STATUS = 0
BEGIN
    --- Hacemos algo con los datos, por ejemplo eliminar algo
    DELETE FROM [Auth].[Permisos] WHERE IdObjeto = @Id AND IdPerfil = @Name

    --- 3.1 Inciamos siguiente paso
    FETCH NEXT FROM list_cursor INTO @Id, @Name;
END;

--- 4. finalmente, liberamos el cursor
CLOSE list_cursor;
DEALLOCATE list_cursor;
```

## Example 2

```sql
--- declare variables used in cursor
DECLARE @city_name VARCHAR(128);
DECLARE @country_name VARCHAR(128);
DECLARE @city_id INT;
 
--- declare cursor
DECLARE cursor_city_country CURSOR FOR
  SELECT city.id, TRIM(city.city_name), TRIM(country.country_name)
  FROM city
  INNER JOIN country ON city.country_id = country.id;
 
--- open cursor
OPEN cursor_city_country;
 
--- loop through a cursor
FETCH NEXT FROM cursor_city_country INTO @city_id, @city_name, @country_name;
WHILE @@FETCH_STATUS = 0
    BEGIN
    PRINT CONCAT('city id: ', @city_id, ' / city name: ', @city_name, ' / country name: ', @country_name);
    FETCH NEXT FROM cursor_city_country INTO @city_id, @city_name, @country_name;
    END;
 
--- close and deallocate cursor
CLOSE cursor_city_country;
DEALLOCATE cursor_city_country;
```