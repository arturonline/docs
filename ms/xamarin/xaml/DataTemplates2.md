# DataTemplates

Everything on a Xamarin.Forms flyout can be templated, and the first you'll likely want to customize is the flyout items themselves. You have bindable properties for things like the image and the title text, and visual states are propogated as well. You can define your template inline with the Shell file, or in a separate file. Both work with Hot Reload.

## Example 1: Flyout item

```xml
<Shell.ItemTemplate>
    <DataTemplate>
        <Grid ColumnDefinitions="20,*"
              Padding="20,10,0,10"
              ColumnSpacing="20">

            <Image Grid.Column="0"
                   HorizontalOptions="End"
                   VerticalOptions="Center"
                   Source="{Binding Icon}" />
            <Label Grid.Column="1"
                   VerticalOptions="Center"
                   FontSize="24"
                   Text="{Binding Title}" />
            
        </Grid>
    </DataTemplate>
</Shell.ItemTemplate>
```

>New Item > Content Page > "Templates/MyFlyoutTemplate"

```xml
<!-- MyFlyoutTemplate.xaml -->
<?xml version="1.0" encoding="utf-8" ?>
<Grid xmlns="http://xamarin.com/schemas/2014/forms"
      xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
      x:Class="whatever.templates.MyFlyoutTemplate"
      ColumnDefinitions="20,*" Padding="20,10,0,10" ColumnSpacing="20" >

            <Image Grid.Column="0"
                   HorizontalOptions="End"
                   VerticalOptions="Center"
                   Source="{Binding Icon}" />
            <Label Grid.Column="1"
                   VerticalOptions="Center"
                   FontSize="24"
                   Text="{Binding Title}" />
            
        </Grid>
</Grid>
```
```diff
// Templates/MyFlyoutTemplate.xaml.cs
<Shell
    ...
- public partical class MyFlyoutTemplate : ContentPage
+ public partical class MyFlyoutTemplate : Grid
    ...
 >
```

```diff
<!-- AppShell.xaml -->

+ ItemTemplate="{DataTemplate Templates:FlyoutItemTemplate}"

<FlyoutItem Title="WorkingFile">
    <FlyoutItem.Icon>
    ...
    </FlyoutItem.Icon>
    <ShellContent ContentTemplate ...>
</FlyoutItem>

```

## Example 2: Header

```xml
<!-- Templates/myFlyoutHeaderTemplate -->
<?xml version="1.0" encoding="utf-8" ?>
<Grid xmlns="http://xamarin.com/schemas/2014/forms"
      xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
      BackgroundColor=Orange
      HeightRequest="100"
      Padding="20,66,0,40"
      x:Class="whatever.templates.MyFlyoutTemplate" >

      <Image Source="whateverimage" 
             Grid.ColumnSpan="2"
             VerticalOptions="Start"
             HorizontalOptions="Center" />

</Grid>
```

```diff
<!-- Templates/MyFlyoutHeaderTemplate -->
<Shell
    ...
- public partical class MyFlyoutHeaderTemplate : ContentPage
+ public partical class MyFlyoutHeaderTemplate : Grid
    ...
>

```

```xml
<!-- AppShell.xaml -->

+ FlyoutHeaderTemplate="{DataTemplate Templates:MyFlyoutHeaderTemplate}"
```