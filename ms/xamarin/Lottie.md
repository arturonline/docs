# Lottie

1. Go to [Lottie files](https://lottiefiles.com) and download the JSON animation.
2. Add the file to every project:
    - Android: **Assets** folder as "`AndroidAsset`"
    - iOS: **Resources** folder as "`BundleResource`"
3. Install `Xamarin.Forms.Lottie`
4. Add `AnimationViewRenderer.Init();` to
    - `App.xaml.cs`
    - Android: `MainActivity.cs`
    - iOS: `Delegate.cs`

## Examples

```xml
A normal sample is:

<forms:AnimationView
    x:Name="animationView"
    Animation="LottieLogo1.json"
    AnimationSource="AssetOrBundle"
    Command="{Binding ClickCommand}"
    VerticalOptions="FillAndExpand"
    HorizontalOptions="FillAndExpand" />
```

All possible options are:

```xml
<forms:AnimationView 
    x:Name="animationView"
    Animation="LottieLogo1.json"
    AnimationSource="AssetOrBundle"
    AutoPlay="True"
    CacheComposition="True"
    Clicked="animationView_Clicked"
    Command="{Binding ClickCommand}"
    FallbackResource="{Binding Image}"
    ImageAssetsFolder="Assets/lottie"
    IsAnimating="{Binding IsAnimating}"
    MaxFrame="100"
    MaxProgress="100"
    MinFrame="0"
    MinProgress="0"
    OnAnimationLoaded="animationView_OnAnimationLoaded"
    OnAnimationUpdate="animationView_OnAnimationUpdate"
    OnFailure="animationView_OnFailure"
    OnFinishedAnimation="animationView_OnFinishedAnimation"
    OnPauseAnimation="animationView_OnPauseAnimation"
    OnPlayAnimation="animationView_OnPlayAnimation"
    OnRepeatAnimation="animationView_OnRepeatAnimation"
    OnResumeAnimation="animationView_OnResumeAnimation"
    OnStopAnimation="animationView_OnStopAnimation"
    Progress="{Binding Progress}"
    RepeatCount="3"
    RepeatMode="Restart"
    Scale="1"
    Speed="1"
    VerticalOptions="FillAndExpand"
    HorizontalOptions="FillAndExpand" />
```
