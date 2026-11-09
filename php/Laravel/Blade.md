# Blade

Docs: <https://laravel.com/docs/12.x/blade> · Components: [Components.md](Components.md) · Policies in views: [Policies.md](Policies.md#how-to-use-policies-with-blade-templates)

Views live in `resources/views` and end in `.blade.php`. They are returned from routes/controllers:

```php
return view('posts.index', ['posts' => Post::latest()->get()]);   // resources/views/posts/index.blade.php
```

```bash
php artisan make:view posts.index    # creates resources/views/posts/index.blade.php
```

## Displaying Data

### Variables

```blade
Hello, {{ $name }}.
The current UNIX timestamp is {{ time() }}.
{{ $name ?? 'Default' }} {{-- if $name does not exist (or is null), Default is displayed --}}
```

`{{ }}` escapes the output with `htmlspecialchars` (protection against XSS).

```blade
{{-- display unescaped data (only with trusted HTML!) --}}
Hello, {!! $name !!}.
```

### Embedded Javascript code

```blade
{{-- The @ symbol leaves the expression untouched (for Vue, Alpine...) --}}
<h1>Laravel</h1>
Hello, @{{ name }}.

{{-- Whole block untouched --}}
@verbatim
    <div>{{ name }} {{ email }}</div>
@endverbatim

{{-- Pass PHP data to JS safely --}}
<script>
    const user = {{ Js::from($user) }};
</script>
```

### Embedded PHP code

```blade
@php
    $total = $items->sum('price');
@endphp

@use('App\Models\Post')   {{-- import a class into the view --}}
```

### Comments

```blade
{{-- This comment will not be present in the rendered HTML --}}
```

## Controls structures

### If Statements

```blade
@if (Auth::check())
    You are logged in!
@elseif ($trial)
    Trial
@else
    You are not logged in
@endif

@unless ($user->isAdmin())
    Not admin
@endunless

@auth   Logged in   @endauth
@guest  Guest       @endguest

@env('local')
    <p>Local environment</p>
@endenv
```

### Switch

```blade
@switch($status)
    @case('draft')
        Draft
        @break
    @case('published')
        Published
        @break
    @default
        Unknown
@endswitch
```

### For Loops

```blade
@for ($i = 0; $i < 10; $i++)
    The current value is {{ $i }}
@endfor

@foreach ($users as $user)
    @continue($user->banned)
    <p>This is user {{ $user->id }}</p>
    @break($loop->iteration === 10)
@endforeach

@forelse ($users as $user)
    <li>{{ $user->name }}</li>
@empty
    <p>No users</p>
@endforelse
```

### $loop

Inside `@foreach`/`@forelse` there is a `$loop` object with information about the loop we are iterating:

| Property | Meaning |
|----------|---------|
| `$loop->index` | position, starting at 0 |
| `$loop->iteration` | position, starting at 1 |
| `$loop->remaining` | iterations left |
| `$loop->count` | number of elements |
| `$loop->first` / `$loop->last` | first / last element |
| `$loop->even` / `$loop->odd` | even / odd iteration |
| `$loop->depth`, `$loop->parent` | nested loops |

```blade
{{-- check if it is the last item in the list, and display a special message --}}
<ul>
    @forelse ($elements as $element)
        <li>{{ $loop->iteration }}. {{ $element }} {{ $loop->last ? 'Last item' : '' }}</li>
    @empty
        <li>No items to display</li>
    @endforelse
</ul>
```

Result for `['a', 'b']`:

```html
<ul>
    <li>1. a </li>
    <li>2. b Last item</li>
</ul>
```

### While Loop

```blade
@while (true)
    <p>I'm looping forever.</p>
@endwhile
```

### Check if a variable is defined

```blade
{{-- check if variable is defined and not null --}}
<ul>
    @isset($elements)
        @foreach ($elements as $element)
            <li>{{ $element }}</li>
        @endforeach
    @else
        <li>No items to display</li>
    @endisset
</ul>

@empty($records)
    No records
@endempty
```

## Attributes helpers

```blade
<span @class(['badge', 'badge-red' => $hasError, 'font-bold' => $isActive])></span>
<div @style(['color: red' => $hasError])></div>

<input type="checkbox" name="active" @checked(old('active', $user->active)) />
<option value="es" @selected($locale === 'es')>Español</option>
<button @disabled($errors->isNotEmpty())>Save</button>
<input name="email" @readonly($user->isNotAdmin()) @required(true) />
```

## Forms

```blade
<form method="POST" action="{{ route('posts.update', $post) }}">
    @csrf               {{-- hidden _token field (mandatory in POST/PUT/DELETE) --}}
    @method('PUT')      {{-- HTML forms only support GET/POST --}}

    <input name="title" value="{{ old('title', $post->title) }}"
           @class(['input', 'is-invalid' => $errors->has('title')])>

    @error('title')
        <p class="error">{{ $message }}</p>
    @enderror

    <button>Save</button>
</form>
```

## Include sub-views

```blade
@include('partials.header')
@include('partials.item', ['item' => $item])      {{-- pass extra data --}}
@includeIf('partials.optional')                    {{-- only if the view exists --}}
@includeWhen($user->isAdmin(), 'partials.admin')

@each('partials.item', $items, 'item', 'partials.no-items')
```

## Layouts

### With components (recommended)

```blade
{{-- resources/views/components/layout.blade.php --}}
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <title>{{ $title ?? 'My app' }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    {{ $slot }}
</body>
</html>
```

```blade
{{-- resources/views/posts/index.blade.php --}}
<x-layout title="Posts">
    <h1>Posts</h1>
</x-layout>
```

### With template inheritance

```blade
{{-- resources/views/layouts/app.blade.php --}}
<html>
<head>
    <title>@yield('title', 'My app')</title>
    @stack('scripts')
</head>
<body>
    @section('sidebar')
        Main sidebar
    @show

    <main>@yield('content')</main>
</body>
</html>
```

```blade
{{-- resources/views/posts/index.blade.php --}}
@extends('layouts.app')

@section('title', 'Posts')

@section('sidebar')
    @parent    {{-- keep the layout content --}}
    <p>Extra sidebar</p>
@endsection

@section('content')
    <h1>Posts</h1>
@endsection

@push('scripts')
    <script src="/chart.js"></script>
@endpush
```

## Others

```blade
@json($data)                       {{-- json_encode --}}
@once ... @endonce                 {{-- render only once, even inside loops --}}
@session('status')
    <div class="alert">{{ $value }}</div>   {{-- flash message: redirect()->with('status', 'Saved!') --}}
@endsession
{{ __('messages.welcome') }}       {{-- translations, see new/language.md --}}
```
