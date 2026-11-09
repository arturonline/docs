---
Titulo: 'Filesystem'
Descripción: 'Filesystem in PHP'
tags: [php, files, filessystem]
Fecha: 09/03/2023
---

> See also: [Files](file.md) (open, read, write), [Forms](forms.md).

## Get Information

```php
$filename = "myfile.txt";      // contains "hello"
$info = stat($filename);       // array with size, mtime, mode...

$file = fopen($filename, "r");
$info = fstat($file);          // same, from an open handle

echo $info['size'];                         // 5
echo date('Y-m-d H:i', $info['mtime']);     // last modification
```

Shortcuts:

```php
file_exists($filename);   // true (file OR directory)
is_file($filename);       // true
is_dir($filename);        // false
filesize($filename);      // 5 (bytes)
filemtime($filename);     // timestamp of the last modification
decoct(fileperms($filename) & 0777); // "644" on Linux ("666" on Windows)
(new finfo(FILEINFO_MIME_TYPE))->file($filename); // "text/plain" (real MIME type, from content)
```

> ⚠️ Results of `stat()`, `is_file()`, `filesize()`... are cached. Call `clearstatcache()` if the file changes during the script.

### Paths

```php
print_r(pathinfo('/var/www/img/photo.final.jpg'));
// Array ( [dirname] => /var/www/img [basename] => photo.final.jpg [extension] => jpg [filename] => photo.final )

echo basename('/var/www/img/photo.jpg', '.jpg'); // photo
echo dirname('/var/www/img/photo.jpg');          // /var/www/img
echo dirname('/var/www/img/photo.jpg', 2);       // /var/www
echo realpath('a/../myfile.txt');                // absolute canonical path, false if it doesn't exist
echo __DIR__;                                    // folder of the current script
echo DIRECTORY_SEPARATOR;                        // "\" on Windows, "/" on Linux ("/" works on both)
```

## Working with directories

```php
chdir(string $directory): bool // changes directory

mkdir(string $directory, int $permissions = 0777, bool $recursive = false): bool
// creates a directory with the specified permissions (affected by umask, ignored on Windows).
// $recursive must be true if we are trying to create a nested structure of directories

rmdir(string $directory): bool // removes the directory (must be empty)

getcwd(): string|false // returns the current directory

scandir(string $directory): array|false
// returns an array with the files and directories of the specified path (including . and ..)

glob(string $pattern): array|false // files matching a pattern
```

```php
mkdir('a/b/c', 0755, true);            // true
file_put_contents('a/b/c/x.txt', '1');
file_put_contents('a/y.log', '1');

print_r(array_values(array_diff(scandir('a'), ['.', '..'])));
// Array ( [0] => b [1] => y.log )

print_r(glob('a/*.log'));
// Array ( [0] => a/y.log )
```

Walk a directory tree recursively:

```php
$it = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator('a', FilesystemIterator::SKIP_DOTS)
);

foreach ($it as $file) {          // SplFileInfo
    echo $file->getPathname() . ' ' . $file->getSize() . PHP_EOL;
}
// a/b/c/x.txt 1
// a/y.log 1
```

Delete a non-empty directory:

```php
function rrmdir(string $dir): void {
    $items = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS),
        RecursiveIteratorIterator::CHILD_FIRST // children before their parent
    );
    foreach ($items as $item) {
        $item->isDir() ? rmdir($item->getPathname()) : unlink($item->getPathname());
    }
    rmdir($dir);
}

rrmdir('a');
var_dump(file_exists('a')); // bool(false)
```

Other functions:

```php
// chmod, chown, chgrp      -> change permissions and owners
// copy($from, $to)         -> copy a file
// rename($from, $to)       -> rename / move a file or directory
// unlink($file)            -> delete a file
// tempnam(sys_get_temp_dir(), 'prefix') -> create a unique temporary file
// disk_free_space, disk_total_space     -> info about disk space
// is_dir, is_executable, is_file, is_link, is_readable, is_writable -> test the type of a file
```

🔗 [More info](https://www.php.net/manual/en/book.filesystem.php)

## Upload Files

```html
<form enctype="multipart/form-data" action="upload.php" method="post">
    <!-- one file -->
    <input type="file" id="file" name="file">
    <!-- or multiple files: note the [] -->
    <input type="file" id="files" name="files[]" multiple>
    <button type="submit">Upload</button>
</form>
```

You can access the uploaded file via `$_FILES['file']`:

| KEY       | DESCRIPTION                                                              |
| --------- | ------------------------------------------------------------------------ |
| name      | original file name (sent by the client: **don't trust it**)             |
| full_path | full path submitted by the browser (directory uploads, PHP 8.1)          |
| tmp_name  | temporary path where the file is stored on the server                    |
| type      | MIME type e.g., image/jpeg (sent by the client: **don't trust it**)     |
| error     | `UPLOAD_ERR_OK` (0) means the file was uploaded successfully             |
| size      | in bytes                                                                 |

Move the file from the temporary folder to its destination (it is deleted at the end of the request otherwise):

```php
// move_uploaded_file() checks that the file was really uploaded via POST (copy() doesn't)
move_uploaded_file($_FILES['file']['tmp_name'], $path . $filename);
```

Get errors:

```php
$message = match ($_FILES['file']['error']) {
    UPLOAD_ERR_OK         => 'OK',
    UPLOAD_ERR_INI_SIZE,
    UPLOAD_ERR_FORM_SIZE  => 'File too big',        // upload_max_filesize / MAX_FILE_SIZE
    UPLOAD_ERR_PARTIAL    => 'File only partially uploaded',
    UPLOAD_ERR_NO_FILE    => 'No file was uploaded',
    UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
    UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
    UPLOAD_ERR_EXTENSION  => 'Upload stopped by a PHP extension',
    default               => 'Unknown error',
};
```

With `name="files[]"`, `$_FILES['files']` is "transposed": `$_FILES['files']['name'][0]`, `$_FILES['files']['tmp_name'][0]`...

```php
foreach ($_FILES['files']['error'] as $i => $error) {
    if ($error === UPLOAD_ERR_OK) {
        $tmp = $_FILES['files']['tmp_name'][$i];
        // validate + move_uploaded_file(...)
    }
}
```

## limit file size

- Server side (the real limit), in `php.ini`: `upload_max_filesize = 2M` and `post_max_size = 8M` (must be bigger).
- `MAX_FILE_SIZE` hidden field: only a hint for the browser; it must go **before** the file input. Always validate the size in PHP too.

```html
<form enctype="multipart/form-data" action="upload.php" method="post">
    <div>
        <label for="file">Select a file:</label>
        <input type="hidden" name="MAX_FILE_SIZE" value="10240"/>
        <input type="file" id="file" name="file"/>
     </div>
     <div>
        <button type="submit">Upload</button>
     </div>
</form>
```

## Example: secure image upload

```php
<?php
declare(strict_types=1);

const MAX_SIZE   = 200 * 1024;                  // 200 KB = 204 800 bytes
const UPLOAD_DIR = __DIR__ . '/img';
const ALLOWED    = ['image/jpeg' => 'jpg', 'image/gif' => 'gif', 'image/png' => 'png'];

if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}

$error = null;
$saved = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $photo = $_FILES['photo'] ?? null;

    if ($photo === null || $photo['error'] !== UPLOAD_ERR_OK) {
        $error = 'Upload error (code ' . ($photo['error'] ?? UPLOAD_ERR_NO_FILE) . ')';
    } elseif ($photo['size'] > MAX_SIZE) {
        $error = sprintf('File too big: %d KB (max %d KB)', $photo['size'] / 1024, MAX_SIZE / 1024);
    } else {
        // Check the REAL type from the content, not $photo['type'] (sent by the client)
        $mime = (new finfo(FILEINFO_MIME_TYPE))->file($photo['tmp_name']);

        if (!isset(ALLOWED[$mime])) {
            $error = 'Invalid type: ' . $mime;
        } else {
            // Never use the original name: generate a safe, unique one
            $newName = date('Ymd') . '-' . bin2hex(random_bytes(8)) . '.' . ALLOWED[$mime];

            if (move_uploaded_file($photo['tmp_name'], UPLOAD_DIR . '/' . $newName)) {
                $saved = $newName;
            } else {
                $error = 'Error uploading file.';
            }
        }
    }
}
?>
<body>
    <h1>My photo album</h1>
    <h2>Upload file</h2>
    <form action="" method="post" enctype="multipart/form-data">
        <input type="hidden" name="MAX_FILE_SIZE" value="<?= MAX_SIZE ?>">
        Select file:
        <input type="file" name="photo" accept="image/jpeg,image/gif,image/png"><br>
        <button type="submit">Send</button>
    </form>

    <?php if ($error): ?>
        <p class="error"><?= htmlspecialchars($error) ?></p>
    <?php elseif ($saved): ?>
        <p>The file was uploaded successfully: <?= htmlspecialchars($saved) ?></p>
    <?php endif ?>

    <?php foreach (glob(UPLOAD_DIR . '/*.{jpg,gif,png}', GLOB_BRACE) ?: [] as $image): ?>
        <img src="img/<?= htmlspecialchars(basename($image)) ?>" alt=""><br>
    <?php endforeach ?>
</body>
```

> 🔒 Also: add a [CSRF token](forms2.md#csrf-protection) to the form, store uploads outside the web root (or disable script execution in that folder), and never `include` an uploaded file.
