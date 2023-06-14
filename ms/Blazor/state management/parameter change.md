# State management in Blazor

Notifica el cambio de un valor de un componente a otro. Guarda el valor.

```cs
public class StateContainer
{
    private string? savedString;

    public string Property
    {
        get => savedString ?? string.Empty;
        set
        {
            savedString = value;
            NotifyStateChanged();
        }
    }

    public event Action? OnChange;

    private void NotifyStateChanged() => OnChange?.Invoke();
}
```

```cs
// Program.cs
builder.Services.AddScoped<StateContainer>();
```

## Example

```cs
@implements IDisposable
@inject StateContainer StateContainer

<p>Nested component Property: <b>@StateContainer.Property</b></p>

<p>
    // @* botón que cambia la propiedad *@
    <button @onclick="ChangePropertyValue">
        Change the Property from the Nested component
    </button>
</p>

@code {
    protected override void OnInitialized()
    {
        // Registramos el evento que se ejecutará cuando cambie el valor de la propiedad
        StateContainer.OnChange += StateHasChanged;
    }

    // Método que se ejecuta cuando se hace click en el botón
    private void ChangePropertyValue()
    {
        StateContainer.Property = 
            $"New value set in the Nested component: {DateTime.Now}";
    }

    public void Dispose()
    {
        // Cancelamos la subscripción al evento
        StateContainer.OnChange -= StateHasChanged;
    }
}
```
