# Pivot

Imagine you have the sales data table:

ProductID | Year | TotalSales
----------|------|-----------
1         | 2020 | 15000
1         | 2021 | 20000
2         | 2020 | 25000
2         | 2021 | 30000



And you want to see the total sales for each product by year:

ProductID | 2020  | 2021
----------|-------|-------
1         | 15000 | 20000
2         | 25000 | 30000



To achive that you can use pivot:

```sql
SELECT ProductID, [2020], [2021]
FROM
(
    SELECT ProductID, Year, TotalSales
    FROM SalesData
) AS SourceTable
PIVOT
(
    SUM(TotalSales)
    FOR Year IN ([2020], [2021])
) AS PivotTable;
```

## Dynamic Pivot 

In this case you don't know the value of rows in the year column ([2020] & [2021]):

```sql
DECLARE @DynamicYearColumns NVARCHAR(MAX);
DECLARE @DynamicPivotQuery NVARCHAR(MAX);

-- Construct the list of year columns to pivot
SELECT @DynamicYearColumns = STRING_AGG(QUOTENAME(Year), ', ')
FROM (SELECT DISTINCT Year FROM SalesData) AS Years;

-- Build the dynamic pivot query
SET @DynamicPivotQuery = 
    N'SELECT ProductID, ' + @DynamicYearColumns + '
    FROM
    (
        SELECT ProductID, Year, TotalSales
        FROM SalesData
    ) AS SourceTable
    PIVOT
    (
        SUM(TotalSales)
        FOR Year IN (' + @DynamicYearColumns + ')
    ) AS PivotTable';

-- Execute the dynamic pivot query
EXEC sp_executesql @DynamicPivotQuery;
``` 