# Advanced Parameters

>💡 Get-Help about_functions_Advanced_Parameters -showwindow

In Powershell attributes allow us to attach additional information to classes, functions and properties. It’s metadata for your code.

## Parameter Attributes

The Parameter attribute identifies a public property of the cmdlet class as a cmdlet parameter.

### Mandatory (System.Boolean)

Optional named parameter. True indicates the cmdlet parameter is required. If a required parameter is not provided when the cmdlet is invoked, Windows PowerShell prompts the user for a parameter value. The default is false.

```powershell
function Test-Mandatory {
    [Cmdletbinding()]
    Param (
        [Parameter(Mandatory=$true)]
        [String[]]$Computername
    )
    Write-Host "Test-Mandatory: $ComputerName"
}
```

```powershell
PS C:\> .\script.ps1
PS C:\> Test-Mandatory -ComputerName "s01", "s02", "s03"

Test-Mandatory: s01, s02, s03
```

### ParameterSetName (System.String)

Specifies the parameter set that this cmdlet parameter belongs to. If no parameter set is specified, the parameter belongs to all parameter sets.

### Position (System.Integer)

Specifies the position of the parameter within a Windows PowerShell command.

```powershell
function Get-Position {
    [CmdletBinding()]
    Param (
        [Parameter(Position=0)]
        [String] $pos1,
        [Parameter(Position=1)]
        [String] $pos2
    )
    Write-Host "Pos1: $pos1, Pos2: $pos2"
}

Get-Position -pos1 "1" -pos2 "2" # this work
Get-Position -pos2 "2" -pos1 "1" # this work too even you swap them
```

```powershell
# Output:
PS D:\> .\script.ps1
Pos1: 1, Pos2: 2
Pos1: 1, Pos2: 2
```

### ValueFromPipeline (System.Boolean)

True indicates that the cmdlet parameter supports pipeline input. Specify this keyword if the cmdlet accesses the complete object, not just a property of the object. The default is false.

### ValueFromPipelineByPropertyName (System.Boolean)

True indicates that the cmdlet parameter takes its value from a **property** of a pipeline object that has either the same name or the same alias as this parameter. For example, if the cmdlet has a Name parameter and the pipeline object also has a Name property, the value of the Name property is assigned to the Name parameter of the cmdlet. The default is false.

```powershell
function Test-ValueFromPipelineByPropertyName {
    [CmdletBinding()]
    Param (
        [Parameter(
            ValueFromPipeline=$true,
            ValueFromPipelineByPropertyName=$true
         )] [String[]] $Names
    )
    Begin {
        Write-Host "The begin is block"
    }
    Process {
        Write-Host "Processing:Test-ValueFromPipelineByPropertyName: $Names"
    }
    End {
        write-host "The is end block"
    }
}
Get-ChildItem | Select-Object -First 5 | Test-ValueFromPipelineByPropertyName
```

```powershell
# Output:
PS C:\Windows\System32> .\script.ps1
The begin is block
Processing:Test-ValueFromPipelineByPropertyName: 0409
Processing:Test-ValueFromPipelineByPropertyName: 1033
Processing:Test-ValueFromPipelineByPropertyName: AdvancedInstallers
Processing:Test-ValueFromPipelineByPropertyName: af-ZA
Processing:Test-ValueFromPipelineByPropertyName: am-ET
The is end block
```

### ValidateCount

The ValidateCount attribute specifies the number of parameter values that a parameter can accepts. PowerShell will generate an error if the number of parameter values is outside the range.

```powershell
function Test-ValidateCount {
    [Cmdletbinding()]
    Param (
        [Parameter(Mandatory=$true)]
        [ValidateCount(1, 3)][String[]]$computerName
    )
    Write-Host "Test-ValidateCount: $computerName"
}
```

```powershell
Test-ValidateCount -computerName "server01", "server02", "server03"

# the test below will generate an error, try to uncomment it
# Test-ValidateCount -computerName "server01", "server02", "server03", "server04"
```

### Alias

You can create alternate names for parameter.

```powershell
function Test-Alias {
    [Cmdletbinding()]
    Param (
        [Parameter(Mandatory=$true)]
        [alias("CN", "MachineName")]
        [String[]]$Computername
    )
    Write-Host "Test-Alias: $ComputerName"
}
```

```powershell
PS C:\> .\script.ps1

PS C:\> Test-Alias -Computername "s01", "s02", "s03"
PS C:\> Test-Alias -MachineName "s01", "s02", "s03"
PS C:\> Test-Alias -CN "s01", "s02", "s03"

```

### ValidateSet

The ValidateSet attribute specifies a set of valid values for a parameter or variable. PowerShell will generate an error if a parameter or variable value does not match any value in the set.

```powershell
function Test-ValidateSet {
    [Cmdletbinding()]
    Param (
        [Parameter(Mandatory=$true)]
        [ValidateSet("Low", "Average", "High")]
        [String[]] $Detail
    )
    Write-Host "Test-ValidateSet: $Detail"
}
Test-ValidateSet -Detail "Low"
# Test-ValidateSet -Detail "Highest" # this will generate error
```

### HelpMessage

Specifies a short description of the parameter. Windows PowerShell displays this message when a cmdlet is run and a mandatory parameter is not specified.

```powershell
function Test-HelpMessage {
    [Cmdletbinding()]
    Param (
        [Parameter(Mandatory=$true,
        HelpMessage="Enter one or more computers!")]
        [String[]]$ComputerName
    )
    Write-Host "Test-HelpMessage : $computerName"
}
Test-HelpMessage
```

```powershell
# Output:
cmdlet Test-HelpMessage at command pipeline position 1
Supply values for the following parameters:
(Type !? for Help.)
ComputerName[0]: !?
Enter one or more computers!
ComputerName[0]: server01
ComputerName[1]: server02
ComputerName[2]:
Test-HelpMessage : server01 server02
```

### ValidatePattern

The ValidatePattern attribute specifies a regular expression that is compared to the parameter or variable value.

```powershell
function Test-ValidatePattern {
    [Cmdletbinding()]
    Param (
        [Parameter(Mandatory=$true)]
        [ValidatePattern("server[0-9][0-9]")]
        [String[]] $ComputerName
    )
    Write-Host "Test-ValidationPattern: $ComputerName"
}
```

```powershell
Test-ValidatePattern -ComputerName "server01", "server02"
# the test below will generate an error, try to uncomment it
# Test-ValidatePattern -ComputerName "server1", "server2"
```

### ValidateScript Validation Attribute

The ValidateScript attribute specifies a script that is used to validate a parameter or variable value. Windows PowerShell pipes the value to the script, and generates an error if the
script returns "false" or if the script throws an exception.

When you use the ValidateScript attribute, the value that is being validated is mapped to the `$_` variable. You can use the `$_` variable to refer to the value in the script.

In the following example, the value of the `EventDate` parameter must be greater than or equal to the current date.

```powershell
Param
    (
    [parameter()]
    [ValidateScript({$_ -ge (get-date)})]
    [DateTime]
    $EventDate
    )
```

Another example:

```powershell
function Test-ValidateScript {
    [CmdletBinding()]
    Param (
         [Parameter(Mandatory=$true)]
         [ValidateScript({ $_ -is [double] })] $number
    )
    Write-Host "Test-ValidateScript: $number"
}
Test-ValidateScript -number 12.32323
```

>⚡[More Attributes Info with examples 1](https://codegeekstuff.blogspot.com/2018/02/powershell-advanced-functions-parameter.html)<br>
⚡[More Atributes Info with examples 2](https://codegeekstuff.blogspot.com/2018/03/powershell-advanced-functions-advanced.html)

## Create your own attributes

>⚡ [Create your own attributes](https://powershellexplained.com/2017-02-19-Powershell-custom-attribute-validator-transform/)