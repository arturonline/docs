# Views

The general way to display views in Laravel is to make the paths return a certain view:

```html
<!-- resources/home.blade.php --->
<html>
 <head>
    <title>Init</title>
 </head>
 <body>
    <h1>Home page</h1>
 </body>
</html>
```

```php
Route::get('/', function() {
 return view('home');
});
```

Laravel assumes that by default the views are in the folder `resources/views`, with the extension `.blade.php`.

## Pass values to views

```php
// Pass single value
return view('post')->with('post' => $post);

// Pass multiple values with 'with' function
return view('post')->with('post' => $post)->with('comment' => $comment);

// Pass multiple values with an array
return view('post', ['post' => $post]);

// With compact function
return view('post', compact('post'));
```

## Templates

When defining a child view, use the Blade `@extends` directive to specify which layout the child view should "inherit". Views which extend a Blade layout may inject content into the layout's sections using `@section` directives.  The contents of these sections will be displayed in the layout using `@yield:`

```php
<!-- Stored in resources/views/layouts/app.blade.php -->

<html>
    <head>
        <title>App Name - @yield('title')</title>
    </head>
    <body>
        @section('sidebar')
            This is the master sidebar.
        @show

        <div class="container">
            @yield('content')
        </div>
    </body>
</html>
```

### Subviews (partial views)

It is posible to define partial contents and include them in the views with the `@include` directive:

```php
// resources/views/partials/nav.blade.php
<nav>
<a href="{{ route('start') }}">Start</a>
 &nbsp;&nbsp;
<a href="{{ route('book_list') }}">List of books</a>
</nav>
```

```php
<html>
		 <head>
				 <title>
						 @yield('title')
				 </title>
		 </head>
		 <body>
				 @include('partials.nav')
				 @yield('content')
		 </body>
</html>
```

## Links

```php
// php:
echo '<a href="/contact">contact</a>';

// html:
<a href="{{ route('path_contact') }}">contact</a>

// blade:
<a href="{{ url('/contact') }}">contact</a>
```