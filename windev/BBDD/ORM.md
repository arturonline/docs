# Funcions manejo bases de datos

## HReadSeekFirst (Function)

Positions on the first record of a data file whose value for a specific item is strictly equal to a sought value (exact-match search)

```lua
// <Result> = HReadSeekFirst(<Data file> , <Item> , <Sought value> [, <Options>])
HReadSeekFirst(DATOS_CRMEventos, DATOS_CRMEventos.idEvento, myId)
```

```lua
// Find the first record for which
// the CUSTOMER name is MOORE
HReadSeekFirst(CUSTOMER, NAME, "MOORE")
IF HFound() = False THEN
    Error("Customer not found")
    RETURN
ELSE
// Continue the process on the customer named MOORE
END
```

## HReadFirst

Positions on the first file record.

```lua
HReadFirst(Customer, Name)
WHILE HOut(Customer) = False
        // Process the record
        HReadNext(Customer, Name)
END
```

⚠`HOut` if the file is empty or there is no record HOut returns true.

⚠`HReadNext` is used to set the position on the next data file record.

## HAdd (insert)

```lua
// 1. genera nuevo record
HReset(TEMP_NOC) 

// 2. Añade información al record
TEMP_NOC.Opcion		= "1"
TEMP_NOC.CodCliente	= 20231
TEMP_NOC.cTipoNota	= "Cobro"
TEMP_NOC.CodProveed	= "6A22"

// 3. Inserta el record
HAdd(TEMP_NOC) 
```

## HModify (update)

```cs
// Finds the record
HReadSeekFirst(Customer, Name, "Smith")
 
IF HFound() = True THEN
    // Modify a record in a data file
    // (record described through programming)
    Customer.FirstName = "Vince"
    Customer.City = "San Francisco"
    Customer.Zip = "94102"
    Customer.Country = "USA"
    HModify(Customer)
END
```

## HDelete

```cs
// Suppression des commandes d'un client
HReadSeekFirst(Commande, NumCli, ValNumCli)
WHILE HFound() = True
    HDelete()
    HReadNext()
END
```

## HFilter

HFilter returns an optimized search key that can be used to browse a data file, view or query.

```cs
// to select the customers whose name corresponds to "Smith":
mykey = HFilter(Customer, Name, "Smith")

HReadFirst(Customer, mykey)
WHILE HOut() = False
    // Process the filtered record
    ...
    HReadNext(Customer, mykey)
END

// Cancels the filter
HDeactivateFilter(Customer)

```
