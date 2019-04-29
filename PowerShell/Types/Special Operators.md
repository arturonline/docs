# Operators

## `( )` Grouping Expression operator

Parenthesis/Brackets work just as they do in mathematics, each pair will determine the order of evaluation and return the result of the expression within.

```powershell
PS C:\> (2 + 3) * 5
```

A shortcut syntax is available (…).property that returns a single property from an item or a collection (PowerShell V3.0):

```powershell
PS C:\> (dir).FullName
```

## `$( )` SubExpression operator

Unlike simple parenthesis, a subexpression can contain multiple ; semicolon ; separated ; statements.

```powershell
PS C:\> $city="Copenhagen"
PS C:\> $strLength = "$($city.length)"
#n.b. not "$city.length" that would return "Copenhagen.Length"
```

## `@( )` Array SubExpression operator

An array subexpression behaves just like a subexpression except that it guarantees that the output will be an array.

```powershell
PS C:\> @(Get-WMIObject win32_logicalDisk)
```

## `::` Static member operator

Call the static properties operator and methods of a .NET Framework class.
To find the static properties and methods of an object, use the -Static parameter of Get-Member:

```powershell
[datetime] | gm -static
[datetime]::now
[datetime]::Utcnow
```

## `,` Comma operator

As a binary operator, the comma creates an array. 
As a unary operator, the comma creates an array with one member. Place the comma before the member.

## `&` Call operator

Run a command, script, or script block. The call operator, also known as the "invocation operator," lets you run commands that are stored in variables and represented by strings. Because the call operator does not parse the command, it cannot interpret command parameters.

```powershell
C:\PS> $c = "get-executionpolicy"
C:\PS> $c
get-executionpolicy
C:\PS> & $c
AllSigned
```

## `.` Dot sourcing operator

Run a script in the current scope so that any functions, aliases, and variables that the script creates are added to the current scope. (without dot sourcing, the variables created within a script will all disappear when the script finishes.)

```powershell
. C:\sample1.ps1
. .\sample2.ps1
```

## `-f` Format operator

Format a string expression.

Place `{0}` `{1}` etc. into the string as placemarkers where you want the variables to appear, immediately follow the string with the `-f` operator and then lastly, the list of comma separated variables which will be used to populate the placemarkers.

```powershell
Get-ChildItem c:\ | ForEach-Object {'File {0} Created {1}' -f $_.fullname,$_.creationtime}
```

>💡 For more information, see the [String.Format](http://go.microsoft.com/fwlink/?LinkID=166450) method, [Composite Formatting](http://go.microsoft.com/fwlink/?LinkID=166451) and [ss64](https://ss64.com/ps/syntax-f-operator.html) site.

Optional format string(s) can be included to add padding/alignment and display dates/times/percentages/hex etc correctly, see the `-f` format page for full details.

## `..` Range operator

Produce a sequence of numbers:

```powershell
10..20
5..25
```

## `[ ]` Index operator

Selects objects from indexed collections, such as arrays and hash tables. Array indexes are zero-based, so the first object is indexed as `[0]`. For arrays (only), you can also use negative indexes to get the last values. Hash tables are indexed by key value.

```powershell
C:\PS> $a = 1, 2, 3
C:\PS> $a[0]
1
C:\PS> $a[-1]
3
```