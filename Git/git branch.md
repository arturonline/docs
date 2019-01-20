# Branching


```bash

```

```bash
# list all branches in your repository
git branch
```

```bash
# Create a new branch called "name"
git branch name
```

```bash
# Delete a branch
git branch -d name

# Force delete the specified branch
git branch -D name
```

```bash
# Rename current branch
git branch -m name
```

```bash
# List all remote branches
git branch -a
```

## Navigate between branches

```bash
# Swith to branch "name"
git checkout name
```

## Git Checkout a Remote Branch

```bash
git fetch --all
git checkout nameRemoteBranch
```

## Merging Changes

git merge is used to combine two branches.

```bash
# First change to the master branch
git checkout master

# Merge the name branch into master branch
git merge name

# Delete the old branch
git branch -d name
```