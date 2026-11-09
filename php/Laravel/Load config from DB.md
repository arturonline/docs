# Config in db

Store settings (API keys, site name, feature flags...) in a `settings` table and use them as config values.

## 0. Settings table and model

```bash
php artisan make:model Setting -m
```

```php
// database/migrations/xxxx_create_settings_table.php
public function up(): void
{
    Schema::create('settings', function (Blueprint $table) {
        $table->id();
        $table->string('key')->unique();
        $table->text('value')->nullable();
        $table->timestamps();
    });
}
```

```php
// app/Models/Setting.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    // Clear the cache whenever a setting changes
    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget('settings'));
        static::deleted(fn () => Cache::forget('settings'));
    }
}
```

```php
// Seed some values (php artisan tinker)
Setting::updateOrCreate(['key' => 'facebook_client_id'], ['value' => 'abc123']);
Setting::updateOrCreate(['key' => 'site_name'], ['value' => 'My site']);
```

## 1. Load database values into the config with a custom service provider

With this method you query the database and set the config values while the application boots, so the rest of the app can use `config()` as usual.

```bash
php artisan make:provider ConfigServiceProvider
# also adds it to bootstrap/providers.php automatically
```

```php
// app/Providers/ConfigServiceProvider.php
namespace App\Providers;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class ConfigServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Avoid errors before the table exists (fresh install, running migrations...)
        if (! Schema::hasTable('settings')) {
            return;
        }

        // ['facebook_client_id' => 'abc123', ...], cached for one day
        $settings = Cache::remember('settings', now()->addDay(),
            fn () => Setting::pluck('value', 'key')->all()
        );

        // Set the config values
        config([
            'services.facebook.client_id' => $settings['facebook_client_id'] ?? null,
            'services.facebook.client_secret' => $settings['facebook_client_secret'] ?? null,
            'services.facebook.redirect' => $settings['facebook_redirect'] ?? null,
            'app.name' => $settings['site_name'] ?? config('app.name'),
        ]);
    }
}
```

Check that the provider is registered (Laravel 11+; `config/app.php` no longer has a `providers` array):

```php
// bootstrap/providers.php
return [
    App\Providers\AppServiceProvider::class,
    App\Providers\ConfigServiceProvider::class,
];
```

Now you can use the config values in your application as usual:

```php
$clientId = config('services.facebook.client_id');   // 'abc123'
```

> ⚠️ With `php artisan config:cache` the cached config is loaded, but `boot()` still runs and overrides those keys at runtime, so this keeps working. `Schema::hasTable()` costs one query per request; remove it once the table always exists.

## 2. With a custom class and a facade

```php
<?php
// app/Support/Settings.php

namespace App\Support;

use App\Models\Setting;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;

class Settings
{
    /** @var array<string, string|null> */
    protected array $settings = [];

    public function __construct()
    {
        $this->loadSettings();
    }

    /**
     * Pull the settings from the database and cache them (one day).
     */
    protected function loadSettings(): void
    {
        $this->settings = Cache::remember('settings', now()->addDay(),
            fn () => Setting::pluck('value', 'key')->all()
        );
    }

    /**
     * Get all settings.
     */
    public function all(): array
    {
        return $this->settings;
    }

    /**
     * Get a setting value by its key.
     * An array of keys can be given to retrieve multiple key-value pairs.
     */
    public function get(string|array $key, mixed $default = null): mixed
    {
        if (is_array($key)) {
            return Arr::only($this->settings, $key);
        }

        return $this->settings[$key] ?? $default;
    }

    public function set(string $key, ?string $value): void
    {
        Setting::updateOrCreate(['key' => $key], ['value' => $value]);  // clears the cache (booted())
        $this->settings[$key] = $value;
    }
}
```

```php
<?php
// app/Facades/Settings.php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static mixed get(string|array $key, mixed $default = null)
 * @method static array all()
 * @method static void set(string $key, ?string $value)
 */
class Settings extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Support\Settings::class;
    }
}
```

```php
<?php
// app/Providers/AppServiceProvider.php

namespace App\Providers;

use App\Support\Settings;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Register the settings class as a singleton (loaded once per request)
        $this->app->singleton(Settings::class);
    }
}
```

Usage example:

```php
use App\Facades\Settings;

Settings::get('site_name');                        // 'My site'
Settings::get('missing', 'default');               // 'default'
Settings::get(['site_name', 'facebook_client_id']);
// ['site_name' => 'My site', 'facebook_client_id' => 'abc123']
Settings::set('site_name', 'New name');

// Or with dependency injection, without the facade
public function index(\App\Support\Settings $settings) { /* $settings->get('site_name') */ }
```

```blade
<title>{{ \App\Facades\Settings::get('site_name') }}</title>
```

> Optional global alias (to write `Settings::` in Blade without the namespace): add `'aliases' => Facade::defaultAliases()->merge(['Settings' => App\Facades\Settings::class])->toArray(),` to `config/app.php`.

## 3. Package alternative

For typed, grouped settings: [spatie/laravel-settings](https://github.com/spatie/laravel-settings).
