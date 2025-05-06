# CRUD

## Inserir dades

```sql
--- Inserir una fila indicant quines columnes i en quin ordre es van a posar els valors
INSERT INTO alumnes (codi, nom) VALUES (25, "Pep");

--- S’introduiran tots els valors i en l’ordre en què estan les columnes en la taula:
INSERT INTO alumnes VALUES(25, "Pep");

--- Inserir diverses files en una sola sentència:
INSERT INTO alumnes (codi,nom) VALUES
    (25,"Pep"),
    (26,"Pepa"),
    (27,"Pepet");

--- Insert into Select
INSERT INTO table2 (column1, column2, column3, ...)
SELECT column1, column2, column3, ...
FROM table1
WHERE condition;
```

## Modificar dades

```sql
UPDATE alumnes
SET nom ="Josep", poble =46410
WHERE nom ="Pep";
```

## Esborrar dades

```sql
DELETE FROM alumnes WHERE codi =25;
```
