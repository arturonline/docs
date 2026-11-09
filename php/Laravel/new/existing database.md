# Working with an existing database in Laravel

Related: [laravel.md](laravel.md) (models & migrations), [PDO](../../PDO/Conexion.md) (plain PHP connection).

## 1. Configure your database connection

Set the connection in `.env` (the values are read by `config/database.php`):

```ini
DB_CONNECTION=mysql        # mysql, mariadb, pgsql, sqlite, sqlsrv
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=legacy_db
DB_USERNAME=user
DB_PASSWORD=secret
```

Check that Laravel can see it:

```bash
php artisan db:show                 # connection, version, tables and sizes
php artisan db:table master_posts   # columns, types, indexes, foreign keys
php artisan db                      # open the DB CLI client
```

## 2. Generate a model for every table

Use the `php artisan make:model` command to create a model (without `-m`, the table already exists). For instance, if you have a table named **master_posts**, create a model named **Post**:

```bash
php artisan make:model Post
```

> The name you select for your model doesn't need to directly match the database table name. It's common to use singular, descriptive names for models while keeping the table names plural.

Packages that generate code from the existing schema:

```bash
# Migrations from the current database
composer require --dev kitloong/laravel-migrations-generator
php artisan migrate:generate

# Models (with relations) from the current database
composer require --dev reliese/laravel
php artisan code:models
```

## 3. Configure the model

To use your database with Laravel you should tell Laravel:

- the *table name*,
- *the timestamps columns*,
- and *the name of the primary key* if it is different from **id**.

### Example

We have a table like this:

```sql
-- Table: master_posts
pid                INT(11) PRIMARY KEY AUTO_INCREMENT,
post_title         VARCHAR(255),
created_timestamp  TIMESTAMP,   -- created at
updated_timestamp  TIMESTAMP    -- updated at
```

We should change:

- 1 First we tell our model which table to look for in the database, which is `master_posts`:

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    // The table in the database is 'master_posts' (default would be 'posts')
    protected $table = 'master_posts';
}
```

- 2 Now tell which columns correspond to the `created_at` and `updated_at` timestamps (or null):

```php
class Post extends Model
{
    protected $table = 'master_posts';

    // Column names of the timestamps:
    public const CREATED_AT = 'created_timestamp';
    public const UPDATED_AT = 'updated_timestamp';
}
```

Alternatives (pick one, a constant can't be declared twice):

```php
public const UPDATED_AT = null;   // only disable updated_at

public $timestamps = false;       // disable both
```

- 3 Adjust the primary key if it's not named `id`:

```php
class Post extends Model
{
    protected $table = 'master_posts';

    public const CREATED_AT = 'created_timestamp';
    public const UPDATED_AT = null;

    // the table primary key is named pid:
    protected $primaryKey = 'pid';

    // only if the key is not an auto-increment integer (e.g. 'POST-0001' or a UUID):
    // public $incrementing = false;
    // protected $keyType = 'string';
}
```

You can now use the Post model to query the `master_posts` table. Retrieve records, perform CRUD operations, and enjoy the benefits of Eloquent!

```php
Post::find(10);                                  // WHERE pid = 10
Post::where('post_title', 'like', '%laravel%')->get();
Post::create(['post_title' => 'Hello']);         // needs $fillable = ['post_title']
// insert into master_posts (post_title, created_timestamp) values ('Hello', '2025-...')
```

### Other useful options

```php
class Customer extends Model
{
    protected $connection = 'legacy';      // a second connection defined in config/database.php
    protected $table = 'TBL_CLIENTES';
    protected $primaryKey = 'CLI_ID';
    protected $guarded = [];               // allow mass assignment of every column
    protected $dateFormat = 'Y-m-d H:i:s'; // storage format of dates (SQL Server, legacy formats...)

    protected function casts(): array
    {
        return [
            'CLI_ACTIVO' => 'boolean',     // 'S'/'N' columns need a custom cast or accessor
            'CLI_ALTA' => 'datetime',
            'CLI_DATOS' => 'array',        // JSON text column <-> PHP array
        ];
    }

    // Relations with non standard keys: (related, foreignKey, ownerKey/localKey)
    public function orders()
    {
        return $this->hasMany(Order::class, 'ORD_CLI_ID', 'CLI_ID');
    }
}
```

```bash
php artisan model:show Customer   # table, attributes, casts, relations detected
```

## Map Column and Model names

When your database column names don't directly match the desired property names in your model you can map a model property to a different column with an accessor/mutator (`Attribute`).

For example, a `User` model where you want a property **name**, but the value is stored in the **usr_nombre** column:

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $appends = ['name'];          // include it in toArray()/JSON
    protected $hidden = ['usr_nombre'];     // hide the raw column

    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => $attributes['usr_nombre'],
            set: fn (string $value) => ['usr_nombre' => $value],
        );
    }
}
```

Now you can access the **name** property, and Eloquent will automatically map it to the **usr_nombre** column in the database:

```php
$user->name;                  // reads usr_nombre
$user->name = 'Ana';          // writes usr_nombre
$user->toArray();             // ['id' => 1, 'name' => 'Ana', ...]
```

> Accessors only work on the model instance: in queries you still use the real column (`User::where('usr_nombre', 'Ana')`).
