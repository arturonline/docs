# How to use ajax with Laravel

Related: [Blade.md](Blade.md), [Api/api.md](Api/api.md) (JSON APIs).

## 1. GET: reload a partial view

In your blade view, you can have a select box or a button that triggers an ajax request when changed or clicked. You can use the `data-` attribute to pass some parameters to the request, such as a URL, a filter or an id. For example:

```blade
{{-- resources/views/items.blade.php --}}
<select id="filter" data-url="{{ route('items.list') }}">
    <option value="all">All</option>
    <option value="new">New</option>
    <option value="expired">Expired</option>
</select>

<div id="items-container">
    @include('_items') {{-- Includes another blade view file into the current view --}}
</div>
```

```blade
{{-- resources/views/_items.blade.php --}}
<ul>
    @forelse ($items as $item)
        <li>{{ $item->name }} ({{ $item->status }})</li>
    @empty
        <li>No items</li>
    @endforelse
</ul>
```

In your script section, you can listen for the change or click event and make an ajax request to the url specified in the data attribute. You can pass the selected value as a query parameter. You can also handle the success or error response and update the DOM accordingly. For example:

```js
// get the filter element by id
const filter = document.getElementById('filter');

// add an event listener for the change event
filter.addEventListener('change', async () => {
  // build the url from the data attribute + the filter value
  const url = `${filter.dataset.url}?filter=${encodeURIComponent(filter.value)}`;

  try {
    const response = await fetch(url, {
      // fetch does NOT send this header by default; Laravel's $request->ajax() needs it
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });
    if (!response.ok) throw new Error(response.status);

    // replace the list with the returned HTML
    document.getElementById('items-container').innerHTML = await response.text();
  } catch (error) {
    alert('Something went wrong!');
  }
});
```

In your controller, you can define a method that handles the ajax request and returns a view or a partial view with the data you want to display. You can use the `$request->ajax()` method to check if the request is an ajax request and return a different response accordingly. For example:

```php
// app/Http/Controllers/ItemController.php
public function items(Request $request)
{
    $filter = $request->input('filter', 'all');

    $items = Item::query()
        ->when($filter !== 'all', fn ($query) => $query->where('status', $filter))
        ->get();

    if ($request->ajax()) {
        return view('_items', compact('items'));   // only the partial
    }

    return view('items', compact('items'));        // full page
}
```

In your routes file, you can define a route that points to the controller method that handles the ajax request. You can use any HTTP verb that suits your needs, such as GET or POST. For example:

```php
// routes/web.php
use App\Http\Controllers\ItemController;

Route::get('/items', [ItemController::class, 'items'])->name('items.list');
```

Result: `GET /items?filter=new` with the header returns only the `<ul>...</ul>`; without it, the whole page.

### Alternative: Blade fragments

Instead of a separate partial file, mark a fragment in the full view and return only that part:

```blade
{{-- resources/views/items.blade.php --}}
@fragment('items-list')
    <ul>
        @foreach ($items as $item)
            <li>{{ $item->name }}</li>
        @endforeach
    </ul>
@endfragment
```

```php
return view('items', compact('items'))
    ->fragmentIf($request->ajax(), 'items-list');
```

## 2. POST: send JSON and get JSON back

POST/PUT/DELETE requests to `web` routes need the CSRF token.

```blade
{{-- layout <head> --}}
<meta name="csrf-token" content="{{ csrf_token() }}">

<button id="like" data-url="{{ route('posts.like', $post) }}">Like ({{ $post->likes }})</button>
```

```js
const button = document.getElementById('like');

button.addEventListener('click', async () => {
  const response = await fetch(button.dataset.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',   // validation errors come back as JSON (422)
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
    },
    body: JSON.stringify({ source: 'button' }),
  });

  const data = await response.json();   // { "likes": 8 }
  button.textContent = `Like (${data.likes})`;
});
```

```php
// routes/web.php
Route::post('/posts/{post}/like', [PostController::class, 'like'])
    ->middleware('auth')
    ->name('posts.like');

// PostController
public function like(Request $request, Post $post)
{
    $request->validate(['source' => 'nullable|string|max:20']);

    $post->increment('likes');

    return response()->json(['likes' => $post->likes]);
}
```

> If you use axios (`resources/js/bootstrap.js`), the `X-Requested-With` header and the `XSRF-TOKEN` cookie are sent automatically.

Status codes to handle in JS: `419` CSRF token expired (page too old), `422` validation errors (`{ "message": ..., "errors": { "field": [...] } }`), `401/403` not logged in / not allowed.
