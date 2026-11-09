# Intro

Symfony 7.x (requires PHP 8.2+). Docs: <https://symfony.com/doc/current/index.html> · Database: [doctrine.md](doctrine.md)

## Requires

Install the Symfony CLI (<https://symfony.com/download>) and Composer.

```bash
# Checking system requirements
symfony check:req

# new full web app (Twig, Doctrine, forms, security, AssetMapper, MakerBundle...)
symfony new myapp --webapp
# new minimal app (microservice, API, console)
symfony new myapp
# specific version
symfony new myapp --version=lts --webapp     # or --version=7.3
# without the CLI
composer create-project symfony/skeleton:"7.3.*" myapp

cd myapp
symfony server:start -d        # https://127.0.0.1:8000
symfony server:stop
```

```bash
# Add twig (templates)
composer require templates

# Check installed recipes
composer recipes

# Update recipes
composer recipes:update

# Install debug (profiler/web debug toolbar + dump())
composer require --dev debug

# To serialize objects to json
composer require serializer

# Install asset (asset() function in Twig)
composer require symfony/asset

# Code generator
composer require --dev symfony/maker-bundle
php bin/console list make
```

```bash
# Show every route in your app
php bin/console debug:router
php bin/console router:match /api/songs/5

# Check injected services
php bin/console debug:autowiring
php bin/console debug:autowiring logger
php bin/console debug:container

# Configuration and env vars
php bin/console debug:config framework
php bin/console debug:dotenv

# Clear cache
php bin/console cache:clear
```

## Frontend: AssetMapper (default) or Webpack Encore

```bash
# AssetMapper: no Node/build step, files in assets/ (default in --webapp)
composer require symfony/asset-mapper symfony/stimulus-bundle
php bin/console importmap:require bootstrap     # add a JS package
php bin/console asset-map:compile               # production

# Webpack Encore (legacy, needs Node)
composer require symfony/webpack-encore-bundle
npm install && npm run dev
```

```twig
{# templates/base.html.twig #}
{% block javascripts %}
    {% block importmap %}{{ importmap('app') }}{% endblock %}
{% endblock %}
```

## Routes

Routes are defined with the `#[Route]` attribute on controller methods.

```bash
php bin/console make:controller SongController
# created: src/Controller/SongController.php
# created: templates/song/index.html.twig
```

```php
// src/Controller/SongController.php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/songs', name: 'api_songs_')]     // prefix for every route in the class
class SongController extends AbstractController
{
    #[Route('/{id<\d+>}', name: 'get', methods: ['GET'])]
    public function getSong(int $id): JsonResponse
    {
        $song = ['id' => $id, 'name' => 'Waterfalls', 'url' => 'https://example.com/song.mp3'];

        return $this->json($song);
        // GET /api/songs/5 -> {"id":5,"name":"Waterfalls","url":"https://example.com/song.mp3"}
    }

    #[Route('/genre/{slug}', name: 'genre', methods: ['GET'])]
    public function genre(?string $slug = null): Response
    {
        return $this->render('song/genre.html.twig', ['genre' => $slug]);
    }
}
```

```php
// Specify type: only numbers (\d+)
#[Route('/api/songs/{id<\d+>}', methods: ['GET'])]

// Default value for a parameter
#[Route('/blog/{page<\d+>?1}', name: 'blog_list')]

// Requirements and priority
#[Route('/blog/{slug}', name: 'blog_show', requirements: ['slug' => '[a-z0-9-]+'], priority: -1)]
```

### Request data

```php
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;

// GET /songs?page=2&q=rock
#[Route('/songs')]
public function list(
    #[MapQueryParameter] int $page = 1,
    #[MapQueryParameter] ?string $q = null,
): Response { /* ... */ }

// POST JSON body -> DTO (validated, 422 on errors)
#[Route('/api/songs', methods: ['POST'])]
public function create(#[MapRequestPayload] SongDto $dto): JsonResponse
{
    return $this->json($dto, 201);
}

// Or the classic Request object
public function search(Request $request): Response
{
    $q = $request->query->get('q');           // ?q=
    $name = $request->request->get('name');   // form POST
    $data = $request->toArray();              // JSON body
}
```

### Controller helpers (AbstractController)

```php
$this->render('song/index.html.twig', ['songs' => $songs]);
$this->json($data, 200);
$this->redirectToRoute('app_homepage');
$this->addFlash('success', 'Saved!');
$this->createNotFoundException('Not found');   // throw it -> 404
$this->getUser();
$this->denyAccessUnlessGranted('ROLE_ADMIN');
```

## Services and autowiring

Every class in `src/` is a service; type-hint it in a constructor or controller method and Symfony injects it.

```php
// src/Service/SongFormatter.php
namespace App\Service;

use Psr\Log\LoggerInterface;

class SongFormatter
{
    public function __construct(private LoggerInterface $logger) {}

    public function format(string $name): string
    {
        $this->logger->info('Formatting {name}', ['name' => $name]);
        return ucwords($name);
    }
}

// In a controller
public function show(SongFormatter $formatter): Response
{
    return new Response($formatter->format('waterfalls'));   // Waterfalls
}
```

## Twig

Twig has exactly three different syntaxes:

### Say something

```twig
{{ title }}
{{ song.name|upper }}          {# filters #}
{{ 'now'|date('d/m/Y') }}
```

### Create comment

```twig
{# TODO: add an image of the record #}
```

### Do something

```twig
<ul>
    {% for track in tracks %}
        <li>
            {{ loop.index }}. {{ track }}
        </li>
    {% else %}
        <li>No tracks</li>
    {% endfor %}
</ul>

{% if tracks|length > 10 %}Long list{% endif %}
{% set total = tracks|length %}
```

### twig inheritance

```twig
{# templates/vinyl/homepage.html.twig #}
{% extends 'base.html.twig' %}

{% block title %}Mixed Vinyl{% endblock %}

{% block body %}
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

`base.html.twig` defines the blocks (`{% block title %}{% endblock %}` inside `<title>`, `{% block body %}{% endblock %}` inside `<body>`); child templates override them. Use `{{ parent() }}` to keep the parent content.

```twig
{{ include('song/_card.html.twig', { song: song }) }}   {# partial #}
```

## Assets and links

- `composer require symfony/asset`

- Public content like images or css goes into the **public** folder (or **assets/** with AssetMapper).
We can use the **asset** function to set the path relative to the public directory:

```twig
<link rel="stylesheet" href="{{ asset('styles/app.css') }}">
<img src="{{ asset('images/logo.png') }}" alt="Logo">
```

- To generate links to routes, add a name to the route:

```php
#[Route('/', name: 'app_homepage')]
```

and use it with the **path** function (`url()` for absolute URLs):

```twig
<a href="{{ path('app_homepage') }}">Home</a>
```

- To pass parameters (slug):

```php
#[Route('/browse/{slug}', name: 'app_browse')]
```

```twig
<a href="{{ path('app_browse', { slug: 'pop' }) }}">Pop</a>   {# /browse/pop #}
```

In PHP: `$this->generateUrl('app_browse', ['slug' => 'pop'])`.
