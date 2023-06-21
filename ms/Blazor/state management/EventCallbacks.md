# EventCallbacks in Blazor

Blazor EventCallback is a special event used to expose changes from a child component to a parent component. For example, if you want to notify the parent component when a checkbox is checked or unchecked in the child component, you can use an EventCallback parameter like this:

```csharp
// Child component
<input type="checkbox" @onchange="OnCheckedChanged" />

[Parameter]
public EventCallback<bool> CheckedChanged { get; set; }

private async Task OnCheckedChanged(ChangeEventArgs e)
{
    await CheckedChanged.InvokeAsync((bool)e.Value);
}
```

```csharp
// Parent component
<ChildComponent @bind-CheckedChanged="OnChildCheckedChanged" />

private void OnChildCheckedChanged(bool value)
{
    // Do something with the value
}
```

Notice, the parent does NOT need to subscribe to the `EventCallback`.

## How can I prevent default browser actions with EventCallback?

You can prevent default browser actions with EventCallback by using the **@on{DOM EVENT}:preventDefault** directive attribute. This attribute tells the browser to not execute the default action for an event, such as navigating to a URL when clicking on a link or submitting a form when pressing Enter. For example:

```html
<a href="https://www.bing.com" @onclick="OnClick" @onclick:preventDefault="true">Search with Bing</a>
```

This code will prevent the browser from navigating to https://www.bing.com when the user clicks on the link, but it will still execute the OnClick method in the component. You can also use a variable to set the value of the preventDefault attribute dynamically.
