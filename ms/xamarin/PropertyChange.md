# Property Change

An `ObservableCollection` should update when an item is added or removed - but it will not force an update if an item is modified, unless that item implements `INotifyPropertyChanged`.

```c#
public class Person : INotifyPropertyChanged
{
    private string _name;
    public string Name
    {
        get => _name; set
        {
            _name = value;
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(Name)));
        }
    }
    public event PropertyChangedEventHandler PropertyChanged;
}
```
