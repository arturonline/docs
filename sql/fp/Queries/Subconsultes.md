# Subconsultes

Les subconsultes són sentències SELECT que s'utilitzen dins d'una altra sentència (SELECT, INSERT, UPDATE o DELETE), a la qual anomenarem consulta principal. Sempre van entre parèntesis.

Dialecte: MySQL 8 (quasi tot és SQL estàndard). Vegeu també: [Consultes](Consultes.md), [Joins](../../Snippets/Joins.md), [CTE](../../Snippets/CTE.md).

## Taules d'exemple

```sql
CREATE TABLE alumnes (num INT PRIMARY KEY, nom VARCHAR(30), grup VARCHAR(5), edat INT);
CREATE TABLE matricules (alu INT, assig INT, nota DECIMAL(4,2), PRIMARY KEY (alu, assig));

INSERT INTO alumnes VALUES (1, 'Anna', '1DAM', 19), (2, 'Pep', '1DAM', 17),
                           (3, 'Maria', '2DAM', 21), (4, 'Joan', '2DAM', 20);
INSERT INTO matricules VALUES (1, 10, 8), (1, 20, 7), (2, 10, 5), (3, 20, 9);
```

## Subconsulta escalar (torna un sol valor)

Si volem saber l'edat màxima de la taula alumnes faríem:

```sql
SELECT MAX(edat) FROM alumnes;   -- 21
```

Però... i si volem saber el nom d'eixe alumne (el que té la màxima edat)?

```sql
SELECT nom
FROM alumnes
WHERE edat = (SELECT MAX(edat) FROM alumnes);   -- Maria
```

Si, a més, volguérem saber quina és eixa edat, la posarem també a la clàusula SELECT:

```sql
SELECT nom, edat
FROM alumnes
WHERE edat = (SELECT MAX(edat) FROM alumnes);   -- Maria | 21
```

⚠ Si hi ha empat, tornarà diverses files (tots els que tenen l'edat màxima). Això és correcte: la subconsulta torna un sol valor, la principal pot tornar moltes files.

⚠ Amb `=`, `<`, `>`... la subconsulta ha de tornar **una sola fila**; si en torna més, dona error (`Subquery returns more than 1 row`). En eixe cas cal usar `IN`, `ANY` o `ALL`.

```sql
-- Alumnes amb més edat que la mitjana (19.25)
SELECT nom, edat FROM alumnes
WHERE edat > (SELECT AVG(edat) FROM alumnes);   -- Maria 21 | Joan 20
```

## IN / NOT IN (la subconsulta torna una llista)

```sql
-- Alumnes matriculats en l'assignatura 10
SELECT nom FROM alumnes
WHERE num IN (SELECT alu FROM matricules WHERE assig = 10);   -- Anna | Pep
```

⚠ **NOT IN i NULL**: si la subconsulta torna algun `NULL`, `NOT IN` no torna cap fila (la comparació amb NULL és desconeguda). Afegiu `WHERE alu IS NOT NULL` o, millor, useu `NOT EXISTS`.

## EXISTS / NOT EXISTS

Comprova si la subconsulta torna alguna fila. Normalment és **correlacionada** (fa referència a la consulta principal).

```sql
-- Alumnes sense cap matrícula
SELECT nom FROM alumnes a
WHERE NOT EXISTS (SELECT 1 FROM matricules m WHERE m.alu = a.num);   -- Joan
```

## ANY / ALL

```sql
-- Alumnes més majors que TOTS els de 1DAM
SELECT nom FROM alumnes
WHERE edat > ALL (SELECT edat FROM alumnes WHERE grup = '1DAM');   -- Maria | Joan

-- Alumnes més majors que ALGUN de 1DAM (= més majors que el mínim)
SELECT nom FROM alumnes
WHERE edat > ANY (SELECT edat FROM alumnes WHERE grup = '1DAM');   -- Anna | Maria | Joan
```

`= ANY` equival a `IN`; `<> ALL` equival a `NOT IN`.

## Subconsultes correlacionades

La subconsulta usa camps de la consulta principal, i s'avalua (conceptualment) una vegada per fila.

```sql
-- Matrícules amb nota superior a la mitjana d'eixa assignatura
SELECT m.alu, m.assig, m.nota
FROM matricules m
WHERE m.nota > (SELECT AVG(m2.nota) FROM matricules m2 WHERE m2.assig = m.assig);
-- 1 | 10 | 8   (mitjana BD = 6.5)
-- 3 | 20 | 9   (mitjana Programació = 8)
```

## Subconsultes en la SELECT

```sql
SELECT a.nom,
       (SELECT COUNT(*) FROM matricules m WHERE m.alu = a.num) AS n_assig
FROM alumnes a;
-- Anna 2 | Pep 1 | Maria 1 | Joan 0
```

## Subconsultes en el FROM (taules derivades)

El resultat de la subconsulta s'usa com una taula. En MySQL **ha de tindre àlies**.

```sql
SELECT grup, mitjana
FROM (SELECT a.grup, AVG(m.nota) AS mitjana
      FROM alumnes a JOIN matricules m ON m.alu = a.num
      GROUP BY a.grup) AS t
WHERE mitjana > 7;
-- 2DAM | 9 (1DAM té 6.67 i es descarta)
```

En MySQL 8 normalment queda més clar amb un CTE:

```sql
WITH t AS (
    SELECT a.grup, AVG(m.nota) AS mitjana
    FROM alumnes a JOIN matricules m ON m.alu = a.num
    GROUP BY a.grup
)
SELECT grup, mitjana FROM t WHERE mitjana > 7;
```

## Subconsultes en INSERT, UPDATE i DELETE

```sql
-- Copiar files d'una consulta
INSERT INTO alumnes_majors (num, nom)
SELECT num, nom FROM alumnes WHERE edat >= 18;

-- Esborrar matrícules d'alumnes de 2DAM
DELETE FROM matricules
WHERE alu IN (SELECT num FROM alumnes WHERE grup = '2DAM');
```

⚠ En MySQL no es pot modificar una taula i llegir-la en una subconsulta de la mateixa sentència (error 1093: *You can't specify target table ... for update in FROM clause*). Solució: embolicar-la en una taula derivada o usar un JOIN:

```sql
-- Error 1093:
-- UPDATE alumnes SET edat = edat + 1 WHERE edat < (SELECT AVG(edat) FROM alumnes);

-- Correcte:
UPDATE alumnes a
JOIN (SELECT AVG(edat) AS mitjana FROM alumnes) t
SET a.edat = a.edat + 1
WHERE a.edat < t.mitjana;
```
