# Vistes

## Syntaxis

```sql
CREATE VIEW nom_vista [ (coma llista_nom_col) ]
AS sentència_select
[ WITH CHECK OPTION ];
```

```sql
DROP VIEW nom_vista [ RESTRIC | CASCADE],
```

## Definicio

Una vista es una “finestra” a partir de la qual podem vorer les dades que volem de una taula. Es a dir, una vista es una taula virtual a partir d’una altra, de forma que els canvis d’una es reflectixen en l’altra.

```sql
create view alu_men as
    select codi, nom, grup, edat
    from alumnes
    where edat < 18;
```

Així, amb la “finestra” (vista) anomenada `alu_men`, podrem vore el `codi`, `nom`, `grup` i `edat` dels alumnes de la taula `alumnes` que siguen menors de 18 anys.

>⚠ sempre podrem fer select sobre elles però no sempre un insert/delete/update sobre la vista es podrà traduir a un insert/delete/update sobre la taula (o taules) corresponent. Per exemple, si una vista està definida amb un group by, si intentem fer un update sobre la vista, no hi haurà traducció per a fer update sobre la taula corresponent. En eixe cas es diu que la vista **no és actualitzable**.

## Restriccions: WITH CHECK OPTION

Si en la definició d’una vista actualitzable s'inclou la clàusula **WITH CHECK OPTION**, esta no permetrà inserts o updates que no complisquen les condicions de la vista. Per exemple, si la vista `alu_men` l’haguérem creada amb esta clàusula, les següents instruccions donarien error:

```sql
INSERT INTO alu_men VALUES (100, "Pep", "1DAM", 20);
UPDATE alu_men SET edat = 18 WHERE edat = 17;
```