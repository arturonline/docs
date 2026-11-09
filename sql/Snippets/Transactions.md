# Transactions

Dialect: SQL Server. See also: [Errors](Errors.md), [Transaccions en MySQL](../fp/transaccions.md) (savepoints, isolation levels, `START TRANSACTION`).

Sample table:

```sql
CREATE TABLE dbo.Accounts (
    Name    NVARCHAR(30) PRIMARY KEY,
    Balance DECIMAL(10, 2) NOT NULL CHECK (Balance >= 0)
);
INSERT INTO dbo.Accounts VALUES (N'Alícia', 500), (N'Pep', 100), (N'Maria', 0);
```

## Recommended pattern: XACT_ABORT + TRY/CATCH

```sql
SET XACT_ABORT ON;   -- any runtime error rolls back the whole transaction and aborts the batch

BEGIN TRY
    BEGIN TRANSACTION;

    UPDATE dbo.Accounts SET Balance = Balance - 100 WHERE Name = N'Alícia';
    UPDATE dbo.Accounts SET Balance = Balance + 100 WHERE Name = N'Pep';

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
    THROW;   -- re-throw the original error to the caller
END CATCH;
-- Alícia 400 | Pep 200
-- If Alícia had 50, the CHECK fails -> CATCH -> ROLLBACK -> both balances unchanged
```

Why each piece:

- `SET XACT_ABORT ON`: without it, many errors (e.g. constraint violations) only abort the **statement**, and the transaction continues with the rest. It also ensures a rollback if the client times out/cancels (no CATCH runs in that case).
- `IF @@TRANCOUNT > 0`: avoids an error if the transaction was already rolled back.
- `THROW;`: without it the error is swallowed and the caller thinks everything went OK. See [Errors](Errors.md).

## Template for stored procedures

```sql
CREATE OR ALTER PROCEDURE dbo.Transfer
    @From NVARCHAR(30),
    @To   NVARCHAR(30),
    @Amount DECIMAL(10, 2)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        UPDATE dbo.Accounts SET Balance = Balance - @Amount WHERE Name = @From;
        IF @@ROWCOUNT = 0
            THROW 50001, 'Source account not found', 1;

        UPDATE dbo.Accounts SET Balance = Balance + @Amount WHERE Name = @To;
        IF @@ROWCOUNT = 0
            THROW 50002, 'Target account not found', 1;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

EXEC dbo.Transfer @From = N'Alícia', @To = N'Joan', @Amount = 100;
-- Msg 50002: Target account not found  (Alícia's update rolled back)
```

## Legacy pattern: @@ERROR (avoid in new code)

`@@ERROR` is reset after **every** statement, so it must be checked right after each one. TRY/CATCH replaces it.

```sql
BEGIN TRANSACTION;

UPDATE dbo.Accounts SET Balance = Balance - 100 WHERE Name = N'Alícia';
IF @@ERROR <> 0
BEGIN
    ROLLBACK TRANSACTION;
    RAISERROR('Error creating project', 16, 1);
    RETURN;
END

COMMIT TRANSACTION;
```

## Savepoints

```sql
BEGIN TRANSACTION;
    UPDATE dbo.Accounts SET Balance = Balance - 100 WHERE Name = N'Alícia';
    SAVE TRANSACTION BeforeCredit;

    UPDATE dbo.Accounts SET Balance = Balance + 100 WHERE Name = N'Pep';
    ROLLBACK TRANSACTION BeforeCredit;   -- undo only the credit to Pep

    UPDATE dbo.Accounts SET Balance = Balance + 100 WHERE Name = N'Maria';
COMMIT TRANSACTION;
```

## Nested transactions (they are not really nested)

- Each `BEGIN TRANSACTION` increments `@@TRANCOUNT`; each `COMMIT` decrements it. Only the outermost `COMMIT` (when it reaches 0) really commits.
- A `ROLLBACK` (without savepoint name) rolls back **everything** and sets `@@TRANCOUNT` to 0.
- `XACT_STATE()`: `1` = active and committable, `-1` = active but doomed (only ROLLBACK allowed), `0` = no transaction.

```sql
BEGIN TRAN;           -- @@TRANCOUNT = 1
    BEGIN TRAN;       -- 2
    COMMIT;           -- 1 (nothing committed yet)
ROLLBACK;             -- 0: everything is undone, inner "commit" included
```

## Isolation levels

```sql
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;   -- default
-- READ UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SNAPSHOT | SERIALIZABLE
```

- `WITH (NOLOCK)` = `READ UNCOMMITTED`: can read uncommitted, duplicated or missing rows. Don't use it as a "performance fix".
- To reduce blocking between readers and writers, enable row versioning instead:

```sql
ALTER DATABASE MyDb SET READ_COMMITTED_SNAPSHOT ON;   -- readers see the last committed version
ALTER DATABASE MyDb SET ALLOW_SNAPSHOT_ISOLATION ON;  -- enables SET TRANSACTION ISOLATION LEVEL SNAPSHOT
```

## Tips

- Keep transactions short: no user interaction or slow external calls inside.
- Access tables in the same order in all procedures to reduce deadlocks (error 1205; the victim can simply retry).
- Check open transactions in a session: `SELECT @@TRANCOUNT;` / `DBCC OPENTRAN;`.
