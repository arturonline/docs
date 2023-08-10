# Cascading parameter

In Blazor, a **cascading parameter** is a way to pass data from a parent component to its child components. The child components can then use this data without having to pass it down through their own parameters. This is useful when you have data that needs to be shared across multiple components in a hierarchy.

Here's an example of how you can use cascading parameters in Blazor:

```html
<!-- Parent component -->
<CascadingValue Value="@MyData">
    <ChildComponent />
</CascadingValue>

@code {
    public string MyData {get; set;}
}
```

```html
<!-- Child component -->
<div>@context</div>

@code {
    [CascadingParameter]
    public string MyData { get; set; }

    private string context;

    protected override void OnInitialized()
    {
        context = MyData;
    }
}
```

In this example, the parent component passes the `myData` parameter to the child component using the `CascadingValue` component. The child component then uses the `CascadingParameter` attribute to retrieve the value of `myData`.

## Detect changes

### 1. Detect changes from the ancestor component

Anytime the ancestor component changes the value of a cascading parameter, the descendant components will be re-rendered. You can also listen to these changes by override the `OnParametersSet()` method of your descendant component. See Component Lifecycle tutorial.

### 2. Detect changes from the descendant components

Whenever a descendant component changes the value of a cascading parameter, the ancestor will not be re-rendered, unlike changes from the ancestor component. To make the ancestor component reacts to the changes, you need to notify the ancestor component whenever you made a change in the descendant component.

In your ancestor component, declare a notify method in the code section.

```cs
@code {
    ...
    public void NotifyChange()
    {
        InvokeAsync(StateHasChanged);
    }
}
```

Pass this to the descendant components.

```html
<CascadingValue Value="this">
    <CascadingValue Value="ExampleInstance">
        <Parent />
    </CascadingValue>
</CascadingValue>
```

In your descendant components, whenever you made a change to the cascading parameter, call the notify method of the ancestor component.

```cs
@code {
    [CascadingParameter]
    public ExampleClass ReceivedValueAtParent { get; set; } = new();

    [CascadingParameter]
    public GrandParent? Ancestor { get; set; }

    public void UpdateValue()
    {
        ReceivedValueAtParent.Data = "Value changed at parent";
        Ancestor?.NotifyChange();
    }
}
```