# Write-Output -InputObject 'Hello World!'
# $name = Read-Host -Prompt "Please enter your name"
# Write-Output "Congratulations $name! You have written your first code with PowerShell!"

$day = get-date | Select-Object -ExpandProperty dayofweek
$name = Read-Host -Prompt "Please enter your name"
Write-Output "$name today's date is $day"
