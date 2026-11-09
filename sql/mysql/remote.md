# Aceptar conexiones remotas (MySQL 8)

Para conectar desde otra máquina hacen falta 4 cosas:

1. Que el servidor escuche en la red (`bind-address`).
2. Un usuario cuyo `host` permita la IP del cliente (`'usuario'@'host'`).
3. Permisos (`GRANT`) para ese usuario.
4. El puerto (3306 por defecto) abierto en el firewall.

Ver también: [Resumen SQL MySQL](../fp/fp%20sql.md).

## 1. bind-address

Por defecto MySQL escucha solo en `127.0.0.1` (localhost). Editar la configuración:

| Sistema        | Fichero                                                  |
| -------------- | -------------------------------------------------------- |
| Debian/Ubuntu  | `/etc/mysql/mysql.conf.d/mysqld.cnf`                     |
| RHEL/otros     | `/etc/my.cnf` o `/etc/my.cnf.d/*.cnf`                    |
| Windows        | `C:\ProgramData\MySQL\MySQL Server 8.0\my.ini`           |
| MariaDB (Deb.) | `/etc/mysql/mariadb.conf.d/50-server.cnf`                |

```ini
[mysqld]
bind-address = 0.0.0.0              # todas las interfaces IPv4
# bind-address = 192.168.1.10       # solo esa IP
# bind-address = 127.0.0.1,192.168.1.10   # varias (MySQL 8.0.13+)
# skip-networking                   # si está activo, quitarlo (desactiva TCP)
```

Reiniciar y comprobar que escucha:

```bash
sudo systemctl restart mysql        # o mysqld / mariadb
sudo ss -tlnp | grep 3306           # debe mostrar 0.0.0.0:3306 (o la IP elegida)
```

```powershell
Restart-Service MySQL80
Get-NetTCPConnection -LocalPort 3306 -State Listen
```

```sql
SHOW VARIABLES LIKE 'bind_address';
SHOW VARIABLES LIKE 'port';
```

## 2 y 3. Usuario y permisos

Un usuario MySQL se identifica por **nombre + host**: `'app'@'localhost'` y `'app'@'%'` son usuarios distintos, con contraseñas y permisos distintos.

| Host            | Significado                                |
| --------------- | ------------------------------------------ |
| `'localhost'`   | Solo conexiones locales (socket/127.0.0.1) |
| `'192.168.1.50'`| Solo desde esa IP                          |
| `'192.168.1.%'` | Desde cualquier IP de esa red              |
| `'%'`           | Desde cualquier host                       |

En MySQL 8 primero se crea el usuario y después se dan permisos. **`GRANT ... IDENTIFIED BY` ya no existe** (daba error desde 8.0):

```sql
-- Antiguo (MySQL 5.7, ya NO funciona en 8.0):
-- GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '1234567a+' WITH GRANT OPTION;

-- MySQL 8:
CREATE USER 'app'@'192.168.1.%' IDENTIFIED BY 'Una-Contraseña-Segura1';
GRANT SELECT, INSERT, UPDATE, DELETE ON mi_bd.* TO 'app'@'192.168.1.%';

-- Administrador remoto (evitar root@'%'; mejor un usuario propio y red limitada):
CREATE USER 'admin'@'192.168.1.%' IDENTIFIED BY 'Otra-Contraseña-Segura1';
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'192.168.1.%' WITH GRANT OPTION;
```

> Con `CREATE USER` / `GRANT` no hace falta `FLUSH PRIVILEGES` (solo si se modifican las tablas `mysql.*` a mano).

### Niveles de GRANT

```sql
GRANT ALL ON *.* TO ...;              -- todo el servidor
GRANT ALL ON mi_bd.* TO ...;          -- una base de datos
GRANT SELECT ON mi_bd.clientes TO ...;-- una tabla
GRANT SELECT (id, nombre) ON mi_bd.clientes TO ...;  -- columnas
GRANT EXECUTE ON PROCEDURE mi_bd.mi_proc TO ...;
```

## Listar usuarios y permisos

```sql
SELECT user, host, plugin FROM mysql.user;
SHOW GRANTS FOR 'app'@'192.168.1.%';
SELECT CURRENT_USER();                -- con qué usuario@host te ha identificado el servidor
```

## Gestionar usuarios

```sql
ALTER USER 'app'@'192.168.1.%' IDENTIFIED BY 'NuevaContraseña1';
RENAME USER 'app'@'192.168.1.%' TO 'app'@'10.0.0.%';
REVOKE DELETE ON mi_bd.* FROM 'app'@'10.0.0.%';
DROP USER IF EXISTS 'app'@'10.0.0.%';
```

### Plugin de autenticación

MySQL 8 usa `caching_sha2_password` por defecto. Clientes/conectores antiguos fallan con *Authentication plugin 'caching_sha2_password' cannot be loaded*. Lo correcto es actualizar el conector; como apaño temporal:

```sql
ALTER USER 'app'@'192.168.1.%' IDENTIFIED WITH mysql_native_password BY 'Contraseña1';
```

⚠ `mysql_native_password` está obsoleto: desactivado por defecto en MySQL 8.4 y eliminado en 9.0.

## 4. Firewall

```bash
# Ubuntu (ufw): solo desde la red local
sudo ufw allow from 192.168.1.0/24 to any port 3306 proto tcp

# RHEL/CentOS (firewalld)
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="192.168.1.0/24" port port="3306" protocol="tcp" accept'
sudo firewall-cmd --reload
```

```powershell
# Windows
New-NetFirewallRule -DisplayName "MySQL 3306" -Direction Inbound -Protocol TCP -LocalPort 3306 -RemoteAddress 192.168.1.0/24 -Action Allow
```

En la nube (AWS, Azure...) además hay que abrir el puerto en el *security group* / NSG. En Docker: publicar el puerto (`-p 3306:3306`).

## Conectar desde el cliente

```bash
mysql -h 192.168.1.10 -P 3306 -u app -p mi_bd
```

```powershell
Test-NetConnection 192.168.1.10 -Port 3306     # comprobar que el puerto es alcanzable
```

Cadenas de conexión:

```text
# .NET (MySqlConnector / MySql.Data)
Server=192.168.1.10;Port=3306;Database=mi_bd;User ID=app;Password=...;SslMode=Required;

# JDBC
jdbc:mysql://192.168.1.10:3306/mi_bd?user=app&password=...&sslMode=REQUIRED

# URI (Python SQLAlchemy, Node, etc.)
mysql://app:password@192.168.1.10:3306/mi_bd
```

## Errores típicos

| Error                                                          | Causa probable                                               |
| -------------------------------------------------------------- | ------------------------------------------------------------ |
| `ERROR 2003 (HY000): Can't connect to MySQL server` / timeout  | `bind-address`, servicio parado o firewall                   |
| `ERROR 1130: Host 'x.x.x.x' is not allowed to connect`         | No existe usuario con un `host` que encaje con esa IP        |
| `ERROR 1045: Access denied for user 'app'@'x.x.x.x'`           | Contraseña incorrecta, o encaja con otro usuario@host        |

> Alternativa más segura a abrir el puerto: dejar `bind-address = 127.0.0.1` y conectar por túnel SSH: `ssh -L 3307:127.0.0.1:3306 usuario@servidor` y luego `mysql -h 127.0.0.1 -P 3307 -u app -p`. En este caso el servidor ve la conexión como local, así que el usuario debe ser `'app'@'localhost'` / `'app'@'127.0.0.1'`.
