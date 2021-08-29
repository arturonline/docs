# ASP MVC

[Overview of ASP.Net Core MVC](https://docs.microsoft.com/en-us/aspnet/core/mvc/overview?view=aspnetcore-5.0)

The Model-View-Controller (MVC) architectural pattern separates an app into three main components: the view only displays information; the controller handles and responds to user input and interaction.

- **Models**: Classes that represent the data of the app.
- **Views**: Views are the components that display the app's user interface (UI). Generally, this UI displays the model data.
- **Controllers**: Classes that handle browser requests. They retrieve model data and call view templates that return a response.

Controller example:

```csharp
using Microsoft.AspNetCore.Mvc;
using System.Text.Encodings.Web;

namespace MvcMovie.Controllers
{
    public class HelloWorldController : Controller
    {
        // GET: /HelloWorld/

        public string Index()
        {
            return "This is my default action...";
        }

        // GET: /HelloWorld/Welcome/

        public string Welcome()
        {
            return "This is the Welcome action method...";
        }
    }
}
```

## Binding

Every public method in a controller is callable as an HTTP endpoint (URL in the web application).

MVC invokes controller classes (and the action methods within them) depending on the incoming URL. When you browse to the app and don't supply any URL segments, it defaults to the `Home` controller and the `Index` method.

### The routing format

```csharp
// Startup.cs

app.UseMvc(routes =>
{
    routes.MapRoute(
        name: "default",
        template: "{controller=Home}/{action=Index}/{id?}");
});
```

- The first URL segment determines the controller class to run. So `localhost:xxxx/HelloWorld` maps to the `HelloWorldController` class in our example.
- The second part of the URL segment determines the action method on the class. So `localhost:xxxx/HelloWorld/Index` would cause the `Index` method of the `HelloWorldController` class to run. Notice that you only had to browse to `localhost:xxxx/HelloWorld` and the `Index` method was called by default.
- The third part of the URL segment `(id)` is for route data.

### Passing parameters

```html
https://localhost:xxxx/HelloWorld/Welcome?name=Rick&numtimes=4
```

The `?` in the above URL is a separator. The `&` character separates query strings.

```csharp
public string Welcome(string name, int numTimes = 1)
{
    return HtmlEncoder.Default.Encode($"Hello {name}, NumTimes is: {numTimes}");
}
```

## Views

Most web apps have a common structures such as scripts and stylesheets are also frequently used by many pages within an app. All of these shared elements may be defined in a *layout* file, which can then be referenced by any view used within the app. Layouts reduce duplicate code in views.

Views are stored in `Views/` folder.

The `Views/_ViewStart.cshtml` file brings in the `Views/Shared/_Layout.cshtml` file to each view. `_Layout.cshtml` is the default layout for an ASP.NET Core app.

### Specifying a Layout

You can a use a different layout from `Views/Shared/` folder by referencing it in the Razor view with his `Layout property`:

```csharp
@{
    Layout = "_MyNewLayout";
}
```

By default, every layout must call `RenderBody`. Wherever the call to `RenderBody` is placed, the contents of the view will be rendered.

## Passing data from the Controller to the View

You pass data from the controller to the view using `ViewData dictionaries`.
A `ViewData Dictionary` is a dictionary which can contain key-value pairs where each key must be string.

```csharp
public IActionResult Welcome(string name, int numTimes = 1)
{
    ViewData["Message"] = "Hello " + name;
    ViewData["NumTimes"] = numTimes;

    return View();
}
```

The controller packages the data into a `ViewData dictionary` and passes that object to the `view`. The view then renders the data as `HTML` to the browser.