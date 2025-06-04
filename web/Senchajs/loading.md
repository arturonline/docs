# Loading

## Añadir loading al cargar un grid

```js
// Store en el ViewModel
listeners: {
    beforeload: 'onBeforeLoad',
    load: 'onStoreLoad',
},
```

```js
// ViewController:

// 1. Antes de cargar desde el store
onBeforeLoad: function (store, operation, eOpts) {
    const oView = this.getView();
    const oGridHistorico = oView.queryById('oGridHistoricoDePrecios');
    oGridHistorico.mask(oIdioma.Get('lbl_Trabajando'));
},


// 2. Despues de cargar desde el store
onStoreLoad: function (store, operation, eOpts) {
    const oView = this.getView();
    const oGridHistorico = oView.queryById('oGridHistoricoDePrecios');
    oGridHistorico.unmask();
},
```