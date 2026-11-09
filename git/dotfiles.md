# dotfiles

Version your config files (`.bashrc`, `.vimrc`, `.gitconfig`...) directly in `$HOME`, without symlinks, using a **bare repository**: the Git data lives in `~/.dotfiles` and the work tree is your home folder. A `config` alias replaces `git` for this repo, so it never interferes with other repos.

Source: [The best way to store your dotfiles (Atlassian)](https://www.atlassian.com/git/tutorials/dotfiles). See also: [Git basics](1.git.md) · [Remotes](3.Remote.md)

## Starting from scratch

```bash
git init --bare $HOME/.dotfiles

alias config='git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME'

# don't list every untracked file in $HOME on "config status"
config config --local status.showUntrackedFiles no

# make the alias permanent
echo "alias config='git --git-dir=\$HOME/.dotfiles/ --work-tree=\$HOME'" >> $HOME/.bashrc
```

> Escaping `\$HOME` writes the literal variable into `.bashrc`; without it the path is expanded when you run `echo` (also works, but is machine-specific). On Linux the original article uses `/usr/bin/git`; plain `git` also works in Git Bash on Windows.

After you've executed the setup any file within the `$HOME` folder can be versioned with:

```bash
config status
config add .vimrc
config commit -m "Add vimrc"
config add .bashrc
config commit -m "Add bashrc"

# first push: link the remote
config remote add origin git@github.com:arturonline/dotfiles.git
config push -u origin main
```

```text
$ config status
On branch main
Changes not staged for commit:
	modified:   .bashrc

Untracked files not listed (use -u option to show untracked files)
```

> Never run `config add .` or `config add -A`: it would add your whole home folder. Always add files explicitly.

⚠ The original article packaged the above lines into a snippet (`curl -Lks http://bit.do/cfg-init | /bin/bash`). The `bit.do` short links may no longer work; the commands above are all it does. Read any script before piping it into bash.

## Install your dotfiles onto a new system (or migrate to this setup)

```bash
alias config='git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME'

# avoid recursion problems: the repo folder must never be tracked by itself
echo ".dotfiles" >> $HOME/.gitignore

git clone --bare <git-repo-url> $HOME/.dotfiles
# git clone --bare https://github.com/arturonline/dotfiles.git $HOME/.dotfiles

config checkout

config config --local status.showUntrackedFiles no
```

If `config checkout` fails because some files already exist:

```text
error: The following untracked working tree files would be overwritten by checkout:
	.bashrc
	.gitignore
Please move or remove them before you switch branches.
Aborting
```

Back them up and try again:

```bash
mkdir -p $HOME/.dotfiles-backup
config checkout 2>&1 | grep -E "^\s+\." | awk '{print $1}' | \
  xargs -I{} sh -c 'mkdir -p "$HOME/.dotfiles-backup/$(dirname {})" && mv "$HOME/{}" "$HOME/.dotfiles-backup/{}"'
config checkout
```

(Or simply `config checkout -f` to overwrite them, if you don't need the local versions.)

Done!

From now on you can type config commands to add and update your dotfiles:

```bash
config status
config add .vimrc
config commit -m "Add vimrc"
config add .bashrc
config commit -m "Add bashrc"
config push
```

⚠ Again, the original shortcut for a new machine was `curl -Lks http://bit.do/cfg-install | /bin/bash`; it runs the steps of this section, including the backup.

## Tips

```bash
config ls-files                 # list the tracked dotfiles
config pull                     # get changes made on another machine
config log --oneline -- .bashrc # history of one file
config diff                     # pending changes
```

- Tab completion for the alias (bash): `complete -o default -o nospace -F __git_wrap__git_main config` (needs git completion loaded).
- Keep secrets (tokens, SSH private keys, `.git-credentials`) out of the repo; source them from an untracked file such as `~/.bashrc.local`.
- Per-machine differences: use conditionals in the config files (`if [ "$(hostname)" = ... ]`) or `includeIf` in `.gitconfig`.
