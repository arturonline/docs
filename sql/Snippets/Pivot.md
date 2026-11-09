# Pivot

Dialect: SQL Server (`PIVOT`/`UNPIVOT` are T-SQL; conditional aggregation works everywhere). See also: [Joins - APPLY](Joins.md#cross-apply--outer-apply-sql-server), [snippets](snippets.md).

Imagine you have the sales data table:

```sql
CREATE TABLE SalesData (ProductID INT, [Year] INT, TotalSales DECIMAL(12, 2));
INSERT INTO SalesData VALUES (1, 2020, 15000), (1, 2021, 20000),
                             (2, 2020, 25000), (2, 2021, 30000);
```

| ProductID | Year | TotalSales |
| --------- | ---- | ---------- |
| 1         | 2020 | 15000      |
| 1         | 2021 | 20000      |
| 2         | 2020 | 25000      |
| 2         | 2021 | 30000      |

And you want to see the total sales for each product by year:

| ProductID | 2020  | 2021  |
| --------- | ----- | ----- |
| 1         | 15000 | 20000 |
| 2         | 25000 | 30000 |

To achieve that you can use PIVOT:

```sql
SELECT ProductID, [2020], [2021]
FROM
(
    SELECT ProductID, [Year], TotalSales   -- only the columns you need!
    FROM SalesData
) AS SourceTable
PIVOT
(
    SUM(TotalSales)
    FOR [Year] IN ([2020], [2021])
) AS PivotTable;
```

- Every column of the source subquery that is not the aggregated value nor the `FOR` column becomes a grouping column. That's why the subquery should select only the needed columns.
- Missing combinations return `NULL`; use `ISNULL([2020], 0) AS [2020]` in the outer SELECT.

## Conditional aggregation (portable alternative)

Works in SQL Server, MySQL, PostgreSQL... and allows several aggregates at once.

```sql
SELECT ProductID,
       SUM(CASE WHEN [Year] = 2020 THEN TotalSales ELSE 0 END) AS [2020],
       SUM(CASE WHEN [Year] = 2021 THEN TotalSales ELSE 0 END) AS [2021],
       SUM(TotalSales)                                         AS Total
FROM SalesData
GROUP BY ProductID;
-- PostgreSQL: SUM(TotalSales) FILTER (WHERE Year = 2020)
```

## Dynamic Pivot

In this case you don't know the values in the Year column beforehand ([2020] & [2021]):

```sql
DECLARE @DynamicYearColumns NVARCHAR(MAX);
DECLARE @DynamicPivotQuery NVARCHAR(MAX);

-- Construct the list of year columns to pivot: [2020], [2021]
-- STRING_AGG: SQL Server 2017+. QUOTENAME protects against SQL injection.
SELECT @DynamicYearColumns = STRING_AGG(QUOTENAME([Year]), ', ') WITHIN GROUP (ORDER BY [Year])
FROM (SELECT DISTINCT [Year] FROM SalesData) AS Years;

-- Build the dynamic pivot query
SET @DynamicPivotQuery =
    N'SELECT ProductID, ' + @DynamicYearColumns + N'
    FROM
    (
        SELECT ProductID, [Year], TotalSales
        FROM SalesData
    ) AS SourceTable
    PIVOT
    (
        SUM(TotalSales)
        FOR [Year] IN (' + @DynamicYearColumns + N')
    ) AS PivotTable;';

-- Execute the dynamic pivot query
EXEC sys.sp_executesql @DynamicPivotQuery;
```

Before SQL Server 2017 (no `STRING_AGG`):

```sql
SELECT @DynamicYearColumns = STUFF((
    SELECT DISTINCT ', ' + QUOTENAME([Year])
    FROM SalesData
    FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 2, '');
```

## Unpivot

The reverse: columns to rows. Given `SalesWide(ProductID, [2020], [2021])`:

```sql
SELECT ProductID, [Year], TotalSales
FROM SalesWide
UNPIVOT (TotalSales FOR [Year] IN ([2020], [2021])) AS u;
-- Year comes back as NVARCHAR (the column name); rows with NULL are dropped
```

`CROSS APPLY (VALUES ...)` is more flexible (keeps NULLs, lets you unpivot several columns and choose types):

```sql
SELECT w.ProductID, v.[Year], v.TotalSales
FROM SalesWide w
CROSS APPLY (VALUES (2020, w.[2020]),
                    (2021, w.[2021])) AS v([Year], TotalSales);
```
