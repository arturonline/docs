# Xaml Markup Extensions

All properties in XAML are set using strings - even when the property in question is not a string type.

```xml
<Label FontSize="Micro" TextColor="Red" Text="Hello World" />
```

Neither `FontSize` nor `TextColor` are typed as strings, but yet I can set them equal to strings in XAML.

That's accomplished because there are several type converters for individual properties that get run automatically when the XAML is being parsed. The converter is able to take the string representation of Red and turn it into the Color structure's Red value.

## Syntax

Markup extensions are properties declared with curly braces:

```xml
<Entry Text="{Binding FirstName}" />
```

So the binding keyowrd here is the markup extension.

## Xaml built-in extensions for Xamarin

### x:Static

Despite the similarities of their names, `x:Static` and `StaticResource` are very different. `StaticResource` returns an object from a resource dictionary while `x:Static` accesses one of the following:

- a public static field
- a public static property
- a public constant field
- an enumeration member

Example:

```c#
 static class AppConstants
{
    ...
    public static readonly Color ForegroundColor  = Color.Aqua;
    ...
}
```

```xml
      <BoxView WidthRequest="{x:Static sys:Math.PI}"
               HeightRequest="{x:Static sys:Math.E}"
               Color="{x:Static local:AppConstants.ForegroundColor}"
               />
```

### x:Reference

References an instance that is declared elsewhere in XAML markup. The reference refers to an element's `x:Name`.

```xml
<Label Text="ROTATION"
        BindingContext="{x:Reference Name=slider}"
        Rotation="{Binding Path=Value}"
        FontAttributes="Bold"
        FontSize="Large"
        HorizontalOptions="Center"
        VerticalOptions="CenterAndExpand" />

<Slider x:Name="slider"
        Maximum="360"
        VerticalOptions="CenterAndExpand" />
```

### x:Type

If a property is of type Type, you can assign it to a Type object using the markup extension {x:Type someClass}.

### x:Array

You can define arrays in XAML using the x:Array markup extension. This markup extension has a required attribute named Type that indicates the type of the elements in the array.

### x:Null

If a property has a non- null value by default but you want to set it to null, set it to the {x:Null} markup extension.

### DataTemplate

In XAML, application developers can nest markup inside a DataTemplate tag to create a View whose members are bound to the properties of data objects that are contained in a ItemsSource list.

A common usage scenario for a DataTemplate is displaying data from a collection of objects in a ListView. The appearance of the data for each cell in the ListView can be managed by setting the ListView.ItemTemplate property to a DataTemplate.

### FontImage
### AppThemeBinding
### OnPlatform
### OnIdiom