# Laravel API projects

Laravel 12 + Sanctum (API tokens). Docs: <https://laravel.com/docs/12.x/sanctum>

Related: [Policies.md](../Policies.md) (authorization), [Ajax.md](../Ajax.md) (calling endpoints from Blade).

## 1. Install

```bash
composer create-project laravel/laravel laravel-api
cd laravel-api
php artisan install:api
```

`install:api` does everything that used to be manual:

- installs `laravel/sanctum` and publishes `config/sanctum.php`
- creates the `personal_access_tokens` migration (and offers to run it)
- creates `routes/api.php` and registers it in `bootstrap/app.php` (prefix `/api`)

```php
// bootstrap/app.php (after install:api)
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Only for an SPA on the same top-level domain using cookie/session auth:
        // $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Always return JSON errors for /api/* (404, 422, 500...)
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request, Throwable $e) => $request->is('api/*') || $request->expectsJson()
        );
    })->create();
```

> There is no `app/Http/Kernel.php` since Laravel 11, and no need to add an `api` guard to `config/auth.php`: the `auth:sanctum` middleware works out of the box.

## 2. Configure

Ensure your User model uses the `HasApiTokens` trait provided by Sanctum:

```php
// app/Models/User.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',   // plain passwords are hashed automatically
        ];
    }
}
```

## 3. Auth controller

```bash
php artisan make:controller Api/AuthController
```

```php
// app/Http/Controllers/Api/AuthController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create($data);   // 'hashed' cast hashes the password

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['access_token' => $token, 'token_type' => 'Bearer'], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
            'device_name' => 'nullable|string',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],   // 422
            ]);
        }

        $token = $user->createToken($credentials['device_name'] ?? 'auth_token')->plainTextToken;

        return response()->json(['access_token' => $token, 'token_type' => 'Bearer']);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();   // revoke only this token
        // $request->user()->tokens()->delete();            // revoke all

        return response()->json(['message' => 'Logged out']);
    }
}
```

## 4. Define API Routes

In the `routes/api.php` file, add routes for registration, login, and logout (all prefixed with `/api`):

```php
// routes/api.php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1'); // 5 per minute

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', fn (Request $request) => $request->user());

    // Add your protected routes here
    Route::apiResource('posts', PostController::class);
});
```

```bash
php artisan route:list --path=api
#  GET|HEAD   api/posts ........... posts.index   › Api\PostController@index
#  POST       api/posts ........... posts.store   › Api\PostController@store
#  GET|HEAD   api/posts/{post} .... posts.show    › Api\PostController@show
#  PUT|PATCH  api/posts/{post} .... posts.update  › Api\PostController@update
#  DELETE     api/posts/{post} .... posts.destroy › Api\PostController@destroy
```

## 5. Resource controller + API Resources

```bash
php artisan make:model Post -mf
php artisan make:controller Api/PostController --api --model=Post
php artisan make:request StorePostRequest
php artisan make:resource PostResource
```

```php
// app/Http/Resources/PostResource.php: shape of the JSON
public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'title' => $this->title,
        'author' => $this->whenLoaded('user', fn () => $this->user->name),
        'created_at' => $this->created_at->toIso8601String(),
    ];
}
```

```php
// app/Http/Controllers/Api/PostController.php
public function index()
{
    return PostResource::collection(Post::with('user')->latest()->paginate(15));
}

public function store(StorePostRequest $request)
{
    $post = $request->user()->posts()->create($request->validated());

    return (new PostResource($post))->response()->setStatusCode(201);
}

public function show(Post $post)
{
    return new PostResource($post->load('user'));
}

public function update(StorePostRequest $request, Post $post)
{
    Gate::authorize('update', $post);    // see Policies.md
    $post->update($request->validated());

    return new PostResource($post);
}

public function destroy(Post $post)
{
    Gate::authorize('delete', $post);
    $post->delete();

    return response()->noContent();      // 204
}
```

Response of `GET /api/posts/1`:

```json
{
  "data": {
    "id": 1,
    "title": "Hello",
    "author": "John Doe",
    "created_at": "2025-03-01T10:00:00+00:00"
  }
}
```

## 6. Token abilities (scopes)

```php
$token = $user->createToken('reports', ['posts:read'])->plainTextToken;

$request->user()->tokenCan('posts:read');   // true
```

```php
// bootstrap/app.php
$middleware->alias([
    'abilities' => \Laravel\Sanctum\Http\Middleware\CheckAbilities::class,
    'ability' => \Laravel\Sanctum\Http\Middleware\CheckForAnyAbility::class,
]);

// routes/api.php
Route::get('/reports', ReportController::class)->middleware(['auth:sanctum', 'abilities:posts:read']);
```

## 7. Test auth

```http
POST /api/register
Accept: application/json
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}

POST /api/login
Accept: application/json
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{ "access_token": "1|Xk3q...", "token_type": "Bearer" }
```

With curl (always send `Accept: application/json`, otherwise validation errors redirect instead of returning 422 JSON):

```bash
# Register
curl -X POST http://localhost:8000/api/register -H "Accept: application/json" -H "Content-Type: application/json" -d '{"name": "John Doe", "email": "john@example.com", "password": "password", "password_confirmation": "password"}'

# Login
curl -X POST http://localhost:8000/api/login -H "Accept: application/json" -H "Content-Type: application/json" -d '{"email": "john@example.com", "password": "password"}'

# Current user
curl http://localhost:8000/api/user -H "Accept: application/json" -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Logout
curl -X POST http://localhost:8000/api/logout -H "Accept: application/json" -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Without a valid token: `401 {"message": "Unauthenticated."}`.

### Pest

```php
// tests/Feature/Api/PostTest.php
use App\Models\User;
use Laravel\Sanctum\Sanctum;

it('requires a token', function () {
    $this->getJson('/api/posts')->assertUnauthorized();
});

it('lists posts', function () {
    Sanctum::actingAs(User::factory()->create(), ['*']);

    $this->getJson('/api/posts')
        ->assertOk()
        ->assertJsonStructure(['data', 'links', 'meta']);
});

it('logs in', function () {
    $user = User::factory()->create(['password' => 'secret123']);

    $this->postJson('/api/login', ['email' => $user->email, 'password' => 'secret123'])
        ->assertOk()
        ->assertJsonStructure(['access_token', 'token_type']);
});
```
