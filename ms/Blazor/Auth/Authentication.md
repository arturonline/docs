# Blazor authentication

1. add to `program.cs`

    ```cs
    app.UseAuthentication();
    app.UseAuthorization();
    ```

1. Create you `CustomAuthenticationStateProvider`.
   The `GetAuthenticationStateAsync()` methods provides the authentication state of the app at any moment.

1. Add `CustomAuthenticationStateProvider` to `program.cs`
1. Add `<CascadingAuthenticationState>` to `app.razor`
1. Create the method to save and retrieve the user from the database

    ```cs
    await db.Query<bool>("sp_GetUserFromDb", params);
    ```

1. Create a method to retrieve or store the user from local or sesion storage

    ```cs
    var email = await _sessionStorage.GetAsync<string>("email");
    ```

1. Create a method to authenticate user using data previously obtained:

   ```cs
    // Check usuario from db, session or localstorage
    // If user exists:

    var identity = new ClaimsIdentity(new[]
    {
        new Claim(ClaimTypes.Name, usuario),
    }, "My Custom Authentication");

    var user = new ClaimsPrincipal(identity);

    // Update user state:
    NotifyAuthenticationStateChanged(Task.FromResult(new AuthenticationState(user))); 
   ```

1. Create a method to register
1. Create a method to login
1. Create a method to logout

## Concepts

### ClaimsIdentity vs ClaimsPrincipal

**ClaimsIdentity** and **ClaimsPrincipal** are two classes in the `System.Security.Claims` namespace in .NET. 

- **ClaimsIdentity** represents a single identity and contains a collection of claims, which are statements about the identity. 
- **ClaimsPrincipal**, on the other hand, represents the security context for the running process and can contain multiple identities. 
  
A **ClaimsPrincipal** can have many **ClaimsIdentity** objects, each of which represents a different identity for the same user. For example, a user might have a *Windows identity* and an *OpenID Connect identity*, both of which are represented by separate **ClaimsIdentity** objects within the same **ClaimsPrincipal**. The **ClaimsPrincipal** class is used to represent the current authenticated user in .NET applications1.

```cs
var identity = new ClaimsIdentity(new[]
    {
        new Claim(ClaimTypes.Name, userIdentifier),
    }, "Custom Authentication");

var user = new ClaimsPrincipal(identity);
```