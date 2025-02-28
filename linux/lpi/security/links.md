# Links

There are two types of links on a Linux system:

- Symbolic links

Also called soft links, they point to the path of another file. If you delete the file the link points to (called target) the link will still exist, but it “stops working”, as it now points to “nothing”.

- Hard links

When you “delete” a file the data is not actually erased from the disk. The system simply deletes the entry on the filesystem table pointing to the inode corresponding to the data on the disk. But if you have a second entry pointing to the same inode, you can still get to the data. Think of it as two roads converging on the same point. Even if you block or redirect one of the roads, you can still reach the destination using the other.

In contrast to symbolic links, you can only create hard links to files, and both the link and target must reside in the same file system.

💡 An inode is a data structure that stores attributes for a file or directory. Every hard link pointing to a file increases the *link count attribute* on the file's inode.

## Working with Hard Links

To create a hard link:

```sh
> ln TARGET  LINK_NAME
```

When creating symbolic links you should be aware that unless a path is fully specified the location of the target is interpreted as relative to the location of the link. This may create problems if the link, or the file it points to, is moved.

💡 If you leave out the last parameter (LINK_NAME), a link with the same name as the target will be created in the current directory.

To check a hard link:

```sh
> ls -li

3806696 -r--r--r-- 2 carol carol 111702 Jun  7 10:13 hardlink
3806696 -r--r--r-- 2 carol carol 111702 Jun  7 10:13 target.txt
```

To remove a hard link:

```sh
> rm HARD_LINK
```

## Working with Symbolic links

To create a symbolic link:

```sh
> ln -s TARGET  LINK_NAME
```

💡 As with hard links, you can leave out the last parameter (LINK_NAME), a link with the same name as the target will be created in the current directory.

To check a symbolic link:

```sh
> ls -lh

-rw-r--r-- 1 carol carol 110K Jun  7 10:13 target.txt
lrwxrwxrwx 1 carol carol   12 Jun  7 10:14 softlink -> target.txt
```

⚠ Note that on file and directory listings, soft links themselves always show the permissions rwx for the user, the group and others, but in practice the access permissions for them are the same as those for the target.

To remove a hard link:

```sh
> rm HARD_LINK
```
