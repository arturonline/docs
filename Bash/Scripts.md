# Scripts

A script is basically a sequence of commands in a file. Bash reads the file and processes the commands in order. It moves on to the next command only when the current one has ended.

Making a script is easy. Begin by making a new file, and put this on the first line:

```bash
#!/bin/bash
```

or

```bash
#!/usr/bin/env bash
```

Once the script file has been created, it can be executed by doing:

```bash
bash myscript
```

Alternatively, we can give our scripts executable permissions. With this method, instead of calling Bash manually, we can execute the script as an application:

```bash
chmod +x myscript  # Mark the file as executable.
./myscript  # Now, myscript can be executed directly instead of having to pass it to bash.
```
