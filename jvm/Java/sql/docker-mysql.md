# Docker mysql

```sh
# To create mysql docker

mkdir -p /srv/mysql

docker run --name mysql-srv \
            -p 3308:3306 \
            -v /srv/mysql:/var/lib/mysql \
            -e MYSQL_ROOT_PASSWORD="root" \
            -d mysql
```

```sh
# To start docker
docker start mysql-srv

# To connect to database from host
mysql -u root --host=127.0.0.1 --port=3308 -p
```