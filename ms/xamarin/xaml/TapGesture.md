# TapGesture

```xml
<StackLayout>
    <StackLayout.GestureRecognizers>
        <TapGestureRecognizer 
            NumberOfTapsRequired="1"
            Command="{Binding Source={RelativeSource AncestorType={x:Type local:TodoListViewModel}}, Path=ItemTapped}"	
            CommandParameter="{Binding .}">
        </TapGestureRecognizer>
    </StackLayout.GestureRecognizers>
</StackLayout>
```

```cs
public Command ItemTapped { get; set; }

public TodoListViewModel()
{
    ...
    ItemTapped = new Command(OnItemTapped);
    ...
}

private async void OnAddTodoTapped(object obj)
{
    // Whatever        
}
```
