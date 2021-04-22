
# IOS Sandbox 

Each iOS app has its own sandbox directory. [Apple documentation](https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/FileSystemOverview/FileSystemOverview.html)

Generally, we store user's data in the Documents folder. And we could access its path on Forms directly:

```cs
var path = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
```

Please note: IOS only could access photo gallery and iCloud folder.

File system access in Xamarin.iOS: [Microsoft documentation](https://docs.microsoft.com/en-us/xamarin/ios/app-fundamentals/file-system)