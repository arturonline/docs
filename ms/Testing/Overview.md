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

Con ella lo que vamos a hacer es definir el cuerpo de la prueba una única vez y nos va a permitir parametrizarla, de modo que le pasemos los datos necesarios a través de los parámetros del método.

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

En esta ocasión, lo que hacemos es sobrescribir el método abstracto GetData() que toma como parámetro la información del método al que se aplica (nos sirve, en este caso, para saber qué parámetros se esperan y de qué tipo), y devuelve un IEnumerable<object[]>, como ya conocemos, para obtener la información que nos interesa y que luego se va a pasar al motor de testing.

Además, hemos metido un par de métodos privados auxiliares para procesar la información del archivo CSV antes de devolverla.

>Nota: dado que es un atributo convencional de .NET, lo decoramos con el atributo AttributeUsage, indicando que se usará para decorar métodos. Además, se ha implementado un código para procesar el CSV intencionadamente simple, que sólo divide la información usando las comas y no tiene en cuenta otras complejidades relacionadas con "parsear" ese tipo de archivos, ya que no es el objeto del curso y facilita la comprensión del ejemplo.

Hay que tener en cuenta que xUnit utiliza el atributo para obtener los valores en una lista (con ToList()), por lo que debe devolver conjuntos completos de resultados y no utilizar resultados parciales o diferir su obtención en caso de usar alguna fuente más compleja. Debe devolver todo en la primera llamada.

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
