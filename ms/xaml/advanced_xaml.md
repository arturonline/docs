# Advanced XAML

## Namespaces

An XML namespace is used to specify the location of the information needed to instantiate the XML document.

Namespaces are defined by adding the **xmlns** attribute to the root element.

Typically, the root element of a `Xamarin.Forms XAML` document is `ContentPage`.

```xml
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms" //Xamarin.Forms
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml" // XAML
             x:Class="Sample.MyPage">
</ContentPage>
```

## XAML markup extensions

Much of your XAML definition will be known at compile time. But, sometimes you want to set a property value to something that are only known when the program is running. Microsoft has defined the Markup Extension for this purpose.

Markup extensions are classes that you use in XAML to access runtime values.

Example: Assume you have a button defined in XAML and you want to set the `TextColor` and `BackgroundColor` to the same value throughout the app.

First, create a C# static class to hold your shared values:

```cs
using Xamarin.Forms;

public static class SharedResources
{
    public static Color ButtonBkColor {
        get { return Color.FromRgb(0xff, 0xa5, 0); }
    }

    public static Color ButtonTextColor {
        get { return Color.White; }
    }
}
```

To have access to our static code values, add a namespace attribute into the root ContentPage element to gain access to the resources under the namespace local and use the `{x:Static}` markup extension:

```xml
// An example of adding the Background and TextColor colors to a button
<ContentPage ...
             xmlns:local="clr-namespace:Phoneword">
    ...
    <Button x:Name="translateButton" Text="Translate" Clicked="OnTranslate"
            TextColor="{x:Static local:SharedResources.ButtonTextColor}"
            BackgroundColor="{x:Static local:SharedResources.ButtonBkColor}" />
    ...
</ContentPage>
```

## Platform-specific values

The `Device.RuntimePlatform` property allows you to select a unique value for each platform.

```cs
if (Device.RuntimePlatform == Device.iOS)
{
    Padding = new Thickness(0, 20, 0, 0);
}
```

The `OnPlatform` class allows you to set properties on XAML elements and is used at runtime for iOS, Android, and other supported **Xamarin.Forms platforms**.

```xml
<ContentPage.Padding>
    <OnPlatform x:TypeArguments="Thickness">
        <On Platform="iOS" Value="0,20,0,0" />
        <On Platform="Android" Value="0,0,0,0" />
    </OnPlatform>
</ContentPage.Padding>
```