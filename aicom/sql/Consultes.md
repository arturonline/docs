# Consultes

```sql
SELECT ... -- campos o funciones de grupo
FROM ... -- tablas
WHERE ... -- condiciones de los campos
GROUP BY ... -- campo(s) por los que se agrupan
HAVING ... -- condiciones de los grupos
```

## group by, having i order by

### group by

GROUP BY clause summaries identical rows into a single/distinct group and returns a single row with the summary for each group, by using appropriate Aggregate function in the SELECT list, like COUNT(), SUM(), MIN(), MAX(), AVG(), etc.

### Having

Si la clàusula WHERE descartava files, la clàusula HAVING descarta grups. És a dir: en la condició de filtrat del HAVING indicarem què ha de complir un grup per a que no siga descartat. No pot haver clàusula HAVING si no hi ha GROUP BY.

### order by

Podem ordenar respecte a qualsevol element de la clàusula SELECT o per qualsevol camp
de la taula del FROM (encara que no estiga en la clàusula SELECT).
Si no s’indica DESC ni ASC, per defecte és ASC.

## Union

Podem “unir” dos o més consultes en una sola. És a dir, a partir del conjunt de resultats d’una SELECT i del conjunt de resultats d’una altra SELECT, podem obtindre un únic conjunt de resultats.

## Consultes compostes o Multitaula

Consultes de dos o més taules. Com que la informació està en 2 taules (o més), haurem de:

- Posar les 2 taules en el **FROM**
- Posar en el **WHERE** com estan relacionades les 2 taules: sol ser una condició sobre la clau aliena.

Ex:

```sql
-- tenim:

POBLES = codi_postal + nom
ALUMNES = num + nom + grup + cp
    C. Ali: cp -> POBLES (codi_postal)

-- Volem fer una consulta on aparega el nom de l’alumne i el nom del poble on viu:

SELECT alumnos.nombre, pueblos.nombre
FROM alumnos, pueblos
WHERE alumnes.cp = pueblos.código_postal;
```

Ex per a més de dos taules:

```sql
ASSIGNATURES = codi + nom
ALUMNES = num + nom + grup + cp
MATRÍCULES = alu + assig + nota
    C. Ali: alu -> ALUMNES(num)
        assig -> ASSIGNATURES(codi)

-- Volem obtindré de cada alumne: el seu nom i el nom de les assignatures on està matriculat.

SELECT alumnes.nom, assignatures.nom
FROM alumnes, assignatures, matricules
WHERE alumnes.num = matricules.alu AND matricules.assig = assignatures.codi;
```

### Join

Hi ha una altra forma de fer les composicions de taules: l’ús de JOIN.

Per exemple, estes dos sentències trauen el mateix resultat:

```sql
SELECT alumnes.*, pobles.nom, pobles.comarca
FROM alumnes, pobles
WHERE alumnes.cp = pobles.cpostal AND alumnes.edat > 17;
```

```sql
SELECT alumnes.*, pobles.nom, pobles.comarca
FROM alumnes JOIN pobles
ON alumnes.cp = pobles.cpostal WHERE alumnes.edat > 17;
```

#### Tipus de joins

<img src="./joins.png">

Problema: El **outer join** (o **full outer join**) no funciona en MySQL (almenys en algunes versions). La solució es fer un UNION de la left i de la right:

```sql
SELECT alumnes.*, pobles.*
FROM alumnes LEFT JOIN pobles
ON alumnes.cp = pobles.cpostal
WHERE edat > 17

UNION

SELECT alumnes.*, pobles.*
FROM alumnes RIGHT JOIN pobles
ON alumnes.cp = pobles.cpostal
WHERE edat > 17
```