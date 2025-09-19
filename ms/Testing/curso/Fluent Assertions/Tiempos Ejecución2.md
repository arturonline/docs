# FA: medir tiempos ejecución

>No se trata de hacer un benchmark, por lo que no es una medida precisa del tiempo de ejecución del código, sino que se trata de determinar que no están pasando "cosas raras". Ahora lo veremos...

Para validar el tiempo de ejecución de un código:

```cs
//Arrange

//Act
Action act = () => MétodoAProbar();

//Assert
act.ExecutionTime().Should().BeCloseTo(10.Milliseconds(), 10.Milliseconds());
```

`ExecutionTime()` pone a nuestra disposición las afirmaciones:

- `BeLessThan(expected)`: el tiempo de ejecución es menor que el esperado.
- `BeGreaterThan(expected)`: el tiempo de ejecución es mayor que el esperado.
- `BeLessOrEqualTo(expected)`: el tiempo de ejecución es menor o igual que el esperado.
- `BeGreaterOrEqualTo(expected)`: el tiempo de ejecución es mayor o igual que el esperado.
- `BeCloseTo(expected,tolerance)`: el tiempo de ejecución es el esperado ± la tolerancia.

Existe una versión no genérica de ExecutionTime() para trabajar sobre una instancia directamente que es ExecutionTimeOf(expression), la cual nos va a permitir no tener que crear un Action o un Func:

```cs
//Arrange
var sujeto = new MyClass();
//Act

//Assert
sujeto.ExecutionTimeOf(x=>x.Método()).Should().BeCloseTo(10.Milliseconds(), 10.Milliseconds());
```

En caso de que el retorno sea Task vamos a poder utilizar los métodos CompleteWithin(expected) (bloqueando la ejecución) y CompleteWithinAsync(expected) (sin bloquear la ejecución) para afirmar que la tarea acaba dentro del tiempo esperado. La principal diferencia entre estos dos métodos y los anteriores es que, en estos dos últimos, vamos a poder concatenar nuevas afirmaciones mediante And y Which.