# Trazar mensajes durante las pruebas

La interfaz `ITestOutputHelper` se usa para registrar todos los logs que nos interesen, y se añadirán al resultado de la prueba, independientemente de si esta pasa o no pasa.

Simplemente bastará con que recibamos en el constructor de la clase esa interfaz (inyectada). Esta interfaz tiene tan solo dos métodos que nos van a permitir escribir como si de la consola Console se tratase:

```cs
public interface ITestOutputHelper
{
    void WriteLine(string message);
    void WriteLine(string format, params object[] args);
}
```

Vamos a ver un ejemplo:

```cs
public class EjemploITestOutputHelper
{
    private readonly ITestOutputHelper _output;

    public EjemploITestOutputHelper(ITestOutputHelper output)
    {
        _output = output;
    }

    [Fact]
    public void SomeMethod_ShouldBe_If()
    {
        _output.WriteLine("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
        //Ejemplo de prueba correcta
        Assert.True(true);
    }

    [Fact]
    public void SomeMethod2_ShouldBe_If()
    {
        _output.WriteLine("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
        //Ejemplo de prueba fallida
        Assert.True(false);
    }
}
```

Al ejecutar los test, dentro de los detalles del explorador de pruebas, va a aparecer una nueva opción que nos va a indicar que la prueba generó una salida adicional. Basta con que pulsemos sobre ese enlace que nos ha aparecido, y se abrirá una nueva pestaña donde podremos ver todos los mensajes de salida que ha generado la prueba.