# Permissions

Unix permissions are 3 groups of 3 bits (user/owner, group, other). Each group is one octal digit:

```md
+-----+---+--------------------------+
| rwx | 7 | Read, write and execute  |
| rw- | 6 | Read, write              |
| r-x | 5 | Read and execute         |
| r-- | 4 | Read                     |
| -wx | 3 | Write and execute        |
| -w- | 2 | Write                    |
| --x | 1 | Execute                  |
| --- | 0 | No permissions           |
+-----+---+--------------------------+

+------------+-------+-------+
| Permission | Octal | Field |
+------------+-------+-------+
| rwx------  | 0700  | User  |
| ---rwx---  | 0070  | Group |
| ------rwx  | 0007  | Other |
+------------+-------+-------+
```

For directories: `r` = list the names, `w` = create/delete entries, `x` = enter/traverse it (`cd`, access files inside). A directory almost always needs `x` wherever it has `r`.

## Common Permission Usages

**0755** Commonly used for directories and executables. The owner can read, write, execute. Everyone else can read and execute but not modify the file.

**0777** Everyone can read write and execute. On a web server, it is not advisable to use `777` permission for your files and folders, as it allows anyone to add malicious code to your server.

**0644** Only the owner can read and write. Everyone else can only read. No one can execute the file. The usual mode for regular files.

**0600** Only the owner can read and write. Use it for secrets: private keys, `.env`, tokens, config with passwords.

**0700** Only the owner can read, write and enter. Private directories (e.g. `~/.ssh`).

**0655** The owner can read and write but not execute; group and others can read and execute. Unusual (others have more rights than the owner); normally a typo for `0755` or `0644`.

## In Go

- The leading `0` makes the literal **octal**: `0644` (or the clearer `0o644`, Go 1.13+). `644` without the zero is decimal and means something completely different.
- The type is `os.FileMode` (alias of `fs.FileMode`). `Perm()` keeps only the 9 permission bits; `String()` prints them like `ls -l`.
- **umask**: the mode passed to `os.WriteFile`, `os.OpenFile`, `os.Mkdir`... is filtered by the process umask (typically `022`). `0666 &^ 022 = 0644`, `0777 &^ 022 = 0755`. That's why code usually passes `0666` for files / `0755` for dirs. Use `os.Chmod` if you need an exact mode.
- The mode is only applied when the file is **created**; writing to an existing file doesn't change its permissions.
- Setuid/setgid/sticky: use `os.ModeSetuid`, `os.ModeSetgid`, `os.ModeSticky` (e.g. `os.Chmod(p, os.ModeSetuid|0o755)`); the Unix octal `04755` does not work in Go because those bits are different in `FileMode`.
- **Windows**: there are no Unix permission bits. Only the owner write bit (`0200`) is used, to set/clear the read-only attribute; files are reported as `0666` (`-rw-rw-rw-`) or `0444` if read-only, and directories as `0777`. Real access control is via ACLs.

```go
package main

import (
	"fmt"
	"io/fs"
	"log"
	"os"
)

func main() {
	const name = "perm-demo.txt"
	if err := os.WriteFile(name, []byte("hi\n"), 0o644); err != nil {
		log.Fatal(err)
	}
	defer os.Remove(name)

	info, err := os.Stat(name)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(info.Mode())                // -rw-r--r--
	fmt.Printf("%#o\n", info.Mode().Perm()) // 0644

	if err := os.Chmod(name, 0o600); err != nil {
		log.Fatal(err)
	}
	if info, err = os.Stat(name); err != nil {
		log.Fatal(err)
	}
	fmt.Println(info.Mode())                   // -rw-------
	fmt.Println(info.Mode()&0o111 != 0)        // false (no execute bit for anyone)
	fmt.Println(info.Mode().Perm()&0o077 == 0) // true (group/other have no access)

	var m fs.FileMode = 0o755
	fmt.Println(m, os.ModeDir|m) // -rwxr-xr-x drwxr-xr-x
}
// Output assumes Unix with umask 022. On Windows the file modes print as
// -rw-rw-rw- / 0666 and the "group/other" check is false (see note above).
```
