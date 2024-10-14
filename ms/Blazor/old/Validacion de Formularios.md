---
title: Validación de formularios en Blazor
author: Artur Badenes Puig 
date: 15/09/2022
---

# Validación de formularios en Blazor

- [Validación de formularios en Blazor](#validación-de-formularios-en-blazor)
  - [1. Anotamos el modelo](#1-anotamos-el-modelo)
  - [2. Añadimos `<EditForm>` y `<DataAnnotationsValidator>` al formulario](#2-añadimos-editform-y-dataannotationsvalidator-al-formulario)
  - [3. FormSubmit](#3-formsubmit)
  - [5. Built-in input components](#5-built-in-input-components)
  - [6. Data Anotations](#6-data-anotations)
  - [7. Links](#7-links)

## 1. Anotamos el modelo

```cs
using System.ComponentModel.DataAnnotations;

public class Contact
{
    [Required(ErrorMessage = "Es necesario introducir un nombre.")]
    [StringLength(10, ErrorMessage = "Name is too long.")]
    public string Name { get; set; } = string.Empty;
}
```

## 2. Añadimos `<EditForm>` y `<DataAnnotationsValidator>` al formulario

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

## 3. FormSubmit

Este método se ejecuta cuando se pasan las validaciones correctamente.
En caso contrario muestra los errores.

```cs
private void FormSubmit(EditContext context)
{
    // Validates the EditContext 
    var isValid = context.Validate();

    if (isValid)
    {
        // Form has valid inputs.
        OnClickGuardar();
    }
}
```

## 5. Built-in input components

[Componentes:](https://docs.microsoft.com/en-us/aspnet/core/blazor/forms-and-input-components?view=aspnetcore-6.0#built-in-input-components)

| Input component           | Rendered as…                        |
| ------------------------- | ----------------------------------- |
| `InputCheckbox`           | `<input type="checkbox">`           |
| `InputDate<TValue>`       | `<input type="date">`               |
| `InputFile`               | `<input type="file">`               |
| `InputNumber<TValue>`     | `<input type="number">`             |
| `InputRadio<TValue>`      | `<input type="radio">`              |
| `InputRadioGroup<TValue>` | Group of child `InputRadio<TValue>` |
| `InputSelect<TValue>`     | `<select>`                          |
| `InputText`               | `<input>`                           |
| `InputTextArea`           | `<textarea>`                        |

## 6. Data Anotations

[Anotaciones](https://docs.microsoft.com/en-us/dotnet/api/system.componentmodel.dataannotations?view=net-6.0)

- Tamaño:

```cs
[Range(18, 80, ErrorMessage = "Age must be between 18 and 80.")]
public int Age { get; set; }

[MinLengthAttribute(10, ErrorMessage = "Tamaño mínimo 10 chars.")]
public int Name { get; set; }
```

- Email:

```cs
[Required]
[EmailAddress]
public string Email { get; set; }
```

- Password validation:

```cs
[Required]
[RegularExpression(@"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{10,}$",
            ErrorMessage = "Password should have minimum 10 characters, at least 1 uppercase letter, 1 lowercase letter and 1 number.")]
public string Password { get; set; }

[Required]
[Display(Name = "Confirm Password")]
[Compare("Password", ErrorMessage = "The password and confirm password fields do not match.")]
public string ConfirmPassword { get; set; }
```

- Telefono movil
  
```cs
[RegularExpression(@"(?:6[0-9]{2}|7[1-9][0-9])(?: ?[0-9]{3}){2}$)", ErrorMessage = "Ej. 666334455"]
public string movil { get; set; }
```

## 7. Links

- [Tutorial Oficial](https://docs.microsoft.com/en-us/aspnet/core/blazor/forms-and-input-components?view=aspnetcore-6.0)
- [Tutorial Syncfusion](https://blazor.syncfusion.com/documentation/common/input-validation)
- [Tipo de Componentes:](https://docs.microsoft.com/en-us/aspnet/core/blazor/forms-and-input-components?view=aspnetcore-6.0#built-in-input-components)
- [Tipos de Anotaciones](https://docs.microsoft.com/en-us/dotnet/api/system.componentmodel.dataannotations?view=net-6.0)