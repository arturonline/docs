# Common Table Expression (CTE)

A Common Table Expression (CTE) is a temporary result set that you define within a **WITH** clause. It exists only for the duration of a single _SELECT_, _INSERT_, _UPDATE_, or _DELETE_ statement. CTEs can be especially helpful in making complex queries more readable by breaking them into logical parts.

```sql
WITH CTE_Name 
AS
(
    -- CTE query definition
    SELECT Column1, Column2, ...
    FROM SomeTable
    WHERE SomeCondition
)
-- Following statement using the CTE
SELECT Column1, Column2, ...
FROM CTE_Name
WHERE SomeOtherCondition;
```

## Example

Here's a basic example of how to use a CTE in SQL Server:

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

>⚠️ De esta manera, el CTE se usa como una variable (o varias) contra la que comparar.

## Recursive CTE

This will return a list of employees, organized by levels under their managers.

```sql
WITH EmployeeHierarchy AS (
    SELECT EmployeeID, ManagerID, FirstName, LastName, 1 AS Level
    FROM Employees
    WHERE ManagerID IS NULL
    UNION ALL
    SELECT e.EmployeeID, e.ManagerID, e.FirstName, e.LastName, Level + 1
    FROM Employees e
    JOIN EmployeeHierarchy eh ON e.ManagerID = eh.EmployeeID
)
SELECT * FROM EmployeeHierarchy;

```
