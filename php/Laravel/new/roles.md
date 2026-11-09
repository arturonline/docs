# Permissions and roles

If you want to assign roles and permissions in Laravel 12 you can implement role-based access control by adding a simple role column to your users table and using middleware (and Gates) to restrict access. Here's a step-by-step guide with examples.

Related: [Policies.md](../Policies.md) (Gates & Policies), [Auth with Breeze.md](../Auth%20with%20Breeze.md).

---

## 1. Add a Role Column to the Users Table

First, create a migration to add a `role` column to your `users` table. A `string` column is easier to extend than a DB `enum`; the allowed values are controlled by a PHP enum.

```bash
php artisan make:migration add_role_to_users_table
```

Edit the migration:

```php
public function up(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->string('role')->default('user')->after('email');
    });
}

public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn('role');
    });
}
```

Apply the migration:

```bash
php artisan migrate
```

Create a backed enum and cast the column:

```php
// app/Enums/Role.php
namespace App\Enums;

enum Role: string
{
    case Admin = 'admin';
    case Editor = 'editor';
    case User = 'user';
}
```

```php
// app/Models/User.php
use App\Enums\Role;

protected function casts(): array
{
    return [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'role' => Role::class,
    ];
}

public function hasRole(Role|string ...$roles): bool
{
    foreach ($roles as $role) {
        if ($this->role === (is_string($role) ? Role::tryFrom($role) : $role)) {
            return true;
        }
    }

    return false;
}
```

---

## 2. Update Registration and User Management

New users get the default `user` role from the column default. **Don't** add `role` to `$fillable` or accept it from the registration form, or anyone could register as admin.

Assign roles from an admin panel, a seeder or tinker:

```php
$user = User::find(1);
$user->role = Role::Admin;
$user->save();

// or
User::where('email', 'admin@example.com')->update(['role' => Role::Admin]);
```

```php
// database/seeders/DatabaseSeeder.php
User::factory()->create([
    'email' => 'admin@example.com',
    'role' => Role::Admin,   // factories ignore $fillable
]);
```

---

## 3. Create Role Middleware

Create a middleware to check the user's role. With a parameter it works for any role:

```bash
php artisan make:middleware EnsureUserHasRole
```

Edit the middleware:

```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    // role:admin,editor -> $roles = ['admin', 'editor']
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! $request->user()?->hasRole(...$roles)) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
```

Register the alias in `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->alias([
        'role' => \App\Http\Middleware\EnsureUserHasRole::class,
    ]);
})
```

---

## 4. Protect Routes with Middleware

Protect routes by applying the middleware:

```php
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('admin.index');
});

Route::middleware(['auth', 'role:admin,editor'])->group(function () {
    Route::resource('posts', PostController::class)->except(['index', 'show']);
});
```

Result: a logged-in `user` visiting `/admin` gets a **403**; a guest is redirected to `/login` (by `auth`).

---

## 5. Gates for roles

Define a Gate to use the role everywhere (`@can`, `Gate::allows`, `->can()`):

```php
// app/Providers/AppServiceProvider.php
public function boot(): void
{
    Gate::define('admin', fn (User $user) => $user->hasRole(Role::Admin));

    // Admins can do everything (also in Policies)
    Gate::before(fn (User $user) => $user->hasRole(Role::Admin) ? true : null);
}
```

```php
Route::get('/reports', ReportController::class)->middleware(['auth', 'can:admin']);
```

---

## 6. Redirect Users by Role

After login, redirect users to different dashboards based on their role. With Breeze, in `AuthenticatedSessionController::store`:

```php
public function store(LoginRequest $request): RedirectResponse
{
    $request->authenticate();
    $request->session()->regenerate();

    $home = $request->user()->hasRole(Role::Admin)
        ? route('admin.index', absolute: false)
        : route('dashboard', absolute: false);

    return redirect()->intended($home);
}
```

---

## 7. Example: Restricting Access in Views

In your Blade views, you can check the user's role:

```blade
@if (auth()->user()?->hasRole('admin'))
    Admin Panel
@endif

{{-- or with the Gate --}}
@can('admin')
    <a href="{{ route('admin.index') }}">Admin Panel</a>
@endcan
```

---

## 8. Test (Pest)

```php
use App\Enums\Role;
use App\Models\User;

it('blocks non admins', function () {
    $this->actingAs(User::factory()->create())
        ->get('/admin')
        ->assertForbidden();
});

it('lets admins in', function () {
    $this->actingAs(User::factory()->create(['role' => Role::Admin]))
        ->get('/admin')
        ->assertOk();
});
```

---

## Summary Table

| Step                | Description                                              |
|---------------------|----------------------------------------------------------|
| Add role column     | Add `role` to users table + enum cast                    |
| Set role on users   | Assign role via admin panel / seeder (never mass assign) |
| Create middleware   | `role:admin,editor` middleware to check roles            |
| Protect routes      | Use middleware to restrict access                        |
| Gates               | `@can('admin')`, `Gate::before` for super admins         |
| Redirect by role    | Redirect users to appropriate dashboard after login      |
| Check role in views | Conditionally show content based on user role            |

---

This approach is **simpler than using Spatie** and works well for applications with a limited number of roles and straightforward permissions. For more complex permission systems (many roles, per-permission checks, roles stored in tables) use [spatie/laravel-permission](https://spatie.be/docs/laravel-permission).

```bash
composer require spatie/laravel-permission
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan migrate
```

```php
// User model: use Spatie\Permission\Traits\HasRoles;
$user->assignRole('writer');
$role->givePermissionTo('edit articles');
$user->can('edit articles');            // works with @can too
Route::get('/admin', AdminController::class)->middleware('role:admin'); // after registering Spatie's middleware aliases
```

References:

- <https://laravel.com/docs/12.x/authorization>
- <https://spatie.be/docs/laravel-permission/v6/basic-usage/role-permissions>
- <https://laraveldaily.com/post/laravel-breeze-user-student-teacher-admin>
- <https://itsolutionstuff.com/post/laravel-12-user-roles-and-permissions-tutorialexample.html>
- <https://www.infosecinstitute.com/resources/application-security/laravel-authorization-best-practices-and-tips/>
