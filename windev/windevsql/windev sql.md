# Windev SQL

## conexion

```cs
IF HOpenConnection(DBConection) THEN
	Trace("Conexion ok")
ELSE
	Trace("Error de conexión")
END
```

⚠ Abierta por defecto

## Construccion de la Query

Mediante **string**:

```cs
consulta is string = 
[
	SELECT * FROM albums
] 
```

Mediante **SQL Query**:

```cs
query is SQL Query = 
[
	SELECT * FROM Pelis;
] 
```

Mediante **Asistente**:

Nueva > query

```sql
UPDATE 
	pelis2
SET
	ID = {ParamID},
	Name = {ParamName},
	Director = {ParamDirector},
	Genre = {ParamGenre}
WHERE
	ID = {ParamID}
```

```sql
Update.ParamID = edt_id
Update.ParamName = edt_titulo
Update.ParamDirector = edt_director
Update.ParamGenre = edt_genre
```

## Querys SQL

### Con HExecuteQuery()

Cuando usamos variables de tipo `SQL query`:

```cs
IF NOT HExecuteQuery(query) THEN
	Trace(HErrorInfo())
END
```

### con HExecuteSQLQuery()

Cuando declaramos las consultas como `strings`:

```cs
datasource is Data Source

IF NOT HExecuteSQLQuery(dataSource, hQueryDefault, consulta) THEN
	Trace(HErrorInfo())
END
```

## Consultas (select)

### 1. Creamos la consulta

Método 1:

```cs
query is SQL Query = 
[
	SELECT * FROM PELIS
]

IF NOT HExecuteQuery(query) THEN
	Trace(HErrorInfo())
END
```

Método 2:

```cs
datasource is Data Source
consulta is string = 
[
	SELECT * FROM PELIS
]

IF NOT HExecuteSQLQuery(dataSource, hQueryDefault, consulta) THEN
	Trace(HErrorInfo())
END
```

### 2. Recogemos los resultados de la consulta del datasource

Método 1:

```cs
FOR EACH query 
	Trace(query.<item>)
END
```

Método 2:

```cs
HReadFirst(dataSource)
WHILE NOT HOut()
	// Process on the query record
	// Access to the items via MyQuery.<Item Name>
	Trace(datasource.<item>)
	// Read the next record
	HReadNext()
END
```

## Operaciones de modificación (INSERT, UPDATE, DELETE)

### 1. Creamos la query

Método 1:

```cs
query is SQL Query = 
[
	INSERT INTO pelis2 (Name, Director, Genre) VALUES ('artur', 'Badenes', 'puig')
]
```

Método 2:

```cs
consulta is string = [
	INSERT INTO pelis2 (Name, Director, Genre) VALUES ('titulo', 'director', 'genre')
]

```

> ⚠ Comillas simples!!!

### 2. Lanzamos la query

Método 1:

```cs
IF NOT HExecuteSQLQuery(dataSource, hQueryDefault, consulta) THEN
	Trace(HErrorInfo())
END
```

Método 2:

```cs
IF NOT HExecuteSQLQuery(query) THEN
	Trace(HErrorInfo())
END
```

⚠ Update y delete seran igual que insert

## Otras funciones

`HCancelDeclaration(query)` -> vaciar un datasource
