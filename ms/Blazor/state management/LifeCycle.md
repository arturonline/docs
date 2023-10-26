# Life Cycle

## Order

1. If the component is rendering for the first time on a request:
    - Create the component's instance.
    - Perform property injection. Run `SetParametersAsync`.
    - Call `OnInitialized{Async}`. If an incomplete Task is returned, the Task is awaited and then the component is rerendered.
2. Call `OnParametersSet{Async}`. If an incomplete Task is returned, the Task is awaited and then the component is rerendered.
3. Render for all synchronous work and complete Tasks.

>A parent component renders before its children components because rendering is what determines which children are present. If synchronous parent component initialization is used, the parent initialization is guaranteed to complete first.

## Life Cycle Events

### 1. When parameters are set

- `SetParametersAsync` sets parameters supplied by the component's parent in the render tree or from route parameters.

### 2. Component initialized

- `OnInitialized` and `OnInitializedAsync` are invoked when the component is initialized after having received its initial parameters in `SetParametersAsync`.

### 3. After parameters are set

- `OnParameterSet` is called after rerender and after OnInitlitized

### 4. After component render

- `OnAfterRender` and `OnAfterRenderAsync` are called after a component has finished rendering. Element and component references are populated at this point. Use this stage to perform additional initialization steps with the rendered content, such as JS interop calls that interact with the rendered DOM elements.

### 5. StateHasChanged

- `StateHasChanged` notifies the component that its state has changed. When applicable, calling `StateHasChanged` causes the component to be rerendered.
- `StateHasChanged` is called automatically for EventCallback methods. For more information on event callbacks, see ASP.NET Core Blazor event handling.