# language selector with session persistence

The selected language is stored in the session. A middleware checks that the language is among the supported ones; otherwise it uses the default language.

Related: [laravel.md › Localización](laravel.md#localización), [Blade.md](../Blade.md).

## Install language package

Translations of the framework/validation messages for many languages:

```bash
composer require laravel-lang/common --dev
php artisan lang:add es
php artisan lang:add en
php artisan lang:update
# creates lang/es.json, lang/es/validation.php, lang/es/auth.php ...
```

## Create a file called “languages.php” into the config folder

In this sample there are only two languages.

```php
<?php
// config/languages.php

return [
    'en' => 'English',
    'es' => 'Español',
];
```

Usage: `config('languages')` → `['en' => 'English', 'es' => 'Español']`.

## Create a new controller

```bash
php artisan make:controller LanguageController
```

```php
namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;

class LanguageController extends Controller
{
    public function switch(string $lang): RedirectResponse
    {
        // Only supported languages
        abort_unless(array_key_exists($lang, config('languages')), 404);

        session(['locale' => $lang]);

        return back();
    }
}
```

## Register the route

```php
// routes/web.php
use App\Http\Controllers\LanguageController;

Route::get('/lang/{lang}', [LanguageController::class, 'switch'])
    ->whereIn('lang', array_keys(config('languages')))
    ->name('lang');
```

`GET /lang/es` → saves `es` in the session and returns to the previous page. `GET /lang/fr` → 404.

## Create a new middleware with this code

```bash
php artisan make:middleware Language
```

```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class Language
{
    public function handle(Request $request, Closure $next): Response
    {
        $locale = session('locale');

        App::setLocale(
            array_key_exists((string) $locale, config('languages'))
                ? $locale
                : config('app.fallback_locale')
        );

        return $next($request);
    }
}
```

> Optionally, on the first visit use the browser language: `$request->getPreferredLanguage(array_keys(config('languages')))`.

## Edit “app.php” file in the bootstrap folder

Append the middleware to the `web` group (it needs the session, which is started in that group):

```php
<?php

use App\Http\Middleware\Language;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [Language::class]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
```

## Menu Component

```blade
{{-- resources/views/components/language-menu.blade.php --}}
@props([
    'current' => app()->getLocale(),
])

<ul>
    @foreach (config('languages') as $key => $value)
        @if ($key !== $current)
            <li>
                <a class="inline-flex rounded bg-indigo-500 px-6 py-2 text-lg text-white"
                   href="{{ route('lang', $key) }}">{{ $value }}</a>
            </li>
        @endif
    @endforeach
</ul>
```

Use it in the layout:

```blade
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
...
<x-language-menu />
```

Result when the current language is `es`: a single link **English** pointing to `/lang/en`.

## Translate texts

`lang/es.json`:

```json
{
    "Welcome": "Bienvenido",
    "Hello :name": "Hola :name"
}
```

```blade
{{ __('Welcome') }}                     {{-- Bienvenido --}}
{{ __('Hello :name', ['name' => 'Ana']) }} {{-- Hola Ana --}}
```
