# Blazor: Introduction

Blazor apps are reusable web UI components built using C#, HTML, and CSS.

You can use Blazor to generate:

- Server-side code that handles UI interactions over a `WebSocket` connection.
- A client-side web app that runs directly in the browser via `WebAssembly`.

## Razor

Razor is a markup syntax that uses HTML and C# for writing UI components of Blazor web apps.

## c# code

In a Blazor app, you can add C# code in separate .cs files or inline in your razor components.
To add c# inline with HTML you use razor markup `code directives`.a

- `@Page`: Identifies a component as a page. Use this directive to specify a route. The route maps to an attribute route that the Blazor engine recognizes to register and access the page.
- `@expression()`: To add a C# statement inline with HTML.
- `@code`: To add multiplestatements enclosed by parentheses.
- `@bind`: To bind a C# variable to an HTML object.

## Data Binding

Within Razor components, you can data bind HTML elements to C# fields, properties, and Razor expression values. Data binding allows two-way synchronization between HTML and Microsoft .NET.