# Creación y uso de Moqs

## Creación

```cs
var mock = new Mock<IDatabase>(MockBehavior.Default);
mock.Setup(db => db.GetTaxPercentageByPersonId(2)).Returns(0.04);

```

En su constructor le podremos indicar el comportamiento que tendrá cuando se llame a "algo" que no esté configurado en el mock:

- **Loose**: nunca lanzará una excepción por acceder a algo sin configurar, y retornará valores default.
- **Strict**: si se intenta acceder a algo que está sin configurar, lanzará una excepción.
- **Default**: este es el valor por defecto. Es igual que Loose e igual que no poner nada.

Lo más habitual es crear estos mock en el constructor de la clase de pruebas o en un accesorio, ya que así los vamos a poder utilizar en todas las pruebas aunque, si tienes la seguridad de que sólo vas a necesitarlo en una prueba en concreto, puede ir dentro de ella, en el Arrange.

Además, los moq son objetos por referencia y no por valor, lo que quiere decir que puedes modificar el comportamiento para una prueba en concreto modificando el objeto mock aunque ya hayas creado otra clase con él. Esto se suele utilizar cuando el comportamiento es el mismo para la gran mayoría de pruebas, pero tiene que cambiar un poco en algunas en concreto para poder probar los fallos.

## Uso del Moq

Una vez configurado el mock hay que reemplazar los objetos allá donde los necesitemos. Para conseguirlo, la clase genérica `Mock<T>` nos ofrece una propiedad llamada Object que va a retornar un objeto del tipo con el que hayamos creado el mock.

```cs
_taxCalculator = new TaxCalculator(mock.Object);
```

## Sintaxis alternativa

```cs
var database = Mock.Of<IDatabase>(MockBehavior.Default);

Mock.Get(database).Setup(db => db.GetTaxPercentageByPersonId(It.IsAny<int>())).Returns(0.18);

....

_taxCalculator = new TaxCalculator(database);
```

La principal pega que tiene esta sintaxis, es que oscurece un poco qué es un mock y qué no, ya que siempre vamos a tener un objeto del tipo correcto y no un `Mock<T>`.
Otro problema que tiene es que no nos permite crear el mock de una clase que no use el constructor por defecto (sin parámetros), aunque esto se puede solucionar fácilmente creando un método que lo reemplace para esos casos concretos:

```cs
public static T MockOf<T>(MockBehavior behavior,params object[] args) where T : class
{
    return new Mock<T>(behavior,args).Object;
}
```
