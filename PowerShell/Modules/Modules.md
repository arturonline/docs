# Modules

⚡ [Link](https://powershellexplained.com/2017-05-27-Powershell-module-building-basics/) to PS Modules Explained by Kevin Marquette.

## tl,dr: How to Create A PowerShell Module

- Create a folder named `MyModule`
- Create a file called `MyModule.psm1` in that folder to hold your functions
- Use `New-ModuleManifest` to create a `MyModule.psd1` in that folder for the metadata
- Update the `ModuleRoot` and `FunctionsToExport` properties in the `MyModule.psd1`

>💡 Modules are just text files with `.psm1` extension.

## How to Use A PowerShell Module

```powershell
Import-Module MyModule.psm1
```

To remove a module:

```powershell
Remove-Module MyModule
```

## PSModule Path

Whenever you run `Import-Module`, it only loads the module in the current session. You must either load the module again or, preferably, place the module into the PowerShell path so that it auto-loads the next time.

To Show the Powershell path:

```powershell
$env:PSModulePath -split ";"
```

>💡 Best place to save your modules is `C:\Users\artur\Documents\WindowsPowerShell\Modules`

### Folders

You should always place a module into its own folder, and the name of the folder should match the name of the `.psm1` file:

```powershell
Scripts
│   myscript.ps1
│
└───GetInfo
        GetInfo.psm1
```
