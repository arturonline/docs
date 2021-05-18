# Lines and Stroke Caps


## Lines

SKCanvas defines a simple DrawLine method whose arguments indicate the starting and ending coordinates of the line with an SKPaint object:

```c#
canvas.DrawLine (x0, y0, x1, y1, paint);
```
## Stroke caps

As lines become wider, the appearance of the ends of the lines becomes important. The appearance of the starts and ends of lines is called a line cap or, in Skia, a `stroke cap`. Once you start drawing lines of a sizable thickness, that raises an issue: How should the starts and ends of these thick lines be rendered?

- The `StrokeWidth` property of a newly instantiated `SKPaint` object is 0, which has the same effect as a value of 1 in rendering a line of one pixel in thickness.
- There are 3 types: `Butt` (the default), `Square`, `Round`.

## Example

<img src="../resources/strokecaps-large.png" width=450>

```c#
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
        TextAlign = SKTextAlign.Center
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

    float xText = info.Width / 2;
    float xLine1 = 100;
    float xLine2 = info.Width - xLine1;
    float y = textPaint.FontSpacing;

    foreach (SKStrokeCap strokeCap in Enum.GetValues(typeof(SKStrokeCap)))
    {
        // Display text
        canvas.DrawText(strokeCap.ToString(), xText, y, textPaint);
        y += textPaint.FontSpacing;

        // Display thick line
        thickLinePaint.StrokeCap = strokeCap;
        canvas.DrawLine(xLine1, y, xLine2, y, thickLinePaint);

        // Display thin line
        canvas.DrawLine(xLine1, y, xLine2, y, thinLinePaint);
        y += 2 * textPaint.FontSpacing;
    }
}
```
⚠ The `Square` and `Round` stroke caps effectively extend the length of the line by half the stroke width at the beginning of the line and again at the end 
