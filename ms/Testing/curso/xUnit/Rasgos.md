# Organizar tests

## Rasgos

Los rasgos nos proveen de la capacidad para agrupar nuestras pruebas, de modo que podamos filtrarlas y lanzarlas agrupadas.

Para indicar diferentes rasgos usamos el atributo `[Trait(string,string)]`

```cs
[Fact]
[Trait("Category", "FunctionalityA")]
public void SomeMethod_ShouldBe_If()
{
    //...
}

[Fact]
[Trait("Category", "FunctionalityB")]
public void SomeMethod1_ShouldBe_If()
{
    //...
}

[Fact]
[Trait("Category", "FunctionalityA")]
[Trait("Category", "Bug")]
public void SomeMethod2_ShouldBe_If()
{
    //...
}
```

Para filtrar los rasgos o bien utilizamos el fitro del ide que estemos usando o desde la terminal con `dotnet test --filter "Clave=Valor"`.

## Crear rasgos propios

La utilidad de los rasgos puede verse un poco limitada cuando el proyecto se hace grande. Con el tiempo descubrirás que acabarás teniendo métodos de prueba con un montón de atributos aplicados para poder agruparlos bien, ya que el atributo `[Trait]` está limitado a una clave y un valor.

Para evitar esto, xUnit nos ofrece la posibilidad de crear nuestros propios rasgos personalizados, a través de los cuales podremos definir todas aquellas relaciones clave-valor que necesitemos en un solo paso.

Para lograr esto necesitamos dos cosas:

- Crear un atributo propio.
- Crear un descubridor de rasgos (TraitDiscoverer).

### 1/2 Crear un atributo propio

Basta con crear un atributo propio que implemente la interfaz marcadora `ITraitAttribute`.

```cs
[TraitDiscoverer("NombreCompletoDescubridorDeRasgos", "NombreDelEnsambladoDondeEstaElDescubridor")]
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
public class BugAttribute: Attribute, ITraitAttribute
{
    public string Id { get; private set; }

    // Constructor
    public BugAttribute(string id)
    {
        this.Id = id;
    }

    public BugAttribute(long id)
    {
        this.Id = id.ToString();
    }

    public BugAttribute()
    {

    }
}
```

- *AttributeUsage* indica donde lo vamos a usar
- *TraitDiscoverer* indica el descubridor

### 2/2 Descubridor de rasgos

Para implementar el descubridor de rasgos debemos crear una clase que implemente la interfaz `ITraitDiscoverer`. Esta interfaz nos va a obligar a implementar un método llamado `GetTraits`, que recibirá como parámetro el propio atributo en el que referenciamos el descubridor a través de una abstracción de xUnit de tipo `IAttributeInfo`. Dentro de este método, vamos a devolver una enumeración clave-valor con los diferentes rasgos que queramos añadir en nuestro atributo. 

Realmente será este descubridor el que devolverá los valores de los rasgos, tomando por reflexión los datos que necesite del atributo que hemos creado:

```cs
public class BugDiscoverer : ITraitDiscoverer
{
    public IEnumerable<KeyValuePair<string, string>> GetTraits(IAttributeInfo traitAttribute)
    {
        var bugId = traitAttribute.GetNamedArgument<string>("Id");

        yield return new KeyValuePair<string, string>("Category", "Bug");

        if (!string.IsNullOrWhiteSpace(bugId))
        {
            yield return new KeyValuePair<string, string>("Bug", bugId);
        }
    }
}
```

Con este descubridor, estamos obteniendo la propiedad Id que habíamos declarado en nuestro atributo Bug (utilizando el método genérico `GetNamedArgument` de `IAttributeInfo`), y devolvemos una colección de rasgos clave-valor en la que indicaremos los datos de categoría e identificador del bug. Esto es el equivalente a añadir dos `[Trait]`, uno indicando la categoría y otro el id del bug. De esta manera, con un solo rasgo personalizado estamos, en realidad, asignando la prueba a varios.

Una vez que tenemos ambas cosas (el rasgo personalizado y el descubridor), nuestra prueba quedaría así:

```cs
[Fact]
[Bug("1234")]
public void SomeMethod_ShouldBe_If()
{
    //...
}
```

Al estar definiendo nuestro propio rasgo, tenemos margen para hacer lo que necesitemos: agrupar bugs, agrupar historias de trabajo, tipos de prueba, funcionalidad... De igual modo, el atributo es flexible para recibir y utilizar los datos que necesitemos: *string*,*int*,*params* *float[]*...

