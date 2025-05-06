# SQL snippets


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