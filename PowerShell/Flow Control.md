# Flow Control

Like most procedural programming languages, PowerShell supports a variety of loops.

## if

```powershell
If ($this -eq $that) {
  # commands
} elseif ($those -ne $them) {
  # commands
} elseif ($we -gt $they) {
  # commands
} else {
  # commands
}
```

## Switch

```powershell
$temperature = 20

switch($temperature)
{
   { $_ -lt 32 }   { "Below Freezing"; break }
   32              { "Exactly Freezing"; break }
   { $_ -le 50 }   { "Cold"; break }
   { $_ -le 70 }   { "Warm"; break }
   default         { "Hot" }
}
```

## While

```powershell
$i= 1
Do {
    Write-Output "PowerShell is Great! $i"
    $i=$i+1 # $i++
} While ($i -le 5) #Also Do-Until
```

```powershell
$i=5
While ($i -ge 1) {
    Write-Output "Scripting is great! $i"
    $i--
}
```

```powershell
$response = ""
do
{
  $response = Read-Host "Type something"
} until($response -eq "QUIT")
```

## For

```powershell
$services = Get-Service
ForEach ($service in $services) {
  $service.Displayname
}
```

```powershell
For ($i=0;$i –lt 5;$i++) {
 #do something
}
```

```powershell
1..5 | ForEach-Object -process {
    Start calc
}
```