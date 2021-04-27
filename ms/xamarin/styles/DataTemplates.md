# Create Data Templates

## With type

Original:

```xml
<!-- default flyoutitem -->
<FlyoutItem Title="About">
    <ShellContent Route="about" ContentTemplate="{DataTemplate local:AboutPage}" />
</FlyoutItem>
```

Create a new design:

```xml
<!-- Templates/FlyoutTemplate.xaml -->
<?xml version="1.0" encoding="UTF-8"?>
<ContentView xmlns="http://xamarin.com/schemas/2014/forms" 
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="Todo.Templates.FlyoutTemplate">
  <ContentView.Content>
        <StackLayout Orientation="Horizontal">

            <Label FontSize="20" Padding="15,20,0,0"  StyleClass="FlyoutItemLabelStyle">
                <Label.FormattedText>
                    <FormattedString>
                        <FormattedString.Spans>
                            <Span FontSize="25" FontFamily="FA-S" Text="{Binding Icon}" />
                            <Span Text="  " />
                            <Span Text="{Binding Title}"/>
                        </FormattedString.Spans>
                    </FormattedString>
                </Label.FormattedText>
            </Label>

        </StackLayout>
    </ContentView.Content>
</ContentView>
```
Use the new design wherever:

```xml
<!-- AppShell.xaml -->
    <FlyoutItem Title="Tareas" Icon ="{StaticResource IconHome}" BindingContext="IconHome">
        <Shell.ItemTemplate >
            <DataTemplate>
                <template:FlyoutTemplate></template:FlyoutTemplate>
            </DataTemplate>
        </Shell.ItemTemplate>
        <ShellContent Route="todolist" ContentTemplate="{DataTemplate local:TodoListPage}" />
    </FlyoutItem>
```