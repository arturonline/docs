# Tecnicas para codigo no testeable

## 1. Wrappers

Algo habitual, que por desgracia ocurre con cierta frecuencia cuando trabajamos con código un poco antiguo (legacy), es que muchas veces ese código no se pensó para poder probarse mediante pruebas automáticas. Un claro ejemplo de esto es, cuando en una librería de un tercero tenemos un método que nos devuelve un objeto y éste tiene un constructor que no es público.

Para poder solventar este problema, una herramienta muy utilizada es encapsular la clase dentro de otra y que esta última sí que tenga una interfaz. De este modo, gracias al envoltorio (wrapper) sobre la clase que realmente estamos utilizando, vamos a poder reemplazar esa pieza en concreto.

Por ejemplo, piensa en que tienes que hacer pruebas a un código que utiliza el puerto serie del ordenador. La clase SerialPort, al igual que otras muchas propias del framework, no implementa una interfaz:

```cs
public class ClassWithSerialPort
{
    private readonly SerialPort _serial;
    public ClassWithSerialPort(SerialPort serial)
    {
        _serial = serial;
    }

    public void SendMessage(MyClass message)
    {
        var stringMessage = //Operaciones para convertir el parámetro en string

        _serial.Open();
        _serial.WriteLine(stringMessage);
        _serial.Close();
    }
}
```

Al no tener interfaz podemos inyectar la dependencia, pero va a seguir teniendo que estar disponible el puerto serie, o de lo contrario las pruebas fallarán.

Para poder evitar situaciones como esta y simular el puerto, una solución muy socorrida es utilizar un wrapper que envuelva la funcionalidad del puerto serie, y que sí podremos mockear durante las pruebas.

Para este caso tan simple podríamos resolverlo con una interfaz como esta:

```cs
public interface ISerialPortWrapper
{
    void Open();
    void WriteLine(string message);
    void Close();
}
```

Y con una implementación tan simple como recibir el SerialPort en el constructor y llamar a cada uno de los métodos:

```cs
public class SerialPortWrapper : ISerialPortWrapper
{
    private readonly SerialPort _serial;

    public SerialPortWrapper(SerialPort serial)
    {
        _serial = serial;
    }
    public void Open()
    {
        _serial.Open();
    }

    public void WriteLine(string message)
    {
        _serial.WriteLine(message);
    }

    public void Close()
    {
        _serial.Close();
    }
}
```

Con esta técnica, la clase inicial del ejemplo con una dependencia total de SerialPort, ahora la podemos reescribir para que utilice la interfaz en su lugar, desacoplando esa dependencia:

```cs
public class ClassWithSerialPort
{
    private readonly ISerialPortWrapper _serial;
    public ClassWithSerialPort(ISerialPortWrapper serial)
    {
        _serial = serial;
    }

    public void SendMessage(MyClass message)
    {
        var stringMessage = //Operaciones para convertir el parámetro en string

        _serial.Open();
        _serial.WriteLine(stringMessage);
        _serial.Close();
    }
}
```

Al utilizar esta técnica de "envolver" la clase que no podemos mockear, hemos convertido un código, muy difícil o imposible de probar, en un código común y corriente listo para poder utilizarse en los test.

## 2. Herencia

La segunda de las opciones, y que es muy útil siempre que sea posible, es aprovechar el polimorfismo implícito en la programación orientada a objetos. Siempre que la clase no esté sellada vamos a poder heredar de ella para reimplementar los métodos public y protected que contenga, de modo que sí podamos utilizarlos. Supongamos que el tipo de ese objeto de la librería es algo como esto:

```cs
public class MyClass
{
    protected readonly string _name;

    protected internal MyClass(string name)
    {
        _name = name;
    }

    protected string GetName() => _name;
    //Resto de la clase
}
```

Y que en algún punto de nuestro código lo utilizamos de alguna manera, como por ejemplo esta:

```cs
static void DoWork(MyClass myClass)
{
    Console.WriteLine(myClass.GetName());
}
```

Ya que no podemos crear la clase que la propia librería sí puede por su modificador de acceso, podemos crear una clase que herede de MyClass y que sí podamos construir:

```cs
public class MyinheritedClass : MyClass
{
    protected internal MyinheritedClass(string name) :base(name)
    {
    }
}
```

Aprovechando el polimorfismo podemos hacer llamadas al método DoWork así:

```cs
var dummy = new MyinheritedClass("TestValue");
DoWork(dummy);
```

De igual modo que podemos hacer esto para solucionar problemas de constructores, en otros escenarios también es posible heredar y reimplementar para poder acceder a variables internas de la clase que estamos usando para hacer validaciones o modificar comportamientos, siempre con la finalidad de poder tener un entorno controlado donde podamos determinar el resultado final del código.

## 3. Reflexión

>La reflexión es una característica de .NET que nos permite acceder al código generado tras la compilación (a una .dll o un .exe) de manera dinámica.

Mediante reflexión si tienes la descripción y la posición en donde ya hay un objeto de ese tipo, puedes acceder a él y/o modificarlo.

Para poder trabajar vamos a utilizar objetos propios de reflexión como pueden ser Type, MemberInfo, etc... Estos objetos los vamos a poder obtener a partir de información que sí tenemos, como puede ser el propio nombre de la clase o interfaz o actuando sobre un objeto directamente:

```cs
//Sobre la clase/interfaz
var type = typeof(MyClass);
//Sobre el objeto si ya lo tenemos
var type = myObjeto.GetType();
```

Este objeto de tipo Type es el punto de partida de todo, y el que nos permite seguir hacia adelante sacándole partido a la reflexión.

Por ejemplo, si tuviésemos un objeto de tipo MyClass cuyo constructor es privado:

```cs
public class MyClass
{
    private readonly string _name;

    private MyClass(string name)
    {
        _name = name;
    }

    public string GetName() => _name;
    //Resto de la clase
}
```

Incluso en este caso tendríamos acceso a llamarlo, utilizando un código similar a este:

```cs
//Obtenemos el tipo
var type = typeof(MyClass);
//Obtenemos el constructor
var constructor = type.GetConstructor(BindingFlags.NonPublic | BindingFlags.Instance, null, new[] {typeof(string)}, null);
//Creamos dinámicamente un objeto y lo convertimos de object a MyClass
var myClass = (MyClass)constructor.Invoke(new[]{"Test"});
```

Evidentemente, este código es mucho más complejo que su equivalente sin reflexión si pudiésemos usarlo:

```cs
var myClass = new MyClass("Test");
```

Pero sería equivalente.

Vamos a analizar línea por línea lo que hemos hecho para conseguir el mismo resultado. Lo primero es obtener el Type, ya sea usando typeof() sobre la clase, o GetType() sobre una instancia:

```cs
var type = typeof(MyClass);
```

Sobre ese objeto que hemos obtenido y que representa al tipo, vamos a intentar obtener el constructor con el método GetConstructor(), pasándole los siguientes parámetros:

- Las condiciones para localizarlo, que en este caso son: que debe ser un método de instancia (`BindingFlags.Instance`, siempre debe ser así para un constructor) y que además que no sea público (`BindingFlags.NonPublic`, que es el que nos interesa).
- El segundo parámetro es lo que se denomina binder que, dicho de manera básica, le indica al motor de reflexión cómo debe enlazar el método que buscamos para ejecutarlo: cómo trata los parámetros, cómo elige el método si está sobrecargado, etc... Aquí generalmente se usa un valor nulo, lo que fuerza el uso de binder por defecto, **DefaultBinder**, que es lo que necesitaremos en el 99,99% de las ocasiones.
- Como tercer parámetro le debemos pasar una matriz de objetos Type en el orden adecuado para indicar el número y el tipo de parámetros del constructor que necesitamos. En este caso, tan solo un parámetro que es una cadena de texto.
- Finalmente, se pasa un cuarto parámetro que sirve para indicar ciertos atributos de los parámetros anteriores, pero sea lo que sea, el binder por defecto no utiliza (y tampoco lo necesitamos), así que le pasamos simplemente un nulo.

Con ello obtenemos esta línea:

```cs
var constructor = type.GetConstructor(BindingFlags.NonPublic | BindingFlags.Instance, null, new[] {typeof(string)}, null);
```

Después, vamos a llamar al método constructor que hemos obtenido en el paso anterior mediante el método `Invoke()`, que sirve para este propósito en reflexión. Le pasaremos los parámetros que espera, en este caso una simple cadena de texto. Es importante tener en cuenta que `Invoke()` devuelve un objeto genérico, object, pero sabemos que en realidad es un objeto de la clase MyClass, así que debemos hacer una conversión explícita para obtener una instancia de la clase MyClass totalmente funcional, saltándonos cualquier modificador de acceso que hubiese:

```cs
var myClass = (MyClass)constructor.Invoke(new[]{"Test"});
```

Como ya he dicho antes, explicar las técnicas de reflexión en profundidad y aprender a crear escenarios avanzados con ella se sale del alcance del curso, porque más que hablar de testing implicaría explicar cuestiones relacionadas con la reflexión, y eso es una técnica propia de .NET que deberías ya conocer. Por ello, no vamos a profundizar más en este tema.

Lo importante es que sepas de su existencia y que veas que resulta bastante fácil saltarse cualquier restricción en el código gracias a las técnicas de reflexión.

En caso de que quieras ampliar información al respecto, en las referencias cruzadas de la lección puedes encontrar algunos enlaces en los que se hace un análisis más en profundidad de esta poderosa herramienta.
