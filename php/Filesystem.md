---
Titulo: 'Filesystem'
Descripción: 'Filesystem in PHP'
tags: [php, files, filessystem]
Fecha: 09/03/2023'
---

## Get Information

```php
$filename = "myfile.txt"
stat(string $filename);

$file = fopen("myfile.txt", "r");
fstat($file);
```

## Working with directories


```php
chdir(string $directory): bool // changes directory

mkdir(string $directory, int $permissions, bool $recursive);
// creates a directory with the specifed permissions. $recursive must be true 
// if we are trying to create a nested structure of directories

rmdir(string $directory); // removes the directory

getcwd(): string // returns the current directory

scandir(string $directory...): array 
// returns an array with the files and directories of the specified path
```

```php
// chmod, chown to change permissions and owners

// copy, delete to copy and delete files

// disk_free_space, disk_total_space info about disk space

// is_dir, is_executable, is_file, is_link, is_readable, is_writable to test the type of a file
```

[More info[(https://www.php.net/manual/en/book.filesystem.php)

## Upload Files

```php
<form enctype="multipart/form-data" action="index.php" method="post">
...
<input type="file" id="file" name="file"> // one file
--- or
<input type="file" id="file" name="file" multiple> // multiple files
...
</form>

// you can access the uploaded file via $_FILES['file']
```

```php
move_uploaded_file($_FILES['file']['tmp_name'], $path.$filename)
---
copy($_FILES['file']['tmp_name'], $_FILES['file']['name']);
```

Get errors:

```php
move_uploaded_file($_FILES['file']['tmp_name'], $path.$filename)
---
copy($_FILES['file']['tmp_name'], $_FILES['file']['name']);
```

| NAME     | DESCRIPTION                                                   |
| -------- | ------------------------------------------------------------- |
| name     | file name                                                     |
| tmp_name | if the uploaded file is too large, the `tmp_name` is "*none*" |
| type     | MIME type e.g., image/jpeg or application/pdf                 |
| error    | UPLOAD_ERR_OK means the file was uploaded successfully        |
| size     | in bytes                                                      |


## limit file size

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

Example

```php
<body>
    <h1>My photo album</h2>
        <h2>Upload file</h2>
        <form action="" method="post" enctype="multipart/form-data">
            Select file:
            <input type="file" name="photo"><br>
            <input type="submit" name="send" value="Send">
        </form>
        <?php
        define("MaxSize", 204800); // 200kb = 200 * 1024 = 204.800b
        define('dir', "img");
        
        $errors = array();

        if (!file_exists($dir)) {
            mkdir($dir);
        }
        
        if(isset($_POST["send"])) {
            $photo = $_FILES['photo'];
            
            // The extension must be GIF or JPG 
            $type = $photo['type'];
            if ($type != 'image/jpeg' && $type != 'image/gif') {
                echo "Invalid Type: " . $type;
                return;
            }
            
            // the size does not exceed 200kb, 
            $size = $photo['size'];
            if ($size > MaxSize) {
               echo "File to big. 200kb < {$size}kb";
               return;
            }
            
            // show a message if there is an error.
            $error = $photo['error'];
            if (!Empty($error)) {
                echo $error;
                return;
            }
            // Upload file
            $newName = Date("d-m-y") . "-" . $photo['name'];
            $destinationFolder = __DIR__ . "\img\\$newName";
            if (copy($photo['tmp_name'], $destinationFolder)) {
                echo "<br>The file was loaded successfully.<br>File size: {$size} bytes. Image name: '{$newName}'<br>";
                
                $photos = glob("img/" . "*");
                foreach($photos as $image) {
                    echo "<img src=\"$image\">";
                    echo "<br>";
                }
                
            }
            else 
            {
                echo "Error uploading file.<br>";    
            }

        }

        ?>
</body>
```
