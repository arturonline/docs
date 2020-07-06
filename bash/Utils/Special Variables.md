# Special Variables

- **BASH_VERSION**: Contains a string describing the version of Bash.
- **HOSTNAME**: Contains the hostname of your computer, I swear. Either short or long form, depending on how your computer is set up.
- **PPID**: Contains the PID of the parent process of this shell.
- **PWD**: Contains the current working directory.
- **RANDOM**: Each time you expand this variable, a (pseudo)random number between 0 and 32767 is generated.
- **UID**: The ID number of the current user. Not reliable for security/authentication purposes, alas.
- **COLUMNS**: The number of characters that fit on one line in your terminal. (The width of your terminal in characters.)
- **LINES**: The number of lines that fit in your terminal. (The height of your terminal in characters.)
- **HOME**: The current user's home directory.
- **PATH**: A colon-separated list of paths that will be searched to find a command, if it is not an alias, function, builtin command, or shell keyword, and no pathname is specified.
- **PS1**: Contains a string that describes the format of your shell prompt.
- **TMPDIR**: Contains the directory that is used to store temporary files (by the shell).