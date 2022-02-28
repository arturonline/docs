# Fonts as Icons

- Download [Awesome icons](https://fontawesome.com/start) and drag them into your .NET Standard project. 

```cs
// AssembyInfo.cs
[assembly: ExportFont("fa-solid-900.ttf", Alias = "FA-S")]
[assembly: ExportFont("fa-regular-400.ttf", Alias = "FA-R")]
[assembly: ExportFont("fa-brands-400.ttf", Alias = "FA-B")]
```

- In Visual Studio and mark them as an `EmbeddedResource`

```cs
// App.xaml
<Application.Resources>
    ...
    <!-- Font Awesome Icons -->
    <x:String x:Key="IconSDcard">&#xf7c2;</x:String>
    <x:String x:Key="IconFolder">&#xf07b;</x:String>
    <x:String x:Key="IconEmptyFile">&#xf15b;</x:String>
    <x:String x:Key="IconHome">&#xf015;</x:String>
    <x:String x:Key="IconProfile">&#xf2bd;</x:String>
    <x:String x:Key="IconAbout">&#xf05a;</x:String>
    ...
</Application.Resources>
```

## Examples

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
<FlyoutItem Title="Tareas">
    <Shell.ItemTemplate >
        <DataTemplate>
            <StackLayout Orientation="Horizontal">

                <Label FontSize="20" Padding="15,20,0,0">
                    <Label.FormattedText>
                        <FormattedString>
                            <FormattedString.Spans>
                                <Span FontSize="25" FontFamily="FA-S" Text="{StaticResource IconHome}" />
                                <Span Text="  " />
                                <Span Text="{Binding Title}"/>
                            </FormattedString.Spans>
                        </FormattedString>
                    </Label.FormattedText>
                </Label>

            </StackLayout>
        </DataTemplate>
    </Shell.ItemTemplate>
    <ShellContent Route="TodoList" ContentTemplate="{DataTemplate local:TodoListPage}" />
</FlyoutItem>
```

## About

[link origina](https://montemagno.com/using-font-icons-in-xamarin-forms-goodbye-images-hello-fonts/)