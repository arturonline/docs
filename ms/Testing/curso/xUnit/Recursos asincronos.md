# Necesidades asíncronas e interceptores

En lecciones anteriores hemos estudiado cómo en xUnit.net utilizamos el constructor de la clase o accesorio para crear los recursos que necesitemos para las pruebas, y utilizamos el método Dispose para liberar esos recursos. Pero, existen situaciones donde no es suficiente y el constructor/dispose se puede quedar un poco corto como por ejemplo es las operaciones asíncronas.

xUnit nos ofrece la interfaz `IAsyncLifetime` y el atributo `BeforeAfterTestAttribute` para efectuar inicializaciones y destrucciones asíncronas.

## IAsyncLifetime

IAsyncLifetime es una interfaz que nos provee xUnit para poder realizar ejecuciones asíncronas antes y después de cada prueba. Esta interfaz es muy sencilla y sólo contiene dos métodos:

```cs
public interface IAsyncLifetime
{
    Task InitializeAsync();
    Task DisposeAsync();
}
```

La propia documentación de la interfaz indica que es posible utilizarla, tanto en clases de prueba, como en accesorios de clase y de colección. Esto nos proporciona una potente herramienta para realizar acciones asíncronas sin necesidad de utilizar el método Wait(). Esto lo conseguiremos añadiendo el código asíncrono dentro del método correspondiente en cada caso: InitializeAsync para iniciar y DisposeAsync para liberar.

>Nota: aunque su nombre es igual, DisposeAsync no tiene nada que ver con el método DisposeAsync de la interfaz IAsyncDisposable que apareció con .NET Core 3 y .NET Standard 2.1, aunque es un buen lugar para utilizarlo.

## Interceptores

Los Interceptores son atributos de los que podemos heredar para interceptar la llamada a un método de prueba y realizar acciones antes y después de éste. Dicho atributo es `BeforeAfterTestAttribute`, que es simplemente una clase abstracta que nos ofrece dos sencillos métodos virtuales con los que podemos añadir código antes y después de la prueba:

```cs
public abstract class BeforeAfterTestAttribute : Attribute
{
    public virtual void After(MethodInfo methodUnderTest)
    {
    }
    public virtual void Before(MethodInfo methodUnderTest)
    {
    }
}
```

Los atributos que vayamos a crear heredando de `BeforeAfterTestAttribute` no ofrecen elementos accesibles durante la prueba, de decir, dentro del método de la prueba no tenemos acceso a los datos que maneja el atributo ni podemos recuperar nada de éste. Para poder utilizar estos interceptores, basta con que creemos nuestro propio atributo e implementemos los métodos After y Before. No es necesario implementar los dos: puede que en un caso particular solo sea necesario uno de ellos.

Ejemplo:

Imagina, por ejemplo, que tienes algunas pruebas en las que debes utilizar una información de localización distinta a la que tiene el contexto en el que se ejecuta el propio runner.

```cs
public class UseCultureAttribute : BeforeAfterTestAttribute
{
    private CultureInfo _originalCulture;
    private CultureInfo _originalUiCulture;
    private readonly CultureInfo _culture;
    private readonly CultureInfo _uiCulture;

    public UseCultureAttribute(string culture)
        : this(culture, culture) { }

    public UseCultureAttribute(string culture, string uiCulture)
    {
        _culture = new CultureInfo(culture, false);
        _uiCulture = new CultureInfo(uiCulture, false);
    }

    public override void Before(MethodInfo methodUnderTest)
    {
        _originalCulture = Thread.CurrentThread.CurrentCulture;
        _originalUiCulture = Thread.CurrentThread.CurrentUICulture;

        Thread.CurrentThread.CurrentCulture = _culture;
        Thread.CurrentThread.CurrentUICulture = _uiCulture;

        CultureInfo.CurrentCulture.ClearCachedData();
        CultureInfo.CurrentUICulture.ClearCachedData();
    }

    public override void After(MethodInfo methodUnderTest)
    {
        Thread.CurrentThread.CurrentCulture = _originalCulture;
        Thread.CurrentThread.CurrentUICulture = _originalUiCulture;

        CultureInfo.CurrentCulture.ClearCachedData();
        CultureInfo.CurrentUICulture.ClearCachedData();
    }
}
```

Un dato importante es que BeforeAfterTestAttribute puede ser utilizado tanto a nivel de método como a nivel de clase, y que además puede utilizarse más de una vez. Esto quiere decir que podríamos tener varios interceptores en diferentes niveles, tanto en la clase como en el método.

El orden de ejecución en caso de que se declaren varios interceptores, es desde la clase hacia la prueba. Se respeta el orden en el que están colocados antes de ejecutar la prueba, y desde la prueba hacia la clase al terminar ésta.

Vamos a poner un caso práctico. Si tenemos una clase como esta:

```cs
[InterceptorA]
[InterceptorB]
public class Ejemplo
{
    [Fact]
    [InterceptorC]
    [InterceptorD]
    void Prueba() { }
}
```

## Orden de ejecución

Todos estos nuevos elementos añaden un poco de complejidad al ciclo de vida de una prueba y pueden parecer confusos a primera vista. Para aclarar los conceptos, el orden de ejecución en una prueba sin accesorios es el siguiente:

1. Constructor de la clase.
1. `IAsyncLifetime.InitializeAsync`.
1. Todos los `BeforeAfterTestAttribute`.Before en el orden de uso.
1. Ejecución de la prueba.
1. Todos los `BeforeAfterTestAttribute`.After en el orden de uso **inverso**.
1. `IAsyncLifetime.DisposeAsync`.
1. Dispose de la clase.
