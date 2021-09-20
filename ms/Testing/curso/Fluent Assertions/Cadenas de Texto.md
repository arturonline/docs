# FA: Trabajando con Cadenas de Texto

Existen aserciones propias para este tipo que aportan gran versatilidad a la hora de trabajar con string:

## Para saber si la cadena es nula o está vacía

- `BeEmpty()`: la cadena está vacía.
- `NotBeEmpty()`: la cadena está no vacía.
- `BeNullOrWhiteSpace()`: la cadena está vacía, son espacios en blanco o es null.
- `NotBeNullOrWhiteSpace()`: la cadena ni está vacía, ni son espacios en blanco ni es null.

## Contenido de la cadena

- `Contain(expected)`: la cadena que estamos afirmando contiene la cadena esperada.
- `NotContain(expected)`: la cadena que estamos afirmando no contiene la cadena esperada.
- `ContainAll(expected)`: la cadena que estamos afirmando contiene todas las cadenas que recibe como esperadas.
- `NotContainAll(expected)`: la cadena que estamos afirmando no contiene ninguna de las cadenas que recibe como esperadas.
- `ContainAny(expected)`: la cadena que estamos afirmando contiene al menos una de las cadenas que recibe como esperadas.
- `NotContainAny(expected)`: la cadena que estamos afirmando no contiene al menos una de las cadenas que recibe como esperadas.
- `StartWith(expected)`: la cadena que estamos afirmando tiene que empezar con la cadena esperada.
- `NotStartWith(expected)`: la cadena que estamos afirmando no tiene que empezar con las cadena esperada.
- `EndWith(expected)`: la cadena que estamos afirmando tiene que terminar con la cadena esperada.
- `NotEndWith(expected)`: la cadena que estamos afirmando no tiene que terminar con la cadena esperada.
- `Match(expected wit`h wildcards): la cadena que estamos afirmando tiene que cumplir con la cadena esperada. Se puede utilizar * como carácter comodín.
- `NotMatch(expected wit`h wildcards): la cadena que estamos afirmando tiene que no cumplir con la cadena esperada. Se puede utilizar * como carácter comodín.

Para el caso concreto de `Contain`y `ContainEquivalentOf` existe una sobrecarga con la que le vamos a poder indicar el número de veces que queremos que suceda.

- `Exactly`: tiene que repetirse el número exacto de veces.
- `MoreThan`: tiene que repetirse más veces.
- `LessThan`: tiene que repetirse menos veces.
- `AtLeast`: tiene que repetirse las mismas veces o más.
- `AtMost`: tiene que repetirse las mismas veces o menos.

```cs
// comprobar que se repite exactamente 5 veces la cadena esperada dentro de la que estamos afirmando
var result = "Hola alumnos de CampusMVP, estamos estudiando el módulo de Fluent Assertions";
var expected = "a";

result.Should().Contain(expected,Exactly.Times(5));
```

## Afirmaciones que no sean sensibles a diferencias en mayúsculas y minúsculas

- `ContainEquivalentOf(expected)`: la cadena que estamos afirmando contiene la cadena esperada.
- `NotContainEquivalentOf(expected)`: la cadena que estamos afirmando no contiene la cadena esperada.
- `StartWithEquivalentOf(expected)`: la cadena que estamos afirmando tiene que empezar con la cadena esperada.
- `NotStartWithEquivalentOf(expected)`: la cadena que estamos afirmando no tiene que empezar con la cadena esperada.
- `EndWithEquivalentOf(expected)`: la cadena que estamos afirmando tiene que terminar con la cadena esperada.
- `NotEndWithEquivalentOf(expected)`: la cadena que estamos afirmando no tiene que terminar con la cadena esperada.
- `MatchEquivalentOf(expected with wildcards)`: la cadena que estamos afirmando tiene que cumplir con la cadena esperada. Se puede utilizar * como carácter comodín.
- `NotMatchEquivalentOf(expected with wildcards)`: la cadena que estamos afirmando tiene que no cumplir con la cadena esperada. Se puede utilizar * como carácter comodín.

## Afirmaciones con expresiones regulares

- `MatchRegex(regex)`: la cadena que estamos afirmando tiene que validar la expresión regular.
- `NotMatchRegex(regex)`: la cadena que estamos afirmando tiene que no validar la expresión regular.