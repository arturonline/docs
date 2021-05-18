# Using Preferences

Preferences are stored natively, which allows you to integrate your settings into the native system settings.

```c#
//To save a value for a given key in preferences:
Preferences.Set("my_key", "my_value");

//To retrieve a value from preferences or a default if not set:
var myValue = Preferences.Get("my_key", "default_value");

//To check if a given key exists in preferences:
bool hasKey = Preferences.ContainsKey("my_key");

//To remove the key from preferences:
Preferences.Remove("my_key");

//To remove all preferences:
Preferences.Clear();
```
⚠ Uninstalling the application will cause all Preferences to be removed, with the exception being apps that target and run on Android 6.0 (API level 23) or later that use Auto Backup.

## Example

A way to determine the first run's App is to store a boolean value that can be checked at runtime. 

For example:

```c#
public static class Settings
{
  public static bool FirstRun
  {
      get => Preferences.Get(nameof(FirstRun), true);
      set => Preferences.Set(nameof(FirstRun), value);
  }
}
```

Next, check the value at startup to confirm if the value is true. Then perform an action and set the value to false:

```c#
if(Settings.FirstRun)
{
   // Perform an action such as a "Pop-Up".
   Settings.FirstRun = false;
}
```