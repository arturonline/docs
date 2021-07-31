# ListView

⚠️ An ObservableCollection should update when an item is added or removed - but it will not force an update if an item is modified, unless that item implements INotifyPropertyChanged

```c#
// models/Log.cs
public class Log
{
    public string Text { get; set; }
    public string Description { get; set; }
}
```

```c#
// ViewModels/LogViewModel
private string text;
public string Text
{
    get => text;
    set => SetProperty(ref text, value);
}

private string description;
public string Description
{
    get => description;
    set => SetProperty(ref description, value);
}
private ObservableCollection<Log> logs;
public ObservableCollection<Log> Logs
{
    get => logs;
    set => SetProperty(ref logs, value);
}
```

```xml
<!-- LogPage.xaml -->
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:vm="clr-namespace:Todo.ViewModels"
             xmlns:model="clr-namespace:Todo.Models"
             x:Class="Todo.Views.LogPage">

    <ContentPage.BindingContext>
        <vm:LogViewModel />
    </ContentPage.BindingContext>

    <ContentPage.Content>
        <StackLayout>
            <ListView
                      ItemsSource="{Binding Logs}">
                <ListView.ItemTemplate>
                    <DataTemplate x:DataType="model:Log">
                        <TextCell
                            TextColor="White"
                            DetailColor="White"
                            Text="{Binding Text}"
                            Detail="{Binding Description}"/>
                    </DataTemplate>
                </ListView.ItemTemplate>
            </ListView>
        </StackLayout>
    </ContentPage.Content>
</ContentPage>
```

## Example

### ItemsSorce from Static Content (hardcoded)

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

### ItemsSource from Dynamic Content (from an observed list)

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
                <DataTemplate x:DataType="model:Paises" >
                    <TextCell Text="{Binding Name}"
                              Detail="{Binding Ubicacion}"/>
                </DataTemplate>
            </ListView.ItemTemplate>
        </ListView>
    </StackLayout>
</ContentPage>
```
