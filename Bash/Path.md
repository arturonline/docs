# Path

To decide where to put the script, a couple alternatives exists. Generally, people like to keep their scripts in a personally-defined directory; this prevents your script from interfering with other users on the system. Some like to keep their scripts in a pre-existing directory in the PATH, because these people think that they will never make a mistake.

To use a personal directory:

```bash
mkdir -p "$HOME/bin"
echo 'PATH="$HOME/bin:$PATH"' >> "$HOME/.bashrc"
source "$HOME/.bashrc"
```

- The first command will make a directory called bin inside your home directory.
- The second command adds a line containing a variable assignment to a file. The variable is `PATH`, and we are adding this line to the `Bash` configuration file (`.bashrc`). Every new interactive instance of `Bash` will now check for executable scripts in our new directory.
- The third command tells `Bash` to re-read its configuration file. We could have also used `exec bash`, or we could close the existing terminal and open a new one.

In any case, we can now put our script in our bin directory and execute it as a normal command — we no longer need to prepend our script's name with the file path (which was the `./` part in the previous example):

```bash
$ mv myscript "$HOME/bin"
$ myscript
```