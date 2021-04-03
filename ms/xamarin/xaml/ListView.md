# ListView

## Static Content (hardcoded)

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="Lists.MainPage">
    <StackLayout Margin="20,20,20,20">
        <ListView>
            <ListView.ItemsSource>
                <x:Array Type="{x:Type x:String}">
                    <x:String>Artur</x:String>
                    <x:String>Badenes</x:String>
                    <x:String>Puig</x:String>
                    <x:String>Ana</x:String>
                    <x:String>Climent</x:String>
                    <x:String>Espinosa</x:String>
                </x:Array>
            </ListView.ItemsSource>
        </ListView>
    </StackLayout>
</ContentPage>
```

## Dynamic Content (from an observed list)

### Model

```cs
// pais.cs
public class Pais
{
    public string Name { get; set; }
    public string Ubicacion { get; set; }
    public override string ToString() => Name;
}
```

### ViewModel

```cs
// paisViewModel.cs
class PaisViewModel
{
    // ItemSource
    public ObservableCollection<Pais> Paises { get; private set; }

    public PaisViewModel()
    {
        Paises = new ObservableCollection<Pais>
        {
            new Pais
            {
                Name = "España",
                Ubicacion = "Sur",
            },
            new Pais
            {
                Name = "Francia",
                Ubicacion = "Sur",
            },
            new Pais
            {
                Name = "Italia",
                Ubicacion = "Sur",
            },
            new Pais
            {
                Name = "Alemania",
                Ubicacion = "Centro",
            },
            new Pais
            {
                Name = "Reino Unido",
                Ubicacion = "Norte",
            }
        };
    }
}
```

### Controlador

```cs
// MainPage.xaml.cs
public partial class MainPage : ContentPage
{
    public List<Pais> Paises { get; private set; }

    public MainPage()
    {
        InitializeComponent();
    }
}
```

### Vista

```xml
<!--MainPage.xaml-->
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:local="clr-namespace:Lists"
             x:Class="Lists.MainPage">

    <!-- PaisViewModel -->
    <ContentPage.BindingContext>
        <local:PaisViewModel />
    </ContentPage.BindingContext>

    <StackLayout Margin="20,20,20,20">
        <ListView ItemsSource="{Binding Paises}"
            HasUnevenRows="True">
            <ListView.ItemTemplate>
                <DataTemplate>
                    <TextCell Text="{Binding Name}"
                              Detail="{Binding Ubicacion}"/>
                </DataTemplate>
            </ListView.ItemTemplate>
        </ListView>
    </StackLayout>
</ContentPage>

```