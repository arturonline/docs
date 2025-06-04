# Config in db 

## 1. Load database values into the config/services.php file with a custom service provider 

With this method you can query the database and set the config values before the rest of the application is initialized.

```php
// app/Providers/ConfigServiceProvider.php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class ConfigServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Get the facebook keys from the database
        $facebook = \App\Setting::where('key', 'like', 'facebook_%')->get();

        // Set the config values
        config()->set('services.facebook.client_id', $facebook->where('key', 'facebook_client_id')->first()->value);
        config()->set('services.facebook.client_secret', $facebook->where('key', 'facebook_client_secret')->first()->value);
        config()->set('services.facebook.redirect', $facebook->where('key', 'facebook_redirect')->first()->value);
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
```

Then you need to register your service provider in the config/app.php file:

```php
// config/app.php
// ...
'providers' => [
    // ...
    App\Providers\ConfigServiceProvider::class,
],
```

Now you can use the config values in your application as usual:

```php
use Illuminate\Support\Facades\Config;

$client_id = Config::get('services.facebook.client_id');
```

## 2. With a custom class and a facade

Here is some sample code for the first method:


```php
<?php
// app/Classes/Setting.php

namespace App\Classes;

use Cache;

class Setting {

  /**
   * The array of settings
   *
   * @var array $settings
   */
  protected $settings = [];

  /**
   * Instantiate the class.
   */
  public function __construct () {
    $this->loadSettings ();
  }

  /**
   * Pull the settings from the database and cache them.
   *
   * @return void;
   */
  protected function loadSettings () {
    $settings = Cache::remember ('settings', 24*60, function () {
      return \App\Setting::all ()->toArray ();
    });

    $this->settings = array_pluck ($settings, 'value', 'key');
  }

  /**
   * Get all settings.
   *
   * @return array;
   */
  public function all () {
    return $this->settings;
  }

  /**
   * Get a setting value by it's key.
   * An array of keys can be given to retrieve multiple key-value pair's.
   *
   * @param string|array $key;
   * @return string|array;
   */
  public function get ($key) {
    if ( is_array ($key) ) {
      $keys = [];

      foreach ($key as $k) {
        $keys [$k] = $this->settings [$k];
      }

      return $keys;
    }

    return $this->settings [$key];
  }
}

<?php
// app/Facades/Setting.php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class Setting extends Facade {

  /**
   * Get the registered name of the component.
   *
   * @return string
   */
  protected static function getFacadeAccessor () {
    return 'setting';
  }
}

// app/Providers/AppServiceProvider.php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider {

  /**
   * Bootstrap any application services.
   *
   * @return void
   */
  public function boot () {
    //
  }

  /**
   * Register any application services.
   *
   * @return void
   */
  public function register () {
    // Register the setting class as a singleton
    $this->app->singleton ('setting', function ($app) {
      return new \App\Classes\Setting ();
    });
  }
}

// config/app.php
// ...
'providers' => [
  // ...
  App\Providers\AppServiceProvider::class,
],

'aliases' => [
  // ...
  'Setting' => App\Facades\Setting::class,
],

// Usage example
$foo = Setting::get ('foo'); // returns 'bar'
```