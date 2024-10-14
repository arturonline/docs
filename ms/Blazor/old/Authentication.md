# Authentication

## Obtener usuario

```c#
[Inject] public AuthService AuthService { get; set; }

var employee = AuthService.CurrentUser; 
```

## Hace logout

```c#	
AuthService.LogoutAsync();
```

```cs
<a type="button" @onclick="async () => AuthService.LogoutAsync()">
```

## Comprobar si usuario esta autenticado

```cs
[CascadingParameter] public Task<AuthenticationState> AuthenticationStateTask { get; set; }

var auth = await AuthenticationStateTask;
if (auth.User.Identity.IsAuthenticated)
{
            // Do something
}
```