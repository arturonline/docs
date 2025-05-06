# Transactions

```sql
BEGIN TRANSACTION;
    IF @@ERROR <> 0
    BEGIN
        ROLLBACK ;
        RAISERROR('Error creando proyecto', 16, 1);
    END
    ELSE
    BEGIN
        COMMIT TRANSACTION;
    END
END;
```

## errors + transactions

```sql
BEGIN TRY
    BEGIN TRANSACTION;
    -- Su código aquí...
    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    -- Su código de manejo de errores aquí...
    ROLLBACK TRANSACTION;
END CATCH
```