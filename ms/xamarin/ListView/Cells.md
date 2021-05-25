# Cells

## Cells

TextCells allow you to set the following properties:

- **Text** – the text that is shown on the first line, in large font.
- **Detail** – the text that is shown underneath the first line, in a smaller font.
- **TextColor** – the color of the text.
- **DetailColor** – the color of the detail text

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:d="http://xamarin.com/schemas/2014/forms/design"
             xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
             mc:Ignorable="d"
             x:Class="builtInCellsListView.Views.TextCellXaml"
             Padding="10"
             Title="TextCell XAML Demo">
    <ListView x:Name="listView">
        <ListView.ItemTemplate>
            <DataTemplate>
                <TextCell Text="{Binding Name}"
                          Detail="{Binding Comment}" />
            </DataTemplate>
        </ListView.ItemTemplate>
    </ListView>
</ContentPage>
```
## ImageCell

`ImageCells` are customizable, allowing you to set:

- **Text** – the text that is shown on the first line, in large font
- **Detail** – the text that is shown underneath the first line, in a smaller font
- **TextColor** – the color of the text
- **DetailColor** – the color of the detail text
- **ImageSource** – the image to display next to the text

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:d="http://xamarin.com/schemas/2014/forms/design"
             xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
             mc:Ignorable="d"
             x:Class="builtInCellsListView.Views.ImageCellXaml"
             Padding="10"
             Title="ImageCell XAML Demo">
    <ListView x:Name="listView">
        <ListView.ItemTemplate>
            <DataTemplate>
                <ImageCell Text="{Binding Name}"
                           Detail="{Binding Comment}"
                           ImageSource="{Binding Image}"/>
            </DataTemplate>
        </ListView.ItemTemplate>
    </ListView>
</ContentPage>
```

## Custom Cell

```c#

```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms"
xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
x:Class="demoListView.ImageCellPage">
    <ContentPage.Content>
        <ListView  x:Name="listView">
            <ListView.ItemTemplate>
                <DataTemplate>
                    <ViewCell>
                        <StackLayout BackgroundColor="#eee"
                        Orientation="Vertical">
                            <StackLayout Orientation="Horizontal">
                                <Image Source="{Binding image}" />
                                <Label Text="{Binding title}"
                                TextColor="#f35e20" />
                                <Label Text="{Binding subtitle}"
                                HorizontalOptions="EndAndExpand"
                                TextColor="#503026" />
                            </StackLayout>
                        </StackLayout>
                    </ViewCell>
                </DataTemplate>
            </ListView.ItemTemplate>
        </ListView>
    </ContentPage.Content>
</ContentPage>
```
