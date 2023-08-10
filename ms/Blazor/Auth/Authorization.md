# Authorization

## What is a role?

A role is simply a string that can be assigned to a user to define their access level within the application. However, to include the role in a ClaimsIdentity, it must be assigned under the type ClaimTypes.Role.

```cs
public class User 
{
    public List<string> Roles { get; set; }
}
```

```html
<AuthorizeView Roles="normal_user,paid_user">
    <Authorized>
        <div>Content for users with either normal or paid or both roles.</div>
    </Authorized>
</AuthorizeView>

<AuthorizeView Roles="paid_user">
    <Authorized>
        <div>Content for paid users.</div>
    </Authorized>
</AuthorizeView>

<AuthorizeView Roles="admin">
    <Authorized>
        <div>Content for admin users.</div>
    </Authorized>
</AuthorizeView>
```

## What is a Policy?

A policy specifies the requirements that a user must meet to access a resource. If a user fails to comply with any of the conditions in the policy, they will be denied access to the resource. 
For example, suppose your website only sells special alcohol to premium adult users. In that case, the policy would require that the user be older than 18 (the first requirement) and a premium user (the second requirement). Your website will refuse to sell special alcohol if the user fails to meet either of those requirements.


```cs
public class AdultRequirement : IAuthorizationRequirement
{
    public int MinimumAgeToConsiderAnAdult { get; set; } = 18;
}
```

```cs
public class AdultRequirementHandler : AuthorizationHandler<AdultRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AdultRequirement requirement)
    {
        var user = User.FromClaimsPrincipal(context.User);

        if (user.Age >= requirement.MinimumAgeToConsiderAnAdult)
        {
            context.Succeed(requirement);
        }
        else
        {
            context.Fail();
        }

        return Task.CompletedTask;
    }
}
```

```cs
builder.Services.AddScoped<IAuthorizationHandler, AdultRequirementHandler>();
```

```cs
builder.Services.AddAuthorizationCore(config =>
{
    config.AddPolicy("AdultOnly", policy => policy.AddRequirements(new AdultRequirement()));
}
```

```html
<AuthorizeView Policy="AdultOnly">
    <Authorized>
        <div>Content for users in adult policy.</div>
    </Authorized>
    <NotAuthorized>
        <div>This content is for adult.</div>
    </NotAuthorized>
</AuthorizeView>
```