# Apply Effect Gradient

Definimos el gradient:

```xml
<ContentPage.Resources>
...
    <Color x:Key="DarkBlue">#0091FF</Color>
    <Color x:Key="LightBlue">#32C5FF</Color>

    <LinearGradientBrush x:Key="BlueGradient" StartPoint="0,0" EndPoint="1,1">
        <GradientStop Color="{StaticResource DarkBlue}" Offset="0.5" />
        <GradientStop Color="{StaticResource LightBlue}" Offset="1.0" />
    </LinearGradientBrush>
...
</ContentPage.Resources>
```

```xml
<Frame Background="{StaticResource BlueGradient}">
    ...
</Frame>
```
