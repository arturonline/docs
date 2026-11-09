# advanced classes

Herència, mètodes especials, classes abstractes i genèrics. Els conceptes bàsics (definició, atributs, mètodes, `@property`, `dataclasses`) estan en [clases](clases.md).

Vegeu també: [clases](clases.md) · [errors](errors.md) (excepcions pròpies, que també hereten) · [sort](sort.md)

## Herència

Per a definir una classe que hereta d'una altra s'indica la classe pare entre parèntesis en la línia de definició de la classe:

```python
class ClasseFilla(ClassePare):
    pass
```

- Podem afegir nous elements membres (atributs i mètodes) a la nova classe.
- En el constructor hem d'invocar el constructor de la superclasse amb `super().__init__(...)`.
- Podem sobreescriure mètodes de la classe pare.

Exemple:

```python
class SeleccionFutbol:
    # Les variables que es declaren ací són atributs de classe ("estàtics"),
    # compartits per totes les instàncies
    q_elements = 0

    def __init__(self, id: int, nombre: str, apellidos: str, edad: int):
        self.id = id
        self.nombre = nombre
        self.apellidos = apellidos
        self.edad = edad
        # Accés a la variable estàtica a través del nom de la classe
        SeleccionFutbol.q_elements += 1

    def mostrar(self) -> None:
        print("Selecció:", self.nombre)
```

```python
class Futbolista(SeleccionFutbol):
    q_futbolistas = 0

    def __init__(self, id=0, nombre="", apellidos="", edad=16, dorsal=1, demarcacion=""):
        super().__init__(id, nombre, apellidos, edad)
        Futbolista.q_futbolistas += 1
        self.dorsal = dorsal
        self.demarcacion = demarcacion

    # Sobreescrivim el mètode de la classe pare
    def mostrar(self) -> None:
        print("Futbolista", self.nombre)

f = Futbolista(1, "David", "Albelda", 32, 6, "Pivot")
f.mostrar()                    # -> Futbolista David
SeleccionFutbol.q_elements     # -> 1
isinstance(f, SeleccionFutbol) # -> True
issubclass(Futbolista, SeleccionFutbol)  # -> True
```

> ⚠️ Si els atributs foren privats (`self.__nombre`), la classe filla **no** podria accedir-hi com `self.__nombre` (el *name mangling* el converteix en `_SeleccionFutbol__nombre`). Per a atributs que han d'usar les filles, millor `self._nombre` (protected) o una `@property` (veure [clases](clases.md#propietats-property)). Getters/setters a l'estil Java (`getNombre()`) no són idiomàtics en Python.

### `@override` (3.12+)

Marca que un mètode sobreescriu un del pare: els comprovadors de tipus (mypy, pyright) avisen si el pare no el té (p. ex. per un error d'escriptura).

```python
from typing import override

class Porter(Futbolista):
    @override
    def mostrar(self) -> None:
        print("Porter", self.nombre)
```

### Herència múltiple i MRO

```python
class A:
    def hola(self): return "A"
class B(A):
    def hola(self): return "B -> " + super().hola()
class C(A):
    def hola(self): return "C -> " + super().hola()
class D(B, C):
    pass

D().hola()                          # -> 'B -> C -> A'
[k.__name__ for k in D.__mro__]     # -> ['D', 'B', 'C', 'A', 'object']
```

`super()` segueix l'ordre de resolució de mètodes (MRO), no necessàriament "el pare directe".

## Reescriptura de mètodes especials

### `__str__` i `__repr__`

- `__str__`: representació "per a l'usuari"; s'invoca amb `str(obj)`, `print(obj)` i en f-strings `f"{obj}"`.
- `__repr__`: representació "per al programador" (idealment, codi que recrea l'objecte); s'usa en el REPL, en llistes i en `f"{obj!r}"`. Si no hi ha `__str__`, `str()` usa `__repr__`.

```python
# A la classe SeleccionFutbol
def __str__(self):
    return f"{self.nombre}, {self.apellidos}"

def __repr__(self):
    return f"{type(self).__name__}({self.id!r}, {self.nombre!r}, {self.apellidos!r}, {self.edad!r})"


# A la classe Futbolista
def __str__(self):
    # retornem el str del pare i afegim el nostre
    return f"{super().__str__()}, dorsal={self.dorsal}"
```

```python
f = Futbolista(1, "David", "Albelda", 32, 6)
print(f)     # -> David, Albelda, dorsal=6
[f]          # -> [Futbolista(1, 'David', 'Albelda', 32)]
```

### `__eq__`

Aquest mètode s'invoca quan es comparen dos objectes amb `==`. Imaginem el codi següent:

```python
s1 = SeleccionFutbol(100, "David", "Albelda", 32)
s2 = SeleccionFutbol(100, "David", "Albelda", 32)

print("Són iguals", s1 == s2)   # -> Són iguals False
```

Això ens retorna `False` donat que, encara que tinguen els mateixos valors, són instàncies distintes.

Però si escrivim el codi següent a la classe `SeleccionFutbol`:

```python
def __eq__(self, altre):
    if not isinstance(altre, SeleccionFutbol):
        return NotImplemented   # deixa que Python provi l'altra comparació / retorne False
    return (self.id, self.nombre, self.apellidos, self.edad) == \
           (altre.id, altre.nombre, altre.apellidos, altre.edad)
```

Ara ja ens retornarà `True`.

⚠ Notes:

- Ara `==` ja no compara referències: per a saber si són **la mateixa instància** cal usar `is` (`s1 is s2` -> `False`).
- En definir `__eq__`, Python posa `__hash__ = None`: l'objecte deixa de ser *hashable* (no es pot posar en un `set` ni ser clau d'un `dict`). Si cal, defineix també `__hash__` amb els mateixos camps: `return hash((self.id, self.nombre, self.apellidos, self.edad))`.
- Una `@dataclass` genera `__eq__` (i `__repr__`) automàticament (veure [clases](clases.md#dataclasses)).

### Altres mètodes especials habituals

| Mètode                            | S'invoca amb                               |
| --------------------------------- | ------------------------------------------ |
| `__lt__`, `__le__`, `__gt__`...   | `<`, `<=`, `>`... (i per tant `sorted()`)  |
| `__len__`                         | `len(obj)`                                 |
| `__getitem__`                     | `obj[i]`, i fa l'objecte iterable          |
| `__iter__`                        | `for x in obj`                             |
| `__contains__`                    | `x in obj`                                 |
| `__add__`, `__mul__`...           | `obj + altre`, `obj * altre`...            |
| `__call__`                        | `obj()`                                    |
| `__enter__` / `__exit__`          | `with obj:`                                |
| `__bool__`                        | `if obj:`                                  |

```python
from functools import total_ordering

@total_ordering                      # a partir de __eq__ i __lt__ genera la resta
class Equip:
    def __init__(self, nom: str, jugadors: list[str]):
        self.nom = nom
        self.jugadors = jugadors

    def __len__(self):
        return len(self.jugadors)

    def __iter__(self):
        return iter(self.jugadors)

    def __contains__(self, jugador):
        return jugador in self.jugadors

    def __eq__(self, altre):
        return len(self) == len(altre)

    def __lt__(self, altre):
        return len(self) < len(altre)

e1 = Equip("València", ["Albelda", "Baraja", "Ayala"])
e2 = Equip("Llevant", ["Morales"])
len(e1)              # -> 3
"Baraja" in e1       # -> True
list(e1)             # -> ['Albelda', 'Baraja', 'Ayala']
e2 < e1, e1 >= e2    # -> (True, True)
max(e1, e2).nom      # -> 'València'
```

## Classes abstractes

Una classe abstracta no es pot instanciar; obliga les filles a implementar certs mètodes.

```python
from abc import ABC, abstractmethod

class Figura(ABC):
    @abstractmethod
    def area(self) -> float: ...

    def descripcio(self) -> str:          # mètode normal, heretat
        return f"{type(self).__name__} d'àrea {self.area():.2f}"

class Cercle(Figura):
    def __init__(self, r: float):
        self.r = r

    def area(self) -> float:
        return 3.14159 * self.r ** 2

Figura()                  # TypeError: Can't instantiate abstract class Figura without an implementation for abstract method 'area'
Cercle(1).descripcio()    # -> "Cercle d'àrea 3.14"
```

### Protocols (duck typing amb tipus)

Un `Protocol` defineix una interfície **sense herència**: qualsevol classe que tinga els mètodes la compleix (comprovat pel type checker).

```python
from typing import Protocol

class TeArea(Protocol):
    def area(self) -> float: ...

class Quadrat:                 # no hereta de TeArea
    def __init__(self, c: float):
        self.c = c
    def area(self) -> float:
        return self.c ** 2

def area_total(figures: list[TeArea]) -> float:
    return sum(f.area() for f in figures)

area_total([Quadrat(2), Cercle(1)])   # -> 7.14159
```

## Pattern matching amb classes

`match` pot comprovar el tipus i extraure atributs alhora:

```python
def descriu(fig) -> str:
    match fig:
        case Cercle(r=0):
            return "punt"
        case Cercle(r=r):
            return f"cercle de radi {r}"
        case Quadrat(c=c) if c > 10:
            return "quadrat gran"
        case Quadrat():
            return "quadrat"
        case _:
            return "desconegut"

descriu(Cercle(2)), descriu(Quadrat(20)), descriu(Quadrat(1))
# -> ('cercle de radi 2', 'quadrat gran', 'quadrat')
```

> 💡 Amb `__match_args__ = ("r",)` (les `dataclass` el generen soles) es pot escriure `case Cercle(r):` posicionalment.

## Genèrics (PEP 695, 3.12+)

Classes i funcions parametritzades per tipus, amb la sintaxi `[T]`:

```python
class Pila[T]:
    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        return self._items.pop()

    def __len__(self) -> int:
        return len(self._items)

p = Pila[int]()
p.push(1)
p.push(2)
p.pop()        # -> 2
len(p)         # -> 1

def primer[T](items: list[T]) -> T:          # funció genèrica
    return items[0]

def maxim[T: (int, float)](a: T, b: T) -> T:  # T restringit a int o float
    return a if a > b else b

type Parell[T] = tuple[T, T]                 # àlies de tipus genèric
```

Abans de 3.12 calia `T = TypeVar("T")` i `class Pila(Generic[T])`.
