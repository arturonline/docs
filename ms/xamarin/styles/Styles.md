# Styles

[More info](https://docs.microsoft.com/en-gb/learn/modules/design-consistent-xaml-pages-with-shared-resources-and-styles/6-create-consistent-ui-with-styles)

A style is a collection of *property/value* pairs targeted at a specific UI view:

```xml
<Style TargetType="Button">
    <Setter Property="BackgroundColor" Value="#2A84D3" />
    <Setter Property="BorderColor" Value="#1C5F9B" />
    <Setter Property="BorderRadius" Value="10" />
    <Setter Property="BorderWidth" Value="3" />
    <Setter Property="TextColor" Value="White" />
</Style>
```

⚠️ You can't use this style for a label, because the Label class doesn't include the BorderColor, BorderRadius, or BorderWidth property.

## Define a Style

You'll typically define your styles as `resources` inside `ResourceDictionary`.

```xml
<Page.Resources>
    <Style x:Key="MyButtonStyle" TargetType="Button">
    ...
    </Style>
</Page.Resources>
```

## Apply a style

```xml
<Button Text="OK" Style="{StaticResource MyButtonStyle}" />
<Button Text="Cancel" Style="{DynamicResource MyButtonStyle}" />
```

❕ `DynamicResource` listens for replacement of **x:Key** in the dictionary. If you write code that loads a new style into `ResourceDictionary` with that same **x:Key** instance, the new style will automatically get applied to your UI.

## Implicit style

An implicit style is a style that you add to `ResourceDictionary` without giving it an `x:Key` instance. Implicit styles are automatically applied to all controls of the `TargetType` object.

Here's the previous example declared as an implicit style. This style will be loaded onto every Button instance on the page:

```xml
<Page.Resources>
    <Style TargetType="Button">
        <Setter Property="BackgroundColor" Value="Blue" />
        <Setter Property="BorderColor" Value="Navy" />
        ...
    </Style>
</Page.Resources>
```

⚠️ Controls that inherit from the target type will not receive the styles. To affect inherited controls, you can set the `Style.ApplyToDerivedTypes` attribute to `True`.
Example we could apply a black background style to `ContentPage` and have it affect any of your pages that inherit from it:

```xml
<Page.Resources>
    <Style TargetType="ContentPage"
           ApplyToDerivedTypes="True">
        <Setter Property="BackgroundColor" Value="Black" />
    </Style>
</Page.Resources>
```

## Override a style

```xml
<Style x:Key="MyButtonStyle" TargetType="Button">
    <Setter Property="BackgroundColor" Value="Blue" />
    <Setter Property="BorderRadius" Value="10" />
    <Setter Property="BorderWidth" Value="3" />
</Style>
```

Let's assume that this style works for all your buttons except **Cancel**, which needs a **red background**. The following code shows how to override the color setting:

```xml
<Button
    Text="Cancel"
    Style="{StaticResource MyButtonStyle}"
    BackgroundColor="Red"
    ... />
```

## Target an ancestor type

Suppose you want a custom background color for your buttons and labels. You can create separate styles for each type. Or, you can create one style with `TargetType` set to `VisualElement`. This technique works because `VisualElement` is a base class for both Button and Label.
The following code shows a style that targets a base class that's being applied to two different derived types.

```xml
<Style x:Key="MyVisualElementStyle" TargetType="VisualElement">
    <Setter Property="BackgroundColor" Value="#2A84D3" />
</Style>

<Button Style="{StaticResource MyVisualElementStyle}" ... />
<Label Style="{StaticResource MyVisualElementStyle}" ... />
```

An **implicit** style won't work here because `TargetType` for an implicit style must be an exact match to the object type.

## Inherit from a style

The following code shows two styles with a repeated setter:

```xml
<Style x:Key="MyButtonStyle" TargetType="Button">
    <Setter Property="BackgroundColor" Value="Blue" />
    <Setter Property="BorderColor" Value="Navy" />
    <Setter Property="BorderWidth" Value="5" />
</Style>

<Style x:Key="MyEntryStyle" TargetType="Entry">
    <Setter Property="BackgroundColor" Value="Blue" />
    <Setter Property="TextColor" Value="White" />
</Style>
```

The following code shows the previous example styles refactored into a hierarchy. The common setter appears only in the base style rather than being repeated. Notice that you use `StaticResource` to look up the base style. That's the only option, because Dynami`cResource **isn't allowed**.

```xml
<Style x:Key="MyVisualElementStyle" TargetType="VisualElement">
    <Setter Property="BackgroundColor" Value="Blue" />
</Style>

<Style x:Key="MyButtonStyle" TargetType="Button" BasedOn="{StaticResource MyVisualElementStyle}">
    <Setter Property="BorderColor" Value="Navy" />
    <Setter Property="BorderWidth" Value="5" />
</Style>

<Style x:Key="MyEntryStyle" TargetType="Entry" BasedOn="{StaticResource MyVisualElementStyle}">
    <Setter Property="TextColor" Value="White" />
</Style>
```