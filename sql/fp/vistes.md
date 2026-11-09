# Vistes

Dialecte: MySQL 8. Vegeu també: [Consultes](Queries/Consultes.md), [Subconsultes](Queries/Subconsultes.md).

## Definició

Una vista és una "finestra" a partir de la qual podem vore les dades que volem d'una o diverses taules. És a dir, una vista és una **taula virtual** definida per una consulta: no guarda dades pròpies, sinó que cada vegada que la consultem s'executa la SELECT sobre les taules base. Per això els canvis en les taules es reflecteixen en la vista (i, si la vista és actualitzable, els canvis fets a través de la vista es reflecteixen en la taula).

Usos habituals:

- Simplificar consultes complexes (joins, càlculs) que s'usen sovint.
- Seguretat: donar permís sobre la vista i no sobre la taula, per a amagar files o columnes.
- Mantindre la compatibilitat si canvia l'estructura de les taules.

## Sintaxi

```sql
CREATE [OR REPLACE] VIEW nom_vista [(llista_noms_columnes)]
AS sentència_select
[WITH [CASCADED | LOCAL] CHECK OPTION];
```

```sql
ALTER VIEW nom_vista AS sentència_select;       -- redefinir-la
DROP VIEW [IF EXISTS] nom_vista [RESTRICT | CASCADE];
```

> En MySQL, `RESTRICT` i `CASCADE` en el `DROP VIEW` s'accepten però no fan res. En PostgreSQL sí: `CASCADE` esborra també els objectes que depenen de la vista.

```sql
SHOW CREATE VIEW nom_vista;                     -- veure la definició
SHOW FULL TABLES WHERE Table_type = 'VIEW';     -- llistar les vistes de la BD
```

## Exemple

```sql
CREATE TABLE alumnes (codi INT PRIMARY KEY, nom VARCHAR(30), grup VARCHAR(5), edat INT);
INSERT INTO alumnes VALUES (1, 'Anna', '1DAM', 19), (2, 'Pep', '1DAM', 17),
                           (3, 'Maria', '2DAM', 16), (4, 'Joan', '2DAM', 20);

CREATE VIEW alu_men AS
    SELECT codi, nom, grup, edat
    FROM alumnes
    WHERE edat < 18;

SELECT * FROM alu_men;
```

| codi | nom   | grup | edat |
| ---- | ----- | ---- | ---- |
| 2    | Pep   | 1DAM | 17   |
| 3    | Maria | 2DAM | 16   |

Així, amb la "finestra" (vista) anomenada `alu_men`, podrem vore el `codi`, `nom`, `grup` i `edat` dels alumnes de la taula `alumnes` que siguen menors de 18 anys.

Vista amb join i noms de columna propis:

```sql
CREATE OR REPLACE VIEW notes_alumnes (alumne, assignatura, nota) AS
    SELECT a.nom, s.nom, m.nota
    FROM alumnes a
    JOIN matricules m   ON m.alu = a.codi
    JOIN assignatures s ON s.codi = m.assig;

SELECT * FROM notes_alumnes WHERE nota >= 5;   -- s'usa com una taula
```

## Vistes actualitzables

⚠ Sempre podrem fer SELECT sobre una vista, però no sempre un INSERT/UPDATE/DELETE sobre la vista es podrà traduir a un INSERT/UPDATE/DELETE sobre la taula (o taules) corresponent. En eixe cas es diu que la vista **no és actualitzable**.

Una vista **no** és actualitzable si conté, entre altres:

- Funcions d'agregat (`SUM`, `COUNT`...), `GROUP BY` o `HAVING`.
- `DISTINCT`.
- `UNION` / `UNION ALL`.
- Subconsultes en la SELECT, o certs tipus de join.
- Columnes calculades (eixes columnes concretes no es poden modificar).

Per a fer un INSERT, a més, la vista ha d'incloure totes les columnes de la taula que no tenen valor per defecte.

```sql
UPDATE alu_men SET grup = '1ASIX' WHERE codi = 2;   -- OK: modifica la taula alumnes
```

## Restriccions: WITH CHECK OPTION

Si en la definició d'una vista actualitzable s'inclou la clàusula **WITH CHECK OPTION**, esta no permetrà inserts o updates que deixen files que no complisquen la condició (WHERE) de la vista, és a dir, files que "desapareixerien" de la vista.

```sql
CREATE OR REPLACE VIEW alu_men AS
    SELECT codi, nom, grup, edat
    FROM alumnes
    WHERE edat < 18
WITH CHECK OPTION;

-- Estes instruccions donen error (CHECK OPTION failed 'alu_men'):
INSERT INTO alu_men VALUES (100, 'Pep', '1DAM', 20);
UPDATE alu_men SET edat = 18 WHERE edat = 17;

-- Esta sí que funciona:
INSERT INTO alu_men VALUES (101, 'Pepa', '1DAM', 16);
```

Sense `WITH CHECK OPTION`, l'INSERT de l'alumne de 20 anys funcionaria, però la fila no es veuria després en la vista.

- `CASCADED` (per defecte): comprova també les condicions de les vistes sobre les quals està definida.
- `LOCAL`: només comprova la condició de la vista actual (i les vistes base que tinguen la seua pròpia CHECK OPTION).

> Vistes materialitzades (que sí guarden el resultat i es refresquen): existeixen en PostgreSQL i Oracle (`CREATE MATERIALIZED VIEW`); en SQL Server hi ha les *indexed views*. MySQL no en té.
