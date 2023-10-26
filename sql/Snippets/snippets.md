# SQL snippets

## CRUD

### Inserir dades

```sql
--- Inserir una fila indicant quines columnes i en quin ordre es van a posar els valors
INSERT INTO alumnes (codi, nom) VALUES (25, "Pep");

--- S’introduiran tots els valors i en l’ordre en què estan les columnes en la taula:
INSERT INTO alumnes VALUES(25, "Pep");

--- Inserir diverses files en una sola sentència:
INSERT INTO alumnes (codi,nom) VALUES
    (25,"Pep"),
    (26,"Pepa"),
    (27,"Pepet");

--- Insert into Select
INSERT INTO table2 (column1, column2, column3, ...)
SELECT column1, column2, column3, ...
FROM table1
WHERE condition;
```

### Modificar dades

```sql
UPDATE alumnes
SET nom ="Josep", poble =46410
WHERE nom ="Pep";
```

### Esborrar dades

```sql
DELETE FROM alumnes WHERE codi =25;
```

## Obtener resultado de una función

### Return scalar

```sql
CREATE FUNCTION CalculateDiscount(@Price DECIMAL(10, 2), @DiscountRate DECIMAL(5, 2))
RETURNS DECIMAL(10, 2)
AS
BEGIN
    DECLARE @DiscountedPrice DECIMAL(10, 2)
    SET @DiscountedPrice = @Price - (@Price * @DiscountRate / 100)
    RETURN @DiscountedPrice
END

--- 

SELECT dbo.CalculateDiscount(100.00, 10.00) AS DiscountedPrice
```

### Return Table value

Inline table:

```sql
CREATE FUNCTION GetEmployeesInDepartment(@DepartmentName NVARCHAR(50))
RETURNS TABLE
AS
RETURN (
    SELECT EmployeeID, EmployeeName
    FROM Employees
    WHERE Department = @DepartmentName
)

--- 
SELECT * FROM dbo.GetEmployeesInDepartment('Sales')
```

Table variable:

```sql
CREATE FUNCTION GetEmployeesWithSalaryAbove(@SalaryThreshold DECIMAL(10, 2))
RETURNS @Result TABLE (EmployeeName NVARCHAR(50), Salary DECIMAL(10, 2))
AS
BEGIN
    INSERT INTO @Result
    SELECT EmployeeName, Salary
    FROM Employees
    WHERE Salary > @SalaryThreshold
    RETURN
END

---

SELECT * FROM dbo.GetEmployeesWithSalaryAbove(50000.00)
```

## Obtener resultados de un procedimiento

### Using Output Parameters

You can define output parameters in your stored procedure to return values. 

```sql
CREATE PROCEDURE GetEmployeeSalary
    @EmployeeID INT,
    @Salary DECIMAL(10, 2) OUTPUT
AS
BEGIN
    SELECT @Salary = Salary
    FROM Employees
    WHERE EmployeeID = @EmployeeID
END

---

DECLARE @MySalary DECIMAL(10, 2)
EXEC GetEmployeeSalary @EmployeeID = 123, @Salary = @MySalary OUTPUT
SELECT @MySalary
```

## Using Result Set

To use the result set just use 'SELECT' inside proc as last value:

```sql
CREATE PROCEDURE GetHighSalaries
AS
BEGIN
    SELECT EmployeeName, Salary
    FROM Employees
    WHERE Salary > 50000
END

---

EXEC GetHighSalaries
```

## Errors

```sql
BEGIN TRY

    ---
    IF NOT EXISTS(SELECT * FROM [Auth].[TiposPermisos] WHERE Id = @IdTipo)
        RAISERROR (N'El tipo de permiso no existe.', 17,1
    ---

END TRY
BEGIN CATCH
    select error_number(), error_message();
END CATCH
```

## Transactions

```sql
BEGIN TRANSACTION;
    IF @@ERROR <> 0
    BEGIN
        ROLLBACK ;
        RAISERROR('Error creando proyecto', 16, 1);
    END
    ELSE
    BEGIN
        COMMIT TRANSACTION;
    END
END;
```