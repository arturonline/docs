# Policies & Gates

https://code.tutsplus.com/tutorials/gates-and-policies-in-laravel--cms-29780

## Policies

With Policies you can group your authorization actions for a particular model or resource.

## How to create policies

## How to Use Policies With Blade Templates

You can also use policies in blade templates as well, if you want to display a code snippet if the logged-in user is authorized to perform a specific action. Let's quickly look at how it works.

```php
@can('delete', $post)
    <!-- Display delete link here... -->
@endcan
```

In the above case, it'll only display the delete link to a user who is authorized to perform the delete action on the Post model.