# Auth with Breeze

> Since Laravel 12 the official way to get authentication are the **starter kits** (React, Vue or Livewire), chosen when running `laravel new`.
> **Breeze** (and Jetstream) are legacy: they still work with Laravel 12 but receive no new features. Breeze is still handy for a simple Blade-only app.

Related: [Policies.md](Policies.md) (authorization), [new/roles.md](new/roles.md) (roles), [Api/api.md](Api/api.md) (token auth for APIs).

## Installation

### Option A: Laravel 12 starter kit (recommended)

```bash
laravel new example-app
# Which starter kit would you like to install? > React / Vue / Livewire
# Which authentication provider do you prefer? > Laravel's built-in authentication / WorkOS
cd example-app
composer run dev
```

The code (pages, routes, auth logic) is copied into your app, so you can edit it freely. Routes live in `routes/auth.php` and `routes/settings.php`.

### Option B: Breeze (legacy)

```bash
composer create-project laravel/laravel example-app
cd example-app

# breeze
composer require laravel/breeze --dev
php artisan breeze:install            # interactive
# php artisan breeze:install blade      # stacks: blade, livewire, livewire-functional, react, vue, api
# php artisan breeze:install blade --dark --pest

# Install js dependencies
php artisan migrate
npm install && npm run dev            # Vite
```

What you get:

| Route | Purpose |
|-------|---------|
| `/register`, `/login`, `/logout` | Register, login, logout |
| `/forgot-password`, `/reset-password/{token}` | Password reset by email |
| `/verify-email`, `/email/verification-notification` | Email verification |
| `/dashboard` | Protected page (`auth`, `verified`) |
| `/profile` | Edit profile, password, delete account |

```bash
php artisan route:list --except-vendor   # check them
```

## Protect routes

```php
// routes/web.php
Route::middleware('auth')->group(function () {
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
});

Route::get('/admin', AdminController::class)->middleware(['auth', 'verified']);
```

A guest visiting `/orders` is redirected to `/login`; after login it goes back to `/orders` (`redirect()->intended()`).

## Get the logged-in user

```php
use Illuminate\Support\Facades\Auth;

$user = Auth::user();        // or auth()->user() / $request->user()
$id   = Auth::id();
Auth::check();               // true if logged in
```

```blade
@auth
    Hello {{ auth()->user()->name }}
    <form method="POST" action="{{ route('logout') }}">
        @csrf
        <button>Logout</button>
    </form>
@endauth

@guest
    <a href="{{ route('login') }}">Login</a>
@endguest
```

## Add email verification

```php
// routes/web.php: add the 'verified' middleware
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');
```

```diff
// app/Models/User.php
+ use Illuminate\Contracts\Auth\MustVerifyEmail;

- class User extends Authenticatable
+ class User extends Authenticatable implements MustVerifyEmail
```

In development, write the emails to the log instead of sending them:

```ini
# .env
MAIL_MAILER=log
```

The verification link appears in `storage/logs/laravel.log`.

## Limitar numero reintentos validación

```diff
// app/Http/Requests/Auth/LoginRequest.php
// Bajamos de 5 reintentos a 3

- if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
+ if (! RateLimiter::tooManyAttempts($this->throttleKey(), 3)) {
```

Tras 3 intentos fallidos el login devuelve: *"Too many login attempts. Please try again in 60 seconds."*

## Redirect after login

```php
// app/Http/Controllers/Auth/AuthenticatedSessionController.php (Breeze)
public function store(LoginRequest $request): RedirectResponse
{
    $request->authenticate();
    $request->session()->regenerate();

    return redirect()->intended(route('dashboard', absolute: false));
}
```

Change `route('dashboard')` to send users elsewhere (e.g. by role, see [new/roles.md](new/roles.md)).

## Test (Pest)

```php
// tests/Feature/AuthTest.php
use App\Models\User;

it('redirects guests to login', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

it('shows the dashboard to verified users', function () {
    $this->actingAs(User::factory()->create())
        ->get('/dashboard')
        ->assertOk();
});
```
