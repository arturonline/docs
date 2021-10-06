# Prism 101

## Passing params in constructor

```cs
Service>(new CacheService(BlobCache.LocalMachine, "MyAppName"), "localMachineCache");
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

## Get current container

```cs
((App) Aplication.Current).Container;
```
