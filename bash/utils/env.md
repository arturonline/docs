# Special Variables

See also: [variables](../vars.md), [PATH](path.md), special parameters (`$?`, `$!`...) in [old/parameters2](../old/parameters2.md#special-parameters).

## Shell variables

- **BASH_VERSION**: Contains a string describing the version of Bash (`BASH_VERSINFO[0]` = major version, e.g. `5`).
- **HOSTNAME**: Contains the hostname of your computer, I swear. Either short or long form, depending on how your computer is set up.
- **PPID**: Contains the PID of the parent process of this shell.
- **BASHPID**: PID of the current bash process (differs from `$$` inside subshells).
- **PWD** / **OLDPWD**: Current / previous working directory (`cd -` goes to `OLDPWD`).
- **RANDOM**: Each time you expand this variable, a (pseudo)random number between 0 and 32767 is generated. **SRANDOM** (bash 5.1+): 32-bit, better random number.
- **SECONDS**: Seconds since the shell started (assign `SECONDS=0` to use it as a timer).
- **EPOCHSECONDS** / **EPOCHREALTIME** (bash 5.0+): Unix time, without calling `date`.
- **UID** / **EUID**: The (effective) ID number of the current user. Not reliable for security/authentication purposes, alas. `(( EUID == 0 ))` → running as root.
- **COLUMNS**: The number of characters that fit on one line in your terminal. (The width of your terminal in characters.)
- **LINES**: The number of lines that fit in your terminal. (The height of your terminal in characters.)
- **HOME**: The current user's home directory.
- **USER** / **LOGNAME**: Current user name (set by the login process).
- **SHELL**: The user's login shell (not necessarily the one running).
- **PATH**: A colon-separated list of paths that will be searched to find a command, if it is not an alias, function, builtin command, or shell keyword, and no pathname is specified. See [path](path.md).
- **PS1**: Contains a string that describes the format of your shell prompt. **PS4**: prefix of `set -x` trace lines.
- **IFS**: Internal Field Separator, used for word splitting and `read` (default: space, tab, newline).
- **TMPDIR**: Contains the directory that is used to store temporary files (by the shell, `mktemp`...).
- **LINENO**, **FUNCNAME**, **BASH_SOURCE**: current line, function name stack and source file stack (useful for error messages).
- **PIPESTATUS**: array with the exit status of each command of the last pipeline.
- **HISTSIZE** / **HISTFILESIZE** / **HISTCONTROL**: history settings (`HISTCONTROL=ignoreboth` skips duplicates and lines starting with a space).
- **LANG** / **LC_ALL**: locale (language, sorting, character classes). `LC_ALL=C sort` → byte order, faster.
- **EDITOR** / **VISUAL**: preferred editor for `crontab -e`, `git commit`...

```bash
echo "$BASH_VERSION"          # 5.2.21(1)-release
echo $(( RANDOM % 6 + 1 ))    # dice: 1-6
SECONDS=0; sleep 2; echo "took ${SECONDS}s"   # took 2s
f() { echo "$FUNCNAME at line $LINENO"; }; f  # f at line 1
```

## Shell vs environment variables

A normal variable exists only in the current shell. **Exported** (environment) variables are copied to every child process.

```bash
LOCALV=x
bash -c 'echo "[$LOCALV]"'      # []
export LOCALV
bash -c 'echo "[$LOCALV]"'      # [x]

MYVAR=hi bash -c 'echo "$MYVAR"'   # hi   (only for that command)
echo "${MYVAR:-unset}"             # unset
```

## Commands

```bash
env                     # list environment variables
printenv HOME           # print one
declare -p HOME         # show attributes and value: declare -x HOME="/home/ana"
declare -x              # list exported variables
set                     # list all variables and functions
export VAR=value        # create + export
export -n VAR           # un-export (keep as shell variable)
unset VAR               # delete
env -i bash --noprofile --norc   # start a shell with an empty environment
env VAR=1 OTHER=2 cmd   # run cmd with extra variables
echo "${!BASH@}"        # names of variables starting with BASH
```

## Where to set them

| File                               | Loaded by                                        |
| ---------------------------------- | ------------------------------------------------ |
| `~/.bashrc`                        | interactive non-login shells (new terminal tab on Linux) |
| `~/.bash_profile` / `~/.profile`   | login shells (ssh, macOS Terminal). Usually sources `~/.bashrc` |
| `/etc/environment`, `/etc/profile` | system-wide                                      |
| `.env` file                        | load with `set -a; source .env; set +a` (exports every variable it defines) |
