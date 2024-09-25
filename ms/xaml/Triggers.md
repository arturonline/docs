# Triggers

## Property Triggers

A property trigger performs some actions when a change occurs in a one property.

The following example code shows how to change the foreground color of a button when mouse hovers over the button.

```xml
<Style x:Key = "TriggerStyle" TargetType = "Button"> 
    <Setter Property = "Foreground" Value = "Blue" /> 

    <Style.Triggers> 
        <Trigger Property = "IsMouseOver" Value = "True"> 
            <Setter Property = "Foreground" Value = "Green" /> 
        </Trigger> 
    </Style.Triggers> 
</Style> 
```

## Data Triggers

A data trigger performs some actions when the bound data satisfies some conditions. 

En este caso cambia el estilo de una etiqueta según el valor de la propiedad `_yourScore`.

```cs
[ObservableProperty]
[NotifyPropertyChangedFor(nameof(IsGood))]
[NotifyPropertyChangedFor(nameof(IsMedium))]
[NotifyPropertyChangedFor(nameof(IsBad))]
private double _yourScore = 100;

public bool IsGood => YourScore > 75;
public bool IsMedium => !IsGood && !IsBad;
public bool IsBad => YourScore < 25;
```

```xml
<Label Padding="25" HorizontalTextAlignment="Center">
    <Label.Style>
        <Style TargetType="Label">
            <Style.Triggers>
                <DataTrigger
                    Binding="{Binding IsGood}"
                    TargetType="Label"
                    Value="True">
                    <Setter Property="Background" Value="Green" />
                    <Setter Property="TextColor" Value="White" />
                    <Setter Property="Text" Value="Nice job!" />
                </DataTrigger>
                <DataTrigger
                    Binding="{Binding IsMedium}"
                    TargetType="Label"
                    Value="True">
                    <Setter Property="Background" Value="Yellow" />
                    <Setter Property="Text" Value="Okay..." />
                </DataTrigger>
                <DataTrigger
                    Binding="{Binding IsBad}"
                    TargetType="Label"
                    Value="True">
                    <Setter Property="Background" Value="Red" />
                    <Setter Property="TextColor" Value="White" />
                    <Setter Property="Text" Value="You suck" />
                </DataTrigger>
            </Style.Triggers>
        </Style>
    </Label.Style>
</Label>
```

## Event Triggers

An event trigger performs some actions when a specific event is fired. 

In the following example, we will create a simple button. When the click event is fired, it will expand the button width and height.

```xml
<Grid> 
    <Button Content = "Click Me" Width = "60" Height = "30">

        <Button.Triggers> 
        <EventTrigger RoutedEvent = "Button.Click"> 
            <EventTrigger.Actions> 
                <BeginStoryboard> 
                    <Storyboard> 
                    <DoubleAnimationUsingKeyFrames Storyboard.TargetProperty = 
                        "Width" Duration = "0:0:4"> 
                        <LinearDoubleKeyFrame Value = "60" KeyTime = "0:0:0"/> 
                        <LinearDoubleKeyFrame Value = "120" KeyTime = "0:0:1"/> 
                        <LinearDoubleKeyFrame Value = "200" KeyTime = "0:0:2"/> 
                        <LinearDoubleKeyFrame Value = "300" KeyTime = "0:0:3"/> 
                    </DoubleAnimationUsingKeyFrames>
                    <DoubleAnimationUsingKeyFrames Storyboard.TargetProperty = "Height" 
                        Duration = "0:0:4"> 
                        <LinearDoubleKeyFrame Value = "30" KeyTime = "0:0:0"/> 
                        <LinearDoubleKeyFrame Value = "40" KeyTime = "0:0:1"/> 
                        <LinearDoubleKeyFrame Value = "80" KeyTime = "0:0:2"/> 
                        <LinearDoubleKeyFrame Value = "150" KeyTime = "0:0:3"/> 
                    </DoubleAnimationUsingKeyFrames>
                    </Storyboard> 
                </BeginStoryboard> 
            </EventTrigger.Actions> 
        </EventTrigger> 
        </Button.Triggers> 

    </Button> 
</Grid> 
```