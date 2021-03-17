# MVVM

## Example

<img src="img/mvvm.png" heigth=300 width=300>

## Code

### `XAML:`

```xml
<!-- Views/CofeeEquipment.xaml -->
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:viewmodels="clr-namespace:XamApp1.ViewModels"
             x:Class="XamApp1.Views.CoffeeEquipment"
             x:DataType="viewmodels:CoffeEquipmentViewModel">

    <ContentPage.BindingContext>
        <viewmodels:CoffeEquipmentViewModel/>
    </ContentPage.BindingContext>

        <Grid RowDefinitions="*,Auto,Auto,*">
            <Label
                x:Name="LabelCount"
                Grid.Row="1"
                HorizontalOptions="Center"
                FontSize="Large"
                Text="{Binding CountDisplay}" />
            <Button
                x:Name="ButtonClick"
                Command="{Binding IncreaseCount}"
                Grid.Row="2"
                Text="Click me" />

        </Grid>
</ContentPage>
```

### `C#:`

```cs
// ViewModels/CoffeEquipmentViewModel.cs
using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Input;
using Xamarin.Forms;

namespace XamApp1.ViewModels
{
    class CoffeEquipmentViewModel: BindableObject
    {

        public ICommand IncreaseCount { get; }

        int count = 0;
        String countDisplay = "Click me!";
        public string CountDisplay
        {
            get => countDisplay;
            set
            {
                if (value == countDisplay)
                    return;
                countDisplay = value;
                OnPropertyChanged();
            }
        }

        void OnIncrease()
        {
            count++;
            CountDisplay = $"You clicked {count} time(s)";
        }

        public CoffeEquipmentViewModel()
        {
            IncreaseCount = new Command(OnIncrease);
        }
    }
}

```