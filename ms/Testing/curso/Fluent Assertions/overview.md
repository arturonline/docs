# Fluent Assertions

Una aserción no es más que una comprobación que, en caso de no cumplirse, genera una excepción. Ésta es recogida por el runner para considerar que la prueba ha fallado.

Los mensajes de fallo en las aserciones no son todo lo claros que podrían ser y no siempre existe una aserción para todas tus necesidades.

**Fluent Assertions** es una librería Open Source con una infinidad de herramientas extra para poder hacer las aserciones en las pruebas de una manera muy sencilla debido a su sintaxis fluida. FA aporta una carga semántica muy fuerte a las aserciones, de forma que al leer la propia aserción vamos a poder entender, mientras leemos, qué es lo que se está afirmando, de una manera muy parecida a como lo haríamos mientras hablamos.

Ejemplo:

```cs
[Fact]
public void Method_ShouldBe1Enero2000At1030()
{
    //Arrange
    var clase = new ClaseEjemplo();

    //Act
    var result = clase.Method();

    //Assert
    Assert.Equal(new DateTime(2000, 0, 1,10,30,0), result);
}
```

Con FA:

```cs
[Fact]
public void Method_ShouldBe1Enero2000At1030()
{
    //Arrange
    var clase = new ClaseEjemplo();

    //Act
    var result = clase.Method();

    //Assert
    result.Should().Be(1.January(2000).At(10,30))
}
```

## Funcionamiento Básico

Cualquier aserción que queremos hacer con FA, debe empezar llamando al método `Should()` el cual va a exponer diferentes métodos según el tipo sobre el que llamamos a `Should()`.

`Should()` es un método de extensión que nos va a permitir acceder al resto de métodos y es requisito obligatorio para poder utilizar Fluent Assertions, ya que el resto dependen del objeto que devuelve. Independientemente del tipo sobre el que estemos llamando a `Should()`, vamos a tener unas opciones comunes:

- **`Be(expected)`**: es el valor esperado.
- **`NotBe(expected)`**: no es el valor esperado.
- **`BeNull(expected)`**: es null.
- **`NotBeNull(expected)`**: no es null.
- **`BeOfType<T>()`**: es del tipo T.
- **`BeOfType(expected)`**: es del tipo esperado.
- **`BeSameAs(expected)`**: es el mismo objeto en memoria (dos objetos que apuntan a la misma referencia).
- **`NotBeSameAs(expected)`**: no es el mismo objeto en memoria (dos objetos que apuntan a la misma referencia).
- **`BeAssignableTo<T>()`**: se puede convertir al tipo T.
- **`NotBeAssignableTo<T>()`**: no se puede convertir al tipo T.
- **`BeEquivalentTo(expected)`**: es equivalente a (DTOs).
- **`NotBeEquivalentTo(expected)`**: no es equivalente a (DTOs).
- **`Match(expression)`**: se cumple la expresión.
- **`Match<T>(expression)`**: se cumple la expresión.

Además, estos métodos (salvo `BeEquivalentTo` y `NotBeEquivalentTo`) devuelven un objeto mediante el cual vamos a poder seguir afirmando. Estos objetos son de las clases:

- **And**
- **Which**
- **Subject**

Estas clases nos ofrecen diferentes maneras de seguir avanzando para hacer afirmaciones más complejas:

```cs
variable.Should().NotBeNull().And.Be("nombre");
```

Mediante `Subject` o `Which` podemos acceder al objeto desde el que hemos partido:

```cs
variable.Should().BeOfType<string>().Which.Should().Be("nombre");
```

```cs

```