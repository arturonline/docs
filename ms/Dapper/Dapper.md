# Introducción a dapper

- [Introducción a dapper](#introducción-a-dapper)
  - [Setup](#setup)
  - [Métodos](#métodos)
    - [🚀 Execute](#-execute)
    - [🚀 Execute Reader](#-execute-reader)
    - [🚀 Execute Scalar](#-execute-scalar)
    - [🚀 Query](#-query)
    - [🚀 QueryMultiple](#-querymultiple)
  - [Parameters](#parameters)
    - [🚀 Anonymous](#-anonymous)
    - [🚀 Dynamic](#-dynamic)
    - [🚀 List](#-list)
    - [🚀 string](#-string)
  - [Links](#links)
  
## Setup

Instalar el paquete https://www.nuget.org/packages/Dapper

## Métodos

### 🚀 Execute

Executes a command one or multiple times and return the number of affected rows.

```cs
[Inject] SqlConnection connection { get; set; }

var affectedRows = connection.Execute(sql, new {CustomerID = 1});
```

Multiple times: once for every object in the array list

```cs
var affectedRows = connection.Execute(sql,
new[]
{
    new {CustomerName = "John"},
    new {CustomerName = "Andy"},
    new {CustomerName = "Allan"}
}
```

Execute stored procedure:

```cs
var procedure = "[sp_UpdSales]"

var affectedRows = connection.Execute(
    procedure, 
    new {Kind = InvoiceKind.WebInvoice, Code = "Single_Insert_1"},
    commandType: CommandType.StoredProcedure);
```

### 🚀 Execute Reader

Used when the results of a query are not processed by Dapper. For example, to fill a DataTable or DataSet

```cs
var reader = connection.ExecuteReader("SELECT * FROM Customers;");

DataTable table = new DataTable();
table.Load(reader);
            
FiddleHelper.WriteTable(table);
```

Execute reader a stored procedure:

```cs
var procedure = "SelectAllCustomers @IsActive = @isActive";
var reader = connection.ExecuteReader(procedure, new {IsActive = true} );

DataTable table = new DataTable();
table.Load(reader);
```

### 🚀 Execute Scalar

It executes the query, and returns the first column of the first row in the result set returned by the query. 

```cs
var name = connection.ExecuteScalar<string>("SELECT Name FROM Customers WHERE CustomerID = 1;");
```

### 🚀 Query

```cs
var orderDetail = connection.Query(sql).FirstOrDefault();

var orderDetails = connection.Query<OrderDetail>(sql).ToList();
```

### 🚀 QueryMultiple

QueryMultiple method can execute multiple queries within the same command and map results.

```cs
using (var multi = connection.QueryMultiple(sql, new {InvoiceID = 1}))
{
    var invoice = multi.Read<Invoice>().First();
    var invoiceItems = multi.Read<InvoiceItem>().ToList();
}
```

## Parameters

### 🚀 Anonymous

One parameter (CustomerName = "mark"):

```cs
var affectedRows = connection.Execute(sql, new {CustomerName = "Mark"});
```

Many:

```cs
var affectedRows = connection.Execute(sql,
new[]
{
    new {CustomerName = "John"},
    new {CustomerName = "Andy"},
    new {CustomerName = "Allan"}
}
```

### 🚀 Dynamic

```cs
DynamicParameters parameter = new DynamicParameters();

parameter.Add("@Kind", InvoiceKind.WebInvoice, DbType.Int32, ParameterDirection.Input);
parameter.Add("@Code", "Many_Insert_0", DbType.String, ParameterDirection.Input);
parameter.Add("@RowCount", dbType: DbType.Int32, direction: ParameterDirection.ReturnValue);

connection.Execute(sql, parameter, commandType: CommandType.StoredProcedure);

int rowCount = parameter.Get<int>("@RowCount");
```

### 🚀 List

```cs
var invoices = connection.Query<Invoice>(sql, new {Kind = new[] {InvoiceKind.StoreInvoice, InvoiceKind.WebInvoice}}).ToList();
```

### 🚀 string

```cs
var invoices = connection.Query<Invoice>(sql, new {Code = new DbString {Value = "Invoice_1", IsFixedLength = false, Length = 9, IsAnsi = true}}).ToList();
```

## Links

- https://dapper-tutorial.net/execute-reader
- https://www.learndapper.com/