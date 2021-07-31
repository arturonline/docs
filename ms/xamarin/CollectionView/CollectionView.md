# Collection View

## Gesture Recognaizer

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:vm="clr-namespace:FileExplorer.ViewModels"
             Title ="{Binding DirectorioActual, StringFormat='//{0}'}"
             Shell.NavBarIsVisible="true"
             x:Class="FileExplorer.Views.HomePage">

    <ContentPage.BindingContext>
        <vm:HomeViewModel />
    </ContentPage.BindingContext>

    <ContentPage.ToolbarItems>
        <ToolbarItem Text="menu"
                 IconImageSource="icon_about.png"
                 Order="Primary"
                 Priority="0" />
    </ContentPage.ToolbarItems>

    <ContentPage.Content>
        <StackLayout Orientation="Vertical" Padding="10">

            <Grid>
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="*" />
                    <ColumnDefinition Width="4*" />
                </Grid.ColumnDefinitions>
                <Grid.RowDefinitions>
                    <RowDefinition Height="auto" />
                    <RowDefinition Height="auto"/>
                </Grid.RowDefinitions>
                <Button Text="Back"
                        Grid.Row="0"
                        Grid.Column="0"
                        Command="{Binding goBackCommand}"/>

                <SearchBar x:Name="FilesSearchBar"
                        TextChanged="Handle_SearchButtonPressed"
                        BackgroundColor="LightGray"
                       Grid.Row="0"
                       Grid.Column="1" />
            </Grid>

            <CollectionView x:Name="FileCollection"
                            ItemsSource="{Binding ListOfFiles}"
                            ItemSizingStrategy="MeasureFirstItem">
                <CollectionView.ItemTemplate>
                    <DataTemplate>
                        <StackLayout>
                            <StackLayout.GestureRecognizers>
                                <TapGestureRecognizer
                                    Command="{Binding
                                                Source={RelativeSource AncestorType={x:Type vm:HomeViewModel}},
                                                Path=tapCommand}"
                                    CommandParameter="{Binding .}" />
                            </StackLayout.GestureRecognizers>
                            <Frame Padding="5"
                                   HasShadow="True" />
                            <StackLayout Orientation="Horizontal">
                                    <Image Source="{Binding Icon}" />
                                    <Label Text="{Binding Name}"
                                       FontSize="Medium"
                                       TextColor="black" />
                                </StackLayout>
                        </StackLayout>
                    </DataTemplate>
                </CollectionView.ItemTemplate>
            </CollectionView>
        </StackLayout>
    </ContentPage.Content>

</ContentPage>
```

⚠️ An ObservableCollection should update when an item is added or removed - but it will not force an update if an item is modified, unless that item implements INotifyPropertyChanged