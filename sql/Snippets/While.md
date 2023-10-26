# While

## Sintaxis

```sql
WHILE condition
BEGIN
    -- Statements to be executed while the condition is true
END
```

## Example

```sql
--- We declare an integer variable `@counter` and initialize it to 1.
DECLARE @counter INT = 1;

--- The WHILE loop checks if `@counter` is less than or equal to 5. If this condition is true, it enters the loop.
WHILE @counter <= 5
BEGIN
    --- Inside the loop, it prints the current value of `@counter` 
    PRINT 'Count: ' + CAST(@counter AS NVARCHAR(5));

    --- Increments the condition by 1 using
    SET @counter = @counter + 1;
END
```