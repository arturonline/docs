# Testing overview

## ¿Cómo hacer código que se pueda probar?

### Single responsibility principle (Principio de responsabilidad única)

Cada una de las clases que desarrollas, tiene que tener una única función por sí misma.

A simple vista esta clase parece muy correcta. Pero si la miramos detalladamente podemos comprobar que dentro de la misma clase estamos mezclando varias funcionalidades: la lógica para generar el documento y la que se ocupa de enviarlo. Esto va a hacer mucho más probable que esta clase tenga que cambiar, ya que tiene dos motivos para hacerlo.

Lo que nos dice este principio es que, si queremos enviar un correo con el documento, tengamos una clase que genere el documento y otra que lo envíe. Pero no es adecuado que el documento se pueda enviar a sí mismo. Así, si tenemos que cambiar la manera de enviarlo, no será necesario tocar esta clase.

Aplicando este principio al código que desarrollas, a la hora de crear las pruebas de código podrás crear pruebas para una funcionalidad específica y concreta, siendo mucho más fácil escribir y entender qué hace cada prueba.

### Dependency inversion principle (Principio de inversión de dependencias)

Grosso modo podríamos afirmar que, lo que implica es que, nunca debemos instanciar clases complejas dentro de otras clases.

Vamos a poner un ejemplo. Imagina que tienes una clase que instancia un contexto de datos de un ORM. Si haces un new de dicho contexto de datos desde dentro de tu clase, vas a necesitar obligatoriamente que la base de datos esté disponible durante las pruebas, o no se va a poder probar.

Esto es inadmisible desde el punto de vista de las pruebas de código. En su lugar, lo que debería ocurrir es que se recibiese el objeto como parámetro, para poder reemplazarlo por otro durante las pruebas.

## Flujo de trabajo

El proceso que va a ejecutar el runner es buscar los métodos que estén dentro de una clase pública y que tengan un atributo de pruebas (recuerda: los métodos que tengan el atributo [Fact] o [Theory]). Si el método es estático lo ejecutará directamente, mientras que si es de instancia, creará una instancia de la clase, ejecutará el método, y después liberará los recursos de la clase.

no todas las clases van a contener métodos de prueba, ni todos los métodos que contenga una clase van a ser pruebas.

Para que el runner de xUnit considere que tiene que lanzar una prueba:

- La clase tiene que ser pública (public).
- Además para que un método sea considerado de prueba debe tener el atributo [Fact] o, como veremos, ser una teoría ([Theory]).
- No es un requisito obligatorio pero es conveniente que el método de pruebas sea público, y que su retorno sea void o Task.

## Facts: Test Simples

lo primero que debemos preguntarnos es qué es necesario probar y qué estamos probando con cada una de las pruebas.

## Theories: Tests Multiples

Con el atributo `InlineData` podemos definir el cuerpo de la prueba una única vez y parametrizar los valores que le pasemos a través de los propios parámetros del método.

### Theories: Inline

```cs
public static class FactoríaDeMensajes
{
    public static string ObtenerMensaje(int código)
    {
        switch(código)
        {
            case 0:
                return "Hola";
            case 1:
                return "Adiós";
            case 2:
                return "CampusMVP";
            case 3:
                return "Pruebas";
            case 4:
                return "De";
            case 5:
                return "Código";
            default:
                return "No se ha podido recuperar";
        }
    }
}
```

El método `ObtenerMensaje_ShouldBeCorrectMessage` tomará varios parámetros:

- El primero de ellos será el resultado esperado de cada prueba (no tendría que ser necesariamente el primero, pero se considera una buena práctica, por mantener el orden).
- Los restantes parámetros que se le pasarán serán todos los datos que necesitamos para realizar la prueba, con el nombre que queramos y el tipo apropiado.

```cs
public class FactoríaDeMensajesTests
{
    [Theory]
    [InlineData("Hola",0)]
    [InlineData("Adiós",1)]
    [InlineData("CampusMVP",2)]
    [InlineData("Pruebas",3)]
    [InlineData("De",4)]
    [InlineData("Código",5)]
    [InlineData("No se ha podido recuperar",6)]
    public void ObtenerMensaje_ShouldBeCorrectMessage(string expected, int code)
    {
        //Arrange

        //Act
        var resultado = FactoríaDeMensajes.ObtenerMensaje(code);

        //Assert
        Assert.Equal(expected,resultado);
    }
}
```

El único requisito es incluir un atributo por cada uno de los datos que queremos probar (recuerda: no tienen porque ser dos), y pasárselos al atributo del mismo tipo y en el mismo orden que los espera la teoría o de lo contrario nos producirá una excepción.

### Theories: ClassData

Utilizar InlineData es muy útil cuando tienes un puñado de parámetros y unos pocos casos para probar la teoría. Pero... ¿Qué ocurre si nuestra teoría tiene cientos de casos? ¿Vamos a tener 100 atributos???

Podemos darle una vuelta de tuerca más llevándonos nuestros datos de entrada a una clase creada específicamente para almacenarlos. Por ejemplo:

```cs
public class FactoríaDeMensajesTestsData : IEnumerable<object[]>
{
    public IEnumerator<object[]> GetEnumerator()
    {
        yield return new object[] { "Hola", 0 };
        yield return new object[] { "Adiós", 1 };
        yield return new object[] { "CampusMVP", 2 };
        yield return new object[] { "Pruebas", 3 };
        yield return new object[] { "De", 4 };
        yield return new object[] { "Código", 5 };
        yield return new object[] { "No se ha podido recuperar", 6 };
    }
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
```

O usando la clase especial **TheoryData**:

```cs
public class FactoríaDeMensajesTestsData : TheoryData<string, int>
{
    public FactoríaDeMensajesTestsData()
    {
        Add("Hola", 0);
        Add("Adiós", 1);
        Add("CampusMVP", 2);
        Add("Pruebas", 3);
        Add("De", 4);
        Add("Código", 5);
        Add("No se ha podido recuperar", 6);
    }
}
```

Nuestra prueba de código utilizando ClassData sería, por tanto, algo similar a esto:

```cs
public class FactoríaDeMensajesTests
{
    [Theory]
    [ClassData(typeof(FactoríaDeMensajesTestsData))]
    public void ObtenerMensaje_ShouldBeCorrectMessage(string expected, int code)
    {
        //Arrange

        //Act
        var resultado = FactoríaDeMensajes.ObtenerMensaje(code);

        //Assert
        Assert.Equal(expected, resultado);
    }
}
```

Cuando el runner vaya a ejecutar la prueba llamará a ToList() sobre la clase que le hemos pasado para obtener la lista de estos datos.

>El requisito de esta clase de datos, es que tiene que implementar la interfaz `IEnumerable<object[]>`. En caso de no hacerlo, obtendremos un error de compilación que nos indica que la clase no es válida.

### Theories: MemberData

`MemberData` gives us the same flexibility but without the need for a class. Gracias a éste vamos a poder obtener el valor, por ejemplo, desde una enumeración estática.

Para verlo en acción, siguiendo con nuestra sencilla clase FactoríaDeMensajes podríamos tener los datos en forma de una simple lista:

```cs
public static IEnumerable<object[]> Data =>
    new List<object[]>
    {
        new object[] { "Hola", 0 },
        new object[] { "Adiós", 1 },
        new object[] { "CampusMVP", 2 },
        new object[] { "Pruebas", 3 },
        new object[] { "De", 4 },
        new object[] { "Código", 5 },
        new object[] { "No se ha podido recuperar", 6 }
    };
```

Y para utilizarlos en las pruebas, le aplicaríamos al método de test el atributo MemberData, que espera una cadena de texto con el nombre del tipo enumerable que contiene los datos:

```cs
public class FactoríaDeMensajesTests
{
    [Theory]
    [MemberData(nameof(Data))]
    public void ObtenerMensaje_ShouldBeCorrectMessage(string expected, int code)
    {
        //Arrange

        //Act
        var resultado = FactoríaDeMensajes.ObtenerMensaje(code);

        //Assert
        Assert.Equal(expected, resultado);
    }
}
```

Pero, lo realmente interesante del atributo MemberData, es que se puede utilizar con cualquier método estático que devuelva un `IEnumerable<object[]>`, incluso pasándole parámetros. Podríamos tener en nuestro método algo como esto:

```cs
public class FactoríaDeMensajesTests
{
    public static IEnumerable<object[]> GetData(int tests)
    {
        var datos = new List<object[]>
        {
            new object[] { "Hola", 0 },
            new object[] { "Adiós", 1 },
            new object[] { "CampusMVP", 2 },
            new object[] { "Pruebas", 3 },
            new object[] { "De", 4 },
            new object[] { "Código", 5 },
            new object[] { "No se ha podido recuperar", 6 }
        };

        return datos.Take(tests);
    }

    [Theory]
    [MemberData(nameof(GetData), parameters: 3)]
    public void ObtenerMensaje_ShouldBeCorrectMessage(string expected, int code)
    {
        //Arrange

        //Act
        var resultado = FactoríaDeMensajes.ObtenerMensaje(code);

        //Assert
        Assert.Equal(expected, resultado);
    }
}
```

A la hora de ejecutar las pruebas, el runner llamará a GetData pasándole un 3 como parámetro, por tanto, solo ejecutaremos 3 pruebas.

>Esto es un ejemplo absurdo, una prueba de concepto, ya que normalmente no te va a interesar ejecutar solo 3 pruebas de las 7 que hay en el caso anterior, pero nos permite ver la potencia que nos ofrece el atributo.

Por último, otra opción muy útil que nos brinda este atributo es una especie de "híbrido" entre ClassData y lo que hemos visto ya con MemberData. Es decir, vamos a poder tener una clase como esta:

```cs
public class FactoríaDeMensajesTestsData
{
    public static IEnumerable<object[]> Data =>
        new List<object[]>
        {
            new object[] { "Hola", 0 },
            new object[] { "Adiós", 1 },
            new object[] { "CampusMVP", 2 },
            new object[] { "Pruebas", 3 },
            new object[] { "De", 4 },
            new object[] { "Código", 5 },
            new object[] { "No se ha podido recuperar", 6 }
        };
}
```

En ella podremos almacenar los diferentes conjuntos de datos para las diferentes pruebas, y vamos a poder pasársela a nuestra teoría:

```cs
public class FactoríaDeMensajesTests
{
    [Theory]
    [MemberData(nameof(FactoríaDeMensajesTestsData.Data), MemberType = typeof(FactoríaDeMensajesTestsData))]
    public void ObtenerMensaje_ShouldBeCorrectMessage(string expected, int code)
    {
        //Arrange

        //Act
        var resultado = FactoríaDeMensajes.ObtenerMensaje(code);

        //Assert
        Assert.Equal(expected, resultado);
    }
}
```

Esto es especialmente útil cuando quieres tener una cierta organización de los datos de las pruebas, en vez de tenerlos todos desperdigados. Además, el hecho de tenerlos en una clase no impide que puedas seguir accediendo a una función dentro de ésta y pasarle parámetros como hemos visto en los casos anteriores.

Como puedes comprobar, el atributo MemeberData es muy potente y nos permite gestionar muchísimos escenarios en nuestras pruebas. Además, aquí también vamos a poder emplear conjuntos de datos fuertemente tipados utilizando TheoryData del mismo modo que veíamos para ClassData. Bastará con que el retorno sea `TheoryData<T>` en lugar de `IEnumerable<object[]>`.

### Theories: Crear atributos propios

xUnit.net es altamente extensible.

Imagina el caso de un cliente que te entrega en un fichero miles de datos para que añadas a una teoría. Como hemos visto, podemos utilizar ClassData o MemberData para obtener los datos. Incluso, podemos crear una clase que lea un fichero .csv o un excel y que nos devuelva los datos. Pero xUnit.net ya ha pensado en este tipo de circunstancias y podemos hacer algo mucho más simple: crear nuestro propio atributo para leer esos ficheros. Esto se puede conseguir simplemente heredando de DataAttribute.

Si para nuestra clase FactoríaDeMensajes tuviésemos un fichero .csv con los datos de la teoría, podríamos crear nuestro atributo para CSV que sería algo similar a esto:

```cs
[AttributeUsage(AttributeTargets.Method, AllowMultiple = false, Inherited = false)]
public class CsvDataAttribute : DataAttribute
{
    private readonly string _fileName;
    public CsvDataAttribute(string fileName)
    {
        _fileName = fileName;
    }

    public override IEnumerable<object[]> GetData(MethodInfo testMethod)
    {
        var pars = testMethod.GetParameters();
        var parameterTypes = pars.Select(par => par.ParameterType).ToArray();

        using (var csvFile = new StreamReader(_fileName))
        {
            string line;
            while ((line = csvFile.ReadLine()) != null)
            {
                var row = line.Split(',');
                yield return ConvertParameters(row, parameterTypes);
            }
        }
    }

    private static object[] ConvertParameters(IReadOnlyList<object> values, IReadOnlyList<Type> parameterTypes)
    {
        var result = new object[parameterTypes.Count];
        for (var idx = 0; idx < parameterTypes.Count; idx++)
        {
            result[idx] = ConvertParameter(values[idx], parameterTypes[idx]);
        }

        return result;
    }

    private static object ConvertParameter(object parameter, Type parameterType)
    {
        return parameterType == typeof(int) ? Convert.ToInt32(parameter) : parameter;
    }
}

```

Con este nuevo atributo vamos a poder leer automáticamente de un fichero CSV y vamos a convertir las diferentes columnas al tipo de dato esperado por nuestra teoría. Se crea heredando de DataAttribute. Esta clase es muy simple y se define así:

```cs
public abstract class DataAttribute : Attribute
{
    public abstract IEnumerable<object[]> GetData(MethodInfo testMethod);
    public virtual string Skip { get; set; }
}
```

En esta ocasión, lo que hacemos es sobrescribir el método abstracto `GetData()` que toma como parámetro la información del método al que se aplica (nos sirve, en este caso, para saber qué parámetros se esperan y de qué tipo), y devuelve un IEnumerable<object[]>, como ya conocemos, para obtener la información que nos interesa y que luego se va a pasar al motor de testing.

Además, hemos metido un par de métodos privados auxiliares para procesar la información del archivo CSV antes de devolverla.

>Nota: dado que es un atributo convencional de .NET, lo decoramos con el atributo AttributeUsage, indicando que se usará para decorar métodos. Además, se ha implementado un código para procesar el CSV intencionadamente simple, que sólo divide la información usando las comas y no tiene en cuenta otras complejidades relacionadas con "parsear" ese tipo de archivos, ya que no es el objeto del curso y facilita la comprensión del ejemplo.

Hay que tener en cuenta que xUnit utiliza el atributo para obtener los valores en una lista (con `ToList()`), por lo que debe devolver conjuntos completos de resultados y no utilizar resultados parciales o diferir su obtención en caso de usar alguna fuente más compleja. Debe devolver todo en la primera llamada.

>Como puedes observar, la clase DataAttribute tiene además una propiedad virtual Skip con la que de momento no estamos haciendo nada, pues es opcional. Como breve adelanto: esta propiedad nos va a permitir omitir la ejecución de una prueba. Lo veremos más adelante en el momento oportuno.

Para utilizar el nuevo atributo basta con que decoremos la teoría con éste, indicando la ruta al fichero:

```cs
public class FactoríaDeMensajesTests
{

    [Theory]
    [CsvData("test.csv")]
    public void ObtenerMensaje_ShouldBeCorrectMessage(string expected, int code)
    {
        //Arrange

        //Act
        var resultado = FactoríaDeMensajes.ObtenerMensaje(code);

        //Assert
        Assert.Equal(expected, resultado);
    }
}
```

De esta manera tan simple ya no necesitamos preocuparnos de si el fichero añade o elimina datos. Si nuestro cliente nos enviara un nuevo fichero con nuevos datos, basta con que lo pongamos en la ruta correcta y automáticamente empezaremos a utilizarlos en nuestras pruebas.

## Aserciones

Una aserción no es más que una comprobación que, en caso de no cumplirse, lanza una excepción. El runner recoge esa excepción y da por fallida la prueba, mostrando como mensaje de error el mensaje de la excepción.

## Preparación de Tests

imagina que tienes una clase que comprueba que ciertos ficheros están en un directorio. Podría ser algo tan sencillo como esto:

```cs
public static class UtilidadesDirectorio
{
    public static bool ExistenLosArchivos(string[] archivos, string directorio)
    {
        var dirInfo = new DirectoryInfo(directorio);
        if (!dirInfo.Exists)
        {
            return false;
        }
        var files = dirInfo.GetFiles().Select(file=>file.Name);
        return !archivos.Except(files).Any();
    }
}
```

>Este código comprueba si el directorio existe, obtiene todos los archivos contenidos en éste y comprueba si están todos ellos recogidos dentro del array que recibe como parámetro. De no ser así retornará un false.

A la hora de probar este código, se hace evidente que vamos a necesitar dotar a nuestras pruebas de cierta *funcionalidad extra* que nos permita preparar el entorno para las pruebas: incluir ciertos archivos en la carpeta.

La manera que nos ofrece xUnit.net de añadir este *código auxiliar* necesario para las pruebas, es utilizar el propio constructor de la clase para preparar las pruebas, e implementar `IDisposable` para limpiar los recursos una vez que hayamos terminado. 

Por ejemplo, si queremos crear unos cuantos ficheros temporales antes de ejecutar las pruebas de ese código, pero queremos que al finalizar la prueba se borren, nuestra clase de prueba sería así:

```cs
public class UtilidadesDirectorioTests : IDisposable
{
    private const string DIRECTORY = "./tests";
    private const int FILECOUNT = 5;
    private readonly string[] _files = new string[FILECOUNT];

    public UtilidadesDirectorioTests()
    {
        if (!Directory.Exists(DIRECTORY))
        {
            Directory.CreateDirectory(DIRECTORY);
        }

        for (var i = 0; i < FILECOUNT; i++)
        {
            var fileName = $"{i}.test";
            _files[i] = fileName;
            File.WriteAllText(Path.Combine(DIRECTORY, fileName), "");
        }
    }

    [Fact]
    public void ExistenLosArchivos_ShouldBeTrue_IfFilesExist()
    {
        //Arrange

        //Act
        var result = UtilidadesDirectorio.ExistenLosArchivos(_files, DIRECTORY);

        //Assert
        Assert.True(result);
    }

    [Fact]
    public void ExistenLosArchivos_ShouldBeFalse_IfFilesNotExist()
    {
        //Arrange

        //Act
        var result = UtilidadesDirectorio.ExistenLosArchivos(_files, Path.Combine(DIRECTORY, "NoExisto"));

        //Assert
        Assert.False(result);
    }

    [Fact]
    public void ExistenLosArchivos_ShouldThrowArgumentNullException_IfDirectoryIsNull()
    {
        //Arrange

        //Act
        Action act = () =>
        {
            _ = UtilidadesDirectorio.ExistenLosArchivos(_files, null);
        };

        //Assert
        Assert.Throws<ArgumentNullException>(act);
    }

    [Fact]
    public void ExistenLosArchivos_ShouldThrowArgumentNullException_IfDirectoryIsValidAndFilesIsNull()
    {
        //Arrange

        //Act
        Action act = () =>
        {
            _ = UtilidadesDirectorio.ExistenLosArchivos(null, DIRECTORY);
        };

        //Assert
        Assert.Throws<ArgumentNullException>(act);
    }

    public void Dispose()
    {
        if (Directory.Exists(DIRECTORY))
        {
            Directory.Delete(DIRECTORY, true);
        }
    }
}

```

Si te fijas, en el constructor estamos creando los ficheros (vacíos) necesarios para poder ejecutar las pruebas. Y al acabar la ejecución los estamos liberando gracias a implementar IDisposable. Con esto, hemos conseguido dotar de cierta funcionalidad extra a nuestras pruebas, pudiendo así preparar el escenario inicial para poder realizarse y "limpiándolo" todo al terminar.

## Accesorios: Fixtures ( codigo auxiliar reutilizable)

Según hemos aprendido ya, podemos crear código auxiliar cuando lo necesitemos para poder preparar el entorno antes de las pruebas y limpiarlo después. Sin embargo, si nos fijamos nos daremos cuenta de que estamos creando y borrando los ficheros para cada prueba. Si en vez de utilizar facts, hubiésemos utilizado teorías, esto se multiplica, porque cada ejecución de una teoría se lleva a cabo de manera independiente. En la prueba estamos haciendo operaciones de lectura, como comprobar si el fichero existe. Pero, ¿qué pasaría si estuviésemos haciendo operaciones de escritura?. Podríamos encontrarnos con bloqueos de ficheros que hagan fallar nuestras pruebas, cuando en realidad lo que falla no es el código que queremos probar, sino la manera en la que hemos planteado la prueba.

¡Ahí es donde entran en escena los accesorios! Los accesorios nos van a permitir sacar ese código auxiliar que estábamos utilizando en el constructor a una clase independiente. Esta clase independiente se va a inicializar cuando empezamos a ejecutar las pruebas en las que utilicemos el accesorio, y sólo se liberará al terminar dichas pruebas. De este modo, vamos a conseguir que, en el caso anterior, no estemos creando y eliminando ficheros constantemente cuando no es necesario.

Existen dos tipos de accesorios:

- De clase
- De colección

Ambos tipos de accesorios funcionan igual, lo único que va a cambiar es el ciclo de vida que tienen: los objetos del primer tipo se eliminarán al terminar las pruebas de la clase que los esté usando, y los del segundo (colecciones), al terminar las pruebas del grupo.

### Fixtures de clase: `IClassFixture<T>`

Gracias a esta herramienta vamos a poder compartir funcionalidad entre todas las ejecuciones de las pruebas de una clase.

Vamos a crear una nueva clase que llamaremos **DirectoryFixture**, a la que le añadiremos esa funcionalidad igual que habíamos hecho antes (creando los recursos en el constructor y liberándolos en el Dispose). También vamos a crear una propiedad de solo lectura para poder acceder a *_files*:

```cs
public class DirectoryFixture : IDisposable
{
    public const string DIRECTORY = "./tests";
    private const int FILECOUNT = 5;
    private readonly string[] _files = new string[FILECOUNT];

    public string[] Files => _files;

    public DirectoryFixture()
    {
        if (!Directory.Exists(DIRECTORY))
        {
            Directory.CreateDirectory(DIRECTORY);
        }

        for (var i = 0; i < FILECOUNT; i++)
        {
            var fileName = $"{i}.test";
            _files[i] = fileName;
            File.WriteAllText(Path.Combine(DIRECTORY, fileName), "");
        }
    }


    public void Dispose()
    {
        if (Directory.Exists(DIRECTORY))
        {
            Directory.Delete(DIRECTORY, true);
        }
    }
}
```

Si te fijas, es básicamente lo mismo que teníamos en el constructor y en el Dispose de la clase de pruebas, pero separado en un accesorio (Fixture).

Una vez que tenemos el accesorio listo, tenemos que indicarle al runner de xUnit.net que nuestra clase de pruebas necesita de este accesorio. Esto lo conseguiremos haciendo que la clase de pruebas herede de `IClassFixture<DirectoryFixture>` (fíjate en que el tipo que usamos para particularizar el genérico es nuestra clase anterior):

```cs
public class UtilidadesDirectorioTests : IClassFixture<DirectoryFixture>
```

Una vez que le hemos indicado a xUnit.net que nuestra clase depende de ese accesorio, el runner va a crear una instancia del mismo al iniciar las pruebas. Como normalmente nos interesa tener acceso al accesorio dentro de la clase, vamos a poder recibirla en el constructor y el runner va a inyectarnos la instancia automáticamente:

```cs
private readonly DirectoryFixture _directoryFixture;

public UtilidadesDirectorioTests(DirectoryFixture directoryFixture)
{
    _directoryFixture = directoryFixture;
}
```

>Es importante tener en cuenta que, para poder utilizar el accesorio de clase dentro de la clase de prueba, debemos heredar el `IClassFixture<T>` y recibirlo en el constructor. Si lo tenemos en el constructor, pero la clase de pruebas no hereda de `IClassFixture<T>`, recibiremos un error en nuestro test indicándonos que xUnit.net no sabe qué tiene que inyectar para inicializar la clase. Si por el contrario heredamos, pero no recibimos el accesorio en el constructor, aun así, se ejecutará su constructor y su destructor.

Con los cambios tenidos en cuenta, nuestra clase de prueba ahora queda así:

```cs
public class UtilidadesDirectorioTests : IClassFixture<DirectoryFixture>
{
    private readonly DirectoryFixture _directoryFixture;

    public UtilidadesDirectorioTests(DirectoryFixture directoryFixture)
    {
        _directoryFixture = directoryFixture;
    }

    [Fact]
    public void ExistenLosArchivos_ShouldBeTrue_IfFilesExist()
    {
        //Arrange

        //Act
        var result = UtilidadesDirectorio.ExistenLosArchivos(_directoryFixture.Files, DirectoryFixture.DIRECTORY);

        //Assert
        Assert.True(result);
    }

    [Fact]
    public void ExistenLosArchivos_ShouldBeFalse_IfFilesNotExist()
    {
        //Arrange

        //Act
        var result = UtilidadesDirectorio.ExistenLosArchivos(_directoryFixture.Files, Path.Combine(DirectoryFixture.DIRECTORY, "NoExisto"));

        //Assert
        Assert.False(result);
    }

    [Fact]
    public void ExistenLosArchivos_ShouldThrowArgumentNullException_IfDirectoryIsNull()
    {
        //Arrange

        //Act
        Action act = () =>
        {
            _ = UtilidadesDirectorio.ExistenLosArchivos(_directoryFixture.Files, null);
        };

        //Assert
        Assert.Throws<ArgumentNullException>(act);
    }

    [Fact]
    public void ExistenLosArchivos_ShouldThrowArgumentNullException_IfDirectoryIsValidAndFilesIsNull()
    {
        //Arrange

        //Act
        Action act = () =>
        {
            _ = UtilidadesDirectorio.ExistenLosArchivos(null, DirectoryFixture.DIRECTORY);
        };

        //Assert
        Assert.Throws<ArgumentNullException>(act);
    }
}

```

Con esto, tan solo vamos a crear una vez los ficheros necesarios para todas las pruebas de la clase, y los vamos a borrar al terminar todas las pruebas; en vez de crear y borrar los ficheros para cada prueba. Si crear y borrar los ficheros fuese una carga pesada, estaríamos consiguiendo ahorrar tiempo de ejecución al no repetir trabajo de manera innecesaria y podemos evitar bloqueos y otros efectos secundarios.

Un dato importante a tener en cuenta es que, no estamos limitados a tener un único accesorio por clase. Podemos utilizar tantos accesorios como necesitemos, siempre y cuando lo indiquemos en la herencia y lo recibamos en el constructor.

### Fixtures de Colección: `ICollectionFixture<T>`

Las colecciones de prueba son el mecanismo de agrupación de prueba en xUnit. Tienen dos propósitos:

- Delinean el límite del "paralelismo", es decir, las pruebas en la misma colección no se ejecutarán en paralelo entre sí.
- Ofrecen accesorios para toda la colección mediante el uso de `ICollectionFixture<TFixtureType>`.

Para el primero de los dos propósitos, basta con que decoremos las diferentes clases de pruebas que queremos englobar en una colección con el atributo `[Collection(NombreColección)]`. Con eso, ya es suficiente para que se considere una colección y sus pruebas no se ejecuten en paralelo entre ellas, aunque sí con otras de otro grupo. Esto quiere decir que, si tengo 2 grupos de clases de pruebas, las pruebas se ejecutarán en paralelo entre los grupos, pero no dentro del mismo grupo. De igual modo, si tenemos dos colecciones, las pruebas se ejecutarán en paralelo entre las colecciones, pero nunca dos a la vez dentro de la misma colección.

Para el segundo de los propósitos, el de poder tener accesorios de colección, vamos a tener que declarar una definición de la colección. Es en esta definición de la colección, en donde indicaremos los diferentes `ICollectionFixture<T>` que queremos que estén disponibles para la colección (y al igual que ocurría con los accesorios de clase, podemos añadir tantos como necesitemos):

```cs
[CollectionDefinition("Nombre de la colección")]
public class Nombre_De_la_Colección_Collection : ICollectionFixture<DirectoryFixture> // , ICollectionFixture<T> ...
{
    // Esta clase no tiene código, y nunca se instancia. Su propósito es tan solo
    // ser el lugar en el que aplicar [CollectionDefinition]
    // y las interfaces ICollectionFixture<>.
}
```

El nombre que le demos a la clase donde definimos la colección es irrelevante, ya que no se va a utilizar para nada. Es una herramienta de xUnit para agrupar en un único punto todos los accesorios asociados a la colección. Lo importante es el nombre que le damos en el atributo `[CollectionDefinition()]`

Es necesario señalar que, una clase de pruebas solo puede pertenecer a una única colección, por lo que debemos pensar en cómo vamos a organizar las pruebas de cara a crear las colecciones. Una vez que tenemos eso hecho, vamos a poder utilizar el accesorio recibiéndolo en el constructor de igual manera que hacíamos con los accesorios de clase. La salvedad aquí es que, el accesorio se va a crear antes de empezar a probar la colección, y se va a eliminar al terminar de probar la colección entera.

Si suponemos que la definición de la colección es como la hemos hecho justo arriba, nuestra clase de pruebas quedaría algo así:

```cs
[Collection("Nombre de la colección")]
public class UtilidadesDirectorioTests
{
    private readonly DirectoryFixture _directoryFixture;

    public UtilidadesDirectorioTests(DirectoryFixture directoryFixture)
    {
        _directoryFixture = directoryFixture;
    }

    //.... Todo el código de las pruebas que ya hemos visto
}

```

Fíjate que ya no hereda de `IClassFixture<T>` y en cambio tiene un atributo `[Collection()]` con el nombre de la colección que hemos definido, de modo que queda atada a ésta y se utiliza con las "fixtures" que haya definidas para la misma.

