# Cascading State

## 1. Create a State component

```cs
// MyCascadingState

<CascadingValue Value="this">
  @ChildContent
</CascandingValue>


@code {
  [Parameter] public RenderFragment? ChildContent {get; set;}
  
  private bool showSomething = false;
  public bool ShowSomething 
  {
      get => shoSomething;
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