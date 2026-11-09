# SQL snippets

Dialect: SQL Server (T-SQL). Equivalents for MySQL/PostgreSQL at the end.
See also: [CTE](CTE.md), [Joins](Joins.md), [Pivot](Pivot.md), [Errors](Errors.md).

## CASE

```sql
SELECT
    EmployeeID,
    FirstName,
    LastName,
    Salary,
    CASE
        WHEN Salary <= 30000 THEN 'Low Salary'
        WHEN Salary <= 60000 THEN 'Moderate Salary'   -- WHENs are evaluated in order,
        WHEN Salary <= 90000 THEN 'High Salary'       -- so the lower bound is implicit
        ELSE 'Very High Salary'                       -- without ELSE -> NULL
    END AS SalaryCategory
FROM Employees;
```

Simple form (compare one expression with values):

```sql
SELECT OrderID,
       CASE Status WHEN 'P' THEN 'Pending' WHEN 'S' THEN 'Shipped' ELSE 'Unknown' END AS StatusText
FROM Orders;
```

## IIF

Shorthand for a two-branch `CASE` (SQL Server 2012+).

```sql
SELECT
    ProductName,
    StockQuantity,
    IIF(StockQuantity > 0, 'In Stock', 'Out of Stock') AS AvailabilityStatus
FROM Products;
```

## NULL handling: ISNULL, COALESCE, NULLIF

```sql
SELECT ISNULL(Phone, 'N/A');                 -- T-SQL, 2 arguments, result type = type of 1st argument
SELECT COALESCE(Mobile, Phone, 'N/A');        -- standard, N arguments, first non-NULL
SELECT Total / NULLIF(Quantity, 0);           -- NULLIF(a, b) = NULL if a = b -> avoids divide-by-zero
```

## Convert, Cast, Try_Convert

> CONVERT (data_type, expression, style)

```sql
SELECT CONVERT(INT, '12345') AS IntegerValue;              -- 12345
SELECT CONVERT(INT, 12.34) AS IntegerValue;                -- 12 (truncates)
SELECT CONVERT(VARCHAR(10), GETDATE(), 101) AS FormattedDate;  -- 10/26/2023 (style 101 = mm/dd/yyyy)
SELECT CONVERT(VARCHAR(10), GETDATE(), 103) AS FormattedDate;  -- 26/10/2023 (style 103 = dd/mm/yyyy)
SELECT CONVERT(DATE, '2023-10-26', 23) AS DateValue;       -- style 23 = yyyy-mm-dd
```

```sql
SELECT CAST('12345' AS INT) AS IntegerValue;
SELECT CAST(12.34 AS INT) AS IntegerValue;                 -- 12
SELECT CAST(GETDATE() AS VARCHAR(30)) AS FormattedDate;
SELECT CAST('2023-10-26' AS DATE) AS DateValue;
```

- `CAST` is standard SQL; `CONVERT` is T-SQL and adds the `style` argument (date/number formats).
- ⚠ Always give a length: `VARCHAR` without length is `VARCHAR(30)` in CAST/CONVERT, but `VARCHAR(1)` in a declaration.
- If the conversion is not possible, **both `CAST` and `CONVERT` raise an error**. `TRY_CAST` and `TRY_CONVERT` (SQL Server 2012+) return `NULL` instead:

```sql
SELECT TRY_CONVERT(INT, '12345') AS IntegerValue;          -- 12345
SELECT TRY_CONVERT(DATE, 'Hello, World!') AS DateValue;    -- NULL
SELECT TRY_CONVERT(DATE, '2023-10-26') AS DateValue;       -- 2023-10-26
SELECT TRY_CONVERT(INT, 12.34) AS IntegerValue;            -- 12
SELECT TRY_CAST('abc' AS INT) AS IntegerValue;             -- NULL

-- Find rows with bad data
SELECT * FROM Staging WHERE TRY_CONVERT(DATE, RawDate, 103) IS NULL AND RawDate IS NOT NULL;
```

> `FORMAT(GETDATE(), 'dd/MM/yyyy')` is convenient but slow (uses .NET); avoid it on large result sets.

## Strings

```sql
SELECT CONCAT(FirstName, ' ', LastName);           -- NULLs are treated as ''
SELECT CONCAT_WS(', ', LastName, FirstName);       -- with separator, skips NULLs (2017+)
SELECT TRIM('  hi  '), LEFT('abcdef', 3), RIGHT('abcdef', 2), SUBSTRING('abcdef', 2, 3);  -- hi | abc | ef | bcd
SELECT REPLACE('1DAM', 'DAM', 'DAW'), LEN('abc '), DATALENGTH(N'abc');                    -- 1DAW | 3 | 6
```

### STRING_AGG / STRING_SPLIT

```sql
-- Rows -> one delimited string per group (SQL Server 2017+)
SELECT DepartmentID,
       STRING_AGG(FirstName, ', ') WITHIN GROUP (ORDER BY FirstName) AS Employees
FROM Employees
GROUP BY DepartmentID;
-- 1 | Laura, Marc
-- 2 | Anna, Clara, Pau
-- ⚠ result is limited to 8000 bytes unless the input is (N)VARCHAR(MAX): STRING_AGG(CAST(col AS NVARCHAR(MAX)), ',')

-- Delimited string -> rows (2016+; enable_ordinal 3rd argument: 2022+)
SELECT value FROM STRING_SPLIT('a,b,c', ',');   -- a | b | c
```

## Window functions

Calculate over a set of rows related to the current one **without collapsing them** (unlike `GROUP BY`).
`function() OVER (PARTITION BY ... ORDER BY ... [ROWS/RANGE ...])`.

```sql
CREATE TABLE Sales (Seller NVARCHAR(20), [Month] INT, Amount INT);
INSERT INTO Sales VALUES ('Anna', 1, 100), ('Anna', 2, 150), ('Anna', 3, 120),
                         ('Marc', 1, 200), ('Marc', 2, 150), ('Marc', 3, 150);

SELECT Seller, [Month], Amount,
       ROW_NUMBER() OVER (PARTITION BY Seller ORDER BY Amount DESC, [Month]) AS rn,
       RANK()       OVER (ORDER BY Amount DESC)                               AS rnk,
       DENSE_RANK() OVER (ORDER BY Amount DESC)                               AS drnk,
       SUM(Amount)  OVER (PARTITION BY Seller ORDER BY [Month]
                          ROWS UNBOUNDED PRECEDING)                           AS running_total,
       LAG(Amount)  OVER (PARTITION BY Seller ORDER BY [Month])               AS prev_month,
       SUM(Amount)  OVER (PARTITION BY Seller)                                AS seller_total
FROM Sales
ORDER BY Seller, [Month];
```

| Seller | Month | Amount | rn | rnk | drnk | running_total | prev_month | seller_total |
| ------ | ----- | ------ | -- | --- | ---- | ------------- | ---------- | ------------ |
| Anna   | 1     | 100    | 3  | 6   | 4    | 100           | NULL       | 370          |
| Anna   | 2     | 150    | 1  | 2   | 2    | 250           | 100        | 370          |
| Anna   | 3     | 120    | 2  | 5   | 3    | 370           | 150        | 370          |
| Marc   | 1     | 200    | 1  | 1   | 1    | 200           | NULL       | 500          |
| Marc   | 2     | 150    | 2  | 2   | 2    | 350           | 200        | 500          |
| Marc   | 3     | 150    | 3  | 2   | 2    | 500           | 150        | 500          |

- `ROW_NUMBER` always unique (add a tie-breaker to the ORDER BY to make it deterministic); `RANK` leaves gaps after ties; `DENSE_RANK` doesn't.
- `LAG`/`LEAD(col, n, default)`: previous/next row. `FIRST_VALUE`/`LAST_VALUE`, `NTILE(n)`, `PERCENT_RANK` also exist.
- Use `ROWS UNBOUNDED PRECEDING` for running totals: the default frame with ORDER BY is `RANGE`, which is slower and groups ties together.
- Window functions can't go in `WHERE`: wrap them in a CTE/subquery.

```sql
-- Top 1 per group: best month of each seller
WITH r AS (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY Seller ORDER BY Amount DESC, [Month]) AS rn
    FROM Sales
)
SELECT Seller, [Month], Amount FROM r WHERE rn = 1;
-- Anna 2 150 | Marc 1 200
```

## Paging: TOP and OFFSET/FETCH

```sql
SELECT TOP (10) * FROM Orders ORDER BY OrderDate DESC;

SELECT * FROM Orders
ORDER BY OrderDate DESC, OrderID      -- ORDER BY is required, and should be unique
OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;   -- page 3 of 10 rows
```

## Dates

```sql
SELECT GETDATE(), SYSDATETIME();                      -- datetime / datetime2 (more precision)
SELECT DATEADD(DAY, 7, '2023-10-26');                 -- 2023-11-02
SELECT DATEDIFF(DAY, '2023-10-01', '2023-10-26');     -- 25
SELECT EOMONTH('2023-02-10');                         -- 2023-02-28
SELECT DATEFROMPARTS(2023, 10, 26);                   -- 2023-10-26
SELECT DATETRUNC(MONTH, '2023-10-26');                -- 2023-10-01 (SQL Server 2022+)

-- Filter a whole day on a datetime column (sargable, can use indexes):
WHERE OrderDate >= '2023-10-26' AND OrderDate < '2023-10-27'
```

## Dialect equivalents

| SQL Server                      | MySQL                          | PostgreSQL                         |
| ------------------------------- | ------------------------------ | ---------------------------------- |
| `TOP (n)`                       | `LIMIT n`                      | `LIMIT n`                          |
| `ISNULL(a, b)`                  | `IFNULL(a, b)`                 | `COALESCE(a, b)`                   |
| `IIF(c, a, b)`                  | `IF(c, a, b)`                  | `CASE WHEN c THEN a ELSE b END`    |
| `STRING_AGG(x, ',')`            | `GROUP_CONCAT(x SEPARATOR ',')`| `STRING_AGG(x, ',')`               |
| `GETDATE()`                     | `NOW()`                        | `NOW()`                            |
| `DATEADD(DAY, 1, d)`            | `DATE_ADD(d, INTERVAL 1 DAY)`  | `d + INTERVAL '1 day'`             |
| `LEN(s)`                        | `CHAR_LENGTH(s)`               | `LENGTH(s)`                        |
| `a + b` (strings)               | `CONCAT(a, b)`                 | `a \|\| b`                         |
| `IDENTITY(1,1)`                 | `AUTO_INCREMENT`               | `GENERATED ALWAYS AS IDENTITY`     |
| `[name]`                        | `` `name` ``                   | `"name"`                           |
| `OUTPUT inserted.id`            | `LAST_INSERT_ID()`             | `RETURNING id`                     |
