# Dependecy service

Example of dependency service to get available storage paths in Android.

⚠ The Core project is referenced by the Android & iOS projects, but the Android & iOS projects are not referenced by the Core project. Schematically,

`Core-->Android & Core-->iOS but Core<-x-Android, Core<-x-iOS`

## Storage paths in Android:

Android groups the filesystem into two different types of storage: [Internal Storage](https://docs.microsoft.com/en-us/xamarin/android/platform/files/#working-with-internal-storage) and [External Storage](https://docs.microsoft.com/en-us/xamarin/android/platform/files/external-storage?tabs=windows):

The directory of the private Internal files would be:

`/data/user/0/com.companyname/files`

The directory of the private external files would be:

`/storage/emulated/0/Android/data/com.companyname.app/files/`

You could get it via dependency service:

## Dependency services

Link: [DependencyService](https://docs.microsoft.com/en-us/xamarin/xamarin-forms/app-fundamentals/dependency-service/introduction)


### 1. Create an **interface IExternalStorage**:

```cs
public interface IExternalStorage
{
    string GetPath();
}
The implementation on the Android:

[assembly:Dependency(typeof(AndroidImplementation))]
namespace App.Droid
{
    public class AndroidImplementation: IExternalStorage
    {
        public string GetPath()
        {
           Context context = Android.App.Application.Context;
           var filePath = context.GetExternalFilesDir("");
           return filePath.Path;
        }
    }
}
```

### 2. After that you should register the dependency:

```cs
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            Instance = this;
            global::Xamarin.Forms.Forms.Init(this, savedInstanceState);
            
            DependencyService.Register<IExternalStorage, ExternalStorage>();
            
            LoadApplication(new App());
        }
```


### 3. Then you could use it in Xamarin.Forms:

```cs
var folderPath = DependencyService.Get<IExternalStorage>(). GetPath();
```
