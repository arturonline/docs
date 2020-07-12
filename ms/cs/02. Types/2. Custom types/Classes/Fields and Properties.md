# Fields and Properties

## Field

* A field is a variable of any type that is declared directly in a class or struct. Fields are members of their containing type.
* A class or struct may have instance fields or static fields or both.
* Generally, you should use fields only for variables that have `private` or `protected` accessibility.

```csharp
     // private field
    private DateTime date;

    // public field (Generally not recommended.)
    public string day;
```

## Properties

Properties enable a class to expose a public way of getting and setting values, while hiding implementation or verification code.

A `get property accessor` is used to return the property value, and a `set property accessor` is used to assign a new value:

```csharp
public class Date
{
    // the Month property uses a private field (month) to track the actual value.
    private int month = 7;  // field or Backing store

    public int Month // property
    {
        get
        {
            return month;
        }
        set
        {
            if ((value > 0) && (value < 13))
            {
                month = value;
            }
        }
    }
}
```

The `value` keyword is used to define the value being assigned by the set accessor.

## Encapsulation

Properties can be:

* **read-write** (they have both a get and a set accessor)
* **read-only** (they have a get accessor but no set accessor)
* **write-only** (they have a set accessor, but no get accessor).

Write-only properties are rare and are most commonly used to restrict access to sensitive data.

## Auto-implemented properties

Simple properties that require no custom accessor code can be implemented either as expression body definitions or as auto-implemented properties.

```csharp
// Auto-Impl Properties for trivial get and set
    public double TotalPurchases { get; set; }
    public string Name { get; set; }
    public int CustomerID { get; set; }
```