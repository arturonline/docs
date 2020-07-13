# crontab de Artur

```sh
# https://crontab.guru

# [minute] [hour] [day] [month] [week day] [command to be executed]
#    *       *      *      *        *
#    |       |      |      |        |
#    |       |      |      |        +------ day of week (0-6) (Sunday=0)
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
