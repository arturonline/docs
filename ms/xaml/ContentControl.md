# Content control

> The **ContentControl** can contain any type of common language runtime object (such as a string or a DateTime object) or a UIElement object (such as a Rectangle or a Panel). This enables you to add rich content to controls. 

Content Control sirve para dejar campos en nuestros componentes cuyo contenido se definira cuando se crea el componente.

## How to

### Define the component with a ContentControl

Definimos un campo header.

```xml
<!-- TierCard -->
<Grid>
    <TextBlock Text="{Binding Title, RelativeSource={RelativeSource AncestorType=UserControl}}" />
    <TextBlock Text="{Binding Description, RelativeSource={RelativeSource AncestorType=UserControl}}" />

    <ContentControl 
        Margin="0 10 0 0"
        Content="{Binding Header, RelativeSource={RelativeSource AncestorType=UserControl}}" />
</Grid>
```


### Use the content control from the component

Creamos el componente y definimos lo que queremos que vaya dentro de Header.

```xml
<comp:TierCard
    Title="Basic"
    Description="my new description">
    <comp:TierCard.Header>
        <TextBlock Text="Basic" FontSize="24" />
    </comp:TierCard.Header>
</comp:TierCard>
```

In this case, the content inside `TierCard.Header` will substitute the ContentControl with binding Header.


## Content Presenter

```xml
<Window x:Class="WpfApp.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="MainWindow" Height="200" Width="300">
    <Window.Resources>
        <Style TargetType="Button">
            <Setter Property="Template">
                <Setter.Value>
                    <ControlTemplate TargetType="Button">
                        <Border>
                            <TextBlock Text="hola" />
                            <ContentPresenter Content="{TemplateBinding Content}" 
                                              HorizontalAlignment="{TemplateBinding HorizontalContentAlignment}" 
                                              VerticalAlignment="{TemplateBinding VerticalContentAlignment}" />
                            <TextBlock Text="Adios" />
                        </Border>
                    </ControlTemplate>
                </Setter.Value>
            </Setter>
        </Style>
    </Window.Resources>
    <Grid>
        <Button Content="Click Me" Width="100" Height="50" Background="LightBlue" />
    </Grid>
</Window>
```

Es decir, con la  linia `<ContentPresenter Content="{TemplateBinding Content}"` le decimos **donde** queremos que se ponga el contenido pasado al **ContentPresenter**. En el caso anterior, se situa entre el TextBlock "hola" y el TextBlock  "Adios".