# Prism 101

## Passing params in constructor

```cs
containerRegistry.RegisterInstance<ICacheService>(new CacheService(BlobCache.LocalMachine, "MyAppName"), "localMachineCache");
containerRegistry.RegisterInstance<ICacheService>(new CacheService(BlobCache.UserAccount, "MyAppName"), "userAccountCache");

public SettingsPageViewModel(ICacheService localMachineCache)
{
    CacheService = localMachineCache;
}

// And accordingly if you need both

public SettingsPageViewModel(ICacheService localMachineCache, ICacheService userAccountCache)
{
    MachineCacheService = localMachineCache;
    UserAccountCacheService = userAccountCache;
}
```

```cs
// creo una instancia con un constructor personalizado
var s = _container.RegisterInstance(new ComunicacionUtilsFtp(servidorFtpSeleccionado), "utilsInstance");
// uso el constructor personalizado
var _commUtils = ((App)Application.Current).Container.Resolve<ComunicacionUtilsFtp>("utilsInstance");
```

## Get current container

```cs
var service = ((PrismApplication)Xamarin.Forms.Application.Current).Container;
var container = ((App) Aplication.Current).Container;
```
