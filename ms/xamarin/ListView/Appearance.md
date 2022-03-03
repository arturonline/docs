# Appearance

## Groups

To enable grouping:

- Create a list of lists (a list of groups, each group being a list of elements).
- Set the ListView's ItemsSource to that list.
- Set `IsGroupingEnabled` to **true**.
- Set `GroupDisplayBinding` to bind to the property of the groups that is being used as the title of the group.

[Optional] Set `GroupShortNameBinding` to bind to the property of the groups that is being used as the short name for the group. The short name is used for the jump lists (right-side column on iOS).

```c#
public class PageTypeGroup : List<PageModel>
{
    public string Title { get; set; }
    public string ShortName { get; set; } //will be used for jump lists
    public string Subtitle { get; set; }
    private PageTypeGroup(string title, string shortName)
    {
        Title = title;
        ShortName = shortName;
    }

    public static IList<PageTypeGroup> All { private set; get; }
}
```

```c#
static PageTypeGroup()
{
    List<PageTypeGroup> Groups = new List<PageTypeGroup> {
            new PageTypeGroup ("Alpha", "A"){
                new PageModel("Amelia", "Cedar", new switchCellPage(),""),
                new PageModel("Alfie", "Spruce", new switchCellPage(), "grapefruit.jpg"),
                new PageModel("Ava", "Pine", new switchCellPage(), "grapefruit.jpg"),
                new PageModel("Archie", "Maple", new switchCellPage(), "grapefruit.jpg")
            },
            new PageTypeGroup ("Bravo", "B"){
                new PageModel("Brooke", "Lumia", new switchCellPage(),""),
                new PageModel("Bobby", "Xperia", new switchCellPage(), "grapefruit.jpg"),
                new PageModel("Bella", "Desire", new switchCellPage(), "grapefruit.jpg"),
                new PageModel("Ben", "Chocolate", new switchCellPage(), "grapefruit.jpg")
            }
        };
        All = Groups; //set the publicly accessible list
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="DemoListView.GroupingViewPage"
    <ContentPage.Content>
        <ListView  x:Name="GroupedView"
                   GroupDisplayBinding="{Binding Title}"
                   GroupShortNameBinding="{Binding ShortName}"
                   IsGroupingEnabled="true">
            <ListView.ItemTemplate>
                <DataTemplate>
                    <TextCell Text="{Binding Title}"
                              Detail="{Binding Subtitle}" />
                </DataTemplate>
            </ListView.ItemTemplate>
        </ListView>
    </ContentPage.Content>
</ContentPage>
```

### Customizing grouping

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="DemoListView.GroupingViewPage">
    <ContentPage.Content>
        <ListView x:Name="GroupedView"
                  GroupDisplayBinding="{Binding Title}"
                  GroupShortNameBinding="{Binding ShortName}"
                  IsGroupingEnabled="true">
            <ListView.ItemTemplate>
                <DataTemplate>
                    <TextCell Text="{Binding Title}"
                              Detail="{Binding Subtitle}"
                              TextColor="#f35e20"
                              DetailColor="#503026" />
                </DataTemplate>
            </ListView.ItemTemplate>
            <!-- Group Header Customization-->
            <ListView.GroupHeaderTemplate>
                <DataTemplate>
                    <TextCell Text="{Binding Title}"
                              Detail="{Binding ShortName}"
                              TextColor="#f35e20"
                              DetailColor="#503026" />
                </DataTemplate>
            </ListView.GroupHeaderTemplate>
            <!-- End Group Header Customization -->
        </ListView>
    </ContentPage.Content>
</ContentPage>
```

## Headers and footers

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

## Scrollbar

The ListView class has `HorizontalScrollBarVisibility` and `VerticalScrollBarVisibility` properties, which get or set a `ScrollBarVisibility`:

- **Default** indicates the default scroll bar behavior for the platform.
- **Always** indicates that scroll bars will be visible, even when the content fits in the view.
- **Never** indicates that scroll bars will not be visible, even if the content doesn't fit in the view.

## Row separator

Separator lines are displayed between `ListView` elements by default on iOS and Android. If you'd prefer to hide the separator lines on iOS and Android, set the `SeparatorVisibility` property on your `ListView`. The options for `SeparatorVisibility` are:

- `Default` shows a separator line on iOS and Android.
- `None` hides the separator on all platforms.

```xml
<ListView x:Name="SeparatorDemoListView" SeparatorVisibility="None" />
```

You can also set the color of the separator line via the SeparatorColor property:

```xml
<ListView x:Name="SeparatorDemoListView" SeparatorColor="Green" />```
```

## Row height

All rows in a ListView have the same height by default. ListView has two properties that can be used to change that behavior:

- `HasUnevenRows` *true*/*false* value, rows have varying `heights` if set to *true*. Defaults to *false*.
- `RowHeight` sets the `height` of each row when `HasUnevenRows` is *false*.

You can set the height of all rows by setting the RowHeight property on the ListView.
