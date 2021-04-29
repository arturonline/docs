# Xamarin.Forms String and Image Localization


The .NET framework includes a built-in mechanism for localizing applications using `Resx resource files`. A resource file stores text and other content as name/value pairs that allow the application to retrieve content for a provided key.

A localized application typically contains a default resource file with all strings used in the application, as well as resource files for each supported language.

Ex:

1. AppResources.resx (default)
1. AppResources.es.resx
1. AppResources.fr.resx

## Resx file

### Creation

A resource file is added with the *Add New Item* dialog in Visual Studio 2019.

We create a default resource file by creating a resource file and specifing the *access level* to `public` or `internal`.

Once the default resource file is created, additional files can be created for each culture the application supports. Those files should have a `No code generation` *access modifier*.


## Edit

Resource files contain the following information for each item:

- **Name** specifies the key used to access the text in code.
- **Value** specifies the translated text.
- **Comment** is an optional field containing additional information.

The translation file uses the same `Name` values specified in the default file but contains other language strings in the `Value` column. 

## Specify the default culture

```cs
using System.Resources;

// The resources from the neutral language .resx file are stored directly
// within the library assembly. For that reason, changing en-US to a different
// language in this line will not by itself change the language shown in the
// app. 
[assembly: NeutralResourcesLanguage("en-US")]
```

Once a default resource file has been created and the default culture specified in the AssemblyInfo.cs file, the application can retrieve localized strings at runtime.

## Using localized text from resource files

Accessing these values as x:Static properties allows localized text to be displayed in XAML:

```cs
<ContentPage ...
             xmlns:resources="clr-namespace:LocalizationDemo.Resx">

    <Label Text="{x:Static resources:AppResources.NotesLabel}" />
    <Entry Placeholder="{x:Static resources:AppResources.NotesPlaceholder}" />
    <Button Text="{x:Static resources:AppResources.AddButton}" />
</ContentPage>
```

```cs
public LocalizedCodePage()
{
    Label notesLabel = new Label
    {
        Text = AppResources.NotesLabel,
        // ...
    };

    Entry notesEntry = new Entry
    {
        Placeholder = AppResources.NotesPlaceholder,
        //...
    };

    Button addButton = new Button
    {
        Text = AppResources.AddButton,
        // ...
    };

    Content = new StackLayout
    {
        Children = {
            notesLabel,
            notesEntry,
            addButton
        }
    };
}
```

## Order

The properties in the AppResources class use the current value of the System.Globalization.CultureInfo.CurrentUICulture to determine which culture resource file to retrieve values from.

At runtime, the application attempts to resolve a resource request in order of specificity:

1. AppResources.en-US.resx
1. AppResources.en.resx
1. AppResources.resx (default)

## Specify languages on IOS

On iOS, you must declare all supported languages in the `Info.plist` file:

## Images

Platform image localization functionality should be used instead of storing images in resource files.

- On **Android**, localized drawables (images) are stored using a naming convention for folders in the Resources directory. 

- On **iOS**, localized images are stored using a naming convention for folders in the Resources directory. The default folder is named Base.lproj. Language-specific folders are named with the language or locale name, followed by .lproj. For example, the Spanish-language folder is named es.lproj.

### Consume Localized Images

```xml
<Image>
    <Image.Source>
        <OnPlatform x:TypeArguments="ImageSource">
            <On Platform="iOS, Android" Value="flag.png" />
            <On Platform="UWP" Value="Assets/Images/flag.png" />
        </OnPlatform>
    </Image.Source>
</Image>
```

```cs
string imgSrc = Device.RuntimePlatform == Device.UWP ? "Assets/Images/flag.png" : "flag.png";
Image flag = new Image
{
    Source = ImageSource.FromFile(imgSrc),
    WidthRequest = 100
};
```

## Test localization

Testing localization is best accomplished by changing your device language.