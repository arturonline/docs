# Programar con DataSources y DataTables

## Query

Lanza una consulta a la base de datos y devuelve un DataTable:

```cs
DataTable table = new();
var query = "SELECT nId, CodCliente, nEstado, NomComcial, Direccion, Poblacion FROM MASTER.CLIENTES";

using IDbConnection connection = new SqlConnection("Data Source=Provider=SQLOLEDB.1;Persist Security Info=True;Data Source=SERVIDOR02\\MODERN_2019;User ID=sa;Password=1234567a+;Initial Catalog=H0031_Matupobla");

table.Load(await connection.ExecuteReaderAsync(query));

return table;
```

## Update

Actualiza los cambios de un DataTable en la base de datos:

```cs
var query = "SELECT nId, CodCliente, nEstado, NomComcial, Direccion, Poblacion FROM MASTER.CLIENTES";

// Open the connection
using var connection = new SqlConnection("Data Source=Provider=SQLOLEDB.1;Persist Security Info=True;Data Source=SERVIDOR02\\MODERN_2019;User ID=sa;Password=1234567a+;Initial Catalog=H0031_Matupobla");
await connection.OpenAsync();

using var adapter = new SqlDataAdapter(query, connection);
using var commandBuilder = new SqlCommandBuilder(adapter);

// Use the adapter to update the database with the changes made to the DataTable
adapter.UpdateCommand = commandBuilder.GetUpdateCommand();
adapter.Update(updatedTable);

// Close the connection
await connection.CloseAsync();
```

Ejemplo de uso:

```cs
// Retrieve the data
DataTable clientesTable = await dsMasterClientes.GetClientesAdo();

// Modify the data (example: change the name of the first client)
if (clientesTable.Rows.Count > 0)
{
    clientesTable.Rows[0]["NomComcial"] = "New Name";
}

// Update the database with the modified data
await dsMasterClientes.UpdateClientesAdo(clientesTable);
```