# Path

`PATH` is a colon-separated list of directories where the shell looks for commands, **in order** (the first match wins). See also [env](env.md).

## Inspect

```bash
echo "$PATH" | tr ':' '\n'      # one directory per line
# /home/ana/bin
# /usr/local/bin
# /usr/bin
# /bin

type -a python      # every match: alias, function, builtin or file, in order
command -v jq       # path of the command that would run (POSIX; empty + status 1 if missing)
which -a node       # external program only
hash -r             # forget cached command locations after moving/installing binaries
```

💡 Check if a tool exists in a script: `command -v docker >/dev/null || { echo "docker not found" >&2; exit 1; }`.

## Where to put your script files

To decide where to put the script, a couple alternatives exists. Generally, people like to keep their scripts in a personally-defined directory; this prevents your script from interfering with other users on the system. Some like to keep their scripts in a pre-existing directory in the PATH, because these people think that they will never make a mistake.

To use a personal directory:

```bash
mkdir -p "$HOME/bin"
echo 'PATH="$HOME/bin:$PATH"' >> "$HOME/.bashrc"
source "$HOME/.bashrc"
```

- The first command will make a directory called bin inside your home directory.
- The second command adds a line containing a variable assignment to a file. The variable is `PATH`, and we are adding this line to the `Bash` configuration file (`.bashrc`). Every new interactive instance of `Bash` will now check for executable scripts in our new directory. (Single quotes are intended: `$HOME` and `$PATH` are expanded when `.bashrc` runs, not now.)
- The third command tells `Bash` to re-read its configuration file. We could have also used `exec bash`, or we could close the existing terminal and open a new one.

In any case, we can now put our script in our bin directory and execute it as a normal command — we no longer need to prepend our script's name with the file path (the `./` in `./myscript`):

```bash
mv myscript "$HOME/bin"
chmod +x "$HOME/bin/myscript"
myscript
```

💡 `~/.local/bin` is the XDG convention (used by `pip install --user`, `pipx`...) and many distros already add it to `PATH` if it exists.

## Prepend vs append

```bash
PATH="$HOME/bin:$PATH"     # prepend: your commands win over system ones
PATH="$PATH:/opt/tool/bin" # append: system commands win
```

⚠ Never do `PATH=/some/dir` (without `$PATH`): you lose every other command in that shell.

Add a directory only if it exists and isn't already there (safe to source many times):

```bash
path_add() {
    [[ -d $1 ]] || return
    case ":$PATH:" in
        *":$1:"*) ;;                 # already present
        *) PATH="$1:$PATH" ;;
    esac
}
path_add "$HOME/bin"
path_add "$HOME/.local/bin"
```

## Which file?

| File              | When                                                                |
| ----------------- | ------------------------------------------------------------------- |
| `~/.bashrc`       | interactive non-login shells (most Linux terminals)                 |
| `~/.bash_profile` | login shells (macOS Terminal, ssh). Make it source `~/.bashrc`      |
| `~/.profile`      | login shells when `~/.bash_profile` doesn't exist; also read by `sh` and graphical sessions |

```bash
# ~/.bash_profile
[[ -f ~/.bashrc ]] && source ~/.bashrc
```

⚠ Cron jobs and systemd services don't read these files: they get a minimal `PATH` (see [crontab](crontab.md#gotchas)).

## Run a command with a different PATH

```bash
PATH=/usr/bin:/bin some_command   # only for this command
env PATH=/opt/x/bin:$PATH make
```
