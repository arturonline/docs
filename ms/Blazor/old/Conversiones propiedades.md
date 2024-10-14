---
title: Conversiones entre propiedades
author: Artur Badenes Puig 
date: 05/10/2022
---

# Conversiones entre propiedades

## string -> DateTime

```cs
/// Formato AAAAMMDD
public string Fecha { get; set; }

/// Campo fecha convertido datetime
public DateTime FechaAux
{
    get => Fecha.StringToDateTime();
    set => Fecha = value.ToString("HH:mm:ss");
}
```

## Enum -> string 

```cs
// Enum
public enum MarkingTypes
{
    Unique = 2,
    Free = 3
}

/// Tipo del marcaje
public MarkingTypes Type { get; set; } = MarkingTypes.Unique;

/// Corresponderá al código de la enumeración "Type"
public string TypeCode
{
    get => ((int)Type).ToString();
    set => Type = (MarkingTypes)value.ToNumeric();
}
```    