# Components

There are two approaches to writing components: class based components and anonymous components.

## Anonymous components

```sh
php artisan make:component alert --view
```

### Displaying anonymous Components

To display a component, you may use a Blade component tag within one of your Blade templates. Blade component tags start with the string `x-` followed by the kebab case name of the component class:


```html
<x-alert/>
```

### Props in anonymous Components

```php
@props(['type' => 'info', 'message'])
 
<div {{ $attributes->merge(['class' => 'alert alert-'.$type]) }}>
    {{ $message }}
</div>
```

Given the component definition above, we may render the component like so:

```php
<x-alert type="error" :message="$message" class="mb-4"/>
```

The command above will create a Blade file at `resources/views/components/alert.blade.php`

## Class based components

```sh
php artisan make:component Alert

# Create component within subdirectory
php artisan make:component Forms/Input
```

The `make:component` command will also create a view template for the component. The view will be placed in the `resources/views/components` directory.

Components are automatically discovered within the `app/View/Components` directory and `resources/views/components` directory, so no further component registration is typically required.

### Displaying class Components

To display a component, you may use a Blade component tag within one of your Blade templates. Blade component tags start with the string `x-` followed by the kebab case name of the component class:


```html
<x-alert/>
```

### Props in class components

You may pass data to Blade components using HTML attributes:

```html
<x-alert type="error"/>
```

PHP expressions and variables should be passed to the component via attributes that use the : character as a prefix:

```html
<x-alert :message="$message"/>
```

You should define all of the component's data attributes in its class constructor:

```php
namespace App\View\Components;
 
use Illuminate\View\Component;
 
class Alert extends Component
{
    public $type;

    public $message;
 
    public function __construct($type, $message)
    {
        $this->type = $type;
        $this->message = $message;
    }

    public function render()
    {
        return view('components.alert');
    }
}
```

Component constructor arguments should be specified using camelCase.

When your component is rendered, you may display the contents of your component's public variables by echoing the variables by name:

```php
<div class="alert alert-{{ $type }}">
    {{ $message }}
</div>
```

#### Short Attribute Syntax in class components

If attribute name match the variable name you can omit the name:

```html
{{-- Short attribute syntax... --}}
<x-profile :$userId :$name />
 
{{-- Is equivalent to... --}}
<x-profile :user-id="$userId" :name="$name" />
```

### Using methods as attributes

```php
/**
 * Determine if the given option is the currently selected option.
 *
 * @param  string  $option
 * @return bool
 */
public function isSelected($option)
{
    return $option === $this->selected;
}
```


```html
<option {{ $isSelected($value) ? 'selected' : '' }} value="{{ $value }}">
    {{ $label }}
</option>
```

### Accessing Attributes & Slots Within Component Classes

Blade components also allow you to access the component name, attributes, and slot inside the class's render method:

```php
public function render()
{
    return function (array $data) {
        // $data['componentName'];
        // $data['attributes'];
        // $data['slot'];
 
        return '<div>Components content</div>';
    };
}
```

### Slots

```html
<!-- /resources/views/components/alert.blade.php -->
 
<div class="alert alert-danger">
    {{ $slot }}
</div>

<x-alert>
    <strong>Whoops!</strong> Something went wrong!
</x-alert>
```

## Multiple slots

```html
<!-- /resources/views/components/alert.blade.php -->
 
<span class="alert-title">{{ $title }}</span>
 
<div class="alert alert-danger">
    {{ $slot }}
</div>

<x-alert>
    <x-slot:title>
        Server Error
    </x-slot>
 
    <strong>Whoops!</strong> Something went wrong!
</x-alert>
```

Public methods or properties on your component and accessing the component within your slot via the `$component` variable:

```html
<x-alert>
    <x-slot:title>
        {{ $component->formatAlert('Server Error') }}
    </x-slot>
 
    <strong>Whoops!</strong> Something went wrong!
</x-alert>
```

In this example, we will assume that the x-alert component has a public formatAlert method defined on its component class

https://laravel.com/docs/9.x/blade#using-attributes-slots-within-component-class