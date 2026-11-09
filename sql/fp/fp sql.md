# SQL (MySQL)

Dialecte: MySQL 8. Vegeu també: [Consultes](Queries/Consultes.md), [Subconsultes](Queries/Subconsultes.md), [Vistes](vistes.md), [Transaccions](transaccions.md), [Accés remot i usuaris](../mysql/remote.md).

⚠ En MySQL, els comentaris de línia són `-- ` (dos guions **i un espai**) o `#`. `---text` sense espai no és un comentari.

## Instruccions sobre taules

### Mostrar informació de les taules existents

| Instrucció                     | Descripció                                      |
| ------------------------------ | ----------------------------------------------- |
| `SHOW DATABASES;`              | Mostra les bases de dades                       |
| `USE nom_bd;`                  | Selecciona la BD en ús                          |
| `SHOW TABLES;`                 | Mostra les taules de la BD en ús                |
| `DESCRIBE nom_taula;`          | Mostra els camps d'una taula (o `DESC`)         |
| `SHOW CREATE TABLE nom_taula;` | Mostra el CREATE TABLE de la taula              |
| `SHOW INDEX FROM nom_taula;`   | Mostra els índexs d'una taula                   |

> `EXPLAIN nom_taula` també equival a `DESCRIBE`, però `EXPLAIN SELECT ...` mostra el pla d'execució d'una consulta.

### Crear/modificar/eliminar les taules

| Instrucció                            | Descripció                                     |
| ------------------------------------- | ---------------------------------------------- |
| `CREATE TABLE nom_taula ...`          | Crear una taula                                |
| `CREATE TEMPORARY TABLE nom_taula ...`| Crear una taula temporal (dura fins que es tanca la sessió) |
| `ALTER TABLE nom_taula ...`           | Modificar l'estructura d'una taula, no les dades |
| `DROP TABLE nom_taula;`               | Eliminar una taula                             |
| `TRUNCATE TABLE nom_taula;`           | Buidar una taula (esborra totes les files)     |

Exemple complet:

```sql
CREATE TABLE pobles (
    cp   CHAR(5) PRIMARY KEY,
    nom  VARCHAR(40) NOT NULL
);

CREATE TABLE alumnes (
    codi     INT AUTO_INCREMENT PRIMARY KEY,
    nom      VARCHAR(30) NOT NULL,
    cognoms  VARCHAR(60),
    email    VARCHAR(100) UNIQUE,
    edat     TINYINT UNSIGNED CHECK (edat >= 16),   -- CHECK s'aplica des de MySQL 8.0.16
    poble    CHAR(5),
    alta     DATE DEFAULT (CURRENT_DATE),
    CONSTRAINT fk_alu_poble FOREIGN KEY (poble) REFERENCES pobles (cp)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);
```

## Accions associades a la clau aliena

- `ON DELETE`: què passa amb els registres dependents si s'esborra un registre de la taula referenciada.
- `ON UPDATE`: què passa quan es modifica la clau d'un registre de la taula referenciada.

Estes són les accions que podem fer en un ON DELETE o en un ON UPDATE:

- **CASCADE**: Els registres dependents també s'esborren o es modifiquen.
- **SET NULL**: Els registres dependents es posen a NULL (si no tenien la restricció de NOT NULL, clar).
- **SET DEFAULT**: Els registres dependents es posen al valor per defecte. ⚠ MySQL l'entén, però InnoDB **rebutja** les claus alienes amb SET DEFAULT (sí que funciona en PostgreSQL i SQL Server).
- **RESTRICT**: No deixa esborrar/modificar de la taula pare si té registres dependents.
- **NO ACTION**: En MySQL fa exactament el mateix que RESTRICT. És l'opció per defecte (si no posem ON UPDATE o ON DELETE).

```sql
DELETE FROM pobles WHERE cp = '46410';
-- Amb ON DELETE SET NULL: els alumnes de Sueca queden amb poble = NULL
-- Amb RESTRICT/NO ACTION: error 1451 (Cannot delete or update a parent row)
```

## Accions sobre taules

```sql
-- Eliminar una taula (dades incloses):
DROP TABLE [IF EXISTS] nom_taula;
```

```sql
-- Canviar el nom:
ALTER TABLE nom_antic RENAME TO nom_nou;
RENAME TABLE nom_antic TO nom_nou;            -- equivalent
```

```sql
-- Afegir un camp (columna):
ALTER TABLE taula ADD COLUMN camp INT NOT NULL;
ALTER TABLE taula ADD COLUMN camp VARCHAR(20) NOT NULL FIRST;
ALTER TABLE taula ADD COLUMN camp INT NOT NULL AFTER camp_existent;
```

```sql
-- Eliminar un camp (columna):
ALTER TABLE taula DROP COLUMN camp;
```

```sql
-- Modificar un camp:
ALTER TABLE taula CHANGE COLUMN camp_actual camp_nou INT NOT NULL AFTER camp_existent; -- canvia nom i definició
ALTER TABLE taula MODIFY COLUMN camp VARCHAR(50) NOT NULL;                             -- només la definició
ALTER TABLE taula RENAME COLUMN camp_actual TO camp_nou;                               -- només el nom (MySQL 8)
```

```sql
-- Modificar el valor per defecte:
ALTER TABLE taula ALTER COLUMN camp SET DEFAULT valor;
ALTER TABLE taula ALTER COLUMN camp DROP DEFAULT;
```

```sql
-- Afegir claus o índexs:
ALTER TABLE taula ADD PRIMARY KEY (camps);                     -- 1 o més camps separats per comes
ALTER TABLE taula ADD [CONSTRAINT nom_fk] FOREIGN KEY (camps) REFERENCES taula_pare (camps);
ALTER TABLE taula ADD UNIQUE [nom_index] (camps);              -- clau alternativa
ALTER TABLE taula ADD INDEX [nom_index] (camps);               -- per a recerques més ràpides
```

```sql
-- Esborrar claus o índexs:
ALTER TABLE taula DROP PRIMARY KEY;               -- esborra la clau primària
ALTER TABLE taula DROP FOREIGN KEY nom_clau_ali;  -- esborra la clau aliena (pel nom de la restricció)
ALTER TABLE taula DROP INDEX nom_index;           -- esborra una clau alternativa o un índex
```

> El nom d'una clau aliena creada sense `CONSTRAINT nom` es pot vore amb `SHOW CREATE TABLE`.

## Inserir dades

Usa cometes simples per a les cadenes (`'Pep'`). Les dobles funcionen en MySQL, però no en SQL estàndard (ni en SQL Server/PostgreSQL, ni en MySQL amb `ANSI_QUOTES`).

```sql
-- Inserir una fila indicant quines columnes i en quin ordre es van a posar els valors:
INSERT INTO alumnes (codi, nom) VALUES (25, 'Pep');

-- Inserir una fila sense indicar columnes. S'han d'introduir tots els valors i en l'ordre de les columnes en la taula:
INSERT INTO alumnes VALUES (25, 'Pep', 'Garcia', 'pep@ex.com', 18, '46410', '2024-09-15');

-- Inserir diverses files en una sola sentència:
INSERT INTO alumnes (codi, nom) VALUES
    (25, 'Pep'),
    (26, 'Pepa'),
    (27, 'Pepet');

-- Inserir el resultat d'una consulta:
INSERT INTO alumnes_antics (codi, nom)
SELECT codi, nom FROM alumnes WHERE alta < '2020-01-01';

-- Inserir o, si ja existeix la clau, actualitzar (upsert):
INSERT INTO alumnes (codi, nom) VALUES (25, 'Pep') AS nou    -- àlies: MySQL 8.0.19+
    ON DUPLICATE KEY UPDATE nom = nou.nom;
-- Versions antigues: ... ON DUPLICATE KEY UPDATE nom = VALUES(nom);  (VALUES() està obsolet des de 8.0.20)
```

> `LAST_INSERT_ID()` torna l'últim valor `AUTO_INCREMENT` generat en la sessió (en SQL Server: [OUTPUT / SCOPE_IDENTITY](../Snippets/inserted.md)).

## Esborrar dades

```sql
DELETE FROM alumnes
WHERE codi = 25;
```

⚠ Sense WHERE s'esborren totes les files. Abans d'un DELETE/UPDATE és bona idea executar un `SELECT` amb el mateix WHERE.

## Modificar dades

```sql
UPDATE alumnes
SET nom = 'Josep', poble = '46410'
WHERE nom = 'Pep';
```

## Exportar dades

```sql
-- Guarda les dades de les comarques al fitxer "comarques.txt" del directori "/tmp".
SELECT *
INTO OUTFILE '/tmp/comarques.txt'
FIELDS TERMINATED BY ';' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
FROM comarques;
```

## Importar dades

```sql
LOAD DATA INFILE '/tmp/comarques.txt'
INTO TABLE comarques
FIELDS TERMINATED BY ';' ENCLOSED BY '"'
LINES TERMINATED BY '\n';
-- IGNORE 1 LINES   -> per a saltar la capçalera d'un CSV
```

⚠ El servidor només pot llegir/escriure fitxers en el directori indicat per `secure_file_priv` (`SHOW VARIABLES LIKE 'secure_file_priv';`). Per a llegir un fitxer del client: `LOAD DATA LOCAL INFILE` (requereix `local_infile` activat). Alternativa per a còpies completes: `mysqldump`.

## Consultes simples

- La sentència **SELECT** s'utilitza per a expressar una consulta SQL. Tota sentència SELECT produeix una taula de resultats que conté una o més columnes i zero o més files.
- La clàusula **FROM** especifica les taules que tenen les dades a recuperar en una consulta.
- La clàusula **SELECT** especifica les columnes de dades a incloure en els resultats de la consulta, que poden ser columnes de dades de la BD o columnes calculades.
- La clàusula **WHERE** selecciona les files a incloure en els resultats aplicant una condició de recerca a les files de la taula.
- Una condició de recerca pot seleccionar files mitjançant comparació de valors (`<`, `>`, `=`, `<>`...), mitjançant comparació d'un valor amb un rang (**BETWEEN**) o amb un grup de valors (**IN**), per correspondència amb un patró (**LIKE**) o per comprovació de valors nuls (**IS NULL**).
- Les condicions de recerca simples poden combinar-se mitjançant AND, OR i NOT per a formar condicions de recerca més complexes.
- La clàusula **ORDER BY** especifica que els resultats de la consulta han de ser ordenats en sentit ascendent o descendent, basant-se en els valors d'una o més columnes.
- La clàusula **LIMIT** limita el nombre de files del resultat.
- L'operació **UNION** pot ser utilitzada per a combinar dos o més conjunts de resultats i formar un únic conjunt.

```sql
SELECT nom, edat, edat + 1 AS edat_any_que_ve
FROM alumnes
WHERE edat >= 18
ORDER BY edat DESC
LIMIT 10;
```

### Cadenes

- `'del "marenyet"'` o `"L'Alcúdia"` (o escapant: `'L''Alcúdia'`).

- Funcions sobre cadenes:

  | Funció                            | Resultat                         |
  | --------------------------------- | -------------------------------- |
  | `CHAR_LENGTH('Sueca')`            | `5` (caràcters; `LENGTH` = bytes) |
  | `CONCAT(nom, ' ', cognoms)`       | `'Pep Garcia'`                   |
  | `CONCAT_WS(', ', cognoms, nom)`   | `'Garcia, Pep'`                  |
  | `UPPER('pep')` / `LOWER('PEP')`   | `'PEP'` / `'pep'`                |
  | `SUBSTRING('Alzira', 1, 3)`       | `'Alz'`                          |
  | `TRIM('  hola ')`                 | `'hola'`                         |
  | `REPLACE('1DAM', 'DAM', 'DAW')`   | `'1DAW'`                         |

- Busca de caràcters amb `LIKE`:

El patró és una cadena que pot incloure un o més caràcters comodins:

- `_` (símbol barra baixa) -> qualsevol caràcter (1 i només 1).
- `%` (símbol del percentatge) -> qualsevol seqüència de 0, 1 o més caràcters.

```sql
SELECT nom, cognoms
FROM alumnes
WHERE cognoms LIKE '%Escri_à%';
```

⚠ Si volguérem buscar si apareix el símbol del `%` o el `_` en una cadena de text, caldria utilitzar un caràcter d'escapament, que en MySQL és `\`:

```sql
SELECT * FROM productes WHERE descompte LIKE '%10\%%';   -- conté "10%"
```

### Data i hora

Format de les dates: `'any-mes-dia'` (recomanat, p. ex. `'2024-02-15'`); MySQL també accepta `'2024/02/15'`.

- Funcions de data i hora:

| Funció                                   | Resultat d'exemple           |
| ---------------------------------------- | ---------------------------- |
| `CURRENT_DATE()` / `CURDATE()`           | `2024-02-15`                 |
| `CURRENT_TIME()` / `CURTIME()`           | `10:30:00`                   |
| `CURRENT_TIMESTAMP` / `NOW()`            | `2024-02-15 10:30:00`        |
| `DAY(d)`, `MONTH(d)`, `YEAR(d)`          | `15`, `2`, `2024`            |
| `DAYNAME(d)`                             | `Thursday` (depén de `lc_time_names`) |
| `DATEDIFF('2024-03-01', '2024-02-15')`   | `15` (dies)                  |
| `DATE_ADD(d, INTERVAL 1 MONTH)`          | `2024-03-15`                 |
| `TIMESTAMPDIFF(YEAR, naixement, CURDATE())` | edat en anys              |
| `DATE_FORMAT(d, '%d/%m/%Y')`             | `15/02/2024`                 |

```sql
SELECT data, DAY(data), MONTH(data), YEAR(data), DAYNAME(data)
FROM prestecs;
```

### Duplicats

```sql
SELECT pais, llengua FROM autors;
SELECT DISTINCT pais, llengua FROM autors;
```

⚠ Encara que la clàusula SELECT tinga més d'un camp (com en l'exemple anterior), només es posa un DISTINCT, el qual descartarà les files repetides en tots els camps de la SELECT.

### Rangs

```sql
SELECT codi_soci
FROM prestecs
WHERE data BETWEEN '2013-02-01' AND '2013-02-15';   -- inclou els dos extrems
```

⚠ Si `data` és `DATETIME`, `'2013-02-15'` equival a `'2013-02-15 00:00:00'` i es perd el dia 15. Millor: `data >= '2013-02-01' AND data < '2013-02-16'`.

### Lògica trivaluada

Quan SQL compara els valors de dos expressions, per a una fila determinada es poden produir tres resultats: `TRUE`, `FALSE` o `NULL` (desconegut). Només es seleccionen les files on la condició és `TRUE`.

```sql
SELECT nom FROM alumnes WHERE edat IS NOT NULL;
-- ⚠ edat = NULL o edat <> NULL mai són TRUE: cal usar IS NULL / IS NOT NULL
```

`COALESCE(edat, 0)` (o `IFNULL(edat, 0)`) substitueix els NULL per un valor.

### Condicions compostes: AND, OR i NOT

```sql
SELECT titol_disc, grup
FROM discos
WHERE (tipus = 'rock' OR tipus = 'pop')
  AND NOT (llengua IN ('castellà', 'català', 'anglés'));
```

⚠ AND té prioritat sobre OR: posa parèntesis quan els combines.

### Funcions d'agregat

| Funció                    | Descripció                                        |
| ------------------------- | ------------------------------------------------- |
| `COUNT(*)`                | Compta les files del grup                         |
| `COUNT(camp)`             | Compta les files on `camp` no és NULL             |
| `COUNT(DISTINCT camp)`    | Compta els valors diferents                       |
| `SUM(camp)`, `AVG(camp)`  | Suma i mitjana (ignoren els NULL)                 |
| `MAX(camp)`, `MIN(camp)`  | Màxim i mínim                                     |
| `GROUP_CONCAT(camp ORDER BY camp SEPARATOR ', ')` | Concatena els valors del grup (en SQL Server: `STRING_AGG`) |

### GROUP BY

```sql
SELECT curs, grup, COUNT(*), MIN(edat), MAX(edat)
FROM alumnes
GROUP BY curs, grup;
```

### HAVING

Si la clàusula WHERE descarta files, la clàusula HAVING descarta grups. És a dir: en la condició de filtrat del HAVING indicarem què ha de complir un grup per a no ser descartat.

⚠ Normalment va amb GROUP BY. Sense GROUP BY, tota la taula es considera un únic grup.

```sql
SELECT editorial, MAX(preu), MIN(preu), AVG(preu), SUM(preu), COUNT(*)
FROM llibres
GROUP BY editorial
HAVING COUNT(*) > 1 AND AVG(preu) > 16;
```

### ORDER BY

```sql
SELECT editorial, preu, titol
FROM llibres
ORDER BY editorial DESC, titol ASC;
```

⚠ Si no s'indica DESC ni ASC, per defecte és ASC. Els NULL van primer en ASC (en MySQL).

## Regles per a processament de consultes de taula única

Vegem els passos que segueix el SGBD per a processar una sentència SELECT (ordre lògic, no l'ordre en què s'escriu):

1. **FROM**: selecciona totes les files de la taula que hi ha a la clàusula FROM.
2. **WHERE**: si hi ha clàusula WHERE, aplica la seua condició de recerca a cada fila de la taula. Si per a una fila la condició és TRUE, la selecciona. Però si és FALSE o NULL, la descarta.
3. **GROUP BY**: si hi ha clàusula GROUP BY, classifica en grups les files seleccionades anteriorment (on cada grup té els mateixos valors en els camps del GROUP BY).
4. **HAVING**: si hi ha HAVING, descarta els grups anteriors que no compleixen la condició de recerca del HAVING.
5. **SELECT**: calcula el valor de cada element de la clàusula SELECT per a cada fila seleccionada (o bé, per a cada grup si hi havia GROUP BY).
6. **DISTINCT**: si s'especifica SELECT DISTINCT, elimina les files duplicades dels resultats.
7. **ORDER BY**: si hi ha una clàusula ORDER BY, ordena els resultats de la consulta.
8. **LIMIT**: si hi ha LIMIT, es queda només amb les N primeres files.

> Per això un àlies definit en la SELECT es pot usar en l'ORDER BY, però no en el WHERE.
