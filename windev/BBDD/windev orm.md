# Funcions manejo bases de datos

## HReadSeekFirst (Function)

Positions on the first record of a data file whose value for a specific item is strictly equal to a sought value (exact-match search)

```cs
// <Result> = HReadSeekFirst(<Data file> , <Item> , <Sought value> [, <Options>])
HReadSeekFirst(DATOS_CRMEventos, DATOS_CRMEventos.idEvento, myId)
```

```cs
// Find the first record for which
// the CUSTOMER name is MOORE
HReadSeekFirst(CUSTOMER, NAME, "MOORE")
IF HFound(CUSTOMER) = False THEN
    Error("Customer not found")
    RETURN
ELSE
// Continue the process on the customer named MOORE
END
```