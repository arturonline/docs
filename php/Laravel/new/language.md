# language selector with session persistence

Verifying that the language passed by GET is among the supported languages, otherwise it will return the default pre-determined language.

## Install language package

```sh
composer require laravel-lang/common --dev
php artisan lang:add es
php artisan lang:add en
php artisan lang:update
```

## Create a new controller 

```php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session;

class LanguageController extends Controller
{
    public function switch($lang)
    {
            Session::put([
                'applocale' => $lang,
                'locale' => $lang,
            ]);
            return Redirect::back();
    }
}
```

## Create a nuew middleware with this code

```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class Language
{
    public function handle(Request $request, Closure $next): Response
    {
        $langSesion = Session::get('applocale');
        array_key_exists($langSesion, config('languages')) 
            ? App::setLocale($langSesion) 
            : App::setLocale(Config('app.fallback_locale'));

        return $next($request);
    }
}
```

## Edit “app.php” file in the bootstrap folder 

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
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [Language::class]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
```

## Create a new file called “languages.php” into the config folder

In this sample there are only two languages.

```php
return $idiomas = [
    'en' => "English",
    'es' => "Español",
];
```

## Menu Component

```php
@props([
    'idioma' => array_key_exists(session('locale'),config('languages')) ? session('locale') : Config('app.locale'),
])
<ul>
@foreach (config('languages') as $key => $value)
 @if ($key != $idioma)
 <li>
        <a class="inline-flex rounded bg-indigo-500 px-6 py-2 text-lg text-white"
  href="{{ route('lang', $key) }}">{{ $value }}</a>
    </li>
 @endif
@endforeach
</ul>
```