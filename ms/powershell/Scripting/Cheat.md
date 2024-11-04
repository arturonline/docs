# cheatsheet

```sh
# greeting.ps1
param (
    [string]$Name = "World"
)

Write-Host "Hello, $Name!"
```

```sh
.\greeting.ps1 -Name "user"
# user
```