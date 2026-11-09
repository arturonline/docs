# Classes

Bàsics: definició, atributs, mètodes, `dataclasses`. Herència, mètodes especials (`__str__`, `__eq__`...) i classes abstractes en [clases2](clases2.md).

Vegeu també: [clases2](clases2.md) · [sort](sort.md) (ordenar objectes) · [tuples](tuples.md) (`NamedTuple`) · [errors](errors.md) (excepcions pròpies)

## Scope

- Una variable creada al cos principal del mòdul és **global**: es pot llegir des de qualsevol àmbit, global i local.
- Una variable creada dins d'una funció pertany a l'àmbit **local** d'eixa funció i només es pot usar dins d'ella.
- Per a **assignar** una global des d'una funció cal `global x` (o `nonlocal x` per a una variable de la funció que la conté).

```python
comptador = 0

def incrementa():
    global comptador
    comptador += 1     # sense `global` -> UnboundLocalError

incrementa()
comptador   # -> 1
```

## Definició de classes

```python
class Alumne:
    def __init__(self, dni: str = "", nom: str = "", cognoms: str = "", edat: int = 0):
        self.dni = dni
        self.nom = nom
        self.cognoms = cognoms
        self.edat = edat

alu1 = Alumne("12345678X", "Pepe", "Garcia", 32)
alu2 = Alumne("12345678X")
alu3 = Alumne()
alu4 = Alumne(nom="ZZZ", cognoms="XXX")

alu1.nom    # -> 'Pepe'
alu4.dni    # -> ''
```

- La funció `__init__` és el constructor (inicialitzador) de la classe.
- El primer argument ha de ser sempre **self** (la instància).
- Si els paràmetres del constructor no es guarden com a atributs (és a dir, amb **self.**), quan acaba el constructor eixos valors es perden.
- No es permet la sobrecàrrega, és a dir, només un constructor per classe. Però podem fer ús de valors per defecte als arguments (o `@classmethod` com a constructors alternatius, veure més avall).

## Accés als atributs

- Tot és públic.
- Per convenció, un atribut **protected** porta un guió baix: `self._edat = edat` (només és un avís per al programador, s'hi pot accedir igual).
- Un atribut **privat** porta dos guions baixos: `self.__salari = salari`. Python li canvia el nom (*name mangling*) a `_Empleat__salari`, de manera que no es pot accedir des de fora amb `__salari`.

Exemple:

```python
class Empleat:
    def __init__(self, nom, edat, salari):
        self.nom = nom          # Atribut públic
        self._edat = edat       # Atribut protected
        self.__salari = salari  # Atribut privat

empleat = Empleat("Pere", 42, 1230)

print("El nom és", empleat.nom)
print("L'edat és", empleat._edat)
print("El salari és", empleat.__salari)
```

Eixida:

```text
El nom és Pere
L'edat és 42
Traceback (most recent call last):
  File "prova_classes.py", line 11, in <module>
    print("El salari és", empleat.__salari)
                          ^^^^^^^^^^^^^^^^
AttributeError: 'Empleat' object has no attribute '__salari'
```

```python
empleat._Empleat__salari   # -> 1230  (no és privat de veritat, només "amagat")
```

### Propietats (`@property`)

Per a controlar l'accés a un atribut sense canviar la sintaxi `obj.atribut`:

```python
class Empleat:
    def __init__(self, nom: str, salari: float):
        self.nom = nom
        self.salari = salari          # crida al setter

    @property
    def salari(self) -> float:        # getter
        return self._salari

    @salari.setter
    def salari(self, valor: float) -> None:
        if valor < 0:
            raise ValueError("El salari no pot ser negatiu")
        self._salari = valor

    @property
    def salari_anual(self) -> float:  # propietat calculada, només lectura
        return self.salari * 14

e = Empleat("Pere", 1230)
e.salari_anual   # -> 17220
e.salari = -5    # ValueError: El salari no pot ser negatiu
e.salari_anual = 0   # AttributeError: property 'salari_anual' of 'Empleat' object has no setter
```

## Mètodes

- Tots els mètodes d'instància porten com a primer argument **self**.
- No es permet la sobrecàrrega de mètodes: fer ús de valors per defecte als arguments.

```python
class Alumne:
    def __init__(self, dni: str = "", nom: str = "", cognoms: str = "", edat: int = 0):
        self.dni = dni
        self.nom = nom
        self.cognoms = cognoms
        self.edat = edat

    def nom_complet(self) -> str:
        return f"{self.nom} {self.cognoms}"

    def nom_alfabetic(self) -> str:
        return f"{self.cognoms}, {self.nom}"

    def creixer(self, anys: int = 1) -> None:
        self.edat += anys

alu = Alumne("12345678X", "Pepe", "Garcia", 32)
alu.nom_complet()     # -> 'Pepe Garcia'
alu.nom_alfabetic()   # -> 'Garcia, Pepe'
alu.creixer()
alu.creixer(5)
alu.edat              # -> 38
```

### Atributs i mètodes de classe i estàtics

```python
class Alumne:
    total = 0                          # atribut de classe (compartit per totes les instàncies)

    def __init__(self, nom: str, edat: int):
        self.nom = nom
        self.edat = edat
        Alumne.total += 1

    @classmethod
    def des_de_text(cls, text: str) -> "Alumne":   # constructor alternatiu
        nom, edat = text.split(";")
        return cls(nom, int(edat))

    @staticmethod
    def es_major_edat(edat: int) -> bool:          # no usa ni self ni cls
        return edat >= 18

a = Alumne.des_de_text("Pepe;32")
a.nom, a.edat                 # -> ('Pepe', 32)
Alumne.es_major_edat(16)      # -> False
Alumne.total                  # -> 1
```

> 💡 Des de 3.11 es pot anotar el retorn com `-> Self` (`from typing import Self`) en lloc de `-> "Alumne"`.

## Còpia d'objectes

L'assignació (`b = a`) **no** copia: les dues variables apunten al mateix objecte.

- `copy.copy(x)` -> còpia superficial: crea un objecte nou, però els atributs que són objectes (llistes, altres objectes...) es comparteixen (es copia la referència).
- `copy.deepcopy(x)` -> còpia profunda: ho copia tot, incloent-hi els altres objectes de forma recursiva.

```python
import copy

class Grup:
    def __init__(self, nom: str, alumnes: list[str]):
        self.nom = nom
        self.alumnes = alumnes

g1 = Grup("DAW", ["Pepe", "Anna"])
g2 = copy.copy(g1)
g3 = copy.deepcopy(g1)

g1.alumnes.append("Joan")
g2.alumnes    # -> ['Pepe', 'Anna', 'Joan']   (llista compartida)
g3.alumnes    # -> ['Pepe', 'Anna']
g1 is g2      # -> False
```

## Comparació d'objectes

- `a is b` -> mateixa instància (mateixa referència).
- `a == b` -> per defecte també compara referències, a menys que la classe definisca `__eq__` (veure [clases2](clases2.md#__eq__)).

```python
class Alumne:
    def __init__(self, dni: str, nom: str):
        self.dni = dni
        self.nom = nom

    def igual_alumne(self, altre: object) -> bool:
        if not isinstance(altre, Alumne):
            return False
        return self.dni == altre.dni and self.nom == altre.nom

a1 = Alumne("1X", "Pepe")
a2 = Alumne("1X", "Pepe")
a1 == a2               # -> False (instàncies distintes)
a1.igual_alumne(a2)    # -> True
```

## Dataclasses

`@dataclass` genera automàticament `__init__`, `__repr__` i `__eq__` a partir dels atributs anotats. És la forma recomanada per a classes que principalment guarden dades.

```python
from dataclasses import dataclass, field

@dataclass
class Alumne:
    dni: str
    nom: str
    cognoms: str = ""
    edat: int = 0
    notes: list[float] = field(default_factory=list)   # mai `= []` (seria compartida)

    def nom_complet(self) -> str:
        return f"{self.nom} {self.cognoms}"

a = Alumne("12345678X", "Pepe", "Garcia", 32)
a                  # -> Alumne(dni='12345678X', nom='Pepe', cognoms='Garcia', edat=32, notes=[])
a == Alumne("12345678X", "Pepe", "Garcia", 32)   # -> True (compara camp a camp)
a.notes.append(7.5)
```

Opcions útils:

```python
from dataclasses import dataclass, replace, asdict

@dataclass(frozen=True, slots=True, kw_only=True)
class Punt:
    x: float
    y: float = 0.0

p = Punt(x=1, y=2)
p                    # -> Punt(x=1, y=2)
Punt(1, 2)           # TypeError: Punt.__init__() takes 1 positional argument but 3 were given  (kw_only)
p.x = 5              # dataclasses.FrozenInstanceError: cannot assign to field 'x'  (frozen)
replace(p, y=10)     # -> Punt(x=1, y=10)   (còpia amb canvis)
asdict(p)            # -> {'x': 1, 'y': 2}
{p}                  # frozen + eq -> hashable: es pot usar en sets i com a clau de dict
```

| Opció          | Efecte                                                                    |
| -------------- | ------------------------------------------------------------------------- |
| `frozen=True`  | immutable (i hashable)                                                    |
| `slots=True`   | usa `__slots__`: menys memòria, accés més ràpid, no admet atributs nous   |
| `kw_only=True` | tots els camps s'han de passar per nom                                    |
| `order=True`   | genera `<`, `<=`, `>`, `>=` (compara els camps en ordre, veure [sort](sort.md)) |

Validacions o camps calculats en `__post_init__`:

```python
@dataclass
class Rectangle:
    ample: float
    alt: float
    area: float = field(init=False)

    def __post_init__(self):
        if self.ample <= 0 or self.alt <= 0:
            raise ValueError("Mides positives")
        self.area = self.ample * self.alt

Rectangle(2, 3)   # -> Rectangle(ample=2, alt=3, area=6)
```
