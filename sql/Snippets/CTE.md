# Common Table Expression (CTE)

A Common Table Expression (CTE) is a temporary, named result set that you define within a **WITH** clause. It exists only for the duration of a single _SELECT_, _INSERT_, _UPDATE_, _DELETE_ (or _MERGE_) statement. CTEs make complex queries more readable by breaking them into logical parts, and they enable recursive queries.

Dialect: SQL Server. Also available in MySQL 8+, PostgreSQL, SQLite. See also: [Joins](Joins.md), [window functions](snippets.md#window-functions), [Subconsultes](../fp/Queries/Subconsultes.md).

```sql
WITH CTE_Name (Column1, Column2)   -- column list is optional
AS
(
    -- CTE query definition
    SELECT Column1, Column2
    FROM SomeTable
    WHERE SomeCondition
)
-- Following statement using the CTE (must come immediately after)
SELECT Column1, Column2
FROM CTE_Name
WHERE SomeOtherCondition;
```

> ⚠ T-SQL: the statement **before** `WITH` must end with `;`. That's why you often see `;WITH ...`.

## Sample table

```sql
CREATE TABLE Employees (
    EmployeeID   INT PRIMARY KEY,
    FirstName    NVARCHAR(50),
    LastName     NVARCHAR(50),
    DepartmentID INT,
    Salary       DECIMAL(10, 2),
    ManagerID    INT NULL REFERENCES Employees(EmployeeID)
);

INSERT INTO Employees VALUES
    (1, 'Laura', 'Pérez',  1, 90000, NULL),
    (2, 'Marc',  'Soler',  1, 60000, 1),
    (3, 'Anna',  'Vidal',  2, 50000, 1),
    (4, 'Pau',   'Ferrer', 2, 40000, 3),
    (5, 'Clara', 'Roig',   2, 45000, 3);
```

## Example

Employees earning more than their department's average:

```sql
WITH AvgSalaryCTE AS (
    SELECT DepartmentID, AVG(Salary) AS AvgSalary
    FROM Employees
    GROUP BY DepartmentID
)
SELECT e.EmployeeID, e.FirstName, e.LastName, e.Salary, a.AvgSalary
FROM Employees e
JOIN AvgSalaryCTE a ON e.DepartmentID = a.DepartmentID
WHERE e.Salary > a.AvgSalary;
```

| EmployeeID | FirstName | LastName | Salary | AvgSalary |
| ---------- | --------- | -------- | ------ | --------- |
| 1          | Laura     | Pérez    | 90000  | 75000     |
| 3          | Anna      | Vidal    | 50000  | 45000     |

>⚠️ De esta manera, el CTE se usa como una tabla auxiliar (con uno o varios valores) contra la que comparar.

The same result with a window function, without CTE join:

```sql
SELECT EmployeeID, FirstName, Salary, AvgSalary
FROM (
    SELECT *, AVG(Salary) OVER (PARTITION BY DepartmentID) AS AvgSalary
    FROM Employees
) t
WHERE Salary > AvgSalary;
```

## Multiple CTEs

Separate them with commas; each one can use the previous ones.

```sql
WITH DeptCount AS (
    SELECT DepartmentID, COUNT(*) AS Headcount
    FROM Employees
    GROUP BY DepartmentID
),
BigDepts AS (
    SELECT DepartmentID FROM DeptCount WHERE Headcount >= 3
)
SELECT e.FirstName
FROM Employees e
JOIN BigDepts b ON b.DepartmentID = e.DepartmentID;
-- Anna, Pau, Clara
```

## Modifying data through a CTE (SQL Server)

Classic use: delete duplicates, keeping one row per key.

```sql
WITH Dups AS (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY Email ORDER BY CreatedAt) AS rn
    FROM Customers
)
DELETE FROM Dups WHERE rn > 1;
```

## Recursive CTE

An anchor query + `UNION ALL` + a recursive query that references the CTE itself. Returns the employees organized by levels under their managers:

```sql
WITH EmployeeHierarchy AS (
    -- Anchor: top-level employees
    SELECT EmployeeID, ManagerID, FirstName, LastName, 1 AS Level,
           CAST(FirstName AS NVARCHAR(4000)) AS Path
    FROM Employees
    WHERE ManagerID IS NULL

    UNION ALL

    -- Recursive part: direct reports of the previous level
    SELECT e.EmployeeID, e.ManagerID, e.FirstName, e.LastName, eh.Level + 1,
           CAST(eh.Path + N' > ' + e.FirstName AS NVARCHAR(4000))
    FROM Employees e
    JOIN EmployeeHierarchy eh ON e.ManagerID = eh.EmployeeID
)
SELECT EmployeeID, FirstName, Level, Path
FROM EmployeeHierarchy
ORDER BY Path;
```

| EmployeeID | FirstName | Level | Path                 |
| ---------- | --------- | ----- | -------------------- |
| 1          | Laura     | 1     | Laura                |
| 3          | Anna      | 2     | Laura > Anna         |
| 5          | Clara     | 3     | Laura > Anna > Clara |
| 4          | Pau       | 3     | Laura > Anna > Pau   |
| 2          | Marc      | 2     | Laura > Marc         |

Notes:

- Anchor and recursive columns must have **exactly the same types** in SQL Server (hence the `CAST` on `Path`).
- Default recursion limit is 100 levels; change it with `OPTION (MAXRECURSION 1000)` (`0` = no limit) at the end of the outer query.
- MySQL / PostgreSQL / SQLite require `WITH RECURSIVE`. MySQL limit: `cte_max_recursion_depth` (default 1000). String concatenation: `CONCAT()` in MySQL, `||` in PostgreSQL.

Generate a number series:

```sql
WITH Numbers AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM Numbers WHERE n < 5
)
SELECT n FROM Numbers;   -- 1, 2, 3, 4, 5
-- SQL Server 2022+: SELECT value FROM GENERATE_SERIES(1, 5);
```

## CTE vs temp table vs subquery

- A CTE is **not materialized** in SQL Server: if referenced twice, it runs twice. For large intermediate results reused several times, use a `#temp` table.
- A CTE is just a named subquery: same performance, better readability.
