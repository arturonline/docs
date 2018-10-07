# Working Remotly Workflow

## Create and connect to your remote repository

In our local machine, inside our sources folder:

```bash
# Optional, create a readme:
echo "whatever.." >> README.md

# init our local repository
git init

# add the files to stash
git add *

# commit the files
git commit -m "First commit"

# Link the local and the remote repository:
git remote add origin https://github.com/artur/foo.git

# we can verify with
git remote -v
```

## Upload your changes to the remote repository

From this point, everytime we want to push changes to the server:

```bash
git push -u origin master
```

## Retrieve last updated version from github

We have to options:

### Option 1: merge

```bash
#dowload changes to .git directory:
git fetch origin master

# merge changes from .git directory to my source directory:
git merge origin/master
```

### Option 2: pull

```bash
# fetch and merge at the same time:
git pull origin master
```

The difference between this two options is that if you do a pull and there is a conflict then the pull just fails.

## How to change remote repository

To work with a different repository we have to remove the old and add the new one:

```bash
# remove old
git remote remove origin

# add new
git remote add origin https://gitlab.com/bar.git
```

## Rejected push

If you get the error message: "Rejected because the remote contais work that you do not have locally."

```bash
git pull origin master --allow-unrelated-histories
```