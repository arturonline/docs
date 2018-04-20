# Getting Help

## Get-Help

To get help with help:

`Get-Help`

To read cmdlet self documentation:

`Get-Help <cmdlet>`

Detailed help:

`Get-Help <cmdlet> -detailed`

Usage examples:

`Get-Help <cmdlet> -examples`

Full (everything) help:

`Get-Help <cmdlet> -full`

Online help (if available):

`Get-Help <cmdlet> -online`

To list available aliases (alias alias):

`Get-Alias`

## Finding comdlets

To get a list of all available cmdlets:

`Get-Command`

Get-Command supports filtering. To filter cmdlets on the verb set:

`Get-Command Set*` or

`Get-Command –Verb Set`

Or on the noun process:

`Get-Command *Process` or

`Get-Command –Noun process`

To dismiss a process you can use the process ID or the process name. The -processname switch allows the use of wildcards. Here's how to stop the calculator:

`Stop-Process -processname calc*`
