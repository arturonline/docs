# Git

["GitHowto.com"](https://githowto.com)

WorkFlow:

## start watching a directory for changes

`git init`

and add files to the directory. Or clone one:

`git clone www.URL.com`
`git clone /path/to/folder`

## A change proposal

when one or several files are ready you send them to the staging area:

`git add xxx` || `git add .` || `git add *`

The git add command tells Git that you want to include updates to a particular file in the next commit.

Instead of committing all of the changes you've made since the last commit, the stage area lets you group related changes into highly focused snapshots before actually committing it to the project history.

## Commiting the propose changes

Once you have recopiled the files you want in the staging area, you commit those changes to the repository.

`git commit -m "message"`

Whenever you add, edit, or delete a file, you're making a commit, and adding them to your branch. This process of adding commits keeps track of your progress as you work on a feature branch.

Commits also create a transparent history of your work that others can follow to understand what you've done and why. Each commit has an associated commit message, which is a description explaining why a particular change was made.

commands:

 `Git log` is a journal that remembers all the changes we've committed so far, in the order we committed them.
