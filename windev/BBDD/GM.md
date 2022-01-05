# bases de datos windev

```cs
oOpener.Open("DATOS_ATV", "Datos")
HReadFirst(DATOS_ATV)

WHILE HFound(DATOS_ATV)
    cItem is string = DATOS_ATV.Codigo
    
    HReadNext(DATOS_ATV)
END
```
