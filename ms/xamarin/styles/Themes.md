# Dark and Light Theme

## Colors

[collection1](https://uxdesign.cc/dark-mode-ui-design-the-definitive-guide-part-1-color-53dcfaea5129)
[collection2](https://colorhunt.co/palettes/dark)

**Xamarin.Forms** applications can respond to system theme changes by consuming resources with the `AppThemeBinding` markup extension, and the `SetAppThemeColor` and `SetOnAppTheme<T>` extension methods.

## Define Theme resources

In the next example, the text color of the first Label is set to **green** when the device is using its *light theme*, and is set to **red** when the device is using its *dark theme*. Similarly, the Image displays a different image file based upon the current system theme.

```xml
<ContentPage ...>
    <StackLayout Margin="20">
        <Label Text="This text is green in light mode, and red in dark mode."
               TextColor="{AppThemeBinding Light=Green, Dark=Red}" />
        <Image Source="{AppThemeBinding Light=lightlogo.png, Dark=darklogo.png}" />
    </StackLayout>
</ContentPage>
```

Programatically:

```cs
Label label = new Label();
label.SetAppThemeColor(Label.TextColorProperty, Color.Green, Color.Red);

Image image = new Image();
image.SetOnAppTheme<FileImageSource>(Image.SourceProperty, "lightlogo.png", "darklogo.png");
```

In the next example, the **background color** of the Grid and the Button style changes based on whether the device is using its light theme or dark theme.

```xml
<!-- app.xaml -->
<ContentPage ...>
    <ContentPage.Resources>

        <!-- Light colors -->
        <Color x:Key="LightPrimaryColor">WhiteSmoke</Color>
        <Color x:Key="LightSecondaryColor">Black</Color>

        <!-- Dark colors -->
        <Color x:Key="DarkPrimaryColor">Teal</Color>
        <Color x:Key="DarkSecondaryColor">White</Color>

        <Style x:Key="ButtonStyle"
               TargetType="Button">
            <Setter Property="BackgroundColor"
                    Value="{AppThemeBinding Light={StaticResource LightPrimaryColor}, Dark={StaticResource DarkPrimaryColor}}" />
            <Setter Property="TextColor"
                    Value="{AppThemeBinding Light={StaticResource LightSecondaryColor}, Dark={StaticResource DarkSecondaryColor}}" />
        </Style>
    </ContentPage.Resources>

...

    <Grid BackgroundColor="{AppThemeBinding Light={StaticResource LightPrimaryColor}, Dark={StaticResource DarkPrimaryColor}}">
      <Button Text="MORE INFO"
              Style="{StaticResource ButtonStyle}" />
    </Grid>    
</ContentPage>
```

Once all of our bindings are in place, we can start getting and setting the different themes. *Xamarin.Forms* exposes two properties we can use to do that:

```cs
// Detect current theme
OSAppTheme currentTheme = Application.Current.RequestedTheme;

// Set current theme
Application.Current.UserAppTheme = OSAppTheme.Dark;
```

In this example, the application is set to use the theme defined for the system **dark mode**, regardless of which system theme is currently operational.

## React to theme changes

The `AppThemeChangedEventArgs` object has a single property named `RequestedTheme`, of type `OSAppTheme`. This property can be examined to detect the requested system theme.

```cs
Application.Current.RequestedThemeChanged += (s, a) =>
{
    // Respond to the theme change
};
```

## Set theme preference on app startup

```cs
public App()
{
  InitializeComponent();
  
  // Set the theme that the user has picked.
  Current.UserAppTheme = (OSAppTheme)Preferences.Get(Settings.AppTheme, Settings.AppThemeDefault);
}
```

## Resumen

1. crear colores

    ```xml
        <Application.Resources>
            <Color x:Key="TransparentColor">Transparent</Color>

            <!-- Light colors -->
            <Color x:Key="LightPageBackgroundColor">White</Color>
            <Color x:Key="LightNavigationBarColor">WhiteSmoke</Color>
            <Color x:Key="LightPrimaryColor">WhiteSmoke</Color>
            <Color x:Key="LightSecondaryColor">Black</Color>
            <Color x:Key="LightPrimaryTextColor">Black</Color>
            <Color x:Key="LightSecondaryTextColor">White</Color>
            <Color x:Key="LightTertiaryTextColor">Gray</Color>

            <!-- Dark colors -->
            <Color x:Key="DarkPageBackgroundColor">Black</Color>
            <Color x:Key="DarkNavigationBarColor">Teal</Color>
            <Color x:Key="DarkPrimaryColor">Teal</Color>
            <Color x:Key="DarkSecondaryColor">White</Color>
            <Color x:Key="DarkPrimaryTextColor">White</Color>
            <Color x:Key="DarkSecondaryTextColor">White</Color>
            <Color x:Key="DarkTertiaryTextColor">WhiteSmoke</Color>
        </Application.Resources>
        ```

2. usar { AppThemeBinding Light=WhiteSmoke, Dark=Black} en todo el xaml
3. Implementar settings y cambio
