# Trabajar con .dlls

## Cargar dll desde fichero

Generamos una dll a partir de una clase hija y la cargamos desde la clase padre.

### Hija

>Proyecto: `pruebadll1` <br>
>Clase a cargar: `pruebadll1.DynamicExample` <br>
>Método: `Main`

### Parent

```cs
AssemblyLoadContext loadContext = null;

try
{
    // Create a new context and mark it as 'collectible'.
    string tempLoadContextName = Guid.NewGuid().ToString();
    loadContext = new AssemblyLoadContext(tempLoadContextName, true);

    // Load the assembly we wish to use into the new context.
    const string pathToAssembly = @"D:\source\dll1\pruebadll1.dll";
    Assembly assembly = loadContext.LoadFromAssemblyPath(pathToAssembly);

    // Create an instance of a class from the assembly.
    Type classType = assembly.GetType("pruebadll1.DynamicExample");
    dynamic classInstance = Activator.CreateInstance(classType);

    // Get the Main method
    MethodInfo mainMethod = classType.GetMethod("Main", BindingFlags.Public | BindingFlags.Static);

    // create parameters
    object[] parameters = [_app.ConnectionStringLocal, this];

    // Call the Main method with parameters on the object and get the result. 
    object result = mainMethod.Invoke(null, parameters);
}
finally
{
    // Unload the context.
    loadContext.Unload();
}
```

## Pasar parámetros a una dll

### Parent

```cs
// Pasamos 2 parametros, un string y una clase (el propio parent)
object[] parameters = ["hola", this];
```

### Hija

```cs
public class DynamicExample
{
    // Estamos pasando 2 parametros: 
    // una cadena de texto: cad
    // y una clase: sender
    public static void Main(string cad, object sender)
    {
        var o = (HomePageViewModel)sender;

        MyWindow myWindow = new(o);
        myWindow.Show();
    }
}
```

## Recibir parámetros de una dll (delegate pattern)

### hija

```cs
private void Button_Click(object sender, RoutedEventArgs e)
{
    hp.resultat = "CAMBIADO!";
    hp.RecogerDatos();
}
```

### Parent

```cs
public void RecogerDatos()
{
    System.Windows.MessageBox.Show(resultat);
}
```