# Gallery

The PowerShell Gallery is a collection of modules and scripts that is community driven to help us automate everyday tasks. Sometimes, we have an idea that could written into a function or script, however, most of the time, someone else had the same idea and published their work to the PowerShell Gallery. There is no need to recreate the wheel and re-write it, use the community to our advantage.

## `Find-Module`

`Find-Module` allows us the browse the PowerShell Gallery and find if there is a module in the community that has been created.

But what if we did not know the name of a module we are looking for? The `-Name` parameter accepts wildcards for partial searches, we can enter in `Find-Module -Name Az*` and will return any module in the gallery that starts with *"Az"*.

## `Install-Module`

Once we found the module that we want to use, we can install the module using the `Install-Module` Cmdlet.

```powershell
Find-Module -Name Az |Install-Module
```

```powershell
Install-Module -Name Az -RequiredVersion 1.7
```

>💡 Not using the `-RequiredVersion` parameter will install the latest version of the module.

## `Find-Script`

`Find-Script` works the same way as `Find-Module`, however, instead of finding modules, we are now finding scripts. `Find-Script` will return `.ps1` scripts in the PowerShell Gallery that could be installed.

Ex:

```powershell
Find-Script -Name Get-*

Find-Script -Name Join-String

Find-Script -Name Join-String |Install-Script
```