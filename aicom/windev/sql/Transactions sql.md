# SQL Transactions

## Transactions

The following SQL syntaxes can be used with windev to manage transactions in SQL code:

### Start a Transaction

- BEGIN
- BEGIN WORK
- BEGIN TRANSACTION
- START TRANSACTION
- START TRANSACTION ISOLATION <Level>. The <Level>  parameter can correspond to:
    - READ UNCOMMITTED
    - READ COMMITTED
    - REPEATABLE READ
    - SERIALIZABLE

### Validating a transaction

- COMMIT
- COMMIT WORK
- COMMIT TRANSACTION

The syntaxes used to chain a new transaction:
- COMMIT AND CHAIN
- COMMIT WORK AND CHAIN
- COMMIT TRANSACTION AND CHAIN

### Canceling a transaction

- ROLLBACK
- ROLLBACK WORK
- ROLLBACK TRANSACTION

The syntaxes used to chain a new transaction are also available:
- ROLLBACK AND CHAIN
- ROLLBACK WORK AND CHAIN
- ROLLBACK TRANSACTION AND CHAIN

## sql Transaction

```cs
query is SQL Query = 
[
	BEGIN;
		INSERT INTO pelis2 (Name, Director, Genre) VALUES ('LoTR', 'Peter Jackson', 'Fantastico');
		INSERT INTO pelis2 (Name, Director, Genre) VALUES ('StarWars', 'George Lucas', 'Sci-fi');
		INSERT INTO pelis2 (Name, Director, Genre) VALUES ('Pulp Fiction', 'Tarantino', 'Thriller');
	COMMIT;
]

IF NOT HExecuteQuery(query, hCheckIntegrity + hCheckDuplicates) THEN
	Info (HErrorInfo())
ELSE
	Close()
END
```