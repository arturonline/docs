# Configurar Propiedades

```cs
public interface ITemperatureSensor
{
    string GetCurrentTemperature();
    string Location { get; }
    int Altitude { get; }
}
```

```cs
var sensor = Mock.Of<ITemperatureSensor>(MockBehavior.Default);
Mock.Get(sensor).Setup(s => s.Location).Returns("Some Location");
```

## `SetupSet` y `SetupGet`

Las propiedades, además, nos permiten definir acciones a ejecutar cuando se acceda al get o al set. Esto lo conseguiremos con los métodos `SetupSet` y `SetupGet`:

```cs
var sensor = Mock.Of<ITemperatureSensor>();
Mock.Get(sensor).SetupSet(c => c.Location = "Spain");
Mock.Get(sensor).SetupGet(c => c.Location).Returns("France");
```

Utilizando `SetupSet` y `SetupGet` estamos consiguiendo configurar acciones en el método de acceso y escritura a las propiedades pero no persistimos su estado.

## `SetupProperty`

Si queremos persistir estados vamos a necesitar hacer uso del método `SetupProperty`. Además, con este nuevo Setup también podemos indicarle el valor inicial que queremos que tenga:

```cs
var sensor = Mock.Of<ITemperatureSensor>(MockBehavior.Strict);
Mock.Get(sensor).SetupProperty(c => c.Location,"(Opcional) Valor inicial");
```

## `SetupAllProperties`

`SetupAllProperties` no es más que la llamada `SetupProperty` para todas y cada una de las propiedades que tenga el objeto, con lo que si el valor inicial no es importante, vamos a poder utilizarla para ahorrar algo de tiempo y código.

También es posible llamar a `SetupProperty` con propiedades individuales después de haber hecho `SetupAllProperties` para asignar un valor inicial solo en algunas de ellas.