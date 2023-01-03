# Cascading State

## 1. Create a State component

```cs
// MyCascadingState

<CascadingValue Value="this">
  @ChildContent
</CascadingValue>


@code {
  [Parameter] public RenderFragment? ChildContent {get; set;}
  
  private bool showSomething = false;
  public bool ShowSomething 
  {
      get => showSomething;
      set 
      {
          if(showSomething != value)
          {
              showSomething = value;
              StateHasChanged();
          }
      }
  }
}
```

## 2. Pass to the app

```cs
// App.razor
<MyCascadingState>
    <Router AppAssembly="@typeof(Program).Assembly>
        ...
    </Router>
</MyCascadingState>
```

## 3. Use it!

```cs
// any page where I need the state

[CascadingParameter] MyCascadingState MyState { get; set; }

public bool show = MyState.showSomething;
```