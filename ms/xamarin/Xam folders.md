# Files

## Sandbox

When you're working with loose files such `XML` files, or with a local database file like `SQLite`, you need to find the correct place to store them. The **app sandbox** is a private area your application can work with. By default, no other applications can access this area other than the operating system itself.

The location of the app sandbox changes per platform. However, you can access the file path by using a standard .NET API.

To access the app sandbox on Android, you use the following code snippet:

```C#
string path = Environment.GetFolderPath(Environment.SpecialFolder.Personal);
```

After you run the code snippet, `path` contains the file path to the location where you can store files for the application to use.

To access the app sandbox on iOS, you use a slightly different code snippet:

```cs
string docFolder = Environment.GetFolderPath(Environment.SpecialFolder.Personal);
string libFolder = System.IO.Path.Combine(docFolder, "..", "Library");
```

Apple has iOS guidelines for where files should be stored. By default, there are two main folder locations:

1. The **Documents folder**, which is being referenced by the `docFolder` variable that's shown in the code snippet. Use the Documents folder to store user-generated data only.

2. The **Library folder**, which is being referenced by the `libFolder` variable that's shown in the previous code snippet. Use the Library folder when you're storing data that's app-generated.

Determining the Library folder path on these platforms, though, has been abstracted in `Xamarin.Essentials` to be a single line of code. This abstraction allows you to avoid the iOS-specific path differences.

```C#
var libFolder = FileSystem.AppDataDirectory;
```

## Other special folders

```cs
var mainDir = "/sdcard";
var cacheDir = FileSystem.CacheDirectory;
var _cacheDirectory = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "..", "cache");

var mainDir = FileSystem.AppDataDirectory;


var _rootDirectory = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
```

To List them:

```cs
Debug.WriteLine($"[Artur]: Special folders");
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
