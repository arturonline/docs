# Laravel

Laravel 12 (requires PHP 8.2+). Official docs: <https://laravel.com/docs/12.x>

## Index

| Topic | File |
|-------|------|
| Quick start: migrations, models, controllers, seeders, views | [new/laravel.md](new/laravel.md) |
| Blade templates | [Blade.md](Blade.md) |
| Blade components | [Components.md](Components.md) |
| Authentication (starter kits / Breeze) | [Auth with Breeze.md](Auth%20with%20Breeze.md) |
| Authorization: Gates & Policies | [Policies.md](Policies.md) |
| Roles | [new/roles.md](new/roles.md) |
| REST API with Sanctum | [Api/api.md](Api/api.md) |
| Ajax / fetch | [Ajax.md](Ajax.md) |
| Existing (legacy) database | [new/existing database.md](new/existing%20database.md) |
| Language selector | [new/language.md](new/language.md) |
| Settings stored in the DB | [Load config from DB.md](Load%20config%20from%20DB.md) |
| Docker / Sail | [Docker.md](Docker.md) |

## Installation

### 1. PHP + Composer + Laravel installer

```bash
# All-in-one (PHP, Composer and the laravel installer): https://php.new
/bin/bash -c "$(curl -fsSL https://php.new/install/linux/8.4)"   # Linux
/bin/bash -c "$(curl -fsSL https://php.new/install/mac/8.4)"     # macOS
# Windows: Laravel Herd (https://herd.laravel.com) or php.new for PowerShell

# If PHP and Composer are already installed
composer global require laravel/installer
```

> ⚠️ Make sure Composer's global vendor bin directory is in your `$PATH` so the `laravel` executable can be found:
> Linux `$HOME/.config/composer/vendor/bin`, macOS `$HOME/.composer/vendor/bin`, Windows `%APPDATA%\Composer\vendor\bin`.

### 2. Create the app

```bash
laravel new example-app
# Asks for: starter kit (None, React, Vue, Livewire), auth provider,
# testing framework (Pest / PHPUnit), database (SQLite by default) and runs npm install

cd example-app
composer run dev        # php artisan serve + queue:listen + pail (logs) + npm run dev (Vite)
# -> http://localhost:8000
```

Without the installer:

```bash
composer create-project laravel/laravel example-app
cd example-app
php artisan migrate     # SQLite: database/database.sqlite is created automatically
php artisan serve
```

### 3. Alternative: Docker with Sail

```bash
curl -s "https://laravel.build/example-app?with=mysql,redis" | bash
cd example-app
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate   # run artisan INSIDE the container, not `php artisan`
```

More in [Docker.md](Docker.md).

## Directory structure (Laravel 11+)

```text
app/
  Http/Controllers/     controllers
  Models/               Eloquent models
  Providers/            AppServiceProvider (register gates, singletons, etc.)
bootstrap/app.php       routing, middleware and exception handling (no Kernel.php)
bootstrap/providers.php registered service providers
config/                 configuration (reads values from .env)
database/               migrations, factories, seeders, database.sqlite
lang/                   translations (after `php artisan lang:publish`)
public/                 web root (index.php, build/ from Vite)
resources/              views (Blade), css, js
routes/                 web.php, console.php (+ api.php after `install:api`)
storage/                logs, cache, uploaded files
tests/                  Feature and Unit tests (Pest or PHPUnit)
```

## Request flow in 30 seconds

```php
// routes/web.php
use App\Http\Controllers\PostController;

Route::get('/', fn () => view('welcome'));
Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');
```

```php
// app/Http/Controllers/PostController.php
namespace App\Http\Controllers;

use App\Models\Post;

class PostController extends Controller
{
    public function show(Post $post)   // route model binding: 404 if not found
    {
        return view('posts.show', ['post' => $post]);
    }
}
```

```blade
{{-- resources/views/posts/show.blade.php --}}
<h1>{{ $post->title }}</h1>
<a href="{{ route('posts.show', $post) }}">Permalink</a>
```

## Useful artisan commands

```bash
php artisan list                 # all commands
php artisan route:list           # registered routes (--path=api, -v for middleware)
php artisan make:model Post -mfsc   # model + migration + factory + seeder + controller
php artisan migrate              # run pending migrations
php artisan tinker               # REPL: App\Models\User::count()
php artisan about                # environment, drivers, cache status
php artisan optimize             # cache config/routes/views (production)
php artisan optimize:clear       # clear all those caches
php artisan test                 # run Pest / PHPUnit tests
```
