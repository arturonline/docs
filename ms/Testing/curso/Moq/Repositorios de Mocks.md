# Repositorios de Mocks

Hasta ahora hemos creado los mocks uno a uno con new `Mock<T>()` o `Mock.Of<T>`, y los gestionamos de manera individual. Esto es suficiente cuando tienes uno o dos mocks, y además no se verifica nada, o prácticamente nada en ellos. Pero, a medida que empiezas a hacer pruebas de clases que reciben más de dos o tres dependencias, la cosa se complica (y si recibe más de cinco parámetros quizás deberías pensar en refactorizar esa clase).

Precisamente, para estos escenarios entra en juego la clase específica llamada `MockRepository`. Gracias a ella vamos a poder generar mocks con unos criterios unificados en lo que respecta al comportamiento, los valores por defecto y su CallBase, además de tener un único punto desde el que poder llevar a cabo todas las verificaciones necesarias, para no olvidarnos de ninguna.

Para utilizar un repositorio, lo primero que hay que hacer es crear una instancia de MockRepository, indicándole el comportamiento que tendrán los mocks que pertenezcan a éste:

```cs
var repository = new MockRepository(MockBehavior.Default);
```

## Crear Mocks dentro del repositorio

Este repositorio nos proporciona diferentes opciones para crear los mocks:

- `Of<T>`: crea un objeto del tipo T indicado, utilizando sintaxis Linq para configurarlo.
- `OneOf<T>`: crea un objeto del tipo T del mismo modo en que lo haríamos con `Mock.Of<T>`.
- `Create<T>`: crea un objeto de tipo `Mock<T>` tal y como lo haríamos con new `Mock<T>`.
  
Ejemplo:

```cs
var foo1 = repository.Of<IFoo>()
            .Where(foo=>foo.Accion() == true)
            .First();

var foo2 = repository.OneOf<IFoo>();
Mock.Get(foo2).Setup(foo => foo.Accion()).Returns(true);

var fooMock = repository.Create<IFoo>();
fooMock.Setup(foo => foo.Accion()).Returns(true);
var foo3 = fooMock.Object;
```

## Verificacions

Hasta este punto realmente parece no aportar nada el hecho de hacerlo así o de hacerlo individualmente, y salvo por unificar las configuraciones es verdad que no nos proporciona grandes ventajas... En realidad, la parte interesante viene a la hora de acceder a sus métodos de verificación. *MockRepository* ofrece tres métodos de verificación que se van a ejecutar sobre **TODOS** los mocks creados a partir del repositorio:

- `Verify`: comprueba que las configuraciones marcadas con Verifiable se han ejecutado.
- `VerifyAll`: comprueba que todas las configuraciones se han ejecutado, incluyendo las que no estaban marcadas con Verifiable.
- `VerifyNoOtherCalls`: comprueba que no se ha llamado a ningún otro método aparte de los ya verificados previamente.

Estas opciones son especialmente útiles cuando estamos trabajando con clases complejas que presentan flujos complejos, ya que nos va a permitir comprobar muy fácilmente, y con muy poco código, todas las configuraciones que hemos hecho sobre los mocks sin temor a que por descuido o error nos olvidemos de alguna.

Ten en cuenta que, MockRepository no es una manera de reutilizar mocks, sino de unificarlos y aglutinarlos, de modo que tengan un criterio coherente y que sea fácil comprobarlos todos a la vez. Esto quiere decir que si, por ejemplo, escribes un código como este:

```cs
var fooMock = repository.Create<IFoo>();
var fooMock2 = repository.Create<IFoo>();
var fooMock3 = repository.Create<IFoo>();
```

Vas a tener 3 instancias independientes entre ellas y que se pueden configurar por separado. El hecho de crear (de cualquiera de las tres maneras) un mock para una interfaz o clase que ya se ha creado previamente no te va a devolver una instancia de ese mock creado previamente.