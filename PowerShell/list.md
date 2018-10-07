# List of useful commands

dir /p

dir | more

Update-Help -Force

Search recursively for a certain string within files:

`dir –r | select string "searchforthis"`

Find the five processes using the most memory:

`ps | sort –p ws | select –last 5`

`Stop-Computer -Confirm`

`Get-Date`

`Get-Process`

`Start-Process notepad`
`Start-Process 'http://www.google.es'`

`Start-Sleep -Seconds 3600; Restart-Computer`

As you can see PowerShell goes to sleep for 3600 seconds. After this period the computer will do a restart provided that you don’t close PowerShell. Planning this in a scheduled task is by all means the better solution.

`Get-Help Stop-Process -Parameter Name`

Select-Object

If you tried using the command above, you know that there were numerous properties included in the CSV file. It's often helpful to narrow things down by including only the properties you are really interested in. This is where the Select-Object command comes into play. The Select-Object command allows you to specify specific properties for inclusion. For example, to create a CSV file containing the name of each system service and its status, you could use the following command:

`Get-Service | Select-Object Name, Status | Export-CSV c:\service.csv`