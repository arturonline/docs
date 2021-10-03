# Busy Indicator

```xml
<!-- AGSContentPage.xaml> -->

<?xml version="1.0" encoding="utf-8" ?>
<!--
/// <summary>
/// ********************************************************************************************************************************************
/// Descripción:    Página base de la que heredarán todas las ventanas de la aplicación
/// Autor:          Paco
/// Fecha:          15/10/2020
/// Observaciones:  Constará de una barra superior con botón atrás + título, y posibilidad de añadir más elementos a la derecha u ocultar título
///                 o botón de atrás. Se añadirá el contenido principal con la propiedad "MainContent". La ventana tendrá también implementado
///                 un BusyIndicator para poder utilizar al poner la propiedad "IsLoading" del ViewModelBase (que tendrán todos los ViewModels)
///                 a true.
/// ********************************************************************************************************************************************
/// </summary>-->
<ContentPage
    BackgroundColor="{StaticResource PageBackground}"
    mc:Ignorable="d"
    x:Class="GESMOBILE_Inventory.CustomControls.AGSContentPage"
    xmlns="http://xamarin.com/schemas/2014/forms"
    xmlns:customcontrols="clr-namespace:GESMOBILE_Inventory.CustomControls"
    xmlns:d="http://xamarin.com/schemas/2014/forms/design"
    xmlns:global="clr-namespace:GESMOBILE_Inventory.Src.Globals"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml">

    <ContentPage.Content>

        <Grid
            HorizontalOptions="FillAndExpand"
            RowSpacing="0"
            VerticalOptions="FillAndExpand">

            <Grid.RowDefinitions>
                <RowDefinition Height="{StaticResource HeightTitleBar}" />
                <RowDefinition Height="*" />
            </Grid.RowDefinitions>

            <!--  BARRA SUPERIOR  -->
            <StackLayout
                BackgroundColor="{StaticResource NewColorSecundario}"
                Grid.Row="0"
                Orientation="Horizontal"
                Padding="0,0,0,2"
                Spacing="0">

                <!--  Botón atrás  -->
                <customcontrols:IconButton
                    AutomationId="BackButton"
                    IconImage="{x:Static global:Icons.Arrow_back}"
                    IsActive="True"
                    PressedCommand="{Binding OnClickBackCommand}"
                    Style="{StaticResource TitleButton}"
                    x:Name="oBtnAtras" />

                <!--  Título  -->
                <Label
                    Style="{StaticResource AGSTitleStyle}"
                    Text="{Binding Title}"
                    x:Name="oLblTitulo" />

                <!--  Se utilizará este contenedor para que cada ventana defina lo que quiera en la parte superior derecha (botones por ejemplo)  -->
                <StackLayout
                    Grid.Column="1"
                    HorizontalOptions="EndAndExpand"
                    Orientation="Horizontal"
                    x:Name="ContenidoDerechoTitulo" />
            </StackLayout>

            <!--<BoxView
                x:Name="oSeparator"
                Grid.Row="0"
                HeightRequest="2"
                HorizontalOptions="FillAndExpand"
                VerticalOptions="End"
                Color="{StaticResource AGSTextColor}" />-->

            <!--  En este contenedor se definirá el contenido principal de cada ventana  -->
            <Grid
                ColumnSpacing="0"
                Grid.Row="1"
                HorizontalOptions="FillAndExpand"
                RowSpacing="0"
                VerticalOptions="FillAndExpand"
                x:Name="ContenidoPrincipal" />

            <!--  Este contenedor se utilizará para oscurecer el fondo del Busy Indicator  -->
            <StackLayout
                BackgroundColor="Black"
                Grid.Row="0"
                Grid.RowSpan="2"
                HorizontalOptions="FillAndExpand"
                IsVisible="{Binding lLoading}"
                Opacity="0.35"
                VerticalOptions="FillAndExpand" />

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
        </Grid>

    </ContentPage.Content>
</ContentPage>
```


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