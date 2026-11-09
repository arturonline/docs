# Errors

Dialect: SQL Server (T-SQL). See also: [Transactions](Transactions.md) (TRY/CATCH + transactions + `XACT_ABORT`).

> For new code prefer **THROW**. `RAISERROR` is still useful for printf-style messages, severities other than 16, and `WITH NOWAIT` progress messages.

## Throw

```sql
THROW 50001, 'Invalid input', 1;
```

- **Error number**: 50001 (between 50000 and 2147483647). It does not need to exist in `sys.messages`.
- **Message**: 'Invalid input' (`NVARCHAR(2048)`).
- **State**: 1 (between 0 and 255).
- Severity is always **16**.

It raises an exception and transfers execution to the CATCH block (if there is one).

```sql
BEGIN TRY
  THROW 50001, 'Invalid input', 1;           -- throw an exception
  PRINT 'This statement will not be executed'; -- this will be skipped
END TRY
BEGIN CATCH
  -- handle the exception
  PRINT 'An exception occurred';             -- this will be executed
END CATCH
PRINT 'This statement will be executed';     -- execution continues
```

- ⚠ The statement **before** `THROW` must end with a semicolon (`;`), otherwise `THROW` is parsed as an alias/label.
- `THROW;` without parameters (only inside a CATCH) **re-throws the original error**, with its original number, message and line. This is the usual way to log/rollback and then propagate.
- The message has no `%s` formatting; build it first with `CONCAT` or `FORMATMESSAGE`:

```sql
DECLARE @msg NVARCHAR(2048) = FORMATMESSAGE(N'Permission type %d does not exist.', @IdTipo);
THROW 50002, @msg, 1;
```

- The state can be used to differentiate between errors that have the same number and message, e.g. to indicate where the exception occurred in your code, or what kind of action is required to handle it. You can repeat the error number as long as it is between 50000 and 2147483647:

```sql
THROW 50001, 'Invalid input', 1;  -- state 1 indicates a validation error
-- ...
THROW 50001, 'Invalid input', 2;  -- state 2 indicates a conversion error
```

## Raiserror

```sql
BEGIN TRY
    IF NOT EXISTS (SELECT * FROM [Auth].[TiposPermisos] WHERE Id = @IdTipo)
        RAISERROR (N'Permission type %d does not exist.', 16, 1, @IdTipo);
END TRY
BEGIN CATCH
    SELECT ERROR_NUMBER() AS Number, ERROR_MESSAGE() AS Message;
END CATCH
```

| Severity | Meaning                                                                 |
| -------- | ----------------------------------------------------------------------- |
| 0-10     | Informational: does **not** jump to CATCH (like a `PRINT`)              |
| 11-16    | User errors (use **16**); jumps to CATCH                                |
| 17-19    | Resource/software errors (17+ is not for business validation)           |
| 20-25    | Fatal, closes the connection (needs `WITH LOG` and sysadmin)            |

Progress messages that appear immediately (PRINT output is buffered):

```sql
RAISERROR('Step 1 done', 0, 1) WITH NOWAIT;
```

### THROW vs RAISERROR

| | `THROW` | `RAISERROR` |
| --- | --- | --- |
| Severity | Always 16 | Any (0-25) |
| Message formatting | No (use `FORMATMESSAGE`) | Yes (`%s`, `%d`...) |
| Re-throw original error | `THROW;` | Not possible (creates a new error, 50000) |
| Number must exist in `sys.messages` | No | Only if you pass a number instead of text |
| Respects `SET XACT_ABORT ON` | Yes (aborts batch, rolls back) | No |
| Previous statement needs `;` | Yes | No |

## Error functions (inside CATCH)

```sql
BEGIN TRY
    SELECT 1 / 0;
END TRY
BEGIN CATCH
    SELECT ERROR_NUMBER()    AS Number,     -- 8134
           ERROR_SEVERITY()  AS Severity,   -- 16
           ERROR_STATE()     AS State,      -- 1
           ERROR_PROCEDURE() AS ProcName,   -- NULL outside a procedure
           ERROR_LINE()      AS Line,
           ERROR_MESSAGE()   AS Message;    -- Divide by zero error encountered.
END CATCH
```

## Recommended pattern: log and re-throw

```sql
CREATE OR ALTER PROCEDURE dbo.DoSomething
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
            -- work...
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;

        INSERT INTO dbo.ErrorLog (Number, Message, ProcName, Line, LoggedAt)
        VALUES (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE(), ERROR_LINE(), SYSDATETIME());

        THROW;   -- propagate the original error to the caller
    END CATCH
END;
```

> The log `INSERT` goes **after** the rollback, otherwise it would be rolled back too.

Not caught by TRY/CATCH in the same scope: compile errors (syntax, missing object at parse time) and severity >= 20 errors that close the connection.

## Other dialects

```sql
-- MySQL (inside procedures)
SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid input';
-- DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK; RESIGNAL; END;

-- PostgreSQL (PL/pgSQL)
-- RAISE EXCEPTION 'Invalid input: %', p_value USING ERRCODE = 'P0001';
```
