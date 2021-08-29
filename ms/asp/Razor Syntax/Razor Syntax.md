# Razor Syntax

[Microsoft Razor Syntax reference](https://docs.microsoft.com/en-us/aspnet/core/mvc/views/razor?view=aspnetcore-5.0)

Razor is a markup syntax for embedding server-based code into webpages. The Razor syntax consists of Razor markup, C#, and HTML.

The default Razor language is HTML. Razor supports C# and uses the `@` symbol to transition from HTML to C#. Razor evaluates C# expressions and renders them in the HTML output.

Pages containing Razor generally have a `.cshtml` file extension.

## Transition

Razor uses the `@` symbol to transition from HTML to C#.

- **Implicit transition:** Start with `@` followed by C# code and must not contain spaces. It also can't contain generics.

```cs
<p>@DateTime.IsLeapYear(2016)</p>
```

- **Explicit transition:** consist of an `@` symbol between parenthesis.

```cs
<p>Last week this time: @(DateTime.Now - TimeSpan.FromDays(7))</p>
```

- **Code blocks** start with `@` and are enclosed by `{}`. Unlike explicit expressions, C# code inside code blocks isn't rendered:

```cs
@{
    var quote = "The future depends on what you do today. - Mahatma Gandhi";
}

<p>@quote</p>

@{
    quote = "Hate cannot drive out hate, only love can do that. - Martin Luther King, Jr.";
}

<p>@quote</p>

// <p>The future depends on what you do today. - Mahatma Gandhi</p>
// <p>Hate cannot drive out hate, only love can do that. - Martin Luther King, Jr.</p>
```

To render text, you should Declare local functions to serve as templating.

```cs
@{
    void RenderName(string name)
    {
        <p>Name: <strong>@name</strong></p>
    }

    RenderName("Mahatma Gandhi");
    RenderName("Martin Luther King, Jr.");
}

// <p>Name: <strong>Mahatma Gandhi</strong></p>
// <p>Name: <strong>Martin Luther King, Jr.</strong></p>
```

The default language in a code block is C#, but the Razor Page can transition back to HTML implicitly:

```cs
@{
    var inCSharp = true;
    <p>Now in HTML, was in C# @inCSharp</p>
}
```

- to render HTML that is not surrounded by an HTML tag surround the characters for rendering with the Razor `<text>` tag:

```csharp
@for (var i = 0; i < people.Length; i++)
{
    var person = people[i];
    <text>Name: @person.Name</text>
}
```

- To render the rest of an entire line as HTML inside a code block, use the `@:` syntax:

```csharp
@for (var i = 0; i < people.Length; i++)
{
    var person = people[i];
    @:Name: @person.Name
}
```

## Comments

```csharp
@{
    /* C# comment */
    // Another C# comment
}

// <!-- HTML comment -->
```

Razor comments are removed by the server before the webpage is rendered. Razor uses `@* *@` to delimit comments. The following code is commented out, so the server doesn't render any markup:

```csharp
@*
    @{
        /* C# comment */
        // Another C# comment
    }
    <!-- HTML comment -->
*@
```