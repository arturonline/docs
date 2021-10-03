# FA trabajando con Fechas

Fluent Assertions nos ofrece la posibilidad de trabajar con fechas de manera más natural.

Por ejemplo, si queremos referirnos al 1 de enero del año 2000 a las 11:30, lo haremos así:

```cs
var fecha = 1.January(2000).At(11, 30);
```

Del mismo modo que construimos objetos DateTime con esta sintaxis, podemos crear objetos `TimeSpan` utilizando los métodos de extensión `Days()`,`Hours()`,`Minutes()`, `Seconds()` y `MiliSeconds()`.

```cs
var span = 2.Hours();
```

Por último, también podemos sumar y restar el TimeSpan a una fecha dada con los métodos Before y After:

```cs
var unoEnero = 1.January(2000);
var tresEnero = 2.Days().After(unoEnero);
```

## Afirmaciones específicas para trabajar con DateTime

### Fechas Específicas

- `BeAfter(expected)`: la fecha debe ser **posterior** a la esperada.
- `BeBefore(expected)`: la fecha debe ser **anterior** a la esperada.
- `BeOnOrAfter(expected)`: la fecha debe ser **igual o posterior** a la esperada.
- `BeOnOrBefore(expected)`: la fecha debe ser **igual o anterior** a la esperada.
- `BeSameDateAs(expected)`: la fecha debe ser **igual a la esperada**.
- `BeIn(expected)`: la fecha debe estar representada en el **tipo esperado** (local o UTC, con la enumeración estándar de .NET, DateTimeKind).
- `NotBeAfter(expected)`: la fecha **no debe ser posterior** a la esperada.
- `NotBeBefore(expected)`: la fecha **no debe ser anterior** a la esperada.
- `NotBeOnOrAfter(expected)`: la fecha **no debe ser igual o posterior** a la esperada.
- `NotBeOnOrBefore(expected)`: la fecha **no debe ser igual o anterior** a la esperada.
- `NotBeSameDateAs(expected)`: la fecha **no debe ser igual a la esperada**.
- `BeOneOf(expected)`: la fecha debe estar literalmente en las recibidas como parámetro.

### Partes concretas de la fecha

- `HaveDay(expected)`: es el **número de día** en el mes esperado.
- `HaveMonth(expected)`: es el **número de mes** esperado.
- `HaveYear(expected)`: es el **número de año** esperado.
- `HaveHour(expected)`: es la **hora** esperada.
- `HaveMinute(expected)`: es el **minuto** esperado.
- `HaveSecond(expected)`: es el **segundo** esperado.
- `NotHaveDay(expected)`: **no es el número de día** en el mes esperado.
- `NotHaveMonth(expected)`: **no es el número de mes** esperado.
- `NotHaveYear(expected)`: **no es el número de año** esperado.
- `NotHaveHour(expected)`: **no es la hora** esperada.
- `NotHaveMinute(expected)`: **no es el minuto** esperado.
- `NotHaveSecond(expected)`: **no es el segundo** esperado.

O incluso, saber si es, o no aproximado, lo cual puede ser muy útil:

- `BeCloseTo(expected,tolerance)`: es la **fecha esperada** ± la tolerancia.
- `NotBeCloseTo(expected,tolerance)`: **no es la fecha esperada** ± la tolerancia.

### Afirmaciones sobre los TimeSpan

- `BePositive()`: es **positivo**.
- `BeNegative()`: es **negativo**.
- `BeLessThan(expecte`d): es **menor que** lo esperado.
- `BeGreaterThan(expecte`d): es **mayor que** lo esperado.
- `BeLessOrEqualTo(expecte`d): es **menor o igual que** lo esperado.
- `BeGreaterOrEqualTo(expecte`d): es **mayor o igual que** lo esperado.
- `BeCloseTo(expecte`d,tolerance): es **el tiempo esperado** ± la tolerancia.
- `NotBeCloseTo(expecte`d,tolerance): **no es el tiempo esperado** ± la tolerancia.
