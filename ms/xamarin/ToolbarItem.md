# ToolbarItem

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="Todo.Views.TodoList">
    
        <ContentPage.ToolbarItems>
            <ToolbarItem Text="Add" Command="{Binding AddItemCommand}" />
        </ContentPage.ToolbarItems>
    
    <ContentPage.Content>
        
    </ContentPage.Content>
</ContentPage>
```