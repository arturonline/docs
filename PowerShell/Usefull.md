# Usefull

## Scheduling in Windows Powershell

Example:

```bash
Schtasks /create /tn "Desktop Cleanup" /sc daily /st 07:00 /tr "PowerShell python c:\Users\Matt\Documents\GitHub\baseball_statistics\local_rawdata_stat_get.py"
```

So what do each of these thingies mean?

- `/create` to create a new task.
- `/tn` the **name** you give to the task. It is used to identify it when viewing scheduled tasks or modifying tasks previously created
- `/sc` is **how often** you want this task to run.
- `/st` is what exact time you want this task to **start**.
- `/tr` means “**Task Run**”. This is where you input the command of the task that you want to run, also specifying the path of the particular script.

What if I want to change the time?

Suppose you created this task and after a few months decide that you wanted to run it at 10:00 AM instead of 07:00 AM. You can simply use `schtasks` to change the time by entering the following at the PowerShell command line:

```bash
Schtasks /change /tn "Desktop Cleanup" /st 10:00
```