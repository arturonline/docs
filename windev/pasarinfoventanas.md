# Windev Pasar Info entre Ventanas

ventana 1: Listado de Eventos (**Eventos**)
ventana 2: popUp para elegir fecha a mostrar (**EventosPopUp**)

1. abrimos el popup con `openchild(EventosPopUp)` or `openchild(EventosPopUp, param)`
2. cuando queremos cerrar el popup: `Close(Evento, true)`
3. Recogemos el resultado en la ventana Eventos:

```java
// closing a child window of Eventos
IF MyChildWindow..Name = "SPHEventosFrm" THEN
    IF MyChildWindow..ReturnedValue = True THEN
        //Significará que hay que recargar
        oEventos.CargaDatos()
    END
END
```