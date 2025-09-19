# how to async

## SendAjax


```js
 let response = await SendAjax('ActualizarArticuloPendiente', {
            id: oSelectedRecord.get("nIdReg"),
            familia: familia,
        }, 'ArticulosPendientesBrw');
``` 

```cs
var aComandos = oContexto.GetCommands();
var id = aComandos.Get("id");
var familia = aComandos.Get("familia");
```
