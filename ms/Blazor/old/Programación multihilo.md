---
title: Programación multihilo en Blazor server
author: Artur Badenes Puig 
date: 29/09/2022
---

# Programación multihilo en Blazor server

## Actualizar UI tras tarea larga

The correct way to update UI from a another thread is by using `InvokeAsync()`:

```cs
// Inside Async method:

clients = clientService.GetClients(userService.Employee.Id, userService.Employee.IdProfile);
InvokeAsync(StateHasChanged);
```

```cs
// Inside Sync method
await InvokeAsync(() =>
{
    clients = clientService.GetClients(userService.Employee.Id, userService.Employee.IdProfile);
    StateHasChanged();
});
```

`InvokeAsync()` puede remplazar a `await Task.Run` en Blazor server.

>⚠️`StateHasChanged` must always be run on the UI Thread.


## Ejemplo

```cs
@implements IDisposable
<div>
  Counter value is: @CounterState.Value at @DateTime.UtcNow.ToString("HH:mm:ss")
</div>

@code
{
  private System.Threading.Timer Timer;

  protected override void OnInitialized()
  {
    base.OnInitialized();
    Timer = new System.Threading.Timer(_ =>
    {
      InvokeAsync(StateHasChanged); // sin InvokeAsync daria error: "System.InvalidOperationException: The current thread is not associated with the Dispatcher"

    }, null, 500, 500);
  }

  void IDisposable.Dispose()
  {
    Timer?.Dispose();
    Timer = null;
  }
}
```

## Enlaces

[Fuente](https://swimburger.net/blog/dotnet/pushing-ui-changes-from-blazor-server-to-browser-on-server-raised-events)
[Fuente 1](https://blazor-university.com/components/multi-threaded-rendering/invokeasync/)