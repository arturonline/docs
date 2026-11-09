# Doctrine

Symfony 7 + Doctrine ORM 3 + Doctrine Migrations. Mapping is done with PHP attributes (annotations were removed in ORM 3). Docs: <https://symfony.com/doc/current/doctrine.html>

Back to [sym.md](sym.md).

## Recipes

```bash
# install (already included in `symfony new myapp --webapp`)
composer require symfony/orm-pack
composer require --dev symfony/maker-bundle

# Create database (uses DATABASE_URL from .env / .env.local)
php bin/console doctrine:database:create

# Create or update an entity (interactive)
php bin/console make:entity

# Create migration (diff between entities and the database)
php bin/console make:migration

# Migrate
php bin/console doctrine:migrations:migrate

# Check pending migrations
php bin/console doctrine:migrations:status
php bin/console doctrine:migrations:list

# Rollback the last migration
php bin/console doctrine:migrations:migrate prev

# Validate mapping and DB sync
php bin/console doctrine:schema:validate

# Query the database directly
php bin/console dbal:run-sql 'SELECT * FROM product'
```

## Connection

```ini
# .env.local (not committed)
DATABASE_URL="mysql://app:secret@127.0.0.1:3306/app?serverVersion=8.4&charset=utf8mb4"
# DATABASE_URL="postgresql://app:secret@127.0.0.1:5432/app?serverVersion=16&charset=utf8"
# DATABASE_URL="sqlite:///%kernel.project_dir%/var/data.db"
```

## Entity

```bash
php bin/console make:entity Product
#  New property name: name     > string > 255 > nullable: no
#  New property name: price    > integer
#  New property name: description > text
#  created: src/Entity/Product.php
#  created: src/Repository/ProductRepository.php
```

```php
// src/Entity/Product.php
namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
#[ORM\Table(name: 'product')]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    private ?string $name = null;

    #[ORM\Column]
    #[Assert\Positive]
    private ?int $price = null;          // cents: 1999 = 19.99

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\ManyToOne(inversedBy: 'products')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Category $category = null;

    public function getId(): ?int { return $this->id; }

    public function getName(): ?string { return $this->name; }
    public function setName(string $name): static { $this->name = $name; return $this; }

    public function getPrice(): ?int { return $this->price; }
    public function setPrice(int $price): static { $this->price = $price; return $this; }

    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): static { $this->description = $description; return $this; }

    public function getCategory(): ?Category { return $this->category; }
    public function setCategory(?Category $category): static { $this->category = $category; return $this; }
}
```

### Relations

Run `make:entity Category`, add a property `products` of type `relation` → `OneToMany` and maker generates both sides:

```php
// src/Entity/Category.php
#[ORM\OneToMany(targetEntity: Product::class, mappedBy: 'category', orphanRemoval: true)]
private Collection $products;

public function __construct()
{
    $this->products = new ArrayCollection();
}
```

| Attribute | Example |
|-----------|---------|
| `ManyToOne` / `OneToMany` | Product → Category |
| `ManyToMany` | Product ↔ Tag (join table) |
| `OneToOne` | User → Profile |

## Crud

Inject `EntityManagerInterface` (write) or the repository (read) into the controller action.

### Get

```php
use App\Entity\Product;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/product/{id}', name: 'product_show')]
public function show(EntityManagerInterface $entityManager, int $id): Response
{
    $product = $entityManager->getRepository(Product::class)->find($id);

    if (!$product) {
        throw $this->createNotFoundException(
            'No product found for id '.$id
        );
    }
    return new Response('Check out this great product: '.$product->getName());

    // or render a template
    // in the template, print things with {{ product.name }}
    // return $this->render('product/show.html.twig', ['product' => $product]);
}
```

Shorter: the **EntityValueResolver** fetches the entity from the route parameter (404 if not found):

```php
#[Route('/product/{id}', name: 'product_show')]
public function show(Product $product): Response
{
    return $this->render('product/show.html.twig', ['product' => $product]);
}

// By another field
#[Route('/product/slug/{slug}')]
public function showBySlug(#[MapEntity(mapping: ['slug' => 'slug'])] Product $product): Response { /* ... */ }
```

Repository methods:

```php
$repository->find(5);
$repository->findOneBy(['name' => 'Keyboard']);
$repository->findBy(['category' => $category], ['price' => 'ASC'], limit: 10);
$repository->findAll();
$repository->count(['category' => $category]);
```

### Create

```php
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/product', name: 'create_product', methods: ['POST'])]
public function createProduct(EntityManagerInterface $entityManager, ValidatorInterface $validator): Response
{
    $product = new Product();
    $product->setName('Keyboard');
    $product->setPrice(1999);
    $product->setDescription('Ergonomic and stylish!');

    // Validate (Assert\* attributes on the entity)
    $errors = $validator->validate($product);
    if (count($errors) > 0) {
        return new Response((string) $errors, 400);
    }

    // tell Doctrine you want to (eventually) save the Product (no queries yet)
    $entityManager->persist($product);

    // actually executes the queries (i.e. the INSERT query)
    $entityManager->flush();
    return new Response('Saved new product with id '.$product->getId());
    // Saved new product with id 1
}
```

### Update

```php
#[Route('/product/{id}/edit', name: 'product_edit', methods: ['POST'])]
public function update(Product $product, EntityManagerInterface $entityManager): Response
{
    $product->setName('New product name!');
    $entityManager->flush();             // no persist() needed: the entity is already managed

    return $this->redirectToRoute('product_show', ['id' => $product->getId()]);
}
```

### Delete

```php
#[Route('/product/{id}/delete', name: 'product_delete', methods: ['POST'])]
public function delete(Product $product, EntityManagerInterface $entityManager): Response
{
    $entityManager->remove($product);
    $entityManager->flush();

    return $this->redirectToRoute('product_list');
}
```

## Custom queries in the repository

```php
// src/Repository/ProductRepository.php
/**
 * @return Product[]
 */
public function findAllGreaterThanPrice(int $price): array
{
    return $this->createQueryBuilder('p')
        ->andWhere('p.price > :price')
        ->setParameter('price', $price)
        ->orderBy('p.price', 'ASC')
        ->getQuery()
        ->getResult();
}

// DQL (entity names, not table names)
public function countByCategory(): array
{
    return $this->getEntityManager()->createQuery(
        'SELECT c.name, COUNT(p.id) AS total
         FROM App\Entity\Product p JOIN p.category c
         GROUP BY c.name'
    )->getResult();
}
```

```php
$products = $repository->findAllGreaterThanPrice(1000);
```

## Fixtures (test data)

```bash
composer require --dev orm-fixtures zenstruck/foundry
php bin/console make:fixtures
php bin/console doctrine:fixtures:load     # purges the DB and loads the fixtures
```

```php
// src/DataFixtures/AppFixtures.php
public function load(ObjectManager $manager): void
{
    $category = (new Category())->setName('Hardware');
    $manager->persist($category);

    for ($i = 1; $i <= 10; $i++) {
        $product = (new Product())
            ->setName("Product $i")
            ->setPrice($i * 100)
            ->setCategory($category);
        $manager->persist($product);
    }

    $manager->flush();
}
```
