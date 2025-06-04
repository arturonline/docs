# Alerts and toasts

## Guardar

```js
if (response.success) {
    AgsToast.show('Success', oIdioma.Get('lbl_CambiosGuardados'));
} else {
    AgsAlert.error(oIdioma.Get('lbl_ErrGuardando') + response.cError);
}
```

## Comprobar que se ha seleccionado algún registro

```js
        // Comprobamos que se ha seleccionado un elemento
        if (!grid.getSelectionModel().hasSelection()) {
            AgsAlert.error(oIdioma.Get('lbl_SeleccionarReg'));
            return false;
        }
```
