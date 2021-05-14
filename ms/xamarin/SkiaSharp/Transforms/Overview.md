# Transforms

SkiaSharp supports traditional graphics transforms that are implemented as methods of the SKCanvas object. Mathematically, transforms alter the coordinates and sizes that you specify in SKCanvas drawing functions as the graphical objects are rendered. Transforms are often convenient for drawing repetitive graphics or for animation. Some techniques — such as rotating bitmaps or text — are not possible without the use of transforms.

SkiaSharp transforms support the following operations:

- [Translate](Translate.md) to shift coordinates from one location to another
- [Scale](Scale.md) to increase or decrease coordinates and sizes
- `Rotate` to rotate coordinates around a point
- `Skew` to shift coordinates horizontally or vertically so that a rectangle becomes a parallelogram

These are known as affine transforms: a square is never transformed into anything other than a parallelogram, and a circle is never transformed into anything other than an ellipse.

SkiaSharp also supports non-affine transforms (also called projective or perspective transforms) based on a standard 3-by-3 transform matrix. A non-affine transform allows a square to be transformed into any convex quadrilateral, which is a four-sided figure with all interior angles less than 180 degrees. Non-affine transforms can cause coordinates or sizes to become infinite, but they are vital for 3D effects.

## Differences between SkiaSharp and Xamarin.Forms Transforms

Xamarin.Forms also supports transforms that are similar to those in SkiaSharp. The Xamarin.Forms VisualElement class defines the following transform properties:

- `TranslationX` and `TranslationY`
- `Scale`
- `Rotation`, `RotationX`, and `RotationY`

There are several crucial differences between SkiaSharp transforms and Xamarin.Forms transforms:

- SKiaSharp transforms are methods while the Xamarin.Forms transforms are properties.
- SkiaSharp transforms are applied to the entire SKCanvas object
- The SkiaSharp transforms are relative to the upper-left corner of the SKCanvas