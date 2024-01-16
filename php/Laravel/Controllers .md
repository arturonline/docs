# Controllers

## 1. About Controllers

Controllers are just classes with methods called “**Action Methods**” that handle requests. For example, a **`UserController`** class might handle all incoming requests related to `**users**`, including *showing*, *creating*, *updating*, and *deleting* users.

## 2. Create simple controller

### 2.1 Create a simple controller manually

We just create a class inside Controllers folder that inherits from controller:

```php
<?php
 namespace App\Http\Controllers;

 class TestController extends Controller {
   // Action methods: index, show, delete...
   function index() {
    // index function
   }
 }
```

### 2.2 Create a simple controller with artisan

```bash
php artisan make:controller TestController
```

### 2.3 Define routes for simple Controllers

```php
// Controller routes:
Route::get('/tests', [TestController::class, 'index'];
Route::get('/tests/about', [TestController::class, 'about'];

Route::get('/tests', 'App\Http\Controllers\TestController@index');
```

## 4. Create a Resource Controller

If we create a controller with the '`-r`' option it will create a controller with a series of predefined methods:

- **index** : muestra un listado de los elementos de esa entidad o recurso
- **create** : muestra el formulario para dar de alta nuevos elementos
- **store** : almacena en la base de datos el recurso creado con el formulario anterior
- **show** : muestra los datos de un recurso específico (a partir de su clave o id).
- **edit** : muestra el formulario para editar un recurso existente
- **update** : actualiza en la base de datos el recurso editado con el formulario anterior
- **destroy** : elimina un recurso por su identificador

```php
php artisan make:controller -r BookController
```

### 4.1 Resource controller routes

```php
// Resource controller routes:
Route::resource('/tests', TestController::class];
```

We can use the **`only`** method to indicate for which methods we want routes:

```php
use App\Http\Controllers\BookController;
...
Route::resource('books', BookController::class)
 ->only(['index', 'show']);
```

We can use the **`except`** method to indicate that all routes are generated except
those for the indicated methods:

```php
use App\Http\Controllers\BookController;
...
Route::resource('books', BookController::class)
->except(['update', 'edit']);
```

## 5. Create a Single method Controllers

```php
// php artisan make:controller TestController -i

<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
class TestController extends Controller
{
 ...
 public function __invoke(Request $request)
 {
 ...
 }
}
```

Within the '`__invoke`' method we can define the logic of generating or obtaining the data that a view needs, and render it.

```php
Route::get('test', 'TestController')->name('test');

//or
use App\Http\Controllers\TestController;
...
Route::get('test', TestController::class)->name('test');
```

## 6. Create Api Controllers

API Controllers have the same methods as the resource Controllers, except the '`create`' and '`edit`' methods, since these forms are not necessary in APIs.

With API type controllers we can automatically generate all the routes for their methods, using the '**`apiResource`**' method of the '`Route`' class, instead of the '`resource`' method used before:

```php
use App\Http\Controllers\TestController;
...
Route::apiResource('test', TestController::class);
```