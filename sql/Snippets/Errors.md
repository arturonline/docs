# Errors

## Raiserror

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

## Throw

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
