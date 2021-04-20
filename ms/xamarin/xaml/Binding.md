# Binding

https://docs.microsoft.com/en-gb/learn/modules/separate-your-ui-and-code-with-xamarin-forms-data-binding/3-exercise-replace-code-with-data-bindings

A binding ties two properties together. One property is in your UI and the other is in your data-model object. If the value of either property changes, the binding object can update the other one. In other words, bindings are intermediary objects that synchronize your UI and data.

```cs
// Create Source
ToDo task = new ToDo() { Title = "Pickup some Milk", ... };

// Create target
Entry Name = new Entry();

// Create binding, identifying Source and Path
Binding nameBinding = new Binding()
nameBinding.Source = task;
nameBinding.Path = "Title";

// Set Binding, identifying Target object and Target property
Name.SetBinding(Entry.TextProperty, nameBinding);
```

```xml
<StackLayout>
    <StackLayout.Resources>
        <ResourceDictionary>
            <Todo x:Key="getMilk" Title="Pickup some Milk" />
        </ResourceDictionary>
    </StackLayout.Resources>
    <Entry Text="{Binding Title, Source={StaticResource getMilk}}}" />
</StackLayout>
```

## Use the same source for multiple bindings

So far we've discussed one binding at a time. But in the most common situation, we have several controls that pull data from the same source object.

This situation is so common that bindings have a special case to handle it, The `BindingContext`. The `BindableObject` class defines a property named `BindingContext`. All Xamarin.Forms pages, layout panels, and controls inherit from `BindableObject`, so they all have this property. A binding without a setting for Source automatically searches the visual tree for non-null `BindingContext` properties.

It's common to set the `BindingContext` at the page level. Our XAML bindings contain only the source path, which helps make the XAML smaller and more readable.

```cs
// In code-behind we set Page.BindingContext
BindingContext = new Todo() { Title = "Pickup some milk", Notes = "Stop at the Grocery Store!", Completed = true }
```

```xml
<!-- In XAML our bindings do not need to set Source -->
<StackLayout Padding="20" Spacing="20">
    <Entry Text="{Binding Title}" />
    <Entry Text="{Binding Notes}" />
    <Switch IsToggled="{Binding Completed}" />
</StackLayout>
```