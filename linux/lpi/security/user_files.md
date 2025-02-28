# Users and Groups Config Files

## Configuration files

Information about users and groups is stored in four files within the `/etc` directory tree:

### The Password file: `/etc/passwd`

This file contains one line for each user account on the system.
Each line is composed of seven fields separated by colons(:)

```sh
USERNAME:PASSWORD:UID:GID:GECOS:HOMEDIR:SHELL

# Example:
emma:x:1000:1000:Emma Smith,42 Douglas St,555.555.5555:/home/emma:/bin/bash
```

⚠ An *x* is used if the password is in the shadow file.

The GECOS field contains (3) or more fields, delimited by a comma (,). To change the information on the GECOS field, use the `chfn` command and answer the questions.

### The Group file: `/etc/group`

This file contains a list of groups, each on a separate line:

```sh
NAME:PASSWORD:GID:MEMBERS

# Example:

students:x:1023:jsmith,emma
```

### The Shadow file: `/etc/shadow`

This file contains the login name and encrypted password. Although the file has many fields, most are beyond the scope of this lesson, other than the first two.

```sh
USERNAME:PASSWORD:DATELASTCHANGE:MINPASSAGE:MAXPASSAGE:PASSWARNPERIOD:INACTIVE:ACCOUNTEXPIRATIONDATE:RESERVED
```

```sh
# Example:

frank:$6$i9gjM4Md4MuelZCd$7jJa8Cd2bbADFH4dwtfvTvJLOYCCCBf/.jYbK1IMYx7Wh4fErXcc2xQVU2N1gb97yIYaiqH.jjJammzof2Jfr/:18029:0:99999:7:::
```

The password are stored as a one-way hash function.

A password may take several forms:

| form                   | meaning                                                     |
|------------------------|-------------------------------------------------------------|
| `!!`                   | disabled account, with no password stored                   |
| `!$1$01234567$ABC...`  | A disabled account with hash function, salt and hash string |
| `$1$01234567ABC$012..` | An Enable account, with hash function, salt and string      |

The hash function, hash salt and hash string are preceded and delimited by a dollar symbol ($). The hash salt length must be between eight and sixteen (8-16) characters.

Examples of the three most common are as follows:

```sh
# A hash function of MD5 (1), with an example hash length of eight.
$1$01234567$ABC…
```

```sh
# A hash function of SHA256 (5), with an example hash length of twelve.
$5$01234567ABCD$012…
```

```sh
# A hash function of SHA512 (6), with an example hash length of twelve.
$6$01234567ABCD$012…
```

⚠ Only select authentication services, or the superuser can modify the `/etc/shadow` file via other commands.

### The GShadow file: `/etc/gshadow`

The Group Shadow file is readable only by root and by users with root privileges that contains encrypted passwords for groups, each on a separate line:

```sh
NAME:PASSWORD:GROUPADMINISTRATORS:GROUPMEMBERS
```

```sh
# Example:

developer:$6$7QUIhUX1WdO6$H7kOYgsboLkDseFHpk04lwAtweSUQHipoxIgo83QNDxYtYwgmZTCU0qSCuCkErmyR263rvHiLctZVDR7Ya9Ai1::
```
