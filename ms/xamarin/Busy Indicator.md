# Busy Indicator

```xml
<!--  Busy Indicator  -->
<Frame
    BackgroundColor="White"
    BorderColor="Transparent"
    CornerRadius="6"
    Grid.Row="0"
    Grid.RowSpan="2"
    HasShadow="False"
    HorizontalOptions="Center"
    IsVisible="{Binding lLoading}"
    Padding="20"
    VerticalOptions="Center"
    x:Name="oBorderBusyIndicator">

    <StackLayout
        HorizontalOptions="FillAndExpand"
        Orientation="Horizontal"
        Spacing="0"
        VerticalOptions="FillAndExpand"
        x:Name="oStackLayoutBusyIndicator">

        <ActivityIndicator
            Color="#004e78"
            HeightRequest="50"
            HorizontalOptions="Center"
            IsRunning="{Binding lLoading}"
            VerticalOptions="Center"
            WidthRequest="50"
            x:Name="oIndicator" />

        <Label
            Margin="15,0,0,0"
            Text="{Binding cLoadingMessage}"
            TextColor="#8f8f8f"
            VerticalOptions="Center"
            x:Name="oLblBusyIndicator" />



    </StackLayout>

</Frame>
```

```cs
// viewModelBase

    public class ViewModelBase : BindableBase, IInitialize, INavigationAware, IDestructible
    {
        /// <summary>
        /// Mensaje que se mostrará al mostrar el Busy Indicator
        /// </summary>
        public string cLoadingMessage
        {
            get { return _cLoadingMessage; }
            set { SetProperty(ref _cLoadingMessage, value); }
        }

        /// <summary>
        /// Se pondrá a true para mostrar el Activity Indicator en las pantallas
        /// </summary>
        public bool lLoading
        {
            get { return _lLoading; }
            set { SetProperty(ref _lLoading, value); }
        }
    }