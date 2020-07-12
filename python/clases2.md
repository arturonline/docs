# advanced classes

## Herencia

Per a definir una classe com heredara d’un altra s’indica posant la classe pare entre parèntesi en la linia de definició de la classe:

```python
class ClasseFilla(ClassePare):
    pass
```

- Podem afegir noms elements membres a la nova classe
- En el constructor hem de invocar al constructor de la superclasse

Exemple:

```python
class SeleccionFutbol:
    # Les variables que es declaren ací son per definicó estàtiqes
    qElements=0;

    def __init__(self, id, nombre, apellidos, edad):
        self.__id=id
        self.__nombre=nombre
        self.__apellidos=apellidos
        self.__edad=edad
        # Accés a la variable estàtics
        SeleccionFutbol.qElements+=1
    def getNombre(self):
        return self.nombre

    def setNombre(self,nombre):
        self.nombre=nombre

    def mostrar(self):
        print("Selecció: ", self.nombre)
```

```python
class Futbolista(SeleccionFutbol):
    qFutbolistas=0

    def __init__(self, id=0, nombre="", apellidos="", edad=16, dorsal=1, demarcacion=""):
        super().__init__(id, nombre, apellidos, edad)
        Futbolista.qFutbolistas+=1
        self.dorsal=dorsal
        self.demarcacion=demarcacion

    # Sobreescrivim de la clase pare
    def mostrar(self):
        print("Futbolista " + self.nombre)
```

## Reescriptura de mètodes especials

### __str__

Aquesta és la funció per a la representació del objecte en format str, de manera que quan cride, a `str()` o posem l’objecte dins d’un print s’invoca automàticament. Exemple:

```python
# A la classe SeleccioFutbol
def __str__(self):
    return self.nombre + ", " + self.apellidos


# A la classe Futbolista
def __str__(self):
    return super().__str__() + ", dorsal=" +str(self.dorsal)
# retornem el str del pare i afegim lo nostre
```

### __eq__

Aquest mètode s’invoca quan es comparen dos objectes amb ==. Imaginem el següent codi:

```python
s1=SeleccionFutbol(100, "David", "Albelda", 32)
s2=SeleccionFutbol(100, "David", "Albelda", 32)

print("Son iguals",s1==s2)
```

Això ens retorna False donat que encara que tinguen els mateixos valors, són instàncies distintes.

Però si escrivim el següent codi a la classe SeleccionFutbol:

```python
def __eq__(self, altre):
return self.id==altre.id and self.nombre==altre.nombre and \
        self.apellidos==altre.apellidos and self.edad==altre.edad
```

Ara ja ens retornarà True.

⚠ Nota: adonar-se que ara ja no podem comparar referències
