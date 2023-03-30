# Component binding

## One way binding

To bind values from a parent component to a child component, we use parameters:

```cs
// Parent component
@page "/parent"
<h1>Parent component</h1>
<ChildComponent ChildProperty="@ParentProperty" />

@code {
    public string ParentProperty { get; set; }
}
```

```cs
// Child component
<h3>Child component</h3>
<p>@ChildProperty</p>

@code {
    [Parameter]
    public string ChildProperty { get; set; }
}
```

## Two way binding

If you pass a value to a child content from their parent and wants to update the parent value when it changes in the child you should use two way binding.

## 1. Prev 7.0

To use two-way binding on a parameter you should prefix the HTML attribute with `@bind-.` This tells Blazor it should not only push changes to the component, but should also observe the component for any changes and update its own state accordingly. Two-way binding in Blazor uses a naming convention. If we want to bind to a property named `SomeProperty`, then we need an event call-back named `SomeProperyChanged`. This call-back must be invoked any time the component updates `SomeProperty`.

Exemple1: 

```cs
// parent
public string newPassword {get; set; } // 1. define the property to bind

...

<ChangePasswordComponent @bind-Password="newPassword"/>  // 2. pass the property using bing-*  naming convention
```

```cs
// Child
[Parameter] public string Password { get; set; }  // 3. Get the property as a parameter
[Parameter] public EventCallback<string> PasswordChanged { get; set; }  // 4. create an event to update the parent' property

...
private async void OnClickSaveChild()
{
    await PasswordChanged.InvokeAsync(Password); // 5. Invoque the event to update the parent's property.
}
```

Exemple2:

```cs
// Parent component
@page "/parent"
<h1>Parent component</h1>
<ChildComponent @bind-ChildProperty="@ParentProperty" />

@code {
    public string ParentProperty { get; set; }
}
```

```cs
// Child component
<h3>Child component</h3>
<input type="text" @bind="@ChildProperty" />

@code {
    [Parameter] public string ChildProperty { get; set; }

    [Parameter] public EventCallback<string> ChildPropertyChanged { get; set; }
}
```

As we said, by default Blazor will look for an event on the child component using the naming convention of `{PropertyName}Changed`. However, it's also possible to use a completely different name for the EventCallback property, for example, `ParentsTitleUpdated` specifing the event name in the @bind:

```cs
[Parameter] public string ParentsTitle { get; set; }

<ChildComponent @bind-ParentsTitle="Title" /> // uses "ParentsTitleChanged "
<ChildComponent @bind-ParentsTitle="Title" @bind-ParentsTitle:event="ParentsTitleUpdated" /> // uses "ParentsTitleUpdated"
```

## 2. After 7.0

YOu can use two-way data binding by defining a pair of parameters:

+ `@bind:get:` Specifies the value to bind.
+ `@bind:set:` Specifies a callback for when the value changes.

> ⚠️ The `@bind:get` and `@bind:set` modifiers are always used together.
> 
> ⚠ ️ You should use a method that returns an *Action* or *Task* in a `@bind:set` instead of an event callback parameter.


```cs
<h2>Elements</h2>

<input type="text" @bind:get="text" @bind:set="(value) => { text = value; }" />
<input type="text" @bind:get="text" @bind:set="Set" />
<input type="text" @bind:get="text" @bind:set="SetAsync" />

<h2>Components</h2>

<InputText @bind-Value:get="text" @bind-Value:set="(value) => { text = value; }" />
<InputText @bind-Value:get="text" @bind-Value:set="Set" />
<InputText @bind-Value:get="text" @bind-Value:set="SetAsync" />

@code {
    private string text = "";

    private void Set(string value)
    {
        text = value;
    }

    private Task SetAsync(string value)
    {
        text = value;
        return Task.CompletedTask;
    }
}
```

Example 2:

```cs

```

## Binding to a specific event

The bind attribute by default uses the `onchange` event to handle updating its value. But we can especifie a different event:

```cs
<h1>@Title</h1>

<input @bind-value="Title" @bind-value:event="oninput" />

@code {
    private string Title { get; set; } = "Hello, World!";
}
```