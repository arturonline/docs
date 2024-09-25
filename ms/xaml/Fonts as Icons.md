# Icons

## Font as Icon

- Download [Awesome icons](https://fontawesome.com/start) and drag them into your .NET Standard project. 
- In Visual Studio and mark them as an EmbeddedResource

```cs
// AssembyInfo.cs
[assembly: ExportFont("fa-solid-900.ttf", Alias = "FA-S")]
[assembly: ExportFont("fa-regular-400.ttf", Alias = "FA-R")]
[assembly: ExportFont("fa-brands-400.ttf", Alias = "FA-B")]
```

```cs
// App.xaml
<Application.Resources>
    ...
    <x:String x:Key="Play">&#xf10b;</x:String>
    ...
</Application.Resources>
```

## Add icons

```xml
<Image
    Grid.Column="2"
    HeightRequest="44"
    HorizontalOptions="Center"
    VerticalOptions="Center"
    WidthRequest="44">
    <Image.Source>
        <FontImageSource
            FontFamily="{DynamicResource MaterialFontFamily}"
            Glyph="{StaticResource Play}"
            Size="44"
            Color="{StaticResource PrimaryColor}" />
    </Image.Source>
</Image>
```

```xml
<Label FontFamily="{StaticResource MaterialFontFamily}" Text="{Binding Car"}/>
```

```xml
 <Tab Title="Profile" Route="profile">
     <Tab.Icon>
     	<FontImageSource Glyph="{StaticResource IconCoffee}" FontFamily="FA-S" />
     </Tab.Icon>
 	<ShellContent ContentTemplate="{DataTemplate view:ProfilePage}"/>
 </Tab>
```

## About

[link origina](https://montemagno.com/using-font-icons-in-xamarin-forms-goodbye-images-hello-fonts/)