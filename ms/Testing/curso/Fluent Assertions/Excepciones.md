# FA: trabajando con Excepciones

Fluent Assertions nos ofrece dos maneras de ejecutar las afirmaciones relacionadas con excepciones:

La primera de ellas es mediante el método de extensión `Invoking()` el cual ejecutará el método que debe producir la excepción:

```cs
myClass.Invoking(y => y.MyMethod("Hello")).Should().Throw<InvalidOperationException>()
```

La segunda manera, y la que personalmente te recomiendo, es como hasta ahora, es decir, creando un objeto de tipo `Action` o `Func` y haciendo las aserciones sobre él. De este modo vamos a tener pruebas que cumplan con la "triple A":

```cs
//Act
Action act = () => myClass.MyMethod("Hello");
//Assert
act.Should().Throw<InvalidOperationException>()
```

## Afirmaciones disponibles para verificar que una excepción se produce

- `Throw<T>()`: se ha producido una excepción de tipo T o derivadas.
- `ThrowExactly<T>()`: se ha producido una excepción de tipo T exactamente.
- `NotThrow(): n`o se ha producido ninguna excepción.
- `NotThrow<T>()`: no se ha producido ninguna excepción de tipo T o derivadas.
- `NotThrowAfter(expected_time, check_interval)`: en el periodo máximo esperado, se ha podido ejecutar sin producirse una excepción. Se va a comprobar con la frecuencia indicada durante el tiempo máximo esperado o hasta que se ejecute sin generar una excepción (lo que ocurra primero).

⚠ Todos los métodos anteriores tienen su homónimo asíncrono para hacer afirmaciones sobre Task. Estos métodos asíncronos son los mismos, pero con el sufijo Async, por ejemplo ThrowAsync().

>El método `NotThrowAfter` puede tener poco sentido a primera vista, pero te resultará útil cuando estés haciendo pruebas sobre elementos que se conectan a otros. De este modo, es posible afirmar que los diferentes funcionamientos que puede haber si falla la conexión están bien.

## Verificar mensaje excepción

Fluent Assertions ofrece un método `WithMessage(expected)` en el que vamos a poder indicar el mensaje que tiene que devolver la excepción:

```cs
Action act = () => throw new Exception("Mensaje Excepción 1");

act.Should().Throw<Exception>()
            .WithMessage("Mensaje Excepción 1");
```

Esta afirmación sobre el mensaje también permite utilizar * como comodín para el texto de la excepción:

```cs
Action act = () => throw new Exception("Mensaje Excepción 1");

act.Should().Throw<Exception>()
            .WithMessage("*1");
```
