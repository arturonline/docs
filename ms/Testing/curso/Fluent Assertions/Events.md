# FA: trabajando con Eventos

Cuando anteriormente nos centramos en la prueba de eventos, los estábamos capturando gracias a definir un método anónimo en el que marcábamos como ejecutado el evento, registrando este hecho en una variable de tipo booleano de ámbito superior, así:

```cs
//Arrange
var raised = false;
myClass.ReceivedMessage += (sender, args) => raised = true;

//Act
//....

//Assert
raised.Should().BeTrue();
```

Esto rompe totalmente con la intención de tener afirmaciones fluidas en las pruebas, de modo que se comprendan rápidamente. Precisamente, para evitar lo anterior y tener una sintaxis fluida tenemos a nuestra disposición el método de extensión `Monitor()`. Este método, aplicado sobre un objeto, nos va a devolver un objeto monitorizado sobre el que vamos a poder afirmar la ejecución de eventos gracias a las aserciones `Raise()` y `NotRaise()`, que van a recibir como parámetro el nombre del evento.

```cs
//Arrange
var myClass = ...
using (var monitoredSubject = myClass.Monitor())
{
    //Act
    //...

    //Assert
    monitoredSubject.Should().Raise("ReceivedMessage");
}
```

## MVVM

Cuando se trabaja con el patrón MVVM , es tan habitual utilizar eventos para el cambio de propiedades (`PropertyChangedEventArgs`), que existen dos afirmaciones específicas en las que no hay que indicar siquiera su nombre como parámetro. Estas afirmaciones son **`RaisePropertyChangeFor()`** y **`NotRaisePropertyChangeFor()`**. No las pierdas de vista si utilizas este patrón de desarrollo.

Además de poder comprobar si un evento se ha disparado o no, también se pueden hacer afirmaciones sobre él:

```cs
`WithSender(expected)`: el sender es el esperado.
`WithArgs<T>(expression)`: los argumentos cumplen la expresión indicada.
```

Si en el ejemplo anterior quisiéramos comprobar que el sender sea el propio objeto que lanza el evento y el argumento sea "Test" (el manejador es de tipo `EventHandler<string>`), el código nos quedaría algo como esto:

```cs
//Arrange
var myClass = ...
using (var monitoredSubject = myClass.Monitor())
{
    //Act
    //...

    //Assert
    monitoredSubject.Should().Raise("ReceivedMessage")
                                .WithSender(myClass)
                                .WithArgs<string>(args => args == "Test");
}
```

## Limitar los eventos a afirmar

También es posible limitar los eventos que queremos afirmar. Para lograrlo, existe una sobrecarga genérica del método Monitor(), Monitor<T>(), que nos permite indicar un tipo o interfaz, de modo que solo se monitorizarán los eventos implementados en ésta. De esta forma, aunque el objeto implemente más eventos, gracias a Monitor<T> solo nos preocuparemos de los eventos implementados por el tipo T.

Por ejemplo:

```cs
//Arrange
var myClass = ...
using (var monitoredSubject = myClass.Monitor<ICommunicator>())
{
    //Act
    //...

    //Assert
    monitoredSubject.Should().Raise("ReceivedMessage")
                                .WithSender(myClass)
                                .WithArgs<string>(args => args == "Test");
}
```

En este fragmento, aunque el objeto myClass tuviese varios eventos implementados, solo se monitorizaría para afirmar los que pertenezcan a la interfaz ICommunicator.

