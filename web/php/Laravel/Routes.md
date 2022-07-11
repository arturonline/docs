# Routes

## Web paths

The `'routes/web.php'` file defines routes that are for your web interface.

### Routes

```php
// Route sends back a string
Route::get('/', function() {
	return 'Hello World';
});

// Route sends back html
Route::get('/', function() {
	return '<h1>Hello World</h1>';
});

// Route sends back a Json Array
Route::get('/', function() {
	return ['hello', 'world', 'laravel']
});

// Route sends back a Json Object
Route::get('/', function() {
	return response() -> ([
		'name' => 'Dary',
		'course' => 'Laravel Beginners'
	]);
});

// Route sends back a View
Route::get('/', function() {
 return view('welcome');
});

// Route send back a View - shorter version
Route::view('/welcome', 'welcome');

```

### Named Routes

It is good idea to always name your routes

```php
// Naming a blade page
Route::get('contact', function() {
	return "Contact Page";
}) -> name('path_contact');

// allow us to do: 
<a href="{{ route('path_contact') }}">contact</a>
```

### Routes with parameters:

```php
// Route sends back a string with a variable
Route::get('greeting/{name}', function($name){
return "Hello, " . $name;
});

// Shorter version
Route::view('/welcome', 'welcome', ['name' => 'Taylor']);
```

### Parameter validation

```php
Route::get('greeting/{name?}' , function($name = "Guest"){
return "Hello, " . $name;
}) -> where('name', "[A-Za-z]+");
```

### Combining items into paths

```php
Route::get('greeting/{name?}/{id?}' ,
function($name="Guest", $id=0)
{
	return "Hello $name,your code is the $id"; 
}) -> where('name', "[A-Za-z]+")
	 -> where('id', "[0-9]+")
	 -> name('greeting');
```

![Untitled](Routes%20809fe6cee12a47e7ae8cee8ab1d56779/Untitled.png)

## API paths

The routes in **`routes/api.php`** are stateless and are assigned the **`api`** middleware group.