# Utils

## Como realizar operaciones asíncronas durante el arranque de un view model

```csharp
// Creamos un comando asyncrono
public AsyncRelayCommand LoadDataCommand { get; }

// creamos el método que queremos que se ejecute al cargar el view model
public async Task LoadAsync()
{
    IsLoadingPanel = true;
    Clientes = new ObservableCollection<Cliente>(await DsMasterClientes.GetClientes());
    IsLoadingPanel = false;
}

// ctor
public MainViewModel()
{
    // Asignamos el comando al método
    LoadDataCommand = new AsyncRelayCommand(LoadAsync);

    // Ejecutamos el comando
    LoadDataCommand.Execute(null);
}
```