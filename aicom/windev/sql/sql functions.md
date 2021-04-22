# Procedures SQL

## open

```sql
IF HOpenConnection(DBConexion) = True THEN
	Trace("Conexion establecidad con la BD")
ELSE
	Trace("Error de conexión")
END
```

## Close

```sql
res is boolean = HCloseConnection(DBConexion)
IF res = True THEN
	Trace("Conexión cerrada con exito")
ELSE
	Trace("Error al cerrar la conexión: " + HErrorInfo())
	
END
```

## Execute SQL

```sql
IF NOT HExecuteSQLQuery(dataSource, SQLCode) THEN
	Info(HErrorInfo())
ELSE
	Trace("Consulta: " + SQLCode)
	Trace("La Consulta contiene: " + HNbRec(dataSource) + " entradas.")
END	

RESULT dataSource
```