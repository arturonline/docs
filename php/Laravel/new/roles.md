# Permissions and roles

If you want to assign roles and permissions in Laravel 12 you can implement role-based access control by adding a simple role column to your users table and using middleware to restrict access. Here’s a step-by-step guide with examples:

---

## 1. Add a Role Column to the Users Table

First, create a migration to add a `role` column to your `users` table. This can be an enum or a string column. For example, using an enum:

```bash
php artisan make:migration add_role_to_users_table
```

Edit the migration:

```php
public function up()
{
    Schema::table('users', function (Blueprint $table) {
        $table->enum('role', ['admin', 'editor', 'user'])->default('user');
    });
}
```

Apply the migration:

```bash
php artisan migrate
```

---

## 2. Update Registration and User Management

When registering users or editing their details, set the appropriate role. For example, in your registration controller:

```php
protected function create(array $data)
{
    return User::create([
        'name' => $data['name'],
        'email' => $data['email'],
        'password' => Hash::make($data['password']),
        'role' => $data['role'] ?? 'user', // Default to 'user'
    ]);
}
```

Or, manually assign the role in your admin panel:

```php
$user = User::find(1);
$user->role = 'admin';
$user->save();
```

---

## 3. Create Role Middleware

Create a middleware to check the user’s role. For example:

```bash
php artisan make:middleware AdminMiddleware
```

Edit the middleware:

```php
public function handle(Request $request, Closure $next)
{
    if (auth()->user()->role !== 'admin') {
        abort(403, 'Unauthorized action.');
    }
    return $next($request);
}
```

Register the middleware in `bootstrap/app.php`:

```php
php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->web(append: [
        \App\Http\Middleware\HandleInertiaRequests::class,
        \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
    ]);

    $middleware->alias([
        'admin' => \App\Http\Middleware\AdminMiddleware::class,
    ]);
})
```

---

## 4. Protect Routes with Middleware

Protect routes by applying the middleware:

```php
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index']);
});
```

You can create similar middleware for other roles (e.g., `editor`) and protect their routes accordingly.

---

## 5. Redirect Users by Role

In your `LoginController`, redirect users to different dashboards based on their role:

```php
public function redirectTo()
{
    if (auth()->user()->role === 'admin') {
        return '/admin';
    }
    return '/dashboard';
}
```


---

## 6. Example: Restricting Access in Views

In your Blade views, you can check the user’s role:

```php
@if(auth()->user()->role === 'admin')
    Admin Panel
@endif
```

---

## Summary Table

| Step                | Description                                              |
|---------------------|----------------------------------------------------------|
| Add role column     | Add `role` to users table                                |
| Set role on users   | Assign role during registration or via admin panel       |
| Create middleware   | Make middleware to check roles                           |
| Protect routes      | Use middleware to restrict access                        |
| Redirect by role    | Redirect users to appropriate dashboard after login      |
| Check role in views | Conditionally show content based on user role            |

---

This approach is **simpler than using Spatie** and works well for applications with a limited number of roles and straightforward permissions. For more complex permission systems, consider upgrading to Jetstream or using a package[1][2].

[1] <https://stackoverflow.com/questions/78924699/how-to-create-an-admin-account-in-laravel-11-using-breeze>
[2] <https://laraveldaily.com/post/laravel-breeze-user-student-teacher-admin>
[3] <https://itsolutionstuff.com/post/laravel-12-user-roles-and-permissions-tutorialexample.html>
[4] <https://www.youtube.com/watch?v=o9PIefA5EdE>
[5] <https://kritimyantra.com/blogs/laravel-12-admin-panel-roles-permission>
[6] <https://laravel.com/docs/12.x/authorization>
[7] <https://www.souysoeng.com/2025/06/laravel-12-roles-and-permissions.html>
[8] <https://spatie.be/docs/laravel-permission/v6/basic-usage/role-permissions>
[9] <https://www.infosecinstitute.com/resources/application-security/laravel-authorization-best-practices-and-tips/>
[10] <https://www.youtube.com/watch?v=EiZPls4UcH4>