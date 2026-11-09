# Docker

Two options:

1. **Laravel Sail**: official, zero config, ideal for development.
2. **Custom compose** (php-fpm + nginx + MySQL): full control, closer to production.

> Use Docker Compose v2 (`docker compose ...`, not `docker-compose`). The top-level `version:` key is obsolete and must be removed from compose files.

## Option 1: Laravel Sail

```bash
# New project with MySQL and Redis (also: pgsql, mariadb, redis, valkey, meilisearch, mailpit, selenium...)
curl -s "https://laravel.build/example-app?with=mysql,redis,mailpit" | bash
cd example-app

# Existing project
composer require laravel/sail --dev
php artisan sail:install          # choose services, generates compose.yaml and updates .env

./vendor/bin/sail up -d           # start (http://localhost)
./vendor/bin/sail down            # stop
```

Commands run inside the container:

```bash
./vendor/bin/sail artisan migrate
./vendor/bin/sail composer require laravel/telescope
./vendor/bin/sail npm run dev
./vendor/bin/sail test
./vendor/bin/sail shell           # bash in the app container
./vendor/bin/sail mysql           # MySQL CLI

# Alias (~/.bashrc)
alias sail='sh $([ -f sail ] && echo sail || echo vendor/bin/sail)'
```

Mailpit UI: <http://localhost:8025>. Customize the Dockerfiles with `php artisan sail:publish`.

## Option 2: php-fpm + nginx + MySQL

### 1. Create folders

```bash
mkdir src nginx
# src/   -> Laravel code
# nginx/ -> nginx config
```

```text
.
├── compose.yaml
├── Dockerfile
├── nginx/default.conf
└── src/
```

### 2. Add files

```yaml
# compose.yaml
services:
  nginx:
    image: nginx:stable-alpine
    depends_on:
      - php
    ports:
      - "8088:80"
    volumes:
      - ./src:/var/www/html
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro

  php:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        UID: ${UID:-1000}
        GID: ${GID:-1000}
    volumes:
      - ./src:/var/www/html
    depends_on:
      mysql:
        condition: service_healthy

  mysql:
    image: mysql:8.4
    restart: unless-stopped
    ports:
      - "3306:3306"
    environment:
      MYSQL_DATABASE: laravel
      MYSQL_USER: laravel          # must NOT be root
      MYSQL_PASSWORD: secret
      MYSQL_ROOT_PASSWORD: rootsecret
    volumes:
      - mysql-data:/var/lib/mysql  # named volume (no permission issues)
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 5s
      retries: 10

  # Utility containers: only run on demand (docker compose run --rm ...)
  composer:
    image: composer:2
    profiles: [tools]
    volumes:
      - ./src:/var/www/html
    working_dir: /var/www/html
    user: "${UID:-1000}:${GID:-1000}"
    entrypoint: ["composer", "--ignore-platform-reqs"]

  artisan:
    build: .
    profiles: [tools]
    volumes:
      - ./src:/var/www/html
    depends_on:
      - mysql
    working_dir: /var/www/html
    entrypoint: ["php", "/var/www/html/artisan"]

  npm:
    image: node:22-alpine
    profiles: [tools]
    volumes:
      - ./src:/var/www/html
    ports:
      - "5173:5173"                # Vite dev server
    working_dir: /var/www/html
    entrypoint: ["npm"]

volumes:
  mysql-data:
```

```nginx
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
        try_files $uri =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass php:9000;          # service name : php-fpm port
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
    }

    location ~ /\.(?!well-known) {
        deny all;
    }
}
```

```dockerfile
# Dockerfile
FROM php:8.4-fpm-alpine

# Extensions needed by Laravel + MySQL
RUN apk add --no-cache icu-dev libzip-dev \
    && docker-php-ext-install pdo_mysql intl zip bcmath opcache

# Composer inside the image (optional, handy for `docker compose exec php composer ...`)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Run php-fpm with the host user id to avoid permission problems on ./src
ARG UID=1000
ARG GID=1000
RUN apk add --no-cache shadow \
    && usermod -u ${UID} www-data && groupmod -g ${GID} www-data

WORKDIR /var/www/html
```

> Xdebug: add `RUN apk add --no-cache $PHPIZE_DEPS linux-headers && pecl install xdebug && docker-php-ext-enable xdebug`. Xdebug 3 connects *from* the container to your IDE on port 9003, so no port has to be published.

### 3. Build docker

```bash
docker compose up -d --build
docker compose ps             # check services are running/healthy
```

⚠️ To bring everything down: `docker compose down` (add `-v` to also delete the MySQL volume).

## Install Laravel

```bash
# src/ must be empty
docker compose run --rm composer create-project laravel/laravel .

# check out http://localhost:8088
```

If you get *"The stream or file storage/logs/laravel.log could not be opened"*:

```bash
docker compose exec php chown -R www-data:www-data storage bootstrap/cache
```

### Configure DB

Laravel 12 uses SQLite by default; switch to MySQL:

```ini
# src/.env
DB_CONNECTION=mysql
DB_HOST=mysql          # service name in compose.yaml
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=secret
```

```bash
docker compose run --rm artisan migrate
#   INFO  Running migrations.
#   0001_01_01_000000_create_users_table ........ 12.34ms DONE
```

## Run php commands inside the container

```bash
# docker compose exec <service> <command>      (container must be running)
docker compose exec php php artisan migrate
docker compose exec php sh                      # shell

# docker compose run --rm <service> <args>     (one-off container, tools profile)
docker compose run --rm artisan make:model Post -m
docker compose run --rm composer require laravel/sanctum
docker compose run --rm npm install
docker compose run --rm npm run build           # compiled assets in public/build
```

> For `npm run dev` (Vite HMR) inside Docker, Vite must listen on all interfaces: in `vite.config.js` add `server: { host: '0.0.0.0', hmr: { host: 'localhost' } }` and run `docker compose run --rm --service-ports npm run dev`.
