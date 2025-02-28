# Users and groups

Linux is a multi-user operating system in which multiple users can use the same machine at the same time.

## Adding and Deleting User Accounts

```sh
# new user frank with default settings
useradd frank
```

The most important options which apply to the `useradd` command are:

`-c`
Create a new user account with custom comments (for example full name).

`-d`
Create a new user account with a custom home directory.

`-e`
Create a new user account by setting a specific date on which it will be disabled.

`-f`
Create a new user account by setting the number of days after the password expires during which the user should update the password.

`-g`
Create a new user account with a specific GID

`-G`
Create a new user account by adding it to multiple secondary groups.

`-m`
Create a new user account with its home directory.

`-M`
Create a new user account without its home directory.

`-s`
Create a new user account with a specific login shell.

`-u`
Create a new user account with a specific UID.

Once the new user account is created, you can use the `id` and groups commands to find out its **UID**, **GID** and the groups to which it belongs.

>Remember to check and eventually edit the `/etc/login.defs` file, which defines the configuration parameters that control the creation of users and groups. For example, you can set the range of **UID**s and **GID**s that can be assigned to new user and group accounts, specify that you don’t need to use the `-m` option to create the new user’s home directory and if the system should automatically create a new group for each new user.

```sh
# new user frank with default settings
useradd frank
```

>⚠ Remember that when you add a new user account, the primary group and the secondary groups to which it belongs must exist before launching the useradd command. 

## Delete User

If you want to delete a user account, you can use the `userdel` command. The `-r` option also removes the user’s home directory and all of its contents, along with the user’s mail spool. 

```sh
# Create or change password
userdel -r frank
```

## The Skeleton Directory

When you add a new user account, even creating its home directory, the newly created home directory is populated with files and folders that are copied from the *skeleton directory* (by default `/etc/skel`). Therefore, if you want to customize the files and folders that are created automatically in the home directory of the new user accounts, you must add these new files and folders to the skeleton directory.

## Adding and Deleting Groups

```sh
# Use the -g option to assign an specific GID
groupadd -g 1090 developer

groupdel developer
```

>⚠ You cannot delete a group if it is the primary group of a user account.

## Changing Password

```sh
passwd frank
Changing password for user frank.
New UNIX password:
Retype new UNIX password:
passwd: all authentication tokens updated successfully.
```

The passwd Command is primarily used to change a user’s password. Any user can change their password, but only root can change any user’s password.

Depending on the passwd option used, you can control specific aspects of password aging:

`-d`
Delete the password of a user account (thus disabling the user).

`-e`
Force the user account to change the password.

`-l`
Lock the user account (the encrypted password is prefixed with an exclamation mark).

`-u`
Unlock the user account (it removes the exclamation mark).

`-S`
Output information about the password status for a specific account.
