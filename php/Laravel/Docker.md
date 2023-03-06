# Docker

## Installation

### 1. Create folders

```bash
$ mkdir mysql src nginx
```

### 2. Add files

Version 1:

```yaml
# docker-compose.yml
version: '3'

networks:
  laravel:
  
services:
  nginx:
    image: nginx:stable-alpine
    container_name: nginx
    depends_on:
      - php
      - mysql
    ports:
      - "8088:80"
    volumes:
      - ./src:/var/www/html
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
    networks:
      - laravel
      
  mysql:
    image: mysql:5.7.22
    container_name: mysql
    restart: unless-stopped
    tty: true
    ports:
      - "3306:3306"
    volumes:
      - ./mysql:/var/lib/mysql
    environment:
      MYSQL_DATABASE: laravel
      MYSQL_USER: root
      MYSQL_PASSWORD: qwert
      MYSQL_ROOT_PASSWORD: qwert
      SERVICE_TAGS: dev
      SERVICE_NAME: mysql
    networks:
      - laravel
      
  php:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: php
    volumes:
      - ./src:/var/www/html
    ports:
      - "9003:9003"
    networks:
      - laravel
```

Version 2: 

```yaml
# docker-compose.yml
version: '3'

networks:
  laravel:
  
services:
  nginx:
    image: nginx:stable-alpine
    container_name: nginx
    depends_on:
      - php
      - mysql
    ports:
      - "8088:80"
    volumes:
      - ./src:/var/www/html
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
    networks:
      - laravel
      
  mysql:
    image: mysql:5.7.22
    container_name: mysql
    restart: unless-stopped
    tty: true
    ports:
      - "3306:3306"
    volumes:
      - ./mysql:/var/lib/mysql
    environment:
      MYSQL_DATABASE: laravel
      MYSQL_USER: root
      MYSQL_PASSWORD: qwert
      MYSQL_ROOT_PASSWORD: qwert
      SERVICE_TAGS: dev
      SERVICE_NAME: mysql
    networks:
      - laravel
      
  php:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: php
    volumes:
      - ./src:/var/www/html
    ports:
      - "9003:9003"
    networks:
      - laravel

composer:
    build:
      context: ./dockerfiles
      dockerfile: composer.dockerfile
      args:
        - UID=${UID:-1000}
        - GID=${GID:-1000}
    container_name: composer
    volumes:
      - ./src:/var/www/html
    working_dir: /var/www/html
    depends_on:
      - php
    user: laravel
    entrypoint: ['composer', '--ignore-platform-reqs']
    networks:
      - laravel

  npm:
    image: node:16.14
    container_name: npm
    volumes:
      - ./src:/var/www/html
    ports:
      - 3000:3000
      - 3001:3001
    working_dir: /var/www/html
    entrypoint: ['npm']
    networks:
      - laravel

  artisan:
    build:
      context: ./dockerfiles
      dockerfile: php.dockerfile
      args:
        - UID=${UID:-1000}
        - GID=${GID:-1000}
    container_name: artisan
    volumes:
      - ./src:/var/www/html:delegated
    depends_on:
      - mysql
    working_dir: /var/www/html
    entrypoint: ['php', '/var/www/html/artisan']
    networks:
      - laravel
```

```yaml
# nginx/default.conf

server {
    listen 80;
    index index.php index.html;
    server_name localhost;
    error_log /var/log/nginx/error.log;
    access_log /var/log/nginx/access.log;
    root /var/www/html/public;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        try_files $uri = 404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass php:9000;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
    }
}
```

```yaml
# Dockerfile

FROM php:8.1-fpm-alpine

RUN docker-php-ext-install pdo pdo_mysql
```

### 3. Build docker

```bash
$ docker-compose up -d --build
```

⚠️ To bring everything down: `docker-compose down`

## Install Laravel

```bash
$ cd /src
$ composer create-project laravel/laravel .
$ sudo chmod o+w ./storage/ -R

# check out localhost:8088
```

### Configure DB

```php
// /scr/.env
DB_HOST=mysql
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=qwert
```

## Run php comands inside the container

```bash
# docker-compose exec <container name> <command>
$ docker-compose exec php php /var/www/html/artisan migrate
```