# Module manifest

A **module manifest** adds metadata about your module. It includes author information and versioning. It also will enable PowerShell to auto-load our module if we create it correctly.

The module manifest is just a hashtable saved as a `*.psd1` file. The name of the file should match the name of the folder. By creating this file, it will get loaded when you call `Import-Module`.

## `New-ModuleManifest`

The good news is that we have a `New-ModuleManifest` cmdlet that will create the manifest for us.

```powershell
New-ModuleManifest
```

You can use `New-Modulemanifest` with a gui:

```powershell
Show-Command New-ModuleManifest
```
