# Obtener Id elemento insertado

## 1 Usando OUTPUT

### 1.1 Creamos tablas de ejemplo

```sql
CREATE TABLE Empleados (
    EmpleadoID INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50),
    Departamento NVARCHAR(50)
);

CREATE TABLE EmpleadoLog (
    EmpleadoID INT,
    FechaRegistro DATETIME DEFAULT GETDATE()
);
```

### 1.2 Declarar variable de tabla para recoger los IDs

```sql
DECLARE @NuevosEmpleados TABLE (
    EmpleadoID INT,
    Nombre NVARCHAR(50)
);

```

### 1.3 Insertar y recoger los valores con OUTPUT

```sql
INSERT INTO Empleados (Nombre, Departamento)
OUTPUT inserted.EmpleadoID, inserted.Nombre INTO @NuevosEmpleados
VALUES ('Ana', 'Ventas'), ('Luis', 'Marketing'), ('Marta', 'Finanzas');

```

### 1.4 Usamos los valores recogidos

```sql
INSERT INTO EmpleadoLog (EmpleadoID)
SELECT EmpleadoID
FROM @NuevosEmpleados;
```


## 2. Usando SCOPE_IDENTITY()

Nota: es preferible usar OUTPUT

```sql
DECLARE @Id INT OUTPUT

--- hacemos el insert

SET @Id = SCOPE_IDENTITY()
```
