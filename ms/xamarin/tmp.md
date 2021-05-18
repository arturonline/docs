# temp

```xml

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
```

```xml
xmlns:ios="clr-namespace:Xamarin.Forms.PlatformConfiguration.iOSSpecific;assembly=Xamarin.Forms.Core"
ios:Page.UseSafeArea="true"
```