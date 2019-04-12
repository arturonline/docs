# PS Types

The most common DataTypes used in PowerShell are listed below.

Type | Description
-|-
`[string]` | Fixed-length string of Unicode characters
`[char]` | A Unicode 16-bit character
`[byte]` | An 8-bit unsigned character

`[int]` | 32-bit signed integer
`[long]` | 64-bit signed integer
`[bool]` | Boolean True/False value

`[decimal]` | A 128-bit decimal value
`[single]` | Single-precision 32-bit floating point number
`[double]` | Double-precision 64-bit floating point number
`[DateTime]` | Date and Time

`[xml]` | Xml object
`[array]` | An array of values
`[hashtable]` | Hashtable object

## Casting

To force a conversion to a specific datatype, prefix the value or variable with the type in square brackets, this is known as a Cast Operator and forces the chosen datatype:

```powershell
PS C:\> [int]"0064"
64

PS C:\> [int]$false
0

PS C:\> [byte]('0x' + 'FF')
255
```

When assigning a value to a variable, you can cast either side of the expression so

```powershell
$variable = [int]0123
```

is not quite the same as:

```powershell
[int]$variable = 0123
```

>💡 Notice that `Get-Member` and `GetType()` will display the current datatype but do not indicate if it is static or variant.

## Testing DataTypes

To test the datatype of a value use a comparison operator:

```powershell
PS C:\> 32 -is [int]
True
```

```powershell
PS C:\> $true -is [bool]
True
```

If you are going to cast a variable into a new datatype it is a good idea to first test if the value will cast sucessfully using -as, if the conversion fails, it will return a NULL, which can be used to either avoid the conversion or to raise an error:

```powershell
[string]$var = "64a"
if( ($var -as [double]) -ne $null ) {
   [double]$var = $var
}
$var.GetType().FullName
```