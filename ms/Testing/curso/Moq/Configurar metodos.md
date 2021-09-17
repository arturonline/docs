# Configurar Métodos Moqs

```cs
public class TaxCalculator
{
    private readonly IDatabase _database;
    public TaxCalculator(IDatabase database)
    {
        _database = database;
    }

    public double CalculateTotalValueForPeron(double amount, int id)
    {
        _database.Connect();
        var tax = _database.GetTaxPercentageByPersonId(id);
        return Math.Round(amount * (1 + tax),2);
    }
}

public interface IDatabase
{
    double GetTaxPercentageByPersonId(int id);
    void Connect();
}

public class Database : IDatabase
{
    public double GetTaxPercentageByPersonId(int id)
    {
        //Valor obtenido de la base de datos
    }

    public void Connect()
    {
        //Conexión a la base de datos
    }
}
```

Si te fijas, en este caso, el método `Connect` ni tiene parámetros, ni retorna nada (es void) pero, en cambio, el método `GetTaxPercentageByPersonId` sí los tiene, y sí que devuelve un valor.

Para configurar un método del mock, vamos a llamar a Setup indicándole mediante una expresión lambda cuál es el método que queremos reemplazar y lo que debe devolver (en caso de que lo haga). Esto último lo vamos a conseguir gracias al método Returns que acompañará el Setup:

```cs
Mock.Get(database).Setup(db => db.Connect());
Mock.Get(database).Setup(db => db.GetTaxPercentageByPersonId(0)).Returns(0.12);
```

## Configurar parámetros

Moq además nos permite definir cómo decidirá si tiene que aplicar ese mock o no en función de sus parámetros. Esto lo vamos a conseguir con la clase It, propia de Moq, la cual nos ofrece varios métodos para seleccionar si se activa el mock que hemos creado o no:

- `Is<T>(Predicado)`: el predicado retorna un true. En este contexto, un "Predicado" es un método de tipo `Func<T,bool>` que se utiliza para determinar si una determinada condición se cumple o no.
- `IsAny<T>()`: el parámetro recibido es de tipo T sin importar el valor.
- `IsRegex(regex)`: cumple con la expresión regular especificada.
- `IsIn(IEnumerable<T>)`: está dentro de la colección.
- `IsNotIn(IEnumerable<T>)`: no está dentro de la colección.
- `IsInRange(from,to,Range)`: está dentro del rango especificado. Con Moq.Range le indicamos si incluimos o no los extremos.
- `IsNotNull<T>()`: el parámetro es diferente de null.

Returns no solo nos va a permitir definir directamente un valor, sino que vamos a poder utilizar un **Func** que recibirá los parámetros del método y retornará un objeto del mismo tipo que dicho método. Esto nos va a permitir hacer operaciones sobre el valor en función de la entrada si así nos resulta más cómodo, por ejemplo:

```cs
Mock.Get(database).Setup(db => db.GetTaxPercentageByPersonId(It.IsAny<int>()))
    .Returns((int input) =>
    {
        switch (input)
        {
            case 0:
                return 0.12;
            case 1:
                return 0.27;
            case 2:
                return 0.04;
            default:
                return 0.18;
        }
    });
```

Moq también permite configurar los métodos desde el constructor utilizando una expresión lambda. Por ejemplo:

```cs
var database = Mock.Of<IDatabase>(db=> db.GetTaxPercentageByPersonId(It.IsAny<int>()) == 0.12 ,MockBehavior.Default);`.
```

Esta es una sintaxis que no te recomiendo salvo que el mock sea súpersimple, o de lo contrario va a ser muy difícil de seguir.

## Activar varias configuraciones

Se pueden activar a la vez varias configuraciones y, si esto ocurre, se aplicará la última que se ha registrado. Por ello, no es lo mismo escribir esto:

```cs
var database = new Mock<IDatabase>(MockBehavior.Default);
database.Setup(db => db.GetTaxPercentageByPersonId(It.IsAny<int>())).Returns(0.18);
database.Setup(db => db.GetTaxPercentageByPersonId(0)).Returns(0.12);
```

Que esto:

```cs
var database = new Mock<IDatabase>(MockBehavior.Default);
database.Setup(db => db.GetTaxPercentageByPersonId(0)).Returns(0.12);
database.Setup(db => db.GetTaxPercentageByPersonId(It.IsAny<int>())).Returns(0.18);
```

## Método Callback

Podemos utilizar el método Callback para realizar una acción cuando se active el mock.

Por ejemplo, un evento que nos permita seguir o simplemente para añadir un contador:

```cs
var contador = 0;
var database = Mock.Of<IDatabase>(MockBehavior.Default);
Mock.Get(database).Setup(db => db.GetTaxPercentageByPersonId(0)).Callback(() => contador++).Returns(0.12);
```

## Throws

Podemos lanzar una excepción cuando se active el moq. Si bien esto lo puedes hacer sin ningún problema con un `Callback` como el que acabamos de ver, existe un método `Throws` especializado en esta labor.

```cs
var iOperationsMock = Mock.Of<IOperations>();
Mock.Get(iOperationsMock).Setup(op => op.Division(It.IsAny<int>(), 0)).Throws(new DivideByZeroException());
//o
Mock.Get(iOperationsMock).Setup(op => op.Division(It.IsAny<int>(), 0)).Throws<DivideByZeroException>();
```

## CallBase

Al crear un mock con Moq se reemplazan automáticamente todos sus miembros. Con CallBase en lugar del llamar al método moqueado llamamos al método original:

```cs
Mock.Get(iOperationsMock).Setup(op => op.Division(It.IsAny<int>(), 2)).CallBase();
```

El código anterior va a conseguir que cuando se llame al método Division con un 2 en el segundo parámetro, en vez de ejecutarse el método mock lo que va a hacer es llamar al método real y devolver el resultado real.

## Configurar retornos secuenciales

Para simular cuando una misma llamada con los mismos parámetros (o sin parámetros) tiene que devolver diferentes valores cada vez que se le llama usaremos `SetupSequence`:

```cs
var codeGenerator = new Mock<ICodeGenerator>();
codeGenerator.SetupSequence(s => s.GetNextCode())
    .Returns(1)
    .Returns(2)
    .Returns(3);

```

La principal ventaja del código anterior es que nos va a permitir casi la misma gestión que nos proporciona el método Setup. Es decir, vamos a poder configurar llamadas al código original con `CallBase`, o generar excepciones con `Throw`, de modo que podremos generar un comportamiento en el que, por ejemplo, se lancen 2 excepciones que simulen 2 fallos de conexión al servicio y después un valor correcto.

```cs
var codeGenerator = new Mock<ICodeGenerator>();
codeGenerator.SetupSequence(s => s.GetNextCode())
    .Throws<ServiceConnectionException>()
    .Throws<ServiceConnectionException>()
    .Returns(1);

```

Otra ventaja que nos aporta `SetupSecuence` es que no va a generar una excepción que no es propia del código probado en nuestro test, sino que en caso de sobrepasar los datos configurados, devolverá el valor por defecto para el tipo de dato de retorno.

## MockSequence

Durante el desarrollo de un software, a veces hay partes concretas que tienen que seguir un camino específico para llegar a una situación determinada.

En caso de que se haga el proceso en otro orden, podrían aparecer problemas. Moq da soporte para poder comprobar que se sigue la secuencia correcta para esta tarea específica. Gracias a la comprobación de frecuencias vamos a poder garantizar que los métodos se llaman en el orden correcto, provocando en caso contrario una excepción y haciendo fallar el test.

Las entidades que habilitan la comprobación de secuencias en Moq son la clase MockSequence y el método InSequence(MockSequence):

```cs
var conducir = new Mock<IConducir>(MockBehavior.Strict);
var conducirSecuence = new MockSequence();

conducir.InSequence(conducirSecuence).Setup(c => c.SoltarAcelerador());
conducir.InSequence(conducirSecuence).Setup(c => c.PisarEmbrague());
conducir.InSequence(conducirSecuence).Setup(c => c.CambiarMarcha(It.IsInRange(1,6,Range.Inclusive)));
conducir.InSequence(conducirSecuence).Setup(c => c.SoltarEmbrague());
conducir.InSequence(conducirSecuence).Setup(c => c.PisarAcelerador());
```

Con esta configuración para el mock estamos garantizando que, donde se utilize va a ser invocado en el orden concreto que hemos configurado. y en caso de no ser así, se va a producir una excepción que dará la prueba como mala.

>MUY IMPORTANTE: un detalle crucial a tener en cuenta al trabajar con secuencias es que el mock debe ser creado en modo estricto o de lo contrario no fallará cuando se utilice en el orden incorrecto, con lo que pierde su utilidad.
