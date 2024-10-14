# Authorization

## Comprobar permisos usuario 

```html
<AuthorizeView Roles="admin">
    <Authorized>
        <div>Content for admin users.</div>
    </Authorized>
    <NotAuthorized>
        <div>You are not authorized...</div>
    </NotAuthorized>
</AuthorizeView>
```

## comprobar permisos usuario por código 

1. Importar

```cs
[CascadingParameter] private Task<AuthenticationState>? AuthState { get; set; }
```

1. Comprobar permisos

```cs
var auth = await AuthState;
if (auth.User is not null)
{
    // Comprobamos que el usuario está autenticado
    if (auth.User.Identity is not null && auth.User.Identity.IsAuthenticated)
    {
        // Si el usuario es Aicom o Admin, cargamos todos los proyectos 
        if (auth.User.IsInRole("Admin") || auth.User.IsInRole("Aicom"))
        {
           ...
        }
    }
}
```




