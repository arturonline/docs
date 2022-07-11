# Laravel

[Routes](Laravel%203e57c61d593b4a66a01ed42c505a9660/Routes%20809fe6cee12a47e7ae8cee8ab1d56779.md)

[Controllers](Laravel%203e57c61d593b4a66a01ed42c505a9660/Controllers%20580f367c18a24316ae36481ba0c200fc.md)

[Views](Laravel%203e57c61d593b4a66a01ed42c505a9660/Views%20efc8b0512f48422bbc72a8a15bb3a7c5.md)

[Blade](Laravel%203e57c61d593b4a66a01ed42c505a9660/Blade%2086be6d40b3684ce2b622ca88515f3e46.md)

[css and js](Laravel%203e57c61d593b4a66a01ed42c505a9660/css%20and%20js%20363cafe394074db6b964c4d42635d24f.md)

[Models](Laravel%203e57c61d593b4a66a01ed42c505a9660/Models%200520d1e25a3e4cad9a33dc5dd1fd6fb6.md)

[Auth with Breeze](Laravel%203e57c61d593b4a66a01ed42c505a9660/Auth%20with%20Breeze%202f973831e731414bb076106d4c86c647.md)

[Docker](Laravel%203e57c61d593b4a66a01ed42c505a9660/Docker%20fd327cfa3a3249e790016c7637e36198.md)

## Installation Via Composer

1. Install PHP
2. Install PHP Composer

    ```bash
    $ composer global require laravel/installer
    ```

3. Install Laravel as a global dependency: 

    ```bash
    $ laravel new example-app
    $ cd example-app
    > mysql create database myDb;
    $ php artisan serve
    
    ```

Make sure to place Composer's system-wide vendor bin directory (`$HOME/.config/composer/vendor/bin`) in your `$PATH`  so the `laravel`  executable can be located by your system.

## Installation Via script and sail

```bash
$ curl -s https://laravel.build/example-app | bash
# $ curl -s "https://laravel.build/example-app?with=mysql" | bash
$ cd example-app
$ ./vendor/bin/sail up
$ php artisan migrate
```