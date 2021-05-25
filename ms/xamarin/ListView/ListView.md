# ListView

```c#
// models/Log.cs
public class Log
{
    public string Text { get; set; }
    public string Description { get; set; }
}
```

```c#
// ViewModels/LogViewModel
private string text;
public string Text
{
    get => text;
    set => SetProperty(ref text, value);
}

private string description;
public string Description
{
    get => description;
    set => SetProperty(ref description, value);
}
private ObservableCollection<Log> logs;
public ObservableCollection<Log> Logs 
{
    get => logs;
    set => SetProperty(ref logs, value);
}
```

```xml
<!-- LogPage.xaml -->
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:vm="clr-namespace:Todo.ViewModels"
             xmlns:model="clr-namespace:Todo.Models"
             x:Class="Todo.Views.LogPage">

    <ContentPage.BindingContext>
        <vm:LogViewModel />
    </ContentPage.BindingContext>
    
    <ContentPage.Content>
        <StackLayout>
            <ListView 
                      ItemsSource="{Binding Logs}">
                <ListView.ItemTemplate>
                    <DataTemplate x:DataType="model:Log">
                        <TextCell 
                            TextColor="White"
                            DetailColor="White"
                            Text="{Binding Text}" 
                            Detail="{Binding Description}"/>
                    </DataTemplate>
                </ListView.ItemTemplate>
            </ListView>
        </StackLayout>
    </ContentPage.Content>
</ContentPage>
```

## Cells

TextCells allow you to set the following properties:

- **Text** – the text that is shown on the first line, in large font.
- **Detail** – the text that is shown underneath the first line, in a smaller font.
- **TextColor** – the color of the text.
- **DetailColor** – the color of the detail text

### TextCell

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
### ImageCell

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

### Custom Cell

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

### Groups

To enable grouping:

- Create a list of lists (a list of groups, each group being a list of elements).
- Set the ListView's ItemsSource to that list.
- Set `IsGroupingEnabled` to **true**.
- Set `GroupDisplayBinding` to bind to the property of the groups that is being used as the title of the group.

[Optional] Set `GroupShortNameBinding` to bind to the property of the groups that is being used as the short name for the group. The short name is used for the jump lists (right-side column on iOS).

### Headers and footers

It is possible for a **ListView** to present a `header` and `footer` that scroll with the elements of the list. The header and footer can be strings of text or a more complicated layout. This behavior is separate from section **groups**.

```xml
<ListView x:Name="HeaderList" 
          Header="Header"
          Footer="Footer">
    ...
</ListView>
```

To create a customized header and footer, define the Header and Footer views:

```xml
<ListView.Header>
    <StackLayout Orientation="Horizontal">
        <Label Text="Header"
               TextColor="Olive"
               BackgroundColor="Red" />
    </StackLayout>
</ListView.Header>
<ListView.Footer>
    <StackLayout Orientation="Horizontal">
        <Label Text="Footer"
               TextColor="Gray"
               BackgroundColor="Blue" />
    </StackLayout>
</ListView.Footer>
```

