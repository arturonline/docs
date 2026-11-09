# Obtener resultados

Dialect: SQL Server. See also: [inserted / OUTPUT](inserted.md), [Errors](Errors.md).

Sample table used below:

```sql
CREATE TABLE Employees (
    EmployeeID   INT PRIMARY KEY,
    EmployeeName NVARCHAR(50),
    Department   NVARCHAR(50),
    Salary       DECIMAL(10, 2)
);
INSERT INTO Employees VALUES (123, 'Anna', 'Sales', 52000),
                             (124, 'Marc', 'Sales', 38000),
                             (125, 'Pau',  'IT',    61000);
```

> `CREATE OR ALTER` (SQL Server 2016 SP1+) creates the object or replaces it if it already exists. Always prefix with the schema (`dbo.`).

## 1. Funciones

Functions can't modify data (no INSERT/UPDATE/DELETE on real tables), can't use TRY/CATCH, THROW or dynamic SQL.

### Return scalar

```sql
CREATE OR ALTER FUNCTION dbo.CalculateDiscount (@Price DECIMAL(10, 2), @DiscountRate DECIMAL(5, 2))
RETURNS DECIMAL(10, 2)
AS
BEGIN
    RETURN @Price - (@Price * @DiscountRate / 100);
END;
GO

SELECT dbo.CalculateDiscount(100.00, 10.00) AS DiscountedPrice;   -- 90.00
```

> ⚠ Scalar UDFs used in a `SELECT` over many rows can be slow (executed row by row). SQL Server 2019+ can inline simple ones automatically; otherwise prefer an inline table-valued function + `CROSS APPLY`.

### Return Table value

Inline table (a parameterized view; the optimizer expands it, so it's the fastest kind):

```sql
CREATE OR ALTER FUNCTION dbo.GetEmployeesInDepartment (@DepartmentName NVARCHAR(50))
RETURNS TABLE
AS
RETURN (
    SELECT EmployeeID, EmployeeName
    FROM dbo.Employees
    WHERE Department = @DepartmentName
);
GO

SELECT * FROM dbo.GetEmployeesInDepartment('Sales');
-- 123 Anna | 124 Marc
```

Multi-statement (table variable): allows several statements, but the optimizer can't see inside it (slower on big data):

```sql
CREATE OR ALTER FUNCTION dbo.GetEmployeesWithSalaryAbove (@SalaryThreshold DECIMAL(10, 2))
RETURNS @Result TABLE (EmployeeName NVARCHAR(50), Salary DECIMAL(10, 2))
AS
BEGIN
    INSERT INTO @Result (EmployeeName, Salary)
    SELECT EmployeeName, Salary
    FROM dbo.Employees
    WHERE Salary > @SalaryThreshold;

    RETURN;
END;
GO

SELECT * FROM dbo.GetEmployeesWithSalaryAbove(50000.00);
-- Anna 52000 | Pau 61000
```

Using a TVF per row with `APPLY`:

```sql
SELECT d.Department, e.EmployeeName
FROM (SELECT DISTINCT Department FROM dbo.Employees) d
CROSS APPLY dbo.GetEmployeesInDepartment(d.Department) e;
```

## 2. Procedimientos

### Using Output Parameters

You can define output parameters in your stored procedure to return values.

```sql
CREATE OR ALTER PROCEDURE dbo.GetEmployeeSalary
    @EmployeeID INT,
    @Salary DECIMAL(10, 2) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT @Salary = Salary
    FROM dbo.Employees
    WHERE EmployeeID = @EmployeeID;
END;
GO

DECLARE @MySalary DECIMAL(10, 2);
EXEC dbo.GetEmployeeSalary @EmployeeID = 123, @Salary = @MySalary OUTPUT;   -- OUTPUT is required here too
SELECT @MySalary;   -- 52000.00
```

> ⚠ If no row matches, `SELECT @Salary = ...` leaves the variable unchanged (here `NULL`, because the caller passed an uninitialized variable).

### Using Result Set

To return a result set just use a `SELECT` inside the procedure (usually the last statement):

```sql
CREATE OR ALTER PROCEDURE dbo.GetHighSalaries
    @MinSalary DECIMAL(10, 2) = 50000      -- parameter with default value
AS
BEGIN
    SET NOCOUNT ON;                         -- avoids the "(n rows affected)" messages
    SELECT EmployeeName, Salary
    FROM dbo.Employees
    WHERE Salary > @MinSalary;
END;
GO

EXEC dbo.GetHighSalaries;                    -- Anna 52000 | Pau 61000
EXEC dbo.GetHighSalaries @MinSalary = 60000; -- Pau 61000
```

Capture a procedure's result set into a table (columns must match):

```sql
CREATE TABLE #High (EmployeeName NVARCHAR(50), Salary DECIMAL(10, 2));
INSERT INTO #High (EmployeeName, Salary)
EXEC dbo.GetHighSalaries;
```

### Using RETURN (status code)

`RETURN` in a procedure only returns an `INT`, meant as a status code (0 = OK). Don't use it to return data.

```sql
CREATE OR ALTER PROCEDURE dbo.DeleteEmployee @EmployeeID INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM dbo.Employees WHERE EmployeeID = @EmployeeID;
    IF @@ROWCOUNT = 0 RETURN 1;   -- not found
    RETURN 0;
END;
GO

DECLARE @rc INT;
EXEC @rc = dbo.DeleteEmployee @EmployeeID = 999;
SELECT @rc;   -- 1
```

## Summary

| Need                                  | Use                                     |
| ------------------------------------- | --------------------------------------- |
| One value usable inside a `SELECT`    | Scalar function                         |
| Rows usable in `FROM` / `JOIN`        | Inline table-valued function            |
| Modify data and return a few values   | Procedure + `OUTPUT` parameters         |
| Modify data and return rows           | Procedure + final `SELECT` (or `OUTPUT` clause) |
| Success/failure                       | `RETURN` code, or better, `THROW` on error |
