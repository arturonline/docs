# Search Bar with mvvm

```c#
// text search
private string textSearch;
public string TextSearch
{
    get => textSearch;
    set
    {
        SetProperty(ref textSearch, value);
        OnSearchLog(value);
    }
}

private ObservableCollection<Log> logs;
public ObservableCollection<Log> FilteredLogs
{
    get => logs;
    set => SetProperty(ref logs, value);
}

private ObservableCollection<Log> filteredList;
public ObservableCollection<Log> AllLogs
{
    get => filteredList;
    set => SetProperty(ref filteredList, value);
}

public MyclassConstructor () 
{
    var logs = await App.DataStore.GetLogsAsync();
    FilteredLogs = new ObservableCollection<Log>(logs);
    AllLogs = new ObservableCollection<Log>(logs);
}


private void OnSearchLog(string value)
{
    if (value.Length <= 3)
    {
        FilteredLogs = AllLogs;
    }
    else
    {
        FilteredLogs = new ObservableCollection<Log>(FilteredLogs.Where(log => log.Text.Contains(value)));
    }
}
```

```xml
<StackLayout>
    <SearchBar Placeholder="Search task"
                TextColor="{AppThemeBinding Light=Black, Dark=White}"
                PlaceholderColor="LightGray"
                CancelButtonColor="LightGray"
                SearchCommand="{Binding SearchCommand}"
                Text="{Binding TextSearch}" />
    <ListView 
        x:Name="LogList" 
        ItemsSource="{Binding FilteredLogs}"
        IsPullToRefreshEnabled="True"
        RefreshCommand="{Binding RefreshCommand}" 
        IsRefreshing="{Binding IsRefreshing}"
        HasUnevenRows="True"
        SeparatorColor="{AppThemeBinding Light=White, Dark=LightGray}">
        
        <ListView.Header>
            <StackLayout Padding="10">
                <Label Text="Logs" Style="{DynamicResource ListItemTextStyle}" FontSize="Title"/>
            </StackLayout>
        </ListView.Header>
        <ListView.ItemTemplate>
            <DataTemplate x:DataType="model:Log">
                <ViewCell>
                    <Grid RowDefinitions="auto, auto, auto" Padding="10">
                        <Label Grid.Row="0" Grid.Column="0" Text="{Binding Text}" TextColor="{AppThemeBinding Light=White, Dark=LightGray}"/>
                        <Label Grid.Row="1" Grid.Column="0"  Text="{Binding Description}" TextColor="{AppThemeBinding Light=White, Dark=LightGray}" />
                        <Label Grid.Row="1" Grid.Column="1"  Text="{Binding TimeCompletion}" TextColor="{AppThemeBinding Light=White, Dark=LightGray}" />
                    </Grid>
                    
                </ViewCell> 
            </DataTemplate>
        </ListView.ItemTemplate>
    </ListView>
</StackLayout>
```