# Docker mysql

```sh
# To create mysql docker

mkdir -p /srv/mysql

docker run --name mysql-srv -p 3308:3306 -v "C:\Users\artur\OneDrive\dev\docker\srv\mysql" -e MYSQL_ROOT_PASSWORD="root" -d mysql: mysqld --default-authentication-plugin=mysql_native_password
```

```sh
# To start docker
docker start mysql-srv

# To connect to database from host
mysql -u root --host=127.0.0.1 --port=3308 -p
```