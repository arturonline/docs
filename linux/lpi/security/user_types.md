# Basic Security and Identifying User Types

🔗[source](https://learning.lpi.org/en/learning-materials/010-160/5/5.1/5.1_01/)

| Commands | Description                                                                                                              |
|----------|--------------------------------------------------------------------------------------------------------------------------|
| `id`     | List real (or effective) user and group IDs.                                                                             |
| `last`   | List users who logged in last.                                                                                           |
| `who`    | List users who are currently logged in.                                                                                  |
| `w`      | Similar to who but with additional context.                                                                              |
| `su`     | Switch to another user with a login shell, or run commands as that user, by passing that user’s password.                |
| `sudo`   | Switch User (or Superuser) Do, if entitled, the current user enters their own password (if required) to raise privilege. |
| `chsh`   | Change a user’s shell.                                                                                                   |
| `chfn`   | Change the user’s information on the GECOS field.                                                                        |

## Accounts

Every user has a unique login name and an associated numeric user identifier (*UID*). User can belong to one or more groups. Each group also has a unique name and a group identifier (*GID*).

The primary purpose of user and group *ID*s is to determine ownership of various system resources and to control the permissions granted to processes accessing those resources.

By default on Linux systems, every user is assigned to a group with the same name as their username, and same *GID* as his *UID*.

### Standard User Accounts

All accounts other than root are regular user accounts (unprivileged). They typically have the following properties, with select exceptions:

* UIDs starting at **1000** (4 digits), although some legacy systems may start at 500.
* A defined home directory, usually a subdirectory of `/home`, depending on the site-local configuration.
* A defined login shell.

⚠ If a user account does not have a valid shell in their attributes, the user will not be able to open an interactive shell. Usually `/sbin/nologin` is used as an invalid shell. This may be purposeful, if the user will only be authenticated for services other than console or SSH access, e.g., Secure FTP (sftp) access only.

### Superuser Account

On Linux the superuser account is *root*, which always has **UID 0**. The superuser is sometimes called the system administrator, and has unlimited access and control over the system, including other users.

The default group for the superuser has the **GID 0** and is also named *root*. The home directory for the superuser is a dedicated, top level directory, `/root`, only accessible by the root user himself.

### System Accounts

System accounts are typically pre-created at system installation time. These are for facilities, programs and services that will not run as the superuser. In an ideal world, these would all be operating system facilities.

The system accounts vary, but their attributes include:

* UIDs are usually **under 100** (2-digit) or **500-1000** (3-digit).
* Either no dedicated home directory or a directory that is usually not under `/home`.
* No valid login shell (typically `/sbin/nologin`), with rare exceptions.
* These accounts usually have limited or, more often than not, no privileges.

### Service Accounts

Service accounts are typically created when services are installed and configured. Similar to system accounts, these are for facilities, programs and services that will not run as the superuser.

In much documentation, system and service accounts are similar, and interchanged often. This includes the location of home directories typically being outside of /home, if defined at all (service accounts are often more likely to have one, compared to system accounts), and no valid login shell. Although there is no strict definition, the primary difference between system and service accounts breaks down to UID/GID.

System account:

* UID/GID <100 (2-digit) or <500-1000 (3-digit)

Service account:

* UID/GID >1000 (4+ digit), but not a “standard” or “regular” user account, an account for services, with an UID/GID >1000 (4+ digits)

Some Linux distributions still have pre-reserved service accounts under **UID <100**, and those could be considered a system account as well, even though they are not created at system installation. E.g., on Fedora-based (including Red Hat) Linux distributions, the user for the Apache Web server has UID (and GID) 48, clearly a system account, despite having a home directory (usually at /usr/share/httpd or /var/www/html/).

>💡From the standpoint of the LPI Linux Essentials, system accounts are UIDs <1000, and regular user accounts are UIDs >1000. Since the regular user accounts are >1000, these UIDs can also include service accounts.

## Login Shells and Home Directories

Some accounts have a login shell, while others do not for security purposes as they do not require interactive access.

A user can change his login shell using the `chsh` command.

```sh
# Without arguments, interactive mode
chsh

Changing the login shell for emma
Enter the new value, or press ENTER for the default
	Login Shell [/bin/bash]: /usr/bin/zsh
```

```sh
# non-interactive mode, with the `-s` parameter
chsh -s /usr/bin/zsh
```

Most accounts have a defined home directory. On Linux, this is usually the only location where that user account has guaranteed write access, with some exceptions (e.g., temporary file system areas).

## Getting Information about your Users

* `id`
* `last`
* `lastb`
* `who`
* `w`

The w and who tools only list current users logged into the system, whereas last also lists users that have disconnected. The w command lists system utilization, while who does not.

## Switching Users and Escalating Privilege

To escalate privilege to complete a task in Linux can be done with `su` and `sudo` commands.

>💡 On most Linux systems today, the `su -` command is used for escalating privileges to root, which is the default user if a username is not specified after the command name

The dollar symbol ($) should terminate the command line prompt for a non-privileged user shell, while the pound symbol (#) should terminate the command line prompt for the superuser (root) shell prompt.

>💡 By default, the first authorized sudo command will authenticate subsequent sudo commands for a (very short) period of time. This is configurable by the system administrator.
