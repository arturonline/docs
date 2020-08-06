# File permissions and Ownership

Being a multi-user system, Linux needs some way to track who owns each file and whether or not a user is allowed to perform actions on that file.

## Querying Information about Files and Directories


```sh
ls -l
```

### File types

symbol | description
-|-
`-` | normal file
`d` | directory
`l` | soft link
`b` | block device
`c` | character device
`s` | socket

### File permissions

permission | octal | description
-|-|- 
`r` | 4 | open a file and read its contents
`w` | 2 | open and edit or delete a file 
`x` | 1 | Can run as an executable or script

### Directories permissions

permission | octal | description
-|-|-
`r` | 4 | Read directory's content (list files), but not the files themselves.
`w` | 2 | Create or delete files, change their names, permissions and ownsers.
`x` | 1 | Enter a directory, but not to list its files (for that, the r permission is needed).

>💡 If a user has the write permission on a directory, the user can change permissions of any file in the directory, even if the user has no permissions on the file or if the file is owned by another user.

## Modifying File Permissions

The command `chmod` is used to modify the permissions for a file, and takes at least two parameters: the first one describes which permissions to change, and the second one points to the file or directory where the change will be made. However, the permissions to change can be described in two different ways, or “modes”.

### Symbolic Mode

The first character(s) indicate(s) whose permissions you will alter: 

- The ones for the user (u)
- The group (g)
- Others (o)
- and/or for all the three together (a).

Then you need to tell the command what to do: 

- You can grant a permission (+)
- Revoke a permission (-)
- Or set it to (overwrite) a specific value (=).

Lastly, you specify which permission you wish to affect: read (r), write (w), or execute (x).

#### Exemple:

For the user (u), grant (+) read, write and execute (rwx) permissions, for the group (g) revoke (-), execute permissions (x):

```sh
$ chmod u+rwx,g-x text.txt
$ ls -lh text.txt
-rwxrw-rw- 1 carol carol 765 Dec 20 21:25 text.txt
```

### Numeric Mode

Moden numeric mode, the permissions are specified as a three-digit numeric value on octal notation.

Each permission has a corresponding value, and they are specified in the following order: 

- first comes read (r), which is 4, 
- then write (w), which is 2 
- and last is execute (x), represented by 1. 
- If there is no permission, use the value zero (0). 

#### Example

A permission of rwx would be 7 (4+2+1) and r-x would be 5 (4+0+1):

```sh
$ chmod 660 text.txt
$ ls -l text.txt
-rw-rw---- 1 carol carol 765 Dec 20 21:25 text.txt
```

## Modifying File Ownership

The command chown is used to modify the ownership of a file or directory. The syntax is quite simple:

```sh
$ chown username:groupname filename
```

User or group can be omitted if you do not wish to change them. So, to change just the group owning a file you would use `chown :students text.txt`. To change just the user, the command would be `chown carol: text.txt` or just `chown carol text.txt`. Alternatively, you could use the command `chgrp students text.txt` to change only the group.

⚠ The user who owns a file does not need to belong to the group who owns a file.

### Querying Groups

To see which groups exist on your system, simply type groups:

```sh
$ groups
carol students cdrom sudo dip plugdev lpadmin sambashare
```

And if you want to know to which groups a user belongs, add the username as a parameter:

```sh
$ groups carol
carol : carol students cdrom sudo dip plugdev lpadmin sambashare
```

To do the reverse, displaying which users belong to a group, use **groupmems**. The parameter `-g` specifies the group, and `-l` will list all of its members:

```sh
$ sudo groupmems -g cdrom -l
carol
```

## Special Permissions

Besides the read, write and execute permissions for user, group and others, each file can have three other special permissions which can alter the way a directory works or how a program runs. They can be specified either in symbolic or numeric mode.


name | numeric | symbolic | applies | description
-|-|-|-|-
Sticky Bit | 1 | t | directories | Prevents users from removing or renaming a file in a directory unless they own that file or directory.
Set GID | 2 | s | exectuble files or directories | On executable files, it will grant the process resulting from executing the file access to the privileges of the group who owns the file. When applied to directories, it will make every file or directory created under it inherit the group from the parent directory.
Set UID | 4 | s | files | Its behavior is similar to the SGID bit, but the process will run with the privileges of the user who owns the file.

