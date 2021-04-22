# Transactions windev

## overview

- A transaction is a set of indissociable operations: either all the operations of the transaction are performed, or none is performed. 
- Each write operation performed during a transaction is stored in a transaction file. 
- The transaction can be canceled at any time: all operations performed since the beginning of transaction will be canceled.

Example:

```cs
MyConnection1 is Connection
 
// 1. Start transaction on data files associated with MyConnection1
HTransactionStart(MyConnection1)
 
// 2. Code used to prepare the order to added

aMovie is Record of pelisdb

aMovie.Name = "nombre"
aMovie.Director = "director"
aMovie.Genre = "genero"
aMovie.ID = 1000

pelis2 = aMovie

// 3. Code used to process the order 
WHEN EXCEPTION IN
    // 3.1 Add the order
    HAdd(pelisdb)
    // 3.2 Validate the addition
    HTransactionEnd(MyConnection1)
DO
    // 4. Delete the order lines
    HTransactionCancel(MyConnection1)
END
```


