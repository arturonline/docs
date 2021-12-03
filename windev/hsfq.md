# bases de datos windev

## Query

```java
cQueryLin is string = StringBuild( "SELECT * FROM VENTAS_NOL WHERE NumNota = '%1' AND cTipoNota = '%2'", cNumNota, cTipoNota )
```

## Consulta

```java
// Obtenemos los eventos de la base de datos del día indicado
IF NOT HExecuteSQLQuery(oDatosEventos, hQueryDefault, cQuery ) THEN
    InfoMsg( "Error en la consulta de Eventos: " + CRLF + CRLF + HErrorInfo( hErrFullDetails ), "Error" )
    DesactivaHourglass()
    RETURN
END
```

## Loopear resultados

```java
// Guardamos la información en un array del tipo structure de eventos
HReadFirst(oDatosEventos)
WHILE HFound( oDatosEventos )
    evento is xEvento = [oDatosEventos.cTitulo, oDatosEventos.cCliente, oDatosEventos.cCategoria, oDatosEventos.cHora, oDatosEventos.cPrioridad, oDatosEventos.nEstado, oDatosEventos.nPrioridadColor, oDatosEventos.lFinalizado]
    ArrayAdd(aEventos, evento)
    HReadNext(oDatosEventos)
END
HClose(oDatosEventos)
```

## Llenar looper

```java
// llamar Llenar Looper desde hilo principal
FOR EACH evento IN aEventos
    row is int = LooperAddLine(SPHEventos.oLooEventos)
    SPHEventos.oLooEventos[row].oTxtEvento = evento.cTitulo
    SPHEventos.oLooEventos[row].oTxtCliente = evento.cCliente
    SPHEventos.oLooEventos[row].oTxtCategoria = evento.cCategoria
    SPHEventos.oLooEventos[row].oTxtHora = evento.cHora
    SPHEventos.oLooEventos[row].oTxtPrioridad = evento.cPrioridad
    SPHEventos.oLooEventos[row].oTxtPrioridad..Color = evento.nPrioridadColor
    SPHEventos.oLooEventos[row].oTxtEstado..Color = evento.nEstado	
END
```
