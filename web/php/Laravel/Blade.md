# Blade

[Blade - Laravel guide (laravel-guide.readthedocs.io)](https://laravel-guide.readthedocs.io/en/latest/blade/)

## Displaying Data

### Variables

```php
Hello, {{ $name }}.
The current UNIX timestamp is {{ time() }}.
{{ $name or 'Default' }} // if the $name variable does not exist, the word Default will be displayed.
```

```php
// display unescaped data
Hello, {!! $name !!}. 
```

### Embeded Javascript code

```php
// The @ symbol left an expression untouched
<h1>Laravel</h1>
Hello, @{{ name }}.
```

### Embeded PHP code

```php
@php
    //
@endphp
```

### Comments

```php
{{-- This comment will not be present in the rendered HTML --}}
```

## Controls structures

### If Statements

```php
@if(Auth::check())
	You are logged in!
@else
	You are not logged in
@endif

```

### For Loops

```php
@for ($i = 0; $i < 10; $i++)
    The current value is {{ $i }}
@endfor

@foreach ($users as $user)
    <p>This is user {{ $user->id }}</p>
@endforeach

@forelse ($users as $user)
    <li>{{ $user->name }}</li>
@empty
    <p>No users</p>
@endforelse
```

### $Loop

The for iteratos have available an object called `$loop` with a series of properties about the loop we are iterating, such as:

- `index` position.
- `count`  elements.
- `first` element.
- `last` element.

```php
// check if it is the last item in the list, and display a special message
<ul>
		@forelse($elements the $element)
				<li>{{ $element }} {{ $loop->last ? "Last item" : "" }}</li>
						 @empty
				< li>No items to display</li>
		 @endforelse
</ul>
```

### While Loop

```php
@while (true)
    <p>I'm looping forever.</p>
@endwhile
```

### Check if a variable is defined

```php
// check if variable is defined
<ul>
	@isset($elements)
		 	 @foreach($elements the $element)
			  	< li>{{ $element }}</li>
		   @endforeach
	@else
		< li>No items to display</li>
	@endisset
</ul>
```