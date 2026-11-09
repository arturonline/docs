# Components

Docs: <https://laravel.com/docs/12.x/blade#components> · See also [Blade.md](Blade.md)

There are two approaches to writing components: **anonymous components** (only a Blade file) and **class based components** (PHP class + Blade file).

## Displaying Components

To display a component, you may use a Blade component tag within one of your Blade templates. Blade component tags start with the string `x-` followed by the kebab case name of the component:

```blade
<x-alert/>                 {{-- resources/views/components/alert.blade.php or App\View\Components\Alert --}}
<x-forms.input/>           {{-- resources/views/components/forms/input.blade.php --}}
<x-user-profile/>          {{-- UserProfile class / user-profile.blade.php --}}
```

## Anonymous components

Consist of a single Blade view file. No associated PHP class.

```bash
php artisan make:component alert --view
# creates resources/views/components/alert.blade.php
```

### Props

The `@props` directive defines the properties that the component expects (with optional defaults). Everything else goes to `$attributes`.

```blade
{{-- resources/views/components/button.blade.php --}}
@props(['type' => 'button', 'label'])

<button type="{{ $type }}" {{ $attributes->merge(['class' => 'btn btn-primary']) }}>
    {{ $label }}
</button>
```

Given the component definition above, we may render the component like so:

```blade
<x-button type="submit" label="Submit Form" class="btn-success" />
```

Result (`class` values are appended):

```html
<button type="submit" class="btn btn-primary btn-success">
    Submit Form
</button>
```

PHP expressions and variables should be passed to the component via attributes that use the `:` character as a prefix:

```blade
<x-alert :message="$message"/>
<x-alert message="Plain string"/>
<x-alert :dismissible="true"/>        {{-- a real boolean, not the string "true" --}}
```

### Index component

A folder with an `index.blade.php` (or a file with the same name as the folder) is rendered as the root:

```text
components/card/index.blade.php    -> <x-card>
components/card/header.blade.php   -> <x-card.header>
```

### Accessing parent data: @aware

```blade
{{-- components/menu/index.blade.php --}}
@props(['color' => 'gray'])
<ul class="bg-{{ $color }}-200">{{ $slot }}</ul>

{{-- components/menu/item.blade.php --}}
@aware(['color' => 'gray'])
<li class="text-{{ $color }}-800">{{ $slot }}</li>
```

```blade
<x-menu color="purple">
    <x-menu.item>Home</x-menu.item>    {{-- gets color="purple" --}}
</x-menu>
```

## Class based components

Consist of a PHP class and a Blade view file. The class handles the logic, while the view handles the presentation.

```bash
php artisan make:component Alert
# app/View/Components/Alert.php + resources/views/components/alert.blade.php

# Create component within subdirectory
php artisan make:component Forms/Input     # <x-forms.input/>
```

Components are automatically discovered within the `app/View/Components` directory and `resources/views/components` directory, so no further component registration is typically required.

### Props in class components

You should define all of the component's data attributes in its class constructor. Public properties are available in the view:

```php
namespace App\View\Components;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Alert extends Component
{
    public function __construct(
        public string $type = 'info',
        public string $message = '',
    ) {}

    public function render(): View
    {
        return view('components.alert');
    }
}
```

Component constructor arguments should be specified using camelCase (`$alertType`), and kebab-case in the tag (`alert-type="..."`).

When your component is rendered, you may display the contents of your component's public variables by echoing the variables by name:

```blade
{{-- resources/views/components/alert.blade.php --}}
<div {{ $attributes->class(['alert', 'alert-' . $type]) }}>
    {{ $message }}
</div>
```

```blade
<x-alert type="danger" message="Saved failed" id="main-alert"/>
{{-- <div class="alert alert-danger" id="main-alert">Saved failed</div> --}}
```

#### Short Attribute Syntax

If the attribute name matches the variable name you can omit the value:

```blade
{{-- Short attribute syntax... --}}
<x-profile :$userId :$name />

{{-- Is equivalent to... --}}
<x-profile :user-id="$userId" :name="$name" />
```

### Using methods as attributes

```php
public function __construct(public string $selected = '') {}

/**
 * Determine if the given option is the currently selected option.
 */
public function isSelected(string $option): bool
{
    return $option === $this->selected;
}
```

```blade
<option {{ $isSelected($value) ? 'selected' : '' }} value="{{ $value }}">
    {{ $label }}
</option>
```

### Render conditionally

```php
public function shouldRender(): bool
{
    return $this->message !== '';   // the component outputs nothing if false
}
```

### Accessing Attributes & Slots Within Component Classes

Blade components also allow you to access the component name, attributes, and slot inside the class's render method:

```php
public function render(): \Closure
{
    return function (array $data) {
        // $data['componentName'];
        // $data['attributes'];
        // $data['slot'];

        return '<div>Components content</div>';
    };
}
```

## Attributes bag

```blade
{{ $attributes }}                                   {{-- all non-prop attributes --}}
{{ $attributes->merge(['class' => 'btn']) }}         {{-- class is appended, others overwritten --}}
{{ $attributes->class(['p-4', 'bg-red' => $error]) }}
{{ $attributes->only(['id']) }} / {{ $attributes->except(['class']) }}
{{ $attributes->whereStartsWith('wire:model') }}
@if ($attributes->has('disabled')) ... @endif
{{ $attributes->get('placeholder', 'Type...') }}
```

## Slots

```blade
{{-- resources/views/components/alert.blade.php --}}
<div class="alert alert-danger">
    {{ $slot }}
</div>
```

```blade
<x-alert>
    <strong>Whoops!</strong> Something went wrong!
</x-alert>
```

Check whether the slot is empty: `@if ($slot->isEmpty()) Default content @endif`.

### Multiple (named) slots

```blade
{{-- resources/views/components/alert.blade.php --}}
@props(['title'])

<span {{ $title->attributes->class(['alert-title']) }}>{{ $title }}</span>

<div class="alert alert-danger">
    {{ $slot }}
</div>
```

```blade
<x-alert>
    <x-slot:title class="font-bold">
        Server Error
    </x-slot>

    <strong>Whoops!</strong> Something went wrong!
</x-alert>
```

Public methods or properties of a class component can be accessed within your slot via the `$component` variable:

```blade
<x-alert>
    <x-slot:title>
        {{ $component->formatAlert('Server Error') }}
    </x-slot>

    <strong>Whoops!</strong> Something went wrong!
</x-alert>
```

In this example, we assume that the `x-alert` component has a public `formatAlert` method defined on its component class.

## Layout component

See [Blade.md › Layouts](Blade.md#layouts):

```blade
<x-layout title="Dashboard">
    <x-slot:header>Dashboard</x-slot>
    Content...
</x-layout>
```
