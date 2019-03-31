# AnchorTagHelper

The AnchorTagHelper processes `<a>` tags as defined by the `TargetElementAttribute`. The anchor tag constructs links from one document to another, or to another location within another, or event the current document. The AnchorTagHelper will get to work wherever the Razor parser encounters an `<a>` tag. However, it won't do much unless the tag includes some custom attributes which are prefixed with `asp-`.

The most frequently used ones for internal navigation are likely to be `asp-action`, `asp-controller`, `asp-route`, `asp-route-*` and possibly `asp-fragment`. The `asp-action` and `asp-controller` attributes take an action and controller name respectively. The `asp-route` attrbute takes the name of a route, while the `asp-route-*` attribute represents route values. The `asp-fragment` attribute value represents a location within a document, and is typically used widely in Single Page Applications.

Example:

```csharp
<a asp-action="Index" asp-controller="Article" asp-route-id="@item.Article.ArticleID" asp-route-title="@item.Article.Headline.ToSlug()" asp-fragment="@($"commentId{item.CommentId}")">@item.CommentName</a>
```