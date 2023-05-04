# Auth with Breeze

## Installation

```php
$ composer create-project laravel/laravel example-app
$ cd example-app
> php artisan migrate;

## breeze
$ composer require laravel/breeze --dev
$ php artisan breeze:install


## Install js depencies
$ php artisan migrate
$ npm install && npm run dev
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