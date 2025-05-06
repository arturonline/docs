# Aceptar conexiones remotas

```sql
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '1234567a+' WITH GRANT OPTION;
```

## Listar Usuarios

```sql
select user, host from mysql.user;
```