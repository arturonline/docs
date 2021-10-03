# SetUp Xamarin Environment for tests

## 1. Adding a UITest project to an existing solution

Click derecho en la solución del proyecto:

>Add -> New Project -> **Xamarin.UITest Cross-Platform Test Project**

## 2. Configurar el proyecto de test

### 2.1 Cargar la app en el emulador cuando se lancen los tests

El primer paso es asegurarnos que nuestra aplicación se instale en el emulador cuando lancemos los tests para eso cambiamos:

```diff
-return ConfigureApp.Android.StartApp();
+return ConfigureApp.Android
+    .EnableLocalScreenshots()
+    .InstalledApp("com.agsoft.inventory")
+    .StartApp();
```

El *""com.companyname.atxamarin"* lo sacamos del android manifest:

>Click derecho Project -> Properties -> Android manifest

### 2.2 Desactivar iOS

En Windows comentamos la linia `//[TestFixture(Paltfomr.ios)]` para que no de error cuando intente cargar el emulador de iOS en Windows.

```c#
namespace UITest1
{
    [TestFixture(Platform.Android)]
   // [TestFixture(Platform.iOS)]
    public class Tests
    {
    ....
}
```

### 2.3 Mostrar barra de tests

Nos Abrimos la barra de tests:

>Barra de menú -> Test -> Test Explorer