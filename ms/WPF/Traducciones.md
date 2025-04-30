# Traducciones

Las traducciones se almacenan en la carpeta `Resources/Lang`. 
Cada archivo de idioma tiene el nombre del idioma en formato ISO 639-1 (por ejemplo, `es-ES.xaml` para español). 

Las cadenas se guardan en ingles y en minúscula.

## Generar nuevos idiomas

Simplemente habría que copiar el archivo `es-ES.xaml` y cambiarle el nombre al código de idioma correspondiente. 
Luego se deberán sustituir los valores de las claves en el archivo xaml.

## Como usar las traducciones en código csharp

```csharp
string login = Lang.Get("login");
```

## Como usar las traducciones en xaml

```xml
<Button Content="{DynamicResource login}" />
```