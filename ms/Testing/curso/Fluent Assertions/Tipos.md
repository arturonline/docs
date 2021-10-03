# Tipos Fundamentales

## Anulables

- `HaveValue`: el objeto **no tiene** que ser null.
- `NotHaveValue`: el objeto **tiene** que ser null.

## Booleanos

- `BeTrue`: el objeto tiene que ser **true**.
- `BeFalse`: el objeto tiene que ser **false**.
- `NotBeTrue`: el objeto tiene que ser **false o null**.
- `NotBeFalse`: el objeto tiene que ser **true o null**.

## Números (y cualquier cosa que implemente IComparable)

- `BeGreaterThan(expected)`: el valor debe ser **superior** al esperado.
- `BeLessThan(expected)`: el valor debe ser **inferior** al esperado.
- `BeGreaterOrEqualTo(expected)`: el valor debe ser **superior o igual** al esperado.
- `BeLessOrEqualTo(expected)`: el valor debe ser **inferior o igual** al esperado.
- `BeInRange(min,max)`: el valor debe estar entre los valores **mínimo** y **máximo**.
- `NotBeInRange(min,max)`: el valor debe no estar entre los valores **mínimo** y **máximo**.
- `BePositive()`: el valor debe ser **positivo**.
- `BeNegative()`: el valor debe ser **negativo**.
- `BeApproximately(expected,tolerance)`: el valor debe ser el esperado ± la tolerancia (para valores con decimales).
- `BeOneOf(expected)`: el valor debe ser uno de los que le pasemos en un objeto `IEnumerable<T>`.

## Enumeraciones

- `HaveFlag(expected)`: el flag esperado está **presente**.
- `NotHaveFlag(expected)`: el flag esperado **no está presente**.