# Adding GUI to your Scripts

[Article](https://medium.com/@shalithasuranga/how-to-modernize-your-bash-scripts-by-adding-gui-cba613a34cb7)

| Tool          | Type                         | Notes                                              |
| ------------- | ---------------------------- | -------------------------------------------------- |
| `whiptail`    | text UI (terminal)           | Preinstalled on Debian/Ubuntu (`newt`)             |
| `dialog`      | text UI (terminal)           | More widgets than whiptail (`apt install dialog`)  |
| `zenity`      | GTK windows (desktop)        | GNOME; `apt install zenity`                        |
| `kdialog`     | Qt windows (desktop)         | KDE                                                |
| `yad`         | GTK windows (desktop)        | zenity fork with more options                      |
| `notify-send` | desktop notification         | `libnotify-bin`                                    |
| `osascript`   | macOS dialogs/notifications  | AppleScript                                        |

General rules:

- The user's choice is returned in the **exit status** (`0` = OK/Yes, `1` = Cancel/No, `255` = Esc).
- The entered text goes to **stdout** (zenity, kdialog) or **stderr** (whiptail, dialog). With whiptail/dialog swap them with `3>&1 1>&2 2>&3` to capture it.
- Check that the tool exists: `command -v zenity >/dev/null || { echo "zenity not installed" >&2; exit 1; }`

## Plain terminal (no extra tools)

```bash
read -rp "Name: " name                 # prompt
read -rsp "Password: " pass; echo      # -s: don't echo input
read -rn1 -p "Continue? [y/N] " ans; echo
[[ $ans == [Yy] ]] || exit 1

PS3="Pick one: "
select env in dev staging prod; do
    [[ -n $env ]] && break
done
echo "Deploying to $env"
```

## whiptail / dialog

```bash
# Message box
whiptail --title "Info" --msgbox "Backup finished" 8 40

# Yes/No: result in exit status
if whiptail --yesno "Delete old logs?" 8 40; then
    echo "deleting..."
fi

# Input box: text goes to stderr → swap fds to capture it
name=$(whiptail --inputbox "Your name:" 8 40 "default" 3>&1 1>&2 2>&3) || exit 1

# Menu
choice=$(whiptail --menu "Environment" 15 50 3 \
    dev "Development" \
    pre "Pre-production" \
    pro "Production" 3>&1 1>&2 2>&3)

# Checklist (returns quoted tags: "a" "c")
opts=$(whiptail --checklist "Components" 15 50 3 \
    a "API" ON  b "DB" OFF  c "Web" ON 3>&1 1>&2 2>&3)

# Progress bar: read percentages from stdin
for i in 0 25 50 75 100; do echo "$i"; sleep 0.3; done | whiptail --gauge "Working..." 6 50 0
```

`dialog` uses the same syntax (plus `--calendar`, `--fselect`, `--tailbox`...).

## zenity

```bash
zenity --info --text="Backup finished"
zenity --error --text="Something failed"
zenity --question --text="Continue?" && echo "yes"

name=$(zenity --entry --title="Login" --text="User name:")
pass=$(zenity --password)
file=$(zenity --file-selection --title="Choose a file")
date=$(zenity --calendar --date-format=%F)

choice=$(zenity --list --title="Env" --column="Name" dev pre pro)

# Progress: lines starting with '#' change the label, numbers set the %
(
    echo "# Copying..."; echo 30; sleep 1
    echo "# Compressing..."; echo 80; sleep 1
    echo 100
) | zenity --progress --auto-close
```

## Notifications

```bash
notify-send "Build" "Finished successfully"                  # Linux
notify-send -u critical "Disk" "Less than 5% free"
osascript -e 'display notification "Finished" with title "Build"'   # macOS
```
