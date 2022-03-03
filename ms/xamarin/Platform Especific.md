
# Platform-specific values

In C#, the `Device.RuntimePlatform` property allows you to select a unique value for each platform.

```cs
if (Device.RuntimePlatform == Device.iOS)
{
    Padding = new Thickness(0, 20, 0, 0);
}
```

In XAML, `OnPlatform` class allows you to set properties on XAML elements and is used at runtime for iOS, Android, and other supported **Xamarin.Forms platforms**.

```xml
<ContentPage.Padding>
    <OnPlatform x:TypeArguments="Thickness">
        <On Platform="iOS" Value="0,20,0,0" />
        <On Platform="Android" Value="0,0,0,0" />
    </OnPlatform>
</ContentPage.Padding>
```
