# Manual de localización: Preparar el proyecto

Para Localizar una aplicación en Xamarin.Forms seguiremos los siguientes pasos:

1. Especificar la referencia cultural predeterminada
2. Crear un archivo de recursos predeterminado.
3. Configurar Ios

### #1. Especificar la Referencia Cultural predeterminada

```c#
// properties/AssemblyInfo.cs

// Idioma por defecto de la aplicación
[assembly: NeutralResourcesLanguage("es-ES")]
```

### #2. Creación archivo RESX predeterminado

Para localizar una aplicación necesitamos un archivo de recursos (RESX) predeterminado  con todas las cadenas de texto usadas en la aplicación, así como archivos de recursos extra para cada idioma admitido.

Para añadir un archivo RESX:

**Agregar nuevo elemento > Resources File**

Y para hacerlo predeterminado marcamos *"Acces Modifiers"* como "*Public* o *Internal*"

Para añadir mas idiomas añadiremos un archivo por cada idioma acabados con el código del idioma y lo marcaremos con *"Acces Modifiers"* *"No code generation"*

Ejemplo:

**AppResources.resx** (predeterminado)

**AppResources.en.resx** <- Idioma EN

**AppResources.es.resx** <- Idioma ES

Para resolver una solicitud de recursos la aplicación busca por orden de mas a menos especifico:

1ero: **AppResources.en-US.resx**

2ndo: **AppResources.en.resx**

3ero: **AppResources.resx** (predeterminado)

De modo que si no encuentra una cadena ira bajando hasta el archivo predeterminado. En caso de no encontrarla dará un error NULL.

### #3. Configuración en iOS

En iOS, debe declarar todos los idiomas admitidos en el archivo *Info.plist* del proyecto.

Lo abrimos como XML y añadimos los siguientes campos:

```xml
<key>CFBundleLocalizations</key><!-- Idiomas admitidos por la app -->
<array>
    <string>en</string>
    <string>es</string>
    ...
    ...
    ...
</array>
<key>CFBundleDevelopmentRegion</key> <!-- idioma del país del desarrollador -->
<string>es</string>
```