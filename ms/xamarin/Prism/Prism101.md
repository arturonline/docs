# Prism 101

## Get current container (Resolve)

```cs
using DryIoc;
using Prism.Ioc;

var service = ((PrismApplication)Xamarin.Forms.Application.Current).Container;
var container = ((App) Aplication.Current).Container;
```