# Arrange views with StackLayout

StackLayout is a layout container that organizes its children left-to-right or top-to-bottom. The direction is based on its Orientation property, and the default value is top-to-bottom.

```xml
<StackLayout Orientation="Horizontal">
    <BoxView Color="Silver" />
    <BoxView Color="Blue" />
    <BoxView Color="Gray" />
</StackLayout>
```

Every view has a `VerticalOptions` and `HorizontalOptions` property. You use these properties to set the position of the view within the rectangle the layout panel gave it.

StackLayout uses the `LayoutOptions` property in the direction opposite to its `Orientation`. For example, if the StackLayout `Orientation` property is set to **vertical**, only the view's `HorizontalOptions` property is respected. If the StackLayout's `Orientation` property is set to **horizontal**, only the view's `VerticalOptions` property is respected.

## How to add views to a StackLayout

In Xamarin.Forms, you can add views to a StackLayout in C# code or in XAML:

```cs
var a = new BoxView() { BackgroundColor = Color.Silver };
var b = new BoxView() { BackgroundColor = Color.Blue };
var c = new BoxView() { BackgroundColor = Color.Gray };

stack.Children.Add(a);
stack.Children.Add(b);
stack.Children.Add(c);
```

```xml
<StackLayout>
    <BoxView Color="Silver" />
    <BoxView Color="Blue" />
    <BoxView Color="Gray" />
</StackLayout>
```

## How to change the space between views in a StackLayout

```xml
<StackLayout Spacing="30">
    <BoxView Color="Silver" />
    <BoxView Color="Blue" />
    <BoxView Color="Gray" />
</StackLayout>
```

## Expansion

The `LayoutOptions` struct contains a bool property called **Expands**. This property is designed specifically for StackLayout and allows a child view to request extra space if there's any available.

Here's an example of how the Expands property works:

![Expansion](./img/expands-property.png)

Notice that there's extra space available in the StackLayout. The extra space will be divided evenly among all views that request additional space.

### How to request additional space

Remember that every view has two LayoutOptions properties called VerticalOptions and HorizontalOptions. So far, we've talked about four values for these properties: Start, Center, End, and Fill. If you want to request additional space, you replace the LayoutOptions value with one of these values: StartAndExpand, CenterAndExpand, EndAndExpand, or FillAndExpand.

Here's how each of these values works:

![Expansion 2](./img/layout-options-expands.png)

The orange box is the view and the gray rectangle represents the extra space given to it by the `Expands` property. The view fills the extra space only when you use the `FillAndExpand` value. When you use the other values, the extra space remains empty, but it can't be used by other views in the StackLayout.