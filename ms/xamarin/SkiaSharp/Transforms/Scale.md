# Scale

The scale transform changes the size of the graphical object. 

The scale transform also often causes graphics coordinates to move as they are made larger.

Earlier you saw two transform formulas that describe the effects of translation factors of `dx` and `dy`:

>x' = x + dx<br>
>y' = y + dy

Scale factors of sx and sy are multiplicative rather than additive:

>x' = sx · x<br>
>y' = sy · y

The default values of the translate factors are 0; the default values of the scale factors are 1.


## Scale methods

The first Scale method is for cases when you want the same horizontal and vertical scaling factor:

```c#
public void Scale (Single s)
```

The second Scale method lets you specify different values for horizontal and vertical scaling:

```c#
public void Scale (Single sx, Single sy)
```
The third Scale method combines the two scaling factors in a single SKPoint value:

```c#
public void Scale (SKPoint size)
```
Scaling is relative to the upper-left corner of the canvas. The fourth Scale method includes two additional parameters to specify the center of scaling:

```C#
public void Scale (Single sx, Single sy, Single px, Single py)
```

The `px` and `py` parameters define a point that is sometimes called the scaling center but in the SkiaSharp documentation is referred to as a pivot point. This is a point relative to the upper-left corner of the canvas that is not affected by the scaling. All scaling occurs relative to that center.

## Basic Scale Example

This example contains two Slider elements that let you select horizontal and vertical scaling factors between 0 and 10. 

<img src="../resources/basicscale-large.png" width=450>

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:skia="clr-namespace:SkiaSharp.Views.Forms;assembly=SkiaSharp.Views.Forms"
             x:Class="SkiaSharpFormsDemos.Transforms.BasicScalePage"
             Title="Basic Scale">
    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto" />
            <RowDefinition Height="Auto" />
            <RowDefinition Height="Auto" />
            <RowDefinition Height="Auto" />
            <RowDefinition Height="*" />
        </Grid.RowDefinitions>
        
        <Grid.Resources>
            <ResourceDictionary>
                <Style TargetType="Label">
                    <Setter Property="HorizontalTextAlignment" Value="Center" />
                </Style>

                <Style TargetType="Slider">
                    <Setter Property="Margin" Value="20, 0" />
                    <Setter Property="Maximum" Value="10" />
                </Style>
            </ResourceDictionary>
        </Grid.Resources>

        <Slider x:Name="xScaleSlider"
                Grid.Row="0"
                ValueChanged="sliderValueChanged" />

        <Label Text="{Binding Source={x:Reference xScaleSlider},
                              Path=Value,
                              StringFormat='Horizontal Scaling = {0:F1}'}"
               Grid.Row="1" />

        <Slider x:Name="yScaleSlider"
                Grid.Row="2"
                ValueChanged="sliderValueChanged" />

        <Label Text="{Binding Source={x:Reference yScaleSlider},
                              Path=Value,
                              StringFormat='Vertical Scaling = {0:F1}'}"
               Grid.Row="3" />

        <skia:SKCanvasView x:Name="canvasView"
                           Grid.Row="4"
                           PaintSurface="OnCanvasViewPaintSurface" />
    </Grid>
</ContentPage>
```
The code-behind file uses those values to call Scale before displaying a rounded rectangle stroked with a dashed line and sized to fit some text in the upper-left corner of the canvas:

```c#
using System;

using Xamarin.Forms;

using SkiaSharp;
using SkiaSharp.Views.Forms;

namespace SkiaSharpFormsDemos.Transforms
{
    public partial class BasicScalePage : ContentPage
    {
        public BasicScalePage()
        {
            InitializeComponent();

            xScaleSlider.Value = 1;
            yScaleSlider.Value = 1;
        }

        void sliderValueChanged(object sender, ValueChangedEventArgs args)
        {
            if (canvasView != null)
            {
                canvasView.InvalidateSurface();
            }
        }

        void OnCanvasViewPaintSurface(object sender, SKPaintSurfaceEventArgs args)
        {
            SKImageInfo info = args.Info;
            SKSurface surface = args.Surface;
            SKCanvas canvas = surface.Canvas;

            canvas.Clear();

            using (SKPaint strokePaint = new SKPaint
            {
                Style = SKPaintStyle.Stroke,
                Color = SKColors.Red,
                StrokeWidth = 3,
                PathEffect = SKPathEffect.CreateDash(new float[] {  7, 7 }, 0)
            })
            using (SKPaint textPaint = new SKPaint
            {
                Style = SKPaintStyle.Fill,
                Color = SKColors.Blue,
                TextSize = 50
            })
            {
                canvas.Scale((float)xScaleSlider.Value,
                             (float)yScaleSlider.Value);

                SKRect textBounds = new SKRect();
                textPaint.MeasureText(Title, ref textBounds);

                float margin = 10;
                SKRect borderRect = SKRect.Create(new SKPoint(margin, margin), textBounds.Size);
                canvas.DrawRoundRect(borderRect, 20, 20, strokePaint);
                canvas.DrawText(Title, margin, -textBounds.Top + margin, textPaint);
            }
        }
    }
}
```

You might wonder: How do the scaling factors affect the value returned from the MeasureText method of `SKPaint`? The answer is: Not at all. Scale is a method of `SKCanvas`. It does not affect anything you do with an `SKPaint` object until you use that object to render something on the canvas.

⚠ Anisotropic scaling causes the stroke width to become different for lines aligned with the horizontal and vertical axes. (This is also evident from the first image on this page.) If you don't want the stroke width to be affected by the scaling factors, set it to 0 and it will always be one pixel wide regardless of the Scale setting.

## Example: Centered Scale

Scaling is relative to the upper-left corner of the canvas. This might be exactly what you want, but it might not be. Suppose you want to position the text and rectangle somewhere else on the canvas and you want to scale it relative to its center. This example shows how this works.

<img src="../resources/centeredscale-large.png" width=450>

```c#
using System;

using Xamarin.Forms;

using SkiaSharp;
using SkiaSharp.Views.Forms;

namespace SkiaSharpFormsDemos.Transforms
{
    public partial class CenteredScalePage : ContentPage
    {
        public CenteredScalePage()
        {
            InitializeComponent();

            xScaleSlider.Value = 1;
            yScaleSlider.Value = 1;
        }

        void sliderValueChanged(object sender, ValueChangedEventArgs args)
        {
            if (canvasView != null)
            {
                canvasView.InvalidateSurface();
            }
        }

        void OnCanvasViewPaintSurface(object sender, SKPaintSurfaceEventArgs args)
        {
            SKImageInfo info = args.Info;
            SKSurface surface = args.Surface;
            SKCanvas canvas = surface.Canvas;

            canvas.Clear();

            using (SKPaint strokePaint = new SKPaint
            {
                Style = SKPaintStyle.Stroke,
                Color = SKColors.Red,
                StrokeWidth = 3,
                PathEffect = SKPathEffect.CreateDash(new float[] { 7, 7 }, 0)
            })
            using (SKPaint textPaint = new SKPaint
            {
                Style = SKPaintStyle.Fill,
                Color = SKColors.Blue,
                TextSize = 50
            })
            {
                SKRect textBounds = new SKRect();
                textPaint.MeasureText(Title, ref textBounds);
                float margin = (info.Width - textBounds.Width) / 2;

                float sx = (float)xScaleSlider.Value;
                float sy = (float)yScaleSlider.Value;
                float px = margin + textBounds.Width / 2;
                float py = margin + textBounds.Height / 2;

                canvas.Scale(sx, sy, px, py);

                SKRect borderRect = SKRect.Create(new SKPoint(margin, margin), textBounds.Size);
                canvas.DrawRoundRect(borderRect, 20, 20, strokePaint);
                canvas.DrawText(Title, margin, -textBounds.Top + margin, textPaint);
            }
        }
    }
}
```
The upper-left corner of the rounded rectangle is positioned margin pixels from the left of the canvas and margin pixels from the top. The last two arguments to the Scale method are set to those values plus the width and height of the text, which is also the width and height of the rounded rectangle. This means that all scaling is relative to the center of that rectangle.

The Slider elements in this program have a range of –10 to 10. As you can see, negative values of vertical scaling (such as on the Android screen in the center) cause objects to flip around the horizontal axis that passes through the center of scaling. Negative values of horizontal scaling (such as in the UWP screen on the right) cause objects to flip around the vertical axis that passes through the center of scaling.

https://docs.microsoft.com/en-us/xamarin/xamarin-forms/user-interface/graphics/skiasharp/transforms/scale