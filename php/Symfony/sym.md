# Intro 

## Requires

```php 
// Checking system requirements
symfony check:req

// new minimal app
symfony new myapp

// Add twig (templates)
composer require templates

// Check installed recipes
composer recipes

// Update recipes
composer recipes:update

// Install debug
composer require debug

//To serialize objets to json 
composer require serializer

// Install asset
composer require symfony/asset

// Show every route in your app
php bin/console debug:router

// Check injected services
php bin/console debug:autowiring

// Install webpack
composer require symfony/stimuls-bundle
npm install


```

## Routes

```php
class SongController extends AbstractController
{
    #[Route('/api/songs/{id}', name: 'app_songs', methods: ['GET'])]
    public function getSong(string $id = null): Response
    {
// ... lines 15 - 22
    }
}
```

```php
// Specify type: only numbers(d+)
#[Route('/api/songs/{id<\d+>}', methods: ['GET'])]
```

## Twig

Twig has exactly three different syntaxes:

### Say something

```php
{{ title }}
```

### Create comment

```php
{# TODO: add an image of the record #}
```

### Do something

```php
<ul>
    {% for track in tracks %}
        <li>
            {{ track }}
        </li>
    {% endfor %}
</ul>
```

### twig inheritance

```php
{% extends 'base.html.twig' %}
{% block body %}
<title>{% block title %}Mixed Vinyl{% endblock %}</title>

<div>
    Tracks:
    <ul>
        {% for track in tracks %}
            <li>
                {{ track.song }} - {{ track.artist }}
            </li>
        {% endfor %}
    </ul>
</div>
{% endblock %}
```

## Assets and links

- composer require symfony/asset

- Public content like images or css goes into **public** folder. 
we can use the **asset** function to set the path relative to the public directory: 

```php
{{ asset('styles/app.css' )}}
```

- To generate links to routes, add name to the route: 
 
 ```php
#[Route('/', name: 'app_homepage')]
```

and use it with the **Path** function: 

```php
<a href="{{ path('app_homepage') }}">Pop</a>
```

- To pass slug parameters 

```php
<a href="{{ path('add_homepage', { slug: 'pop' }) }}">Pop</a>
```