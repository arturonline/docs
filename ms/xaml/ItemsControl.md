# ItemsControl

>Represents a control that can be used to present a collection of items.

Basicamente es el for loop de xaml. Le pasas una lista y defines como se mostrará cada elemento de la lista.

- [Video](https://www.youtube.com/watch?v=aRYiUyz2_RM)

```xml
<ItemsControl
    ItemsSource={Binding lista}>
    <ItemsControl.ItemTemplate>
        <DataTemplate>
            <Grid>
                <Grid.RowDefinitions>
                    <RowDefinition Height="auto" />
                    <RowDefinition Height="*" />
                    <RowDefinition Height="auto" />
                </Grid.RowDefinitions>

                <TextBlock
                    Grid.Row="0"
                    FontSize="18"
                    Text="{Binding Name}" />
                <TextBlock
                    Grid.Row="1"
                    Margin="0 10 0 0"
                    Text="{Binding Description}"
                    TextWrapping="Wrap" />
                <TextBlock
                    Grid.Row="2"
                    Margin="0 10 0 0"
                    FontWeight="Bold"
                    Text="{Binding Price, StringFormat={}{0:C}}" />
            </Grid>
        </DataTemplate>
        <ItemsControl.ItemTemplate>
            <ItemsPanelTemplate>
                <WrapPanel />
            </ItemsPanelTemplate>
        </ItemsControl.ItemTemplate>
    </ItemsControl.ItemTemplate>

</ItemsControl>
```

- El `datatemplate` determinara como lucira cada elemento de lista.
- `ItemsPanel` es el contenedor sobre el que se renderizara cada elemento de la lista. Por defecto es un `StackPanel`.