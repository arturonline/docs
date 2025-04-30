# Laravel

## Install

```php
# Install laravel
composer create-project laravel/laravel:^11.0 example-app

# Install breeze
composer require laravel/breeze --dev
php artisan breeze:install
php artisan migrate
npm install
npm run dev
```

## flow

### Create Migration

```php
# Create table plural
php artisan make:migration create_flights_table
```

Laravel will use the name of the migration to attempt to guess the name of the table and whether or not the migration will be creating a new table.


```php
# to see which migrations have run thus far
php artisan migrate:status

# Rollback and Migrate
php artisan migrate:refresh

# Drop all tables and migrate
php artisan migrate:fresh
```

### Create Models

```php
#Create a Model and a migration
php artisan make:model Post -m

# Edit the migrate model file by adding more columns to the table in the up function
public function up(): void
{
    Schema::create('posts', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('description');
        $table->longText('content');
        $table->string('status');
        $table->foreignId('user_id')->constrained();
        $table->foreignId('category_id')->constrained();
        $table->foreignId('tag_id')->constrained();
        $table->timestamps();
    });
}
```

### Create Controller

```php
# create the controller
php artisan make:controller WelcomeController
php artisan make:model YourModelName -mcr
php artisan make:controller PostController --resource --model=Post

# Create an action (method inside the controller)
public function home() {
    return view('welcome');
}

# and register the route
Route::get('/', [\App\Http\Controllers\HomeController::class, 'home'])->name('home');
```

### Seed data in the models

```php
# Create the factory models
php artisan make:factory PostFactory --model=Post
php artisan make:factory UserFactory --model=User

# Edit the factory
# /database/factories
'name' => fake()->name(),
'email' => fake()->unique()->safeEmail(),
'email_verified_at' => now(),
'password' => static::$password ??= Hash::make('password'),
'avatar' => fake()->imageUrl(200, 200), // URL de imagen de perfil (opcional)
'remember_token' => Str::random(10),

# In the factory files you only define the fields that belong directly to the table. The relationships with tags and categories are handled in the seeder.

# Seed the factory 
# /database/seeders/DatabaseSeeder.php
User::factory(5)->create();
Post::factory(10)->create();

## Apply run
php artisan db:seed  # Si esta todo migrado
php artisan migrate --seed # para aplicar antes una migración
php artisan migrate:refresh --seed # para borrar antes la base de datos 
```

### Create the views

```php
# /resources/views/yourFolder

php artisan make:view post.index
php artisan make:view post.create
php artisan make:view post.edit
php artisan make:view post.show

# optionally create a layout
```

## html, css & js resources

```php
# Everything should be in public/
# Layout should include: 
<head>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
```

## Localización

El Idioma de la app se configura en `App\config\app.php` o en `.env`: `APP_LOCALE=ES`

### Pasos previos

Primero publicamos las traducciones (solo la primera vez):

```sh 
php artisan lang:publish
```

A continuación creamos un carpeta para cada idioma (ex: `resources/lang/es`), y 
dentro de cada carpeta de idioma creamos un archivo con traducciones: ex: `messages.php`

### Crear archivo con traducciones

Las traducciones son un archivo php que devuelve un array:

```php
// messages.php
return [
    "Profile" => "Perfil"
]
```

### Usar las traducciones

Para usar las traducciones en blade usaremos la función auxiliar `__()`

```php
{{ __("messages.Profile") }}
```
