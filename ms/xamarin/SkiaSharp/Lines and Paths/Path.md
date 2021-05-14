# Path

One of the most important features of the graphics path is the ability to define when multiple lines should be connected and when they should not be connected. The difference can be significant, as the tops of these two triangles demonstrate:

<img src="../resources/connectedlinesexample.png">

## Contours

A path is a collection of one or more **contours**. Each **contour** is a collection of connected straight lines and curves. **Contours** are not connected to each other but they might visually overlap. Sometimes a single **contour** can overlap itself.

### walking the Path

A **contour** generally begins with a call to the following method of SKPath:

`MoveTo` or `RMoveTo` to begin a new contour

The argument to that method is a single point and establishes an initial point at the beginning of the contour. You can call the following methods to continue the contour with a line or curve from the current point to a point specified in the method, which then becomes the new current point:

Normal | Relative | Description
-|-|-
`LineTo` | `RLineTo` |  to add a straight line to the path
`ArcTo` | `RArcTo` |  to add an arc, which is a line on the circumference of a circle or ellipse
`CubicTo` | `RCubicTo` |  to add a cubic Bezier spline
`QuadTo` | `RQuadTo` |  to add a quadratic Bezier spline
`ConicTo` | `RConicTo` |  to add a rational quadratic Bezier spline, which can accurately render conic sections (ellipses, parabolas, and hyperbolas)

None of these methods contain all the information necessary to describe the line or curve. Each of these five methods works in conjunction with the current point established by the method call immediately preceding it. For example, the `LineTo` method adds a straight line to the contour based on the current point, so the parameter to `LineTo` is only a single point.

The relative methods are relative to the current point. These are handy for drawing similar parts of a path in a method that you call multiple times.

A **contour** ends with another call to `MoveTo` or `RMoveTo`, which begins a new contour, or a call to `Close`, which closes the contour. The Close method automatically appends a straight line from the current point to the first point of the contour, and marks the path as closed, which means that it will be rendered without any stroke caps.

## Example: Triangles

The difference between open and closed **contours** is illustrated in the next example, which uses an `SKPath` object with two **contours** to render two triangles. The first contour is **open** and the second is **closed**. 

```c#
using System;

using Xamarin.Forms;

using SkiaSharp;
using SkiaSharp.Views.Forms;

namespace SkiaSharpFormsDemos.Paths
{
    public class TwoTriangleContoursPage : ContentPage
    {
        public TwoTriangleContoursPage()
        {
            Title = "Two Triangle Contours";

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

            // Create the path
            SKPath path = new SKPath();

            // Define the first contour
            path.MoveTo(0.5f * info.Width, 0.1f * info.Height);
            path.LineTo(0.2f * info.Width, 0.4f * info.Height);
            path.LineTo(0.8f * info.Width, 0.4f * info.Height);
            path.LineTo(0.5f * info.Width, 0.1f * info.Height);
            /* there is no need to Close() */

            // Define the second contour
            path.MoveTo(0.5f * info.Width, 0.6f * info.Height);
            path.LineTo(0.2f * info.Width, 0.9f * info.Height);
            path.LineTo(0.8f * info.Width, 0.9f * info.Height);
            path.Close();

            // Create two SKPaint objects
            SKPaint strokePaint = new SKPaint
            {
                Style = SKPaintStyle.Stroke,
                Color = SKColors.Magenta,
                StrokeWidth = 50
            };

            SKPaint fillPaint = new SKPaint
            {
                Style = SKPaintStyle.Fill,
                Color = SKColors.Cyan
            };

            // Fill and stroke the path
            canvas.DrawPath(path, fillPaint);
            canvas.DrawPath(path, strokePaint);
        }
    }
}
```

As you can see, the first contour is obviously a series of three connected lines, but the end doesn't connect with the beginning. The two lines overlap at the top. The second **contour** is obviously closed, and was accomplished with one fewer `LineTo` calls because the `Close` method automatically adds a final line to close the contour.

## Stroke Join

Just as the appearance of the start and end of a line is defined by a stroke cap, the appearance of the connection between two lines is defined by a stroke join. You specify this by setting the StrokeJoin property of SKPaint to a member of the SKStrokeJoin enumeration:

- Miter for a pointy join
- Round for a rounded join
- Bevel for a chopped-off join

### Example

<img src="../resources/strokejoins-large.png" width=450>

```c#
using System;

using Xamarin.Forms;

using SkiaSharp;
using SkiaSharp.Views.Forms;

namespace SkiaSharpFormsDemos.Paths
{
    public class StrokeJoinsPage : ContentPage
    {
        public StrokeJoinsPage()
        {
            Title = "Stroke Joins";

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

            SKPaint textPaint = new SKPaint
            {
                Color = SKColors.Black,
                TextSize = 75,
                TextAlign = SKTextAlign.Right
            };

            SKPaint thickLinePaint = new SKPaint
            {
                Style = SKPaintStyle.Stroke,
                Color = SKColors.Orange,
                StrokeWidth = 50
            };

            SKPaint thinLinePaint = new SKPaint
            {
                Style = SKPaintStyle.Stroke,
                Color = SKColors.Black,
                StrokeWidth = 2
            };

            float xText = info.Width - 100;
            float xLine1 = 100;
            float xLine2 = info.Width - xLine1;
            float y = 2 * textPaint.FontSpacing;
            string[] strStrokeJoins = { "Miter", "Round", "Bevel" };

            foreach (string strStrokeJoin in strStrokeJoins)
            {
                // Display text
                canvas.DrawText(strStrokeJoin, xText, y, textPaint);

                // Get stroke-join value
                SKStrokeJoin strokeJoin;
                Enum.TryParse(strStrokeJoin, out strokeJoin);

                // Create path
                SKPath path = new SKPath();
                path.MoveTo(xLine1, y - 80);
                path.LineTo(xLine1, y + 80);
                path.LineTo(xLine2, y + 80);

                // Display thick line
                thickLinePaint.StrokeJoin = strokeJoin;
                canvas.DrawPath(path, thickLinePaint);

                // Display thin line
                canvas.DrawPath(path, thinLinePaint);
                y += 3 * textPaint.FontSpacing;
            }
        }
    }
}
```

The `miter join` consists of a sharp point where the lines connect. When two lines join at a small angle, the `miter join` can become quite long. To prevent excessively long `miter joins`, the length of the `miter join` is limited by the value of the `StrokeMiter` property of `SKPaint`. A miter join that exceeds this length is chopped off to become a `bevel join`.