# Is it possible to display an ActivityIndictor while waiting for results of the REST call?

Try to put the REST call in an async method to wait for the work to complete.

indicator.IsRunning = true;
await Task.Run(async() =>
{
    await ...
});

indicator.IsRunning = false;


## change status bar color

```java
LoadApplication(new App());

//Change the Status Bar Color
Window.SetStatusBarColor(Android.Graphics.Color.Argb(255, 0, 0, 0));
```