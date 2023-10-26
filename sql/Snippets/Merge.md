# Merge

## Sintaxis

```sql
MERGE target_table AS target
USING source_table AS source
ON merge_condition

WHEN MATCHED THEN
    --- UPDATE or DELETE statements
WHEN NOT MATCHED THEN
    --- INSERT statement
```

## Example 1

```sql
MERGE products AS target
USING new_products AS source
ON target.product_id = source.product_id
WHEN MATCHED THEN
    UPDATE SET target.product_name = source.product_name, target.price = source.price
WHEN NOT MATCHED THEN
    INSERT (product_id, product_name, price)
    VALUES (source.product_id, source.product_name, source.price);
```

## Example 2

```sql
MERGE [RRHH].[Empleados] AS Tar
USING [Kais].[vw_DameRWEmpleados] AS Src
ON Tar.CodEmpleado = Src.CodEmpleado

WHEN MATCHED  THEN
    UPDATE SET
        Tar.RefExterna        =  Src.RefExterna
    ,  Tar.nEstado           =  Src.nEstado
    ,  Tar.CodEmpleado       =  Src.CodEmpleado
    ,  Tar.NomEmpleado       =  Src.NomEmpleado
    ,  Tar.ApeEmpleado       =  Src.ApeEmpleado
    ,  Tar.Telefono          =  Src.Telefono
    ,  Tar.Movil             =  Src.Movil
    ,  Tar.Nif               =  Src.Nif
    ,  Tar.Direccion         =  Src.Direccion
    ,  Tar.CodPostal         =  Src.CodPostal
    ,  Tar.Poblacion         =  Src.Poblacion
    ,  Tar.CodProvin         =  Src.CodProvin
    ,  Tar.Provincia         =  Src.Provincia
    ,  Tar.CodPais           =  Src.CodPais
    ,  Tar.Mail              =  Src.Mail
    ,  Tar.Observa           =  Src.Observa
    ,  Tar.feAlta            =  Src.feAlta
    ,  Tar.feNacimiento      =  Src.feNacimiento
    ,  Tar.feBaja            =  Src.feBaja
WHEN NOT MATCHED BY SOURCE AND ( Tar.Origen = '1') THEN DELETE;
```