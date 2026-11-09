# Laravel

Quick reference of the usual flow in Laravel 12: migration → model → controller → routes → views. Index of all notes: [laravel intro.md](../laravel%20intro.md).

## Install

```bash
# Install laravel (installer: asks for starter kit, Pest/PHPUnit and database)
laravel new example-app

# or with composer
composer create-project laravel/laravel:^12.0 example-app
cd example-app

# Auth: choose a starter kit in `laravel new` (React/Vue/Livewire)
# or install Breeze (legacy, Blade only), see ../Auth with Breeze.md
composer require laravel/breeze --dev
php artisan breeze:install blade
php artisan migrate
npm install
npm run dev

# Dev server + Vite + queue + logs at once
composer run dev
```

See [Auth with Breeze.md](../Auth%20with%20Breeze.md).

## flow

### Create Migration

```bash
# Create table (plural)
php artisan make:migration create_flights_table
# Modify an existing table
php artisan make:migration add_price_to_flights_table
```

Laravel will use the name of the migration to attempt to guess the name of the table and whether or not the migration will be creating a new table.

```php
// database/migrations/2025_01_01_000000_create_flights_table.php
public function up(): void
{
    Schema::create('flights', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('airline')->nullable();
        $table->decimal('price', 8, 2)->default(0);
        $table->boolean('active')->default(true);
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('flights');
}
```

```php
// add_price_to_flights_table
Schema::table('flights', function (Blueprint $table) {
    $table->integer('seats')->after('name');
    $table->renameColumn('airline', 'company');
    $table->dropColumn('active');
});
```

```bash
# Run pending migrations
php artisan migrate

# to see which migrations have run thus far
php artisan migrate:status

# Rollback the last batch
php artisan migrate:rollback

# Rollback all and migrate again
php artisan migrate:refresh

# Drop all tables and migrate
php artisan migrate:fresh
```

### Create Models

```bash
# Create a Model and a migration
php artisan make:model Post -m

# Model + migration + factory + seeder + resource controller + form requests + policy
php artisan make:model Post --all     # or -a
```

Edit the migration file adding more columns to the table in the `up` function:

```php
public function up(): void
{
    Schema::create('posts', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->string('slug')->unique();
        $table->text('description');
        $table->longText('content');
        $table->string('status')->default('draft');
        $table->timestamp('published_at')->nullable();
        $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        $table->foreignId('category_id')->constrained();
        $table->timestamps();
    });

    // many to many: pivot table (singular names, alphabetical order)
    Schema::create('post_tag', function (Blueprint $table) {
        $table->foreignId('post_id')->constrained()->cascadeOnDelete();
        $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
        $table->primary(['post_id', 'tag_id']);
    });
}
```

Edit the model: mass assignment, casts, relations and scopes:

```php
// app/Models/PostStatus.php (backed enum)
namespace App\Models;

enum PostStatus: string
{
    case Draft = 'draft';
    case Published = 'published';
}
```

```php
// app/Models/Post.php
namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Post extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'slug', 'description', 'content', 'status', 'published_at', 'category_id'];

    protected function casts(): array
    {
        return [
            'status' => PostStatus::class,   // $post->status === PostStatus::Published
            'published_at' => 'datetime',    // Carbon instance
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    #[Scope]
    protected function published(Builder $query): void
    {
        $query->where('status', PostStatus::Published);
    }
}
```

```php
// In User.php
public function posts(): HasMany
{
    return $this->hasMany(Post::class);
}
```

Usage:

```php
$posts = Post::published()->with('user', 'tags')->latest()->paginate(10);
$post = Post::where('slug', 'hello')->firstOrFail();   // 404 if not found
$user->posts()->create($data);                         // sets user_id
$post->tags()->sync([1, 2, 3]);                        // pivot table
$post->update(['status' => PostStatus::Published]);
$post->delete();
```

### Create Controller

```bash
# create the controller
php artisan make:controller WelcomeController
php artisan make:model YourModelName -mcr
php artisan make:controller PostController --resource --model=Post
php artisan make:controller ShowDashboard --invokable   # single action (__invoke)
```

Create an action (method inside the controller) and register the route:

```php
// app/Http/Controllers/HomeController.php
public function home()
{
    return view('welcome');
}
```

```php
// routes/web.php
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PostController;

Route::get('/', [HomeController::class, 'home'])->name('home');

// 7 routes: index, create, store, show, edit, update, destroy
Route::resource('posts', PostController::class);

// Group with middleware, prefix and name
Route::middleware('auth')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/stats', StatsController::class)->name('stats');   // admin.stats -> /admin/stats
});
```

Resource controller example:

```php
// app/Http/Controllers/PostController.php
public function index()
{
    return view('post.index', ['posts' => Post::published()->latest()->paginate(10)]);
}

public function store(Request $request)
{
    $data = $request->validate([
        'title' => 'required|string|max:255',
        'slug' => 'required|alpha_dash|unique:posts',
        'description' => 'required',
        'content' => 'required',
        'category_id' => 'required|exists:categories,id',
    ]);

    $post = $request->user()->posts()->create($data);

    return redirect()->route('posts.show', $post)->with('status', 'Post created!');
}

public function show(Post $post)   // route model binding
{
    return view('post.show', compact('post'));
}
```

```bash
php artisan route:list --name=posts
```

### Seed data in the models

```bash
# Create the factory models
php artisan make:factory PostFactory --model=Post
php artisan make:seeder TagSeeder
```

Edit the factory (`database/factories/UserFactory.php`):

```php
public function definition(): array
{
    return [
        'name' => fake()->name(),
        'email' => fake()->unique()->safeEmail(),
        'email_verified_at' => now(),
        'password' => static::$password ??= Hash::make('password'),
        'avatar' => fake()->imageUrl(200, 200), // URL de imagen de perfil (opcional)
        'remember_token' => Str::random(10),
    ];
}

// state: User::factory()->unverified()->create()
public function unverified(): static
{
    return $this->state(fn (array $attributes) => ['email_verified_at' => null]);
}
```

In the factory files you only define the fields that belong directly to the table. Relationships (tags, categories) are handled in the seeder or with `for()`/`has()`/`hasAttached()`.

Seed the factory in `database/seeders/DatabaseSeeder.php`:

```php
public function run(): void
{
    $this->call(TagSeeder::class);

    User::factory(5)->create();

    Post::factory(10)
        ->for(User::factory())                        // belongsTo
        ->hasAttached(Tag::inRandomOrder()->take(2)->get())
        ->create();
}
```

Apply / run:

```bash
php artisan db:seed                  # Si esta todo migrado
php artisan db:seed --class=TagSeeder
php artisan migrate --seed           # para aplicar antes una migración
php artisan migrate:fresh --seed     # para borrar antes la base de datos
```

### Create the views

```bash
# resources/views/post/*.blade.php
php artisan make:view post.index
php artisan make:view post.create
php artisan make:view post.edit
php artisan make:view post.show

# optionally create a layout component
php artisan make:component layout --view
```

```blade
{{-- resources/views/post/index.blade.php --}}
<x-layout>
    @foreach ($posts as $post)
        <a href="{{ route('posts.show', $post) }}">{{ $post->title }}</a>
    @endforeach

    {{ $posts->links() }}   {{-- pagination --}}
</x-layout>
```

See [Blade.md](../Blade.md) and [Components.md](../Components.md).

## html, css & js resources

Sources live in `resources/css` and `resources/js`; Vite compiles them into `public/build`. Static files (images, favicon) can go directly in `public/`.

```blade
{{-- Layout should include: --}}
<head>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<img src="{{ asset('img/logo.png') }}">   {{-- public/img/logo.png --}}
```

```bash
npm run dev      # development server with hot reload
npm run build    # production build -> public/build
```

Tailwind CSS v4 comes preconfigured in Laravel 12 (`resources/css/app.css` → `@import 'tailwindcss';`).

## Tests (Pest)

```bash
php artisan make:test PostTest           # tests/Feature/PostTest.php
php artisan make:test PostTest --unit
php artisan test                         # or ./vendor/bin/pest
php artisan test --filter=PostTest
```

```php
use App\Models\Post;
use App\Models\User;

it('creates a post', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/posts', [
            'title' => 'Hello', 'slug' => 'hello', 'description' => 'd',
            'content' => 'c', 'category_id' => \App\Models\Category::factory()->create()->id,
        ])
        ->assertRedirect();

    expect(Post::where('slug', 'hello')->exists())->toBeTrue();
});
```

Use `uses(RefreshDatabase::class)` (in `tests/Pest.php`) so every test starts with a clean database.

## Localización

El idioma de la app se configura en `config/app.php` o en `.env`: `APP_LOCALE=es` (y `APP_FALLBACK_LOCALE=en`).

Selector de idioma con sesión: [language.md](language.md).

### Pasos previos

Primero publicamos las traducciones (solo la primera vez), ya que desde Laravel 11 la carpeta `lang` no existe por defecto:

```bash
php artisan lang:publish   # crea lang/en/*.php en la raíz del proyecto
```

A continuación creamos una carpeta para cada idioma (ej: `lang/es`), y dentro de cada carpeta de idioma creamos un archivo con traducciones: ej: `messages.php`.

### Crear archivo con traducciones

Las traducciones son un archivo php que devuelve un array:

```php
// lang/es/messages.php
return [
    'Profile' => 'Perfil',
    'welcome' => 'Bienvenido, :name',
];
```

### Usar las traducciones

Para usar las traducciones en blade usaremos la función auxiliar `__()`:

```blade
{{ __('messages.Profile') }}                       {{-- Perfil --}}
{{ __('messages.welcome', ['name' => 'Ana']) }}    {{-- Bienvenido, Ana --}}
@lang('messages.Profile')
```

Para textos completos se puede usar un JSON por idioma (`lang/es.json`) y `__('Profile')` directamente.
