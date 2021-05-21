# XAML Markup

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