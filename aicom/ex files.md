# Files

## Platform special folders

```cs
var mainDir = "/sdcard";
var cacheDir = FileSystem.CacheDirectory;
var _cacheDirectory = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "..", "cache");

var mainDir = FileSystem.AppDataDirectory;


var _rootDirectory = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
```

To List them:

```cs
Debug.WriteLine($"[Artur2]: Special folders");
var specialFolders = Enum.GetValues(typeof(Environment.SpecialFolder)).Cast<Environment.SpecialFolder>();

foreach (var item in specialFolders)
{
    Debug.WriteLine(item); 
}
```

## Lists top-level subdirectories of the specified directory.

```cs
string[] myDirs = Directory.GetDirectories(path);
```

## Lists top-level files of the specified directory.

```cs
string[] files = Directory.GetFiles(path);
```
