# Hashtables

> ⚡ [More info on MS Docs](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_hash_tables?view=powershell-6)<br>
> ⚡ [Kevin Marquette](https://powershellexplained.com/2016-11-06-powershell-hashtable-everything-you-wanted-to-know-about/)

Hashtable are dictionaries that store unordered **key/value pairs**. When using a Hashtable, you specify an object that is used as a key, and the value that you want linked to that key. Generally we used String or numbers as keys.

```powershell
PS C:\> $hash = @{}
# or:
PS C:\> $hash = @{ ID = 1; Shape = "Square"; Color = "Blue"}
```

You can create ordered Hashtables by using th `[ordered]` attribute:

```powershell
PS C:\> $hash = [ordered]@{ ID = 1; Shape = "Square"; Color = "Blue"}

```

Output:

```powershell
Name         Value  
----         -----
ID           1
Color        Blue
Shape        Square
```

## Accesing keys & values

```powershell
PS C:\> $hash.keys
ID
Color
Shape

PS C:\> $hash.values
1
Blue
Square
```

## Example

```powershell
$hash = @{ ID = 1; Shape = "Square"; Color = "Blue"}

write-host("Print all hashtable keys")
$hash.keys

write-host("Print all hashtable values")
$hash.values

write-host("Get ID")
$hash["ID"]

write-host("Get Shape")
$hash.Number

write-host("print Size")
$hash.Count

write-host("Add key-value")
$hash["Updated"] = "Now"

write-host("Add key-value")
$hash.Add("Created","Now")

write-host("print Size")
$hash.Count

write-host("Remove key-value")
$hash.Remove("Updated")

write-host("print Size")
$hash.Count

write-host("sort by key")
$hash.GetEnumerator() | Sort-Object -Property key
```

```powershell
Print all hashtable keys
ID
Color
Shape
Print all hashtable values
1
Blue
Square
Get ID
1
Get Shape
print Size
3
Add key-value
Add key-value
print Size
5
Remove key-value
print Size
4
sort by key

Name        Value
----        -----
Color       Blue
Created     Now
ID          1
Shape
Square
```