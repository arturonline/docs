# Variables

In PowerShell, variable names start with the `$` character. You can assign a value to a variable using the assignment operator `=`:

```powershell
$myName = "Ferb"
```

In the above example, the double quotes (" ") indicate that a string value is being assigned to the variable.

PowerShell variables are really objects. You can access both properties and methods using a dot (.) after the variable name. Properties don't use parentheses ( ), but methods do.

```powershell
$myName.Length
4

$myName.ToUpper()
FERB
```

## Discovering an Object's Type, Properties, and Methods

The properties and methods that an object can use depend on the object's type. You can get a variable's object type by calling its `GetType` method like this:

```powershell
$myName.GetType()

# The $myName variable contains a String object.
````

You can also use the `Get-Member` cmdlet to see what properties and methods are available:

```powershell
Get-Member –InputObject $myName
```

## Variable Interpolation

When you include a variable's name inside a double-quoted string, PowerShell replaces the variable's name with its value in the string:

```powershell
$myName = "Ferb"
"Hello, $myName"

Hello, Ferb.
```

PowerShell doesn't perform variable interpolation for single-quoted strings:

```powershell
$myName = "Ferb"
'Hello, $myName'

Hello, $myName
```

A common problem when using variable interpolation is when you want to include an object's property (or the result of an object's method) in the string. Using the standard dot notation to retrieve the property doesn't quite work as expected. For example, the command:

```powershell
"$myName is $myName.Length characters"

Ferb.Length characters
```

To work around this problem, PowerShell provides the subexpression operator, `$( )`, which you can use within the string to get the desired result. For example, the command:

```powershell
"$myName is $($myName.Length) characters"

Ferb is 4 characters
```

In general, if PowerShell isn't replacing a variable in a double-quoted string like you expect it to, you can put the variable inside `$( )` to work around the problem.

## Getting Help with Variables

First update your help files:

```powershell
update-help
```

Now you can access the PowerShell Help system:

```powershell
help about_Variables
help about_Automatic_Variables
help about_Preference_Variables
help about_Environment_Variables

```