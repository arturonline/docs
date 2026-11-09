# Gitignore File

See also: [Git basics](1.git.md) · [Dotfiles](dotfiles.md)

1. Create `.gitignore` file in the root project folder (you can also add more `.gitignore` files in subfolders; their patterns are relative to that folder)
2. Add it to git: `git add .gitignore` and commit it, so the whole team shares it

`.gitignore` only affects **untracked** files. A file that is already committed keeps being tracked (see [below](#stop-tracking-a-file-already-committed)).

Templates for every language: [github/gitignore](https://github.com/github/gitignore) · [gitignore.io](https://www.toptal.com/developers/gitignore)

## Pattern rules

| Pattern          | Matches                                                                 |
| ---------------- | ----------------------------------------------------------------------- |
| `readme.md`      | a file or folder with that name, **at any level**                       |
| `/readme.md`     | only in the folder of the `.gitignore` (leading `/` = anchored)          |
| `logs/`          | only **directories** named `logs` (and everything inside), at any level |
| `doc/temp`       | contains a `/` in the middle → relative to the `.gitignore` folder       |
| `*.log`          | `*` = anything except `/`                                               |
| `file?.txt`      | `?` = exactly one character (`file1.txt`)                               |
| `file[0-9].txt`  | character range                                                         |
| `**/build`       | `build` in any folder (same as `build`)                                  |
| `logs/**`        | everything inside `logs`                                                |
| `a/**/b`         | `a/b`, `a/x/b`, `a/x/y/b`...                                            |
| `!keep.log`      | **negation**: include again something excluded before                   |
| `# comment`      | comment line (`\#file` for a file that starts with `#`)                  |
| `Document code`  | spaces in the middle match literally; **trailing** spaces are ignored unless escaped (`name\ `) |

The **last** matching pattern wins.

> Negation can't re-include a file if its **parent directory** is excluded: Git doesn't even look inside an ignored folder.

```gitignore
# WRONG: logs/ excludes the folder, so !logs/keep.log has no effect
logs/
!logs/keep.log

# RIGHT: ignore the content, not the folder
logs/*
!logs/keep.log
```

## Example

```gitignore
# Ignore a file
readme.md

# Ignore a folder (any level)
repos/

# Only the folder at the root
/dist/

# Spaces in the name: "Document code"
Document code
Document*code

# Ignoring a file type
*.log

# ...except this one
!important.log

# Ignore everything inside, but keep the folder in git with an empty .gitkeep
tmp/*
!tmp/.gitkeep
```

### Typical project `.gitignore`

```gitignore
# Dependencies
node_modules/
vendor/
.venv/

# Build output
/dist/
/build/
bin/
obj/
*.exe
*.dll

# Environment / secrets
.env
.env.*
!.env.example
*.pem

# Logs and temp
*.log
*.tmp
.cache/

# IDE / OS
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
.idea/
.DS_Store
Thumbs.db
desktop.ini
```

## Why is a file ignored? `git check-ignore`

```bash
git check-ignore -v x.log build/out.o keep.log
```

```text
.gitignore:1:*.log      x.log
.gitignore:3:build/     build/out.o
.gitignore:2:!keep.log  keep.log
```

Format: `source:line:pattern  path`. A match with a `!` pattern means the file is **not** ignored. Paths that match nothing are not printed (exit code 1 if none matched).

```bash
git status --ignored               # also list ignored files
git clean -ndX                     # dry run: which ignored files would be deleted
git ls-files --others --ignored --exclude-standard   # list ignored files
```

## Stop tracking a file already committed

Adding it to `.gitignore` is not enough. Remove it from the index (the file stays on disk):

```bash
echo ".env" >> .gitignore
git rm --cached .env           # one file   -> rm '.env'
git rm -r --cached node_modules/   # a folder
git commit -m "Stop tracking .env"
```

> The file disappears from the repo in this commit, and other people **will lose it** from their disk when they pull. If it contained secrets, they are still in the history: rotate them.

Re-apply a changed `.gitignore` to the whole repo:

```bash
git rm -r --cached .
git add .
git commit -m "Apply .gitignore"
```

## Global gitignore

For files produced by **your** editor/OS (don't put them in every project's `.gitignore`):

```bash
git config --global core.excludesFile ~/.gitignore_global
```

```gitignore
# ~/.gitignore_global
.DS_Store
Thumbs.db
*.swp
.idea/
```

If `core.excludesFile` is not set, Git already reads `~/.config/git/ignore` (`$XDG_CONFIG_HOME/git/ignore`).

## Local-only ignores

`.git/info/exclude` has the same syntax as `.gitignore` but is not committed: ignores just for you in this repo.

To keep a **tracked** file but ignore your local changes to it (e.g. a config file you tweak):

```bash
git update-index --skip-worktree config.json      # ignore local changes
git update-index --no-skip-worktree config.json   # undo
git ls-files -v | grep ^S                         # list skip-worktree files
```
