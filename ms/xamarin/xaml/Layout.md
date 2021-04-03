# XAML Layout

If you don't specify the size of a view, it will automatically grow to be exactly large enough to fit around its content.

## Size

The View base class defines two properties that influence the size of a view: WidthRequest and HeightRequest. WidthRequest lets you specify the width, and HeightRequest lets you specify the height. Both properties are of type double. One thing that's worth noting is the names of these properties. Both properties contain the word request. This word means the layout panel might not respect them at runtime. The layout panel reads these values during its sizing calculations and tries to accommodate the requests if it can. If there's not enough space, the layout panel is allowed to ignore the values.

## Position

The View base class has two properties that you use to set the position of a view: VerticalOptions and HorizontalOptions. These settings influence how the view is positioned within the rectangle allocated for it by the layout panel. You can specify that you want the view to align to one of the four edges of the rectangle or that you want it to occupy the entire rectangle.

VerticalOptions or HorizontalOptions is more challenging than setting the size because they're of type LayoutOptions:

```cs
public struct LayoutOptions
{
    public LayoutAlignment Alignment { get; set; }
    public bool Expands { get; set; }
    ...
}
```

- **LayoutAlignment** is an enumeration that contains four values: Start, Center, End, and Fill. You can use these values to control how the child view is positioned within the rectangle given to it by its layout panel.

```xml
<StackLayout>
    <Label Text="Start" HorizontalOptions="Start" BackgroundColor="Silver" />
    <Label Text="Center" HorizontalOptions="Center" BackgroundColor="Silver" />
    <Label Text="End" HorizontalOptions="End" BackgroundColor="Silver" />
    <Label Text="Fill" HorizontalOptions="Fill" BackgroundColor="Silver" />
</StackLayout>
```

        start
                Center
                            End
        Filllllllllllllllllllll

- **Expands** property is a bool that allows a view in a StackLayout to request extra space if any is available.