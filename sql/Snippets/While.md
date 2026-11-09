# While

Dialect: SQL Server (T-SQL). See also: [Cursors](Cursors.md), [CTE (number series)](CTE.md#recursive-cte).

> Loops process one row/value at a time. Before writing a WHILE, check whether a single set-based statement (`UPDATE ... FROM`, `INSERT ... SELECT`, window functions) can do it.

## Sintaxis

```sql
WHILE condition
BEGIN
    -- Statements to be executed while the condition is true
    -- BREAK;     exits the loop
    -- CONTINUE;  jumps to the next iteration
END;
```

## Example

```sql
-- We declare an integer variable @counter and initialize it to 1.
DECLARE @counter INT = 1;

-- The WHILE loop checks if @counter is less than or equal to 5. If true, it enters the loop.
WHILE @counter <= 5
BEGIN
    -- Inside the loop, it prints the current value of @counter
    PRINT 'Count: ' + CAST(@counter AS NVARCHAR(5));

    -- Increments the counter by 1
    SET @counter += 1;
END;
-- Count: 1 ... Count: 5
```

Set-based equivalent (returns rows instead of printing):

```sql
SELECT value FROM GENERATE_SERIES(1, 5);   -- SQL Server 2022+
-- Older versions: recursive CTE, or a numbers/tally table
```

## Example 2

```sql
DECLARE @empid AS INT = 1, @lname AS NVARCHAR(20);

WHILE @empid <= 5
BEGIN
    SET @lname = NULL;   -- ⚠ reset: if no row matches, SELECT @var = ... keeps the previous value
    SELECT @lname = lastname FROM HR.Employees WHERE empid = @empid;
    PRINT CONCAT(@empid, ': ', ISNULL(@lname, '(not found)'));
    SET @empid += 1;
END;
```

Set-based equivalent:

```sql
SELECT empid, lastname FROM HR.Employees WHERE empid BETWEEN 1 AND 5 ORDER BY empid;
```

## Example 3: deleting in batches (legitimate use)

Deleting millions of rows in one statement can fill the transaction log and block the table for a long time. Do it in chunks:

```sql
DECLARE @batch INT = 5000;

WHILE 1 = 1
BEGIN
    DELETE TOP (@batch)
    FROM dbo.Logs
    WHERE LoggedAt < DATEADD(MONTH, -6, SYSDATETIME());

    IF @@ROWCOUNT < @batch BREAK;   -- last (partial) batch done

    -- WAITFOR DELAY '00:00:01';    -- optional: give other sessions some air
END;
```

## Example 4: iterate a table without a cursor

```sql
DECLARE @Id INT = 0;

WHILE 1 = 1
BEGIN
    SELECT TOP (1) @Id = Id
    FROM dbo.Pending
    WHERE Id > @Id
    ORDER BY Id;

    IF @@ROWCOUNT = 0 BREAK;

    EXEC dbo.ProcessItem @Id = @Id;   -- per-row work
END;
```

> MySQL: `WHILE cond DO ... END WHILE;` (only inside stored programs). PostgreSQL (PL/pgSQL): `WHILE cond LOOP ... END LOOP;` or `FOR i IN 1..5 LOOP ... END LOOP;`.
