# SQL snippets

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

## Inserted Id

```sql
DECLARE @Id INT OUTPUT

--- hacemos el insert

SET @Id = SCOPE_IDENTITY()
```

## Errors

### Raiserror

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

### Throw

```sql
THROW 50001, 'Invalid input', 1;
```

- **Error number**: 50.001, (between 50000 and 2147483647)
- **Message**: ‘Invalid input’,(NVARCHAR (2048)) 
- **State**: 1, (between 0 and 255)

It raises an exception and transfers execution to a TRY-CATCH block. 

```sql
BEGIN TRY
  THROW 50001, 'Invalid input', 1; -- throw an exception
  PRINT 'This statement will not be executed'; -- this will be skipped
END TRY
BEGIN CATCH
  -- handle the exception
  PRINT 'An exception occurred'; -- this will be executed
END CATCH
PRINT 'This statement will be executed'; -- this will continue the execution
```

- This statement must be end with semicolon (;) 

- The state can be used to differentiate between different types of errors or exceptions that have the same error number and message. For example, you can use different state values to indicate where the exception occurred in your code, or what kind of action is required to handle the exception. 

- you can repeat the error number in a T-SQL THROW statement, as long as it is between 50000 and 2147483647. However, you should use different state values to distinguish between different types of errors or exceptions that have the same error number. For example:

```sql
THROW 50001, 'Invalid input', 1; -- state 1 indicates a validation error
THROW 50001, 'Invalid input', 2; -- state 2 indicates a conversion error
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

## errors + transactions

```sql
BEGIN TRY
    BEGIN TRANSACTION;
    -- Su código aquí...
    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    -- Su código de manejo de errores aquí...
    ROLLBACK TRANSACTION;
END CATCH
```

## CASE

```sql
SELECT
    EmployeeID,
    FirstName,
    LastName,
    Salary,
    CASE
        WHEN Salary <= 30000 THEN 'Low Salary'
        WHEN Salary > 30000 AND Salary <= 60000 THEN 'Moderate Salary'
        WHEN Salary > 60000 AND Salary <= 90000 THEN 'High Salary'
        ELSE 'Very High Salary'
    END AS SalaryCategory
FROM Employees;
```

## IFF

```sql
SELECT
    ProductName,
    StockQuantity,
    IIF(StockQuantity > 0, 'In Stock', 'Out of Stock') AS AvailabilityStatus
FROM Products;
```

## Convert, Cast, Try_Convert

> CONVERT (data_type, expression, style)

```sql
SELECT CONVERT(INT, '12345') AS IntegerValue;
SELECT CONVERT(INT, 12.34) AS IntegerValue;
SELECT CONVERT(VARCHAR, GETDATE(), 101) AS FormattedDate;
SELECT CONVERT(DATE, '2023-10-26', 23) AS DateValue;
```

```sql
SELECT CAST('12345' AS INT) AS IntegerValue;
SELECT CAST(12.34 AS INT) AS IntegerValue;
SELECT CAST(GETDATE() AS VARCHAR) AS FormattedDate;
SELECT CAST('2023-10-26' AS DATE) AS DateValue;
```

If a conversion is not possible with CAST, it will raise an error, whereas CONVERT will attempt the conversion and return NULL if it fails. 

```sql
SELECT TRY_CONVERT(INT, '12345') AS IntegerValue; -- Returns 12345
SELECT TRY_CONVERT(DATE, 'Hello, World!') AS DateValue; -- Returns NULL
SELECT TRY_CONVERT(DATE, '2023-10-26') AS DateValue; -- Returns '2023-10-26'
SELECT TRY_CONVERT(INT, 12.34) AS IntegerValue; -- Returns 12
```

The TRY_CONVERT function in T-SQL is similar to the CONVERT function, but it has one significant difference: TRY_CONVERT attempts to perform the conversion and returns a NULL value if the conversion fails, rather than generating an error. 