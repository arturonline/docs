# Working with an existing database in laravel

## 1. Configure your database connection

Ensure that you’ve configured your database connection in Laravel’s `config/database.php` configuration file.

## 2. Generate a model for every table

Use the `php artisan make:model` command to create a model. For instance, if you have a table named **master_posts**, create a model named **Post**. 

>The name you select for your model doesn’t need to directly match the database table name. It’s common to use singular, descriptive names for models while keeping the table names plural.

## 3. Configure the model

To use your database with laravel you should provide laravel with:

- the *table name (1)*, 
- *the timestamps columns (2)* 
- and *the name of the primary key id (3)* if is different from **id**.

### example

We have a table like this:

```sql
--- Database: master_posts

pid => integer(11), primary key,
post_title => varchar(255),
created_timestamp => timestamp, created at timestamp
updated_timestamp => timestamp, updated at timestamp
```

We should change:

- 1 So first we will tell our model which table to look for in the database which is master_posts:

```php
namespace App;

class Post extends **Model**
{
    // The table in the database is 'master_posts'
    protected $table = 'master_posts';
}
```

- 2 Now you should tell which columns correspond to the `created_at` and `updated_at` timestamps (or null) like this:

```php
namespace App;

class Post extends Model
{
    protected $table = 'master_posts';

    // Tell which table from db:
    public const CREATED_AT = 'created_timestamp';
    public const UPDATED_AT = 'updated_timestamp';

    // or disable one:
    public const UPDATED_AT = null // not used

    // or disable both: 
    public $timestamps = false // this disables both
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

## Map Column and Model names

When your database column names don’t directly match the desired property names in your model you can map a model property to a different column name using Eloquent.

For example, let’s say you have a `User` model with a property named **fullName**, but the corresponding value is stored in the **full_name** column in the database. You can define a mutator like this:

```php
namespace App;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    // Other model properties and methods...

    public function getFullNameAttribute()
    {
        return $this->attributes['full_name'];
    }

    public function setFullNameAttribute($value)
    {
        $this->attributes['full_name'] = $value;
    }
}
```

Now you can access the **fullName** property, and Eloquent will automatically map it to the **full_name** column in the database.
