# Component Change

Notifica el cambio de un componente a otro. No guarda ningún valor.

## 1. create State service

```cs
namespace AicomCRM.Services.States;

public class PermissionState
{
    public event Action? OnChangeConfigmenu;

    public void NotifyStateChanged() => OnChangeConfigmenu?.Invoke(); 

}
```

## 2. Notify state change

```cs
// lanzamos el evento cuando queramos con el código:
PermissionState.NotifyStateChanged();
```

## 3. Subscribe to state change

```cs
// Class must implement IDisposable

[Inject] private PermissionState PermissionState { get; set; }

...

protected override async Task OnInitializedAsync()
{
    PermissionState.OnChangeConfigmenu += StateHasChanged;
}

...

public void Dispose() => PermissionState.OnChangeConfigmenu -= Reloaddata;
```