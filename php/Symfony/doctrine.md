# Doctrine

## Recipes

```php
// install
composer require symfony/orm-pack
composer require --dev symfony/maker-bundle

// Create database
php bin/console doctrine:database:create

// Create entity
$ php bin/console make:entity

// Create migration
php bin/console make:migration

// Migrate
php bin/console doctrine:migrations:migrate

// Check pending migrations
php bin/console doctrine:migrations:list

// Query the database directly
php bin/console dbal:run-sql 'SELECT * FROM product'
```

## Crud

## Get

```php
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

### Create

```php
#[Route('/product', name: 'create_product')]
public function createProduct(EntityManagerInterface $entityManager): Response
{
    $product = new Product();
    $product->setName('Keyboard');
    $product->setPrice(1999);
    $product->setDescription('Ergonomic and stylish!');

    // Validate
    $errors = $validator->validate($product);
    if (count($errors) > 0) {
        return new Response((string) $errors, 400);
    }

    // tell Doctrine you want to (eventually) save the Product (no queries yet)
    $entityManager->persist($product);

    // actually executes the queries (i.e. the INSERT query)
    $entityManager->flush();
    return new Response('Saved new product with id '.$product->getId());
}
```