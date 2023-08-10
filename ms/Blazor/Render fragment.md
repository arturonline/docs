# Render Fragment

Render fragments are segments of UI that can be rendered by a component. They are useful for creating reusable and templated components that can accept one or more UI templates as parameters.

## Example

```html
<!-- Section.razor -->
<div>
    <div class="header">
        @Header
    </div>

    <div class="content">
        @Content
    </div>

    <div class="footer">
        @Footer
    </div>
</div>
```


```cs
/* Section.razor.cs*/
public partial class Section {

    [Parameter] public RenderFragment Header {get; set;}
    [Parameter] public RenderFragment Content {get; set;}
    [Parameter] public RenderFragment Footer {get; set;}
}
```

```html
<!-- Example -->
<Section>

    <Header>
        <h1>Hello world</h1>
    </Header>

    <Content>
        <span>This is content! </span>
    </Content>

    <Footer>
        <button type="button">Salir</button>
    </Footer>

</Section>
```

## Assign a render fragment to a variable

I have a component `<ResultForm SelectedFile="file" OnClose="OncloseDialog" />` in a `ResultForm.razor` file, and i want to use this component as a render fragment in a partial class:

1. From .razor

    ```html
    @code {
        RenderFragment resultFormTemplate = @(<ResultForm SelectedFile="file" OnClose="OncloseDialog" />);
    }
    ```

2. From .razor.cs
 
    ```cs
    RenderFragment resultFormTemplate = builder =>
    {
        builder.OpenComponent<ResultForm>(0); // abrir componente
        builder.AddAttribute(1, "SelectedFile", file); // posición, nombre del parametro y valor
        builder.AddAttribute(2, "OnClose", EventCallback.Factory.Create<bool>(this, OncloseDialog)); // posición, nombre, evento
        builder.CloseComponent(); // cerrar componente
    };
    ```

>⚠️ You can't create a render fragment using the @ symbol in a partial class in Blazor
