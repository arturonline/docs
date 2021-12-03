# sqliteutils

```java
cQuery = [
SELECT
    Datos_CRMEventos.Titulo AS cTitulo,
    Datos_CLI.Nombre AS cNomCliente,
    Datos_CRMCategoria.Nombre AS cCategoria,
    Datos_CRMEventos.heVto AS cHora,
    Datos_CRMPrioridad.Nombre AS cPrioridad,
    Datos_CRMEstados.Color AS nEstado,
    Datos_CRMPrioridad.Color AS nPrioridadColor,
    Datos_CRMEstados.lFinalizado
FROM
    Datos_CRMEventos
LEFT JOIN Datos_CLI
    ON Datos_CRMEventos.CodCliente = Datos_CLI.Codigo
LEFT JOIN Datos_CRMCategoria
    ON Datos_CRMEventos.IdCategoria = Datos_CRMCategoria.Codigo
LEFT JOIN Datos_CRMPrioridad
    ON Datos_CRMEventos.IdPrioridad = Datos_CRMPrioridad.Codigo
LEFT JOIN Datos_CRMEstados
    ON Datos_CRMEventos.IdEstado = Datos_CRMEstados.Codigo
    WHERE Datos_CRMEVENTOS.FEVTO = '%1'
]

cQuery = StringBuild(cQuery, dia)

SQLiteUtils.Query(oApp.oAppPaths.cPathDatos + "/Datos_01.db", oDatosEventos, cQuery)

WHILE NOT SQLiteUtils.Eof("oDatosEventos") 
    evento is xEvento
    evento:cTitulo  = SQLiteUtils.GetValue( "oDatosEventos", "cTitulo")
    evento:cNomCliente  = SQLiteUtils.GetValue( "oDatosEventos", "cNomCliente")
    evento:cCategoria   = SQLiteUtils.GetValue( "oDatosEventos", "cCategoria")
    evento:cHora    = SQLiteUtils.GetValue( "oDatosEventos", "cHora")
    evento:cPrioridad   = SQLiteUtils.GetValue( "oDatosEventos", "cPrioridad")
    evento:nEstado  = SQLiteUtils.GetValue( "oDatosEventos", "nEstado")
    evento:nPrioridadColor  = SQLiteUtils.GetValue( "oDatosEventos", "nPrioridadColor")
    evento:lFinalizado  = SQLiteUtils.GetValue( "oDatosEventos", "lFinalizado")

    ArrayAdd(aEventos, evento)
    SQLiteUtils.ReadNext( "oDatosEventos")
END
SQLiteUtils.BorrarDataSet("oDatosEventos")
```
