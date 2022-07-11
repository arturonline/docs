# Models

## Crear Base de datos y tabla

1. Crear database
2. Generar archivo de migración: `php artisan create:migration create_table_posts --create posts`
3. Editar archivo de migración `xxx_create_table_posts.php`
4. Lanzar la migración: `php artisan migrate` (Esto generará las tablas)

## Crear modelo de las tabla

The idea is to create a class for each table that we have in our database, in order to interact with the table through that associated class. To create this model class: `php artisan make:model Book`. By convention, models are created with a singular name, starting with a capital letter, and are placed in the `app\Models` folder.

Automatically, this model is associated with a table with the same name, but in **plural** and **lowercase**, (model Book → table books) . In case we do not want it to be so, we define a `$table` property in the class with the name that we want the associated table to have:

```php
// app\models
class Book extends Model
{
	protected $table = 'mybooks';
}
```

### Otras opciones para crear modelos:

```php
php artisan make:model Movie -mcr
php artisan make:model Movie --migration --controller --resource
```

## Eloquent

### Search

```php
class BookController extends Controller
{
	public function index()
	{
	$books = Book::get();
	}
}
```

```php
@forelse($books as $book)
	{{ $book->title }}
@empty
	No books found
@endforelse
```

### Filter

```php
$books = Book::where('price', '<', 10) -> get();
$books = Book::where('price', '<', 10) -> where('precio', '>', 5)->get();

$books = Book::orderBy('title')->get();
$books = Book::orderBy('title', 'DESC') -> get();
```

### Pagination

```php
public function index()
{
	$books = Book::paginate(5);
	return view('books.index', compact('books'));
}
```

```php
@forelse($books as $book)
	{{ $book->title }}
@empty
	No books found
@endforelse

{{ $books->links() }} 
// we use the 'links' method to display pagination buttons.
```

Or we can sort the paginated list:

```php
public function index()
{
	 $books = Book::orderByAsc('title')
		-> orderByAsc('editorial')
		-> paginate(5);
	 return view('books.index', compact('books'));
}
```