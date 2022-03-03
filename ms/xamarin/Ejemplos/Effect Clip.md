# Effect Clip

https://dev.to/dotnet/clipping-with-shapes-2p2j

Recortar imagen cuadrada (foto) en forma de avatar (redonda)

```xml
<Image Grid.Column="3" VerticalOptions="Center" Source="https://devblogs.microsoft.com/xamarin/wp-content/uploads/sites/44/2019/03/Screen-Shot-2017-01-03-at-3.35.53-PM.png">
    <Image.Clip>
        <EllipseGeometry RadiusX="22" RadiusY="22" Center="22,22" />
    </Image.Clip>
</Image>
```