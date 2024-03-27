# db 1st in laravel with eloquent

## 1. Configure your database connection

Ensure that you’ve configured your database connection in Laravel’s `config/database.php` configuration file.

## 2. Generate a model for every table

Use the `php artisan make:model` command to create a model. For instance, if you have a table named **master_posts**, create a model named **Post**. 

>The name you select for your model doesn’t need to directly match the database table name. It’s common to use singular, descriptive names for models while keeping the table names plural.

## 3. Configure the model

To use your database with laravel you should provide laravel with the table name (1), the timestamps columns (2) and the name of the primary key (3) id if is different from **id**: 

- 1 Specify the table name

```php
namespace App;

class Post extends **Model**
{
    // The table in the database is 'master_posts'
    protected $table = 'master_posts';
}
```

- 2 Define which columns correspond to the `created_at` and `updated_at` timestamps (or null):

```php
namespace App;

class Post extends Model
{
    protected $table = 'master_posts';

    public const CREATED_AT = 'created_timestamp';
    public const UPDATED_AT = null // not used
}
```

- 3 Adjust the primary key if it’s not named `id`:

```php
namespace App;

class Post extends Model
{
    protected $table = 'master_posts';

    public const CREATED_AT = 'created_timestamp';
    public const UPDATED_AT = null;

    // the table primary key id is named pid:
    protected $primaryKey = 'pid';
}
```

You can now use the Post model to query the master_posts table. Retrieve records, perform CRUD operations, and enjoy the benefits of Eloquent!

### 3.2 Define