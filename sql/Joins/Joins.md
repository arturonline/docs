# Joins

```sql
ASSIGNATURES = codi + nom
    ALUMNES = num + nom + grup + cp 
    MATRÍCULES = alu + assig + nota
        C. Ali: alu à ALUMNES(num)
            assig à ASSIGNATURES(codi)
```

![Joins](joins.png)