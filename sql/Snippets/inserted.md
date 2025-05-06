# Obtener Id elemento insertado

## 1. Creamos tablas de ejemplo

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

## Declarar variable de tabla para recoger los IDs

```sql
DECLARE @NuevosEmpleados TABLE (
    EmpleadoID INT,
    Nombre NVARCHAR(50)
);

```

## Insertar y recoger los valores con OUTPUT

```sql
INSERT INTO Empleados (Nombre, Departamento)
OUTPUT inserted.EmpleadoID, inserted.Nombre INTO @NuevosEmpleados
VALUES ('Ana', 'Ventas'), ('Luis', 'Marketing'), ('Marta', 'Finanzas');

```

## Usamos los valores recogidos

```sql
INSERT INTO EmpleadoLog (EmpleadoID)
SELECT EmpleadoID
FROM @NuevosEmpleados;
```