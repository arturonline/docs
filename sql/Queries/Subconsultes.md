# Subconsultes

Les subconsultes són sentències SELECT que s'utilitzen dins d'una altra sentència SELECT, a la qual anomenarem consulta principal.

Si volem saber l’edat màxima de la taula alumnes faríem:

```sql
SELECT max(edat) FROM alumnes;
```

Però... i si volem saber el nom d’eixe alumne (el que té la màxima edat)?

```sql
SELECT nom
FROM alumnes
WHERE edat = (SELECT max(edat) FROM alumnes);
```

Si, a més, volguérem saber quina és eixa edat, la posarem també a la clàusula select:

```sql
SELECT nom, edat
FROM alumnes
WHERE edat = ( SELECT max(edat) FROM alumnes );
```