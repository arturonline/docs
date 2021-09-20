# FA: trabajando con colecciones

Las afirmaciones que nos ofrece Fluent Assertions para las colecciones son:

- `BeEmpty()`: la colección está vacía.
- `NotBeEmpty()`: no está vacía.
- `BeNullOrEmpty()`: la colección está vacía o es null.
- `NotBeNullOrEmpty()`: la colección ni está vacía ni es null.
- `HaveCount(expected)`: tiene la longitud esperada.
- `NotHaveCount(expected)`: no tiene la longitud esperada.
- `HaveCountGreaterThan(expected)`: tiene una longitud mayor que lo esperado.
- `HaveCountLessOrEqualTo(expected)`: tiene una longitud menor que lo esperado.
- `HaveCountGreaterOrEqualTo(expected)`: tiene una longitud mayor o igual que lo esperado.
- `HaveCountLessThan(expected)`: tiene una longitud menor o igual que lo esperado.
- `HaveSameCount(expected collectio`n): tiene la misma longitud que la colección esperada.
- `NotHaveSameCount(expected collectio`n): no tiene la misma longitud que la colección esperada.
- `Equal(expected collectio`n): contiene los mismos elementos que la colección esperada.
- `NotEqual(expected collection)`: no contiene los mismos elementos que la colección esperada.
- `BeEquivalentTo(expected)`: es equivalente a los parámetros esperados (params object[]).
- `NotBeEquivalentTo(expected)`: no es equivalente a los parámetros esperados (params object[]).
- `OnlyHaveUniqueItems()`: no tiene objetos repetidos.
- `Contain(expected)`: la colección contiene el objeto esperado.
- `NotContain(expected)`: no contiene el elemento esperado.
- `NotContain(expected collection)`: no contiene ningún elemento de la colección esperada.
- `NotContainNulls()`: la colección no contiene valores null.
- `ContainEquivalentOf(expected)`: la colección contiene algún valor equivalente al esperado. En caso de valores por referencia va a comprobar sus valores.
- `ContainInOrder(expected collection)`: contiene los elementos de la colección ordenados de igual manera.
- `ContainItemsAssignableTo<T>()`: los elementos que contiene son convertibles a T.
- `AllBeAssignableTo<T>()`: todos los objetos que contiene son convertibles a T.
- `AllBeOfType<T>()`: todos los objetos que contiene la colección son del tipo T o heredan de este.
- `HaveElementAt(index, expected)`: la colección contiene el objeto esperado en el índice indicado.
- `StartWith(expected)`: la colección empieza por el objeto esperado.
- `StartWith(expected collection)`: la colección empieza por los objetos esperados.
- `EndWith(expected)`: la colección termina por el objeto esperado.
- `EndWith(expected collection)`: la colección termina por los objetos esperados.
- `BeSubsetOf(expected collection)`: la colección es un subconjunto de la colección esperada.
- `NotBeSubsetOf(expected collection)`: la colección no es un subconjunto de la colección esperada.
- `IntersectWith(expected collection)`: existe una intersección con la colección esperada (coinciden uno o más valores).
- `NotIntersectWith(anotherCollection)`: no existe una intersección con la colección esperada.
- `BeInAscendingOrder()`: la colección está ordenada de manera ascendente.
- `BeInDescendingOrder()`: la colección está ordenada de manera descendente.
- `NotBeInAscendingOrder()`: la colección no está ordenada de manera ascendente (o está desordenada).
- `NotBeInDescendingOrder()`: la colección no está ordenada de manera descendente (o está desordenada).

Si estás trabajando con una colección genérica, para estas 4 últimas afirmaciones donde se requiere ordenación, es requisito que la clase contenida en la enumeración implemente `IComparable`.

## Otras colecciones

Existe una sobrecarga para el método, siempre que estemos trabajando con colecciones con objetos personalizados, en el que le vamos a poder indicar como parámetro, mediante una expresión, con qué propìedad queremos comprobar la ordenación:

```cs
collection.Should().BeInAscendingOrder(x=>x.MyProperty);
```

Del mismo modo que ocurre con estas afirmaciones que requieren ordenación, existen otras a las que podemos indicar la propiedad sobre la que afirmar con una expresión. Estas aserciones son:

- `OnlyHaveUniqueItems(expression)`
- `NotContainNulls(expression)`
- `Equal(expression)`
- `StartWith(expression)`
- `EndWith(expression)`

Al tener un tipado fuerte también vamos a poder comprobar si todos los objetos son equivalentes con AllBeEquivalentTo(expected). Por último, las colecciones tipadas nos permiten hacer una afirmación declarativa para los diferentes elementos que contiene. Esto lo vamos a poder conseguir con el método SatisfyRespectively(expression) y una expresión para cada uno de los elementos:

```cs
var collection2 = new[]
    {
        DateTime.Now,
        DateTime.Now.AddDays(1)
    };
collection2.Should().SatisfyRespectively(
    first =>
    {
        first.Date.Should().Be(DateTime.Now.Date);
    },
    second =>
    {
        second.Date.Should().Be(1.Days().After(DateTime.Now.Date));
    });
```

## Diccionarios

De manera muy similar a lo que ocurría con las colecciones, existen afirmaciones específicas para poder trabajar con diccionarios y obtener las ventajas de Fluent Assertions:

- `BeEmpty()`: el diccionario está vacío.
- `NotBeEmpty()`: el diccionario no está vacío.
- `Equal(expected)`: el diccionario tiene el mismo contenido que el diccionario esperado.
- `NotEqual(expected)`: el diccionario no tiene el mismo contenido que el diccionario esperado.
- `ContainKey(expected)`: el diccionario contiene la clave esperada.
- `NotContainKey(expected)`: el diccionario no contiene la clave esperada.
- `ContainKeys(expected)`: el diccionario contiene las claves esperadas.
- `NotContainKeys(expected)`: el diccionario no contiene las claves esperadas.
- `ContainValue(expected)`: el diccionario contiene el valor esperado.
- `NotContainValue(expected)`: el diccionario no contiene el valor esperado.
- `ContainValues(expected)`: el diccionario contiene los valores esperados.
- `NotContainValues(expected)`: el diccionario no contiene los valores esperados.
- `HaveCount(expected)`: el diccionario tiene la longitud esperada.
- `NotHaveCount(expected)`: el diccionario no tiene la longitud esperada.
- `HaveSameCount(expected)`: el diccionario tiene la misma longitud que la colección esperada.
- `NotHaveSameCount(expected)`: el diccionario no tiene la misma longitud que la colección esperada.
- `Contain(expected)`: el diccionario contiene los elementos KeyValuePair<T,Y> indicados en el parámetro params KeyValuePair<T,Y>[].
- `Contain(expected key,expected value)`: el diccionario contiene un elemento que coincide con la clave y valor esperados.
- `NotContain(expected)`: el diccionario no contiene los elementos KeyValuePair<T,Y> indicados en el parámetro params KeyValuePair<T,Y>[].
- `NotContain(expected key,expected value)`: el diccionario no contiene un elemento que coincide con la clave y valor esperados.