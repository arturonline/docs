# B

Bindings are used most often to connect the visuals of a program with an underlying data model, usually in a realization of the MVVM (Model-View-ViewModel) application architecture.

## Binding Mode

- Default
- OneWay — values are transferred from the source to the target
- OneWayToSource — values are transferred from the target to the source
- TwoWay — values are transferred both ways between source and target
- OneTime — data goes from source to target, but only when the BindingContext changes

## View to View

Set the BindingContext of the target object using the `x:Reference` markup extension:

```xml
<Slider x:Name="slider" />

<Label BindingContext="{x:Reference slider}" />
```

## Reference classes in other assemblies (x:Static)

Here’s a program that defines an XML namespace declaration for the `System` namespace:

```xml
<xmlns:sys="clr-namespace:System;assembly=netstandard" />
```

The program can use `x:Static` to obtain the current date and time from the static` DateTime.Now` property and set that DateTime value to the `BindingContext` on a `StackLayout`:

```xml
<StackLayout BindingContext="{x:Static sys:DateTime.Now}" />
```

## Changing data in the view

Viewmodels usually rely on models for most of their data and any business logic. But it's the viewmodel that formats, converts, and enriches the data in whatever way the current view requires.

## Handling events in the viewModel: commands

Sometimes the View needs to contain buttons that trigger various actions in the ViewModel. But the ViewModel must not contain Clicked handlers for the buttons because that would tie the ViewModel to a particular user-interface paradigm.

To allow ViewModels to be more independent of particular user interface objects but still allow methods to be called within the ViewModel, a command interface exists. 