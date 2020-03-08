# Classes

## Scope

- A variable created in the main body is global. Global variables are available from within any scope, global and local.
- A variable created inside a function belongs to the local scope of that function, and can only be used inside that function.

## Definició de clases

```python
class Alumne:
    def __init__(self, dni="",nom="",cognoms="",edat=0):
        self.dni = dni
        self.nom = nom
        self.cognoms = cognoms
        self.edat = edat

alu1=Alumne("12345678X","Pepe","Garcia",32)
alu2=Alumne("12345678X")
alu3=Alumne()
alu4=Alumne(nom="ZZZ",cognoms="XXX")
```

- la funció`__init__` es el constructor de la clase.
- El primer argument ha de ser sempre **self**.
- Si els parametres del constructor no es declaran de la clase (es a dir, amb el **self**) quan acabe el constructor aquestos valors es destrueixen.
- No es permet la sobrecàrrega, es a dir, domes un constructor per clase. Pero podem fer ús de valors per defecte als arguments.

## Accés als atributs

- Tot es public.
- per a fer un atribut protected afegirem un guió baix:
  - `_edat = edat`
- per a fer un atribut privat afegirem dos guions baixos:
  - `__salari = salari`

Exemple:

```python
class Empleat():
    def __init__(self, nom, edat, salari):
        self.nom = nom # Atribut public
        self._edat = edat # Atribut protected
        self.__salari = salari # Atribut privat
empleat = Empleat("Pere", 42, 1230)

print("El nom es", empleat.nom)
print("Edat es", empleat._edat)
print("El salari és", empleat.__salari)
```

Sortida:

```bash
El nom es Pere
Edat es 42
Traceback (most recent call last) :
    File "prova Classes.py", line 66 , in <module >
    print("El salari es " , empleat.__salari)
AttributeError: 'Empleat' object has no attribute'__salari'
```

## Còpia d'objectes

- `copy.copy(x)` -> copia variables normals, no referencies.
- `copy.deepcopy(x[, memo])` -> copia tot, incluint altres objectes de forma recursiva.

## Comparació d'objectes

```python
def igualAlumne(self, altre):
    if not isinstance(altre, Alumne):
        return false
    return self.dni == altre.dni and self.nom == altre.nom
```

## Mètodes

- Tots els mètodes porten com a primer argument **self**.
- No es permet la sobrecàrrega de mètodes, sinò fer ús de valors per defecte als arguments.

```python
def nomComplet(self):
    return self.nom + " " + self.cognoms

def nomAlfabetic(self):
    return self.cognoms + ", " + self.nom

def creixer(self, anys = 1):
    self.edat += anys