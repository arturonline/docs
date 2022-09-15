# Validación de formularios en Blazor

## 1. Anotamos el modelo:

```cs
using System.ComponentModel.DataAnnotations;

public class Contact
{
    [Required(ErrorMessage = "Es necesario introducir un nombre.")]
    [StringLength(10, ErrorMessage = "Name is too long.")]
    public string Name { get; set; } = string.Empty;
}
```

## 2. Añadimos `<EditForm>` y `<DataAnnotationsValidator>` al formulario:

```html
 <EditForm Model="@SelectedContact" OnValidSubmit="FormSubmit">
    <DataAnnotationsValidator/>

    <!-- Nombre -->
    <div class="mb-2 row">
        <label for="nombre" class="col-sm-3 col-form-label">Nombre</label>
        <div class="col-sm-8">
            <!-- Usamos InpuText o control de syncfusion -->
            <InputText type="text" @bind-Value="SelectedContact.Name"/>
            <!-- Añadimos el error -->
            <ValidationMessage For="@(() => SelectedContact.Name)"></ValidationMessage>
        </div>
    </div>
    <div class="e-footer-content">
        <div>
             <button type="submit" class="btn btn-info">Guardar</button>
            <button type="button" class="btn btn-dark" @onclick="OnCloseHandler">Cancelar</button>
        </div>
                    
    </div>

 </EditForm>
``` 

- El modelo `SelectedContact` es la instancia de la clase `Contact` que vamos a validar.
- `FormSubmit` es el método que realiza la validación.
- El boton de guardar ha de ser tipo `submit`. 


## 3. FormSubmit:

Este método se ejecuta cuando se pasan las validaciones correctamente.
En caso contrario muestra los errores.

```cs
private void FormSubmit(EditContext context)
{
    OnClickGuardar();
}
```

## 5. Built-in input components

[Componentes:](https://docs.microsoft.com/en-us/aspnet/core/blazor/forms-and-input-components?view=aspnetcore-6.0#built-in-input-components)

| Input component         | Rendered as…                        |
| ----------------------- | ----------------------------------- |
| InputCheckbox           | `<input type="checkbox">`           |
| InputDate<TValue>       | `<input type="date">`               |
| InputFile               | `<input type="file">`               |
| InputNumber<TValue>     | `<input type="number"> `            |
| InputRadio<TValue>      | `<input type="radio">`              |
| InputRadioGroup<TValue> | Group of child `InputRadio<TValue>` |
| InputSelect<TValue>     | `<select>`                          |
| InputText               | `<input>`                           |
| InputTextArea           | `<textarea>`                        |

## 4. Links

https://blazor.syncfusion.com/documentation/common/input-validation
https://docs.microsoft.com/en-us/aspnet/core/blazor/forms-and-input-components?view=aspnetcore-6.0