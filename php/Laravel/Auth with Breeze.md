# Auth with Breeze

## Installation

```php
$ laravel new example-app
$ cd example-app
> mysql create database myDb;

## breeze
$ composer require laravel/breeze --dev
$ php artisan breeze:install

## Bootstrap
composer require laravel/ui
php artisan ui bootstrap
# php artisan ui bootstrap --auth

## Install js depencies
$ npm install && npm run dev
$ php artisan migrate
```

## Add email verification

```php
// go to routes/web.php add 'verified'

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth, 'verified'])->name('dashboard');
```

```diff
// app/Models/User.php

- class User extends Authenticatable
+ class User extends Authenticatable implements MustVerifyEmail
```

## Limitar numero reintentos validación

```diff
app\http\requests\auth\loginrequests.php

// Bajamos de 5 reintentos a 3

- if (! RateLimiter::tooManyAttemps($this->throttlekey(), 5)
+ if (! RateLimiter::tooManyAttemps($this->throttlekey(), 3)
```