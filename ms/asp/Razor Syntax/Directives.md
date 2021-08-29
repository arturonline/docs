# Directives

A directive typically changes the way a view is parsed or enables different functionality. Razor directives are represented by implicit expressions with reserved keywords following the `@` symbol.

## `@Page`

Identifies a component as a page. Use this directive to specify a route. The route maps to an attribute route that the Blazor engine recognizes to register and access the page.

## `@using`

In C#, a using statement is used to ensure an object is disposed. In Razor, the same mechanism is used to create HTML Helpers that contain additional content. In the following code, HTML Helpers render a form tag with the @using statement:

```cs
@using (Html.BeginForm())
{
    <div>
        email:
        <input type="email" id="Email" value="">
        <button>Register</button>
    </div>
}
```

## `@model`

The `@model` directive specifies the type of the model passed to a view.

```cs
@model TypeNameOfModel
```

The value of the model is passed from the controller to the view.

```cs
<div>The Login Email: @Model.Email</div>
```

## `@inherits`

The  default base class for a Razor view in ASP.NET MVC is `WebViewPage<T>`, , and in most cases you don't need to fiddle with @inherits  - it's more common to use the @model directive and just strongly type the default base class with a specific ViewModel type.

## `@inject`

The `@inject` directive enables the Razor Page to inject a service from the service container into a view.

## `@functions`

The `@functions` directive enables a Razor Page to add a C# code block to a view:

```csharp
@functions { // C# Code }
```

For example:

```cs
@functions {
    public string GetHello()
    {
        return "Hello";
    }
}

<div>From method: @GetHello()</div>

// <div>From method: Hello</div>
```

The following code is generated:

```cs
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Razor;

public class _Views_Home_Test_cshtml : RazorPage<dynamic>
{
    // Functions placed between here
    public string GetHello()
    {
        return "Hello";
    }
    // And here.
#pragma warning disable 1998
    public override async Task ExecuteAsync()
    {
        WriteLiteral("\r\n<div>From method: ");
        Write(GetHello());
        WriteLiteral("</div>\r\n");
    }
#pragma warning restore 1998
```

## `@section`

The `@section` directive is used in conjunction with the layout to enable views to render content in different parts of the HTML page.