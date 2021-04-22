# Sql

## Instruccions sobre taules

### Mostrar informació de les taules existents

| Instrucciò                     | Descripciò                                      |
| ------------------------------ | ----------------------------------------------- |
| `SHOW TABLES`                  | Mostra les taules de la BD en ús                |
| `DESCRIBE nom_taula;`          | Mostra els camps d’una taula (o DESC o EXPLAIN) |
| `SHOW CREATE TABLE nom_taula;` | Mostra el CREATE TABLE de la taula              |
| `SHOW INDEX FROM nom_taula;`   | Mostra els índexs d’una taula                   |

### Crear/modificar/eliminar les taules

| Instrucciò                             | Descripciò                                     |
| -------------------------------------- | ---------------------------------------------- |
| `CREATE TABLE nom_taula...`            | Crear una taula                                |
| `CREATE TERMPORARY TABLE nom_taula...` | Crear una taula temporal                       |
| `ALTER TABLE nom_taula...`             | Modificar estructura d’una taula, no les dades |
| `DROP TABLE nom_taula;`                | Eliminar una taula;                            |

## Accions associades a la clau aliena

- `ON DELETE`: Si esborra un registre de la taula referenciada.
- `ON UPDATE`: Quan modifique un registre en la taula referenciada.

Estes són les accions que podem fer en un ON DELETE o en un ON UPDATE:

- **CASCADE**: Els registres dependents també s’esborren o es modifiquen.
- **SET NULL**: Els registres dependents es posen a null (si no tenien la restricció de NOT NULL, clar).
- **SET DEFAULT**: Els registres dependents es posen al valor per defecte (si el tenien, clar). El motor InnoDB ho accepta, però sense cap efecte.
- **RESTRICT**: No deixa esborrar/modificar de la taula pare si té registres dependents. És l’opció per defecte (si no posem ON UPDATE o ON DELETE).
- **NO ACTION**: En MySQL fa exactament el mateix que RESTRICT.

## Accions sobre taules

```sql
-- Eliminar una taula:
DROP TABLE [IF EXISTS] nom_taula; -- Elimina una taula, dades incloses
```

```sql
-- Canviar el nom:
ALTER TABLE nom_antic RENAME TO nom_nou;
```

```sql
-- Afegir un camp (columna):
ALTER TABLE taula ADD COLUMN camp INT NOT NULL;
ALTER TABLE taula ADD COLUMN camp VARCHAR (20) NOT NULL FIRST;
ALTER TABLE taula ADD COLUMN camp INT NOT NULL AFTER camp_existent;
```

```sql
-- Eliminar un camp (columna):
ALTER TABLE taula DROP COLUMN camp;
```

```sql
-- Modificar un camp:
ALTER TABLE taula CHANGE COLUMN camp_actual  camp_nou INT NOT NULL AFTER camp_exi;
```

```sql
-- Modificar el valor per defecte:
ALTER TABLE taula ALTER COLUMN camp [SET DEFAULT valor | DROP DEFAULT];
```

```sql
-- Afegir claus o índexs:
ALTER TABLE taula ADD PRIMARY KEY (camps); -- 1 o més camps separats per comes.
ALTER TABLE taula ADD FOREIGN KEY (camps) REFERENCES taula_pare (camps);
ALTER TABLE taula ADD UNIQUE [nom_index ] (camps); -- Clau alternativa.
ALTER TABLE taula ADD INDEX [nom_index] (camps); -- Per a recerques més ràpides.
```

```sql
-- Esborrar claus o índexos:
ALTER TABLE taula DROP PRIMARY KEY; -- Esborra clau primària.
ALTER TABLE taula DROP FOREIGN KEY nom_clau_ali; -- Esborra clau aliena.
ALTER TABLE taula DROP INDEX nom_index; -- Esborra clau alternativa o índex.
```

## Inserir dades

```sql
-- Inserir una fila indicant quines columnes i en quin ordre es van a posar els valors
INSERT INTO alumnes (codi, nom) VALUES (25, "Pep");

-- Inserir una fila sense indicar columnes. S’introduiran tots els valors i en l’ordre en què estan les columnes en la taula:
INSERT INTO alumnes VALUES(25, "Pep");

-- Inserir diverses files en una sola sentència:
INSERT INTO alumnes (codi,nom) VALUES
    (25,"Pep"),
    (26,"Pepa"),
    (27,"Pepet");

-- Inserir diverses files a partir d’un fitxer (per defecte, en la carpeta de la BD):
LOAD DATA IN FILE 'fitxer_alumnes.txt' INTO TABLE alumnes;
```

## Esborrar dades

```sql
DELETE FROM alumnes
        WHERE codi =25;
```

## Modificar dades

```sql
UPDATE alumnes
SET nom ="Josep", poble =46410
WHERE nom ="Pep";
```

## Exportar dades

```sql
-- 16)	 Guarda les dades de les comarques al fitxer "comarques.txt”
-- del directori "/tmp".
select *
into outfile '/tmp/comarques.txt'
from comarques;
```

## Importar dades

```sql
load data infile '/tmp/comarques.txt'
into table comarques;
```

## Consultes Simples

- La sentència **SELECT** s'utilitza per a expressar una consulta SQL. Tota sentència SELECT produïx una taula de resultats que conté una o més columnes i zero o més files.
- La clàusula FROM especifica les taules que tenen les dades a recuperar en una consulta.
- La clàusula **SELECT** especifica les columnes de dades a incloure en els resultats de la consulta, que poden ser columnes de dades de la BD o columnes calculades.
- La clàusula **WHERE** selecciona les files a incloure en els resultats aplicant una condició de recerca a les files de la taula.
- Una condició de recerca pot seleccionar files mitjançant comparació de valors(<, >, = ...), mitjançant comparació de valor amb un rang (**BETWEEN**) o un grup de valors (IN), per correspondència amb un patró de columna (**LIKE**) o per comprovació de valors nuls (IS NULL).
- Les condicions de recerca simples poden combinar-se mitjançant AND, OR i NOT per a formar condicions de recerca més complexes.
- La clàusula **ORDER BY** especifica que els resultats de la consulta han de ser ordenats en sentit ascendent o descendent, basant-se en els valors d'una o més columnes.
- L'operació **UNION** pot ser utilitzada dins d'una sentència SELECT per a combinar dos o més conjunts de resultats i formar un únic conjunt.

### Cadenes

- `'del "marenyet"'` o `"L'Alcúdia"`

- Funcions sobre cadenes:

  - `char_length(nom)`
  - `concat(nom)`
  - `upper(nom)`
  - `lower(nom)`

- Busqueda de caracters amb `LIKE`:

El patró és una cadena que pot incloure un o més caràcters comodins:

- `_` (símbol barra baixa) -> qualsevol caràcter (1 i només 1).
- `%` (símbol del percentatge) -> qualsevol seqüència de 0, 1 o més caràcters.

```sql
SELECT nom, cognoms
FROM alumnes
WHERE cognoms LIKE '%Escri_à%';
```

⚠ Si volguérem buscar si apareix el símbol del `%` o el `_` en una cadena de text, caldria utilitzar un caràcter d’escapament, que en MySQL és “`\`”.

### Data i hora

`any/mes/dia` o `any-mes-dia` o `any:mes:dia`

- Funcions de data i hora:

`current_date()` `current_time()` y `current_timestamp`

- Obtindre anys, mesos, dies i dia de la semana.
  `SELECT data, DAY(data), MONTH(data), YEAR(data), DAYNAME(data)`

### Duplicats

- `select país, llengua from autors;`
- `select distinct pais, llengua from autors;`

⚠ Encara que la clàusula SELECT tinga més d’un camp (com en l’exemple anterior), només es posa un DISTINCT, el qual descartarà les files repetides en tots els camps de la SELECT.

### Rangos

```sql
SELECT codi_soci
FROM prestecs
WHERE data BETWEEN "2013/02/01" AND "2013/02/15";
```

### Logica trivaluada

Quan SQL compara els valors de dos expressions en el test de comparació, per a una fila determinada, es poden produir tres resultats: `TRUE`, `FALSE` o `NULL`.

```sql
SELECT nom FROM alumnes WHERE edat IS NOT NULL;
```

### Condicions compostes: AND, OR i NOT

```sql
SELECT títol_disc, grup
FROM discos
WHERE (tipus ='rock'ORtipus ='pop')
   AND NOT (llengua IN('castellà', 'català', 'anglés'));
```

### Funcions d'agregat

- max(valor)
- min(valor)
- count(\*) conta les files del grup
- avg(valor)

### Group by

```sql
SELECT curso,grupo, count(*), min(edad), max(edad)
FROM ALUMNOS GROUP BY curso, grupo;
```

### Having

Si la clàusula WHERE descartava files, la clàusula HAVING descarta grups. És a dir: en la condició de filtrat del HAVING indicarem què ha de complir un grup per a que no siga descartat.

⚠ No pot haver clàusula HAVING si no hi ha GROUP BY.

```sql
SELECT editorial, MAX(preu), MIN(preu), AVG(preu), SUM(preu), COUNT(*)
FROM llibres
GROUP BY editorial
HAVING(COUNT(*) >1) AND (AVG(preu) >16);
```

### Order By

```sql
SELECT editorial, preu, titol
FROM llibre ORDER BY editorial DESC, titol ASC;
```

⚠ Si no s’indica DESC ni ASC, per defecte és ASC

## Regles per a processament de consultes de taula única

Veiem els passos que segueix el SGBD per a processar una sentència SELECT:

1. Seleccionarà totes les files de la taula que hi ha a la clàusula FROM.
2. Si hi ha clàusula WHERE, aplicaràla seua condició de recerca a cada fila de la taula. Si per a una fila la condició de recerca és TRUE, la seleccionarà. Però si és FALSE o NULL, la descartarà.
3. Si hi ha clàusula GROUP BY, les files seleccionadesanteriorment les classificaen grups (on cada grup té els mateixos valors en els camps del GROUP BY).
4. Si hi ha HAVING, descartaelsgrupsanteriors que no compleixen la condició de recerca del HAVING.
5. Calcula el valor de cada element de la clàusula SELECT per a cada fila seleccionada(o bé, per a cada grup si hi haviaGROUP BY).
6. Si s'especifica SELECT DISTINCT, elimina les files duplicades dels resultats que s'hagueren produït.
7. Si hi ha una clàusula ORDER BY, ordena els resultats de la consulta.
