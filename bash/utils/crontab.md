# crontab de Artur

```bash
# https://crontab.guru

# [minute] [hour] [day] [month] [week day] [command to be executed]
#    *       *      *      *        *
#    |       |      |      |        |
#    |       |      |      |        +------ day of week (0-7) (Sunday=0 or 7)
#    |       |      |      |
#    |       |      |      +--------------- month (1-12)
#    |       |      |
#    |       |      +---------------------- day of month (1-31)
#    |       |
#    |       +----------------------------- hour (0-23)
#    |
#    +------------------------------------- min (0-59)

# At 07:30 on every day-of-week from Monday through Friday.
30 07 * * 1-5 brew update && brew upgrade
```

## Commands

```bash
crontab -e            # edit the current user's crontab
crontab -l            # list it
crontab -r            # ⚠ remove it entirely (no confirmation!)
crontab -l > cron.bak # backup
crontab cron.bak      # install from a file
sudo crontab -u ana -e  # edit another user's crontab
```

System-wide jobs live in `/etc/crontab` and `/etc/cron.d/*`; these have an extra **user** field before the command:

```text
0 3 * * * root /usr/local/bin/backup.sh
```

## Field syntax

| Syntax   | Meaning                  | Example                      |
| -------- | ------------------------ | ---------------------------- |
| `*`      | every value              | `* * * * *` every minute     |
| `a,b`    | list                     | `0 8,20 * * *` 08:00 and 20:00 |
| `a-b`    | range                    | `0 9-17 * * 1-5` hourly on office hours |
| `*/n`    | step                     | `*/15 * * * *` every 15 minutes |
| `a-b/n`  | step within a range      | `0 8-18/2 * * *` every 2 hours from 8 to 18 |

⚠ If both *day of month* and *day of week* are set (not `*`), the job runs when **either** matches.

## Special strings

| String               | Equivalent    |
| -------------------- | ------------- |
| `@reboot`            | at startup    |
| `@hourly`            | `0 * * * *`   |
| `@daily`/`@midnight` | `0 0 * * *`   |
| `@weekly`            | `0 0 * * 0`   |
| `@monthly`           | `0 0 1 * *`   |
| `@yearly`            | `0 0 1 1 *`   |

## Examples

```bash
*/5 * * * *   /home/artur/bin/check.sh                   # every 5 minutes
0 2 * * *     /home/artur/bin/backup.sh >> /home/artur/backup.log 2>&1   # daily at 02:00, with log
0 0 1 * *     find /tmp -type f -mtime +30 -delete       # 1st of every month
30 18 * * 5   echo "weekend!" | mail -s "Friday" artur@example.com
@reboot       sleep 30 && /home/artur/bin/start-services.sh
```

## Gotchas

- **Minimal environment**: cron runs with `SHELL=/bin/sh` and a short `PATH` (usually `/usr/bin:/bin`). Use absolute paths or set variables at the top of the crontab:

  ```bash
  SHELL=/bin/bash
  PATH=/usr/local/bin:/usr/bin:/bin
  MAILTO=""          # don't email the output ("" disables it)
  ```

- **`%` is special**: it means newline in cron. Escape it: `date +\%F`.
- **Output** is mailed to the user (if mail is configured) or lost. Redirect it to a log: `>> file.log 2>&1`.
- **Time zone** is the system one (`CRON_TZ=Europe/Madrid` is supported by some cron implementations).
- **Avoid overlapping runs** of long jobs with `flock`:

  ```bash
  */5 * * * * flock -n /tmp/sync.lock /home/artur/bin/sync.sh
  ```

- **Debug**: check the logs (`grep CRON /var/log/syslog`, `journalctl -u cron`), and test the command with the cron environment: `env -i SHELL=/bin/sh PATH=/usr/bin:/bin HOME="$HOME" /path/script.sh`.
- On macOS, give `cron` *Full Disk Access* if the job touches protected folders. On systemd distros, `systemd` timers are an alternative (`systemctl list-timers`).
