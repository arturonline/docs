# PowerShell

In a command line shell you run commands. To discover commands:

```sh
# When you run the Get-Command cmdlet in the shell, you get a list of every command that's installed
get-command

# You can filter the response
get-commmand -noun service
get-command -verb stop
get-command -verb stop -noun service
```

## 2. Get-Help

You can learn more about the cmdlet by using the `Get-Help` cmdlet:

```PowerShell
PS C:\> get-help *g*service*

PS C:\> get-help get-service
PS C:\> get-help get-service –examples
PS C:\> Get-Help get-service -detailed
PS C:\> Get-Help get-service -full
PS C:\> Get-Help get-service -online

PS C:\> get-help get-service -ShowWindow
```

>⚠️ Update-Help -UICulture en-US -Verbose

## cmdlets

* `Get` — To get something
* `Set` — To define something
* `Start` — To run something
* `Stop` — To stop something that is running
* `Out` — To output something
* `New` — To create something

## Discover members of the objects (properties & methods)

When a cmdlet runs, it returns an object. You can inspect the object to learn more by using the cmdlet `Get-Member`.

```PowerShell
PS C:\> get-process | get-member

PS C:\> get-process | gm
```

The first line of the response, running the `Get-Member` command, is the type of the returned object. When you know the type, you can search for other cmdlets that operate on the same type.

```sh
Get-Process -Name name-of-process | Get-Member

# TypeName: System.Diagnostics.Process

Get-Command -ParameterType Process
```

## Pipelines

The pipe character `(|)` is used to connect cmdlets. The output of the cmdlet that precedes the pipe serves as the input for the cmdlet that follows the pipe.

```powershell
PS C:\> get-process | out-file c:\Proc.text
```

### Where

This cmdlet takes an operator and an expression. Together, they process a list of objects and return a result where all records match the filtering statement.

```sh
Get-Process | Where-Object Name -eq name-of-process | Select-Object Name
```

Often, a cmdlet that offers **filtering** is more efficient than using `Where-Object`. Here's a more efficient version of the preceding statement:

```sh
Get-Process -Name name-of-process | Select-Object Name
```

In this version, the parameter -Name does the filtering for you.

