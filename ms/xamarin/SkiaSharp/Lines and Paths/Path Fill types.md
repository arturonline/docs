# Path Filling

Two contours in a path can overlap, and the lines that make up a single contour can overlap. Any enclosed area can potentially be filled, but you might not want to fill all the enclosed areas. Here's an example:

<img src="../resources/filltypeexample.png" width=250>

The `SKFillType` property of SKPath, which you set to a member of the `SKPathFillType` enumeration:

- `Winding`, the default
- `EvenOdd`
- `InverseWinding`
- `InverseEvenOdd`

## Example

<img src="../resources/fivepointedstar-large.png" width=450>

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:skia="clr-namespace:SkiaSharp;assembly=SkiaSharp"
             xmlns:skiaforms="clr-namespace:SkiaSharp.Views.Forms;assembly=SkiaSharp.Views.Forms"
             x:Class="SkiaSharpFormsDemos.Paths.FivePointedStarPage"
             Title="Five-Pointed Star">
    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto" />
            <RowDefinition Height="*" />
        </Grid.RowDefinitions>

        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="*" />
            <ColumnDefinition Width="*" />
        </Grid.ColumnDefinitions>

        <Picker x:Name="fillTypePicker"
                Title="Path Fill Type"
                Grid.Row="0"
                Grid.Column="0"
                Margin="10"
                SelectedIndexChanged="OnPickerSelectedIndexChanged">
            <Picker.ItemsSource>
                <x:Array Type="{x:Type skia:SKPathFillType}">
                    <x:Static Member="skia:SKPathFillType.Winding" />
                    <x:Static Member="skia:SKPathFillType.EvenOdd" />
                    <x:Static Member="skia:SKPathFillType.InverseWinding" />
                    <x:Static Member="skia:SKPathFillType.InverseEvenOdd" />
                </x:Array>
            </Picker.ItemsSource>
            <Picker.SelectedIndex>
                0
            </Picker.SelectedIndex>
        </Picker>

        <Picker x:Name="drawingModePicker"
                Title="Drawing Mode"
                Grid.Row="0"
                Grid.Column="1"
                Margin="10"
                SelectedIndexChanged="OnPickerSelectedIndexChanged">
            <Picker.ItemsSource>
                <x:Array Type="{x:Type x:String}">
                    <x:String>Fill only</x:String>
                    <x:String>Stroke only</x:String>
                    <x:String>Stroke then Fill</x:String>
                    <x:String>Fill then Stroke</x:String>
                </x:Array>
            </Picker.ItemsSource>
            <Picker.SelectedIndex>
                0
            </Picker.SelectedIndex>
        </Picker>

        <skiaforms:SKCanvasView x:Name="canvasView"
                                Grid.Row="1"
                                Grid.Column="0"
                                Grid.ColumnSpan="2"
                                PaintSurface="OnCanvasViewPaintSurface" />
    </Grid>
</ContentPage>
```

The code-behind file uses both Picker values to draw a five-pointed star:

```c#
using System;

using Xamarin.Forms;

using SkiaSharp;
using SkiaSharp.Views.Forms;

namespace SkiaSharpFormsDemos.Paths
{
    public partial class FivePointedStarPage : ContentPage
    {
        public FivePointedStarPage()
        {
            InitializeComponent();
        }

        void OnPickerSelectedIndexChanged(object sender, EventArgs args)
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

            SKPoint center = new SKPoint(info.Width / 2, info.Height / 2);
            float radius = 0.45f * Math.Min(info.Width, info.Height);

            SKPath path = new SKPath
            {
                FillType = (SKPathFillType)fillTypePicker.SelectedItem
            };
            path.MoveTo(info.Width / 2, info.Height / 2 - radius);

            for (int i = 1; i < 5; i++)
            {
                // angle from vertical
                double angle = i * 4 * Math.PI / 5;
                path.LineTo(center + new SKPoint(radius * (float)Math.Sin(angle), 
                                                -radius * (float)Math.Cos(angle)));
            }
            path.Close();

            SKPaint strokePaint = new SKPaint
            {
                Style = SKPaintStyle.Stroke,
                Color = SKColors.Red,
                StrokeWidth = 50,
                StrokeJoin = SKStrokeJoin.Round
            };

            SKPaint fillPaint = new SKPaint
            {
                Style = SKPaintStyle.Fill,
                Color = SKColors.Blue
            };

            switch ((string)drawingModePicker.SelectedItem)
            {
                case "Fill only":
                    canvas.DrawPath(path, fillPaint);
                    break;

                case "Stroke only":
                    canvas.DrawPath(path, strokePaint);
                    break;

                case "Stroke then Fill":
                    canvas.DrawPath(path, strokePaint);
                    canvas.DrawPath(path, fillPaint);
                    break;

                case "Fill then Stroke":
                    canvas.DrawPath(path, fillPaint);
                    canvas.DrawPath(path, strokePaint);
                    break;
            }
        }
    }
}
```

The Android screenshot show the typical even-odd and winding effects, but the order of the stroke and fill also affects the results.

The winding algorithm is dependent on the direction that lines are drawn. Usually when you're creating a path, you can control that direction as you specify that lines are drawn from one point to another. However, the `SKPath` class also defines methods like `AddRect` and `AddCircle` that draw entire contours. To control how these objects are drawn, the methods include a parameter of type `SKPathDirection`, which has two members:

- `Clockwise`
- `CounterClockwise`

The methods in `SKPath` that include an `SKPathDirection` parameter give it a default value of **Clockwise**.

## Exemple 2

<img src="../resources/overlappingcircles-large.png" width=450>

```c#
using System;

using Xamarin.Forms;

using SkiaSharp;
using SkiaSharp.Views.Forms;

namespace SkiaSharpFormsDemos.Paths
{
    public class OverlappingCirclesPage : ContentPage
    {
        public OverlappingCirclesPage()
        {
            Title = "Overlapping Circles";

            SKCanvasView canvasView = new SKCanvasView();
            canvasView.PaintSurface += OnCanvasViewPaintSurface;
            Content = canvasView;
        }

        void OnCanvasViewPaintSurface(object sender, SKPaintSurfaceEventArgs args)
        {
            SKImageInfo info = args.Info;
            SKSurface surface = args.Surface;
            SKCanvas canvas = surface.Canvas;

            canvas.Clear();

            SKPoint center = new SKPoint(info.Width / 2, info.Height / 2);
            float radius = Math.Min(info.Width, info.Height) / 4;

            SKPath path = new SKPath
            {
                FillType = SKPathFillType.EvenOdd
            };

            path.AddCircle(center.X - radius / 2, center.Y - radius / 2, radius);
            path.AddCircle(center.X - radius / 2, center.Y + radius / 2, radius);
            path.AddCircle(center.X + radius / 2, center.Y - radius / 2, radius);
            path.AddCircle(center.X + radius / 2, center.Y + radius / 2, radius);

            SKPaint paint = new SKPaint()
            {
                Style = SKPaintStyle.Fill,
                Color = SKColors.Cyan
            };

            canvas.DrawPath(path, paint);

            paint.Style = SKPaintStyle.Stroke;
            paint.StrokeWidth = 10;
            paint.Color = SKColors.Magenta;

            canvas.DrawPath(path, paint);
        }
    }
}
```