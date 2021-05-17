# Lottie

www.lottiefiles.com
comAirbnb.Xamarin.Forms.Lottie

1. Copy json lottie file to project. (41812-christmas-tree.json)

```xml
<Stacklayout>
...
    <forms:AnimationView
        x:Name="animationView"
        Animation="resource://Resources.41812-christmas-tree.json?assembly=Lottiemas"
        AnimationSource="EmbeddedResource"
        AutoPlay="True"
        BackgroundColor="Red"
        RepeatCount="3"
        RepeatMode="Restart"
        VerticalOptions="FillAndExpand"
        HorizontalOptions="FillAndExpand" />
...
</Stacklayout>
```