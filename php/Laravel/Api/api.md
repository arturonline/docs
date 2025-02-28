# Laravel API projects

## 1. Install

```sh
composer create-project --prefer-dist laravel/laravel laravel-api
cd laravel-api
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
``` 

## 2. Configure

Ensure your User model uses the HasApiTokens trait provided by Sanctum. Open app/Models/User.php and add the trait:

```php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    // Other model properties and methods
}
```

Add Sanctum's middleware to your api middleware group in app/Http/Kernel.php:

```php
protected $middlewareGroups = [
    'api' => [
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        'throttle:api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];
```

Update the `config/auth.php file: 

```php
'guards' => [
    'api' => [
        'driver' => 'sanctum',
        'provider' => 'users',
    ],
],
```

Create auth controller:

```php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['access_token' => $token, 'token_type' => 'Bearer']);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!auth()->attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = auth()->user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['access_token' => $token, 'token_type' => 'Bearer']);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }
}
```

## Define API Routes

```php
In the routes/api.php file, add routes for registration, login, and logout:

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    // Add your protected routes here
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
```

## Test auth

```php
POST /api/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}

POST /api/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

With curl:

```sh
# Register
curl -X POST http://localhost:8000/api/register -H "Content-Type: application/json" -d '{"name": "John Doe", "email": "john@example.com", "password": "password", "password_confirmation": "password"}'

# Login
curl -X POST http://localhost:8000/api/login -H "Content-Type: application/json" -d '{"email": "john@example.com", "password": "password"}'

# Logout
curl -X POST http://localhost:8000/api/logout -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```