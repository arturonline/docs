# Policies & Gates

Docs: <https://laravel.com/docs/12.x/authorization>

- **Gates**: closures for simple, global checks ("is admin?", "can see the reports?").
- **Policies**: classes that group the authorization actions for a particular model or resource (`PostPolicy` for `Post`).

Authentication (who you are) is covered in [Auth with Breeze.md](Auth%20with%20Breeze.md); a simple role column in [new/roles.md](new/roles.md).

## Gates

Define them in `App\Providers\AppServiceProvider::boot()`:

```php
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

public function boot(): void
{
    Gate::define('view-reports', fn (User $user) => $user->is_admin);

    Gate::define('update-post', fn (User $user, Post $post) => $user->id === $post->user_id);
}
```

Use them:

```php
if (Gate::allows('view-reports')) { /* ... */ }
if (Gate::denies('update-post', $post)) { abort(403); }

Gate::authorize('update-post', $post);   // throws AuthorizationException -> 403

$request->user()->can('view-reports');   // same thing from the user
```

## Policies

With Policies you can group your authorization actions for a particular model or resource.

### How to create policies

```bash
php artisan make:policy PostPolicy --model=Post
# INFO  Policy [app/Policies/PostPolicy.php] created successfully.
```

```php
// app/Policies/PostPolicy.php
namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostPolicy
{
    // Runs before any other method: true/false decides, null continues
    public function before(User $user, string $ability): ?bool
    {
        return $user->is_admin ? true : null;
    }

    public function viewAny(?User $user): bool      // ?User = guests allowed
    {
        return true;
    }

    public function create(User $user): bool         // no model instance
    {
        return $user->hasVerifiedEmail();
    }

    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    public function delete(User $user, Post $post): Response
    {
        return $user->id === $post->user_id
            ? Response::allow()
            : Response::deny('You do not own this post.');   // custom 403 message
    }
}
```

### Registering

Nothing to do: policies are **auto-discovered** if they follow the convention `App\Models\Post` → `App\Policies\PostPolicy`.

Otherwise register them explicitly:

```php
// On the model (Laravel 12)
use App\Policies\PostPolicy;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;

#[UsePolicy(PostPolicy::class)]
class Post extends Model {}

// or in AppServiceProvider::boot()
Gate::policy(Post::class, PostPolicy::class);
```

### Using policies

```php
// Controller
use Illuminate\Support\Facades\Gate;

public function update(Request $request, Post $post)
{
    Gate::authorize('update', $post);            // 403 if not allowed

    $post->update($request->validate(['title' => 'required|max:255']));

    return redirect()->route('posts.show', $post);
}

public function store(Request $request)
{
    Gate::authorize('create', Post::class);      // actions without a model -> pass the class
    // ...
}
```

> In Laravel 11+ the base `Controller` is empty. To use `$this->authorize('update', $post)` add the trait `Illuminate\Foundation\Auth\Access\AuthorizesRequests` to `app/Http/Controllers/Controller.php`.

```php
// Route middleware
Route::put('/posts/{post}', [PostController::class, 'update'])->can('update', 'post');
Route::post('/posts', [PostController::class, 'store'])->can('create', Post::class);

// Anywhere
$user->can('update', $post);       // bool
$user->cannot('delete', $post);
```

Form Requests can authorize too:

```php
// app/Http/Requests/UpdatePostRequest.php
public function authorize(): bool
{
    return $this->user()->can('update', $this->route('post'));
}
```

## How to Use Policies With Blade Templates

You can also use policies in blade templates, if you want to display a code snippet only when the logged-in user is authorized to perform a specific action.

```blade
@can('delete', $post)
    <form method="POST" action="{{ route('posts.destroy', $post) }}">
        @csrf @method('DELETE')
        <button>Delete</button>
    </form>
@endcan

@cannot('update', $post)
    <p>Read only</p>
@endcannot

@can('create', App\Models\Post::class)
    <a href="{{ route('posts.create') }}">New post</a>
@endcan

@canany(['update', 'delete'], $post)
    <span>Actions</span>
@endcanany
```

In the first case, it'll only display the delete form to a user who is authorized to perform the `delete` action on the Post model.

## Testing (Pest)

```php
use App\Models\Post;
use App\Models\User;

it('forbids editing posts of other users', function () {
    $post = Post::factory()->create();

    $this->actingAs(User::factory()->create())
        ->put(route('posts.update', $post), ['title' => 'Hacked'])
        ->assertForbidden();                       // 403
});

it('lets the owner update the post', function () {
    $post = Post::factory()->create();

    expect($post->user->can('update', $post))->toBeTrue();
});
```
