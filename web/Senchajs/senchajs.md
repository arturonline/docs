# trucos

## Pasar Arrays al backend


```js
// Generamos array Json apartir de datos que queramos pasar
let datos = ["hola", "amigo", "que", "tal"];
let arrayAPasarEnJson = JSON.stringify(datos);
``` 

```cs
// Recogemos los datos y convertimos en dictionary
var aComandos = oContexto.GetCommands(true);
var data = aComandos.Get("arrayAPasarEnJson");

var elementos = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(data);


// Usamos los datos
var sql = "";
foreach (var pregunta in elementos)
{
    sql += $@"
            UPDATE master.EncuestasPreguntas
            SET nOrden = '{pregunta["nOrden"]}'
            WHERE CodPregunta = '{pregunta["CodPregunta"]}' AND CodEncuesta = '{pregunta["CodEncuesta"]}'; 
    ";
}
```

## Devolver error sql en Backend

```c#

if (elementos.Count == 0)
{
    var cError = TJson.EncodeJson(false, "No se han recibido datos");
    oContexto.Response.Write(cError);
    return;
}
```

## redirect o abrir pagina programaticamente

```js
        // hacemos redirect a la página de delegaciones
        // PROCEDEMOS A CREAR EL FORMULARIO
        Ext.getCmp('XPortalFrm').queryById('oTabPanel').add(Ext.create('Ext.panel.Panel', {
            id: 'oTab' + oData.cCodigo + 'Frm',
            title: oIdioma.Get(oData.cTitulo),
            tooltip: oIdioma.Get(oData.cTitulo),
            layout: 'fit',
            autoDestroy: true,
            items: [
                Ext.create('App.view.T' + oData.cFormulario, aParams)
            ]
        }));

        // MOSTRAMOS LA TAB DEL FORMULARIO
        Ext.getCmp('XPortalFrm').queryById('oTabPanel').setActiveTab('oTab' + oData.cCodigo + 'Frm');
``` 

## await when load store

```js
        // Cargamos la plantilla en el grid
        grid.getStore().getProxy().extraParams.categoria = categoria
        grid.getStore().getProxy().extraParams.delegacion = delegacion

        // Add a listener to execute setUiCamion after the store is loaded
        grid.getStore().on('load', async function () {
            // Cargamos la información del camión
            await this.setUiCamion(oView, categoria, delegacion);
            // Actualizamos UI
            grid.show();
            panelCamion.show();
            panelInicial.hide();
        }, this);

        grid.getStore().reload();
```

D:\source\Deno-Oak-Postgress\lara-server
