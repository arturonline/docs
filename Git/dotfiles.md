# dotfiles

## Starting from scratch

```bash
> git init --bare $HOME/.dotfiles

> alias config='/usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME'

> config config --local status.showUntrackedFiles no

> echo "alias config='/usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME'" >> $HOME/.bashrc
```

After you've executed the setup any file within the `$HOME` folder can be versioned with:

```bash
> config status
> config add .vimrc
> config commit -m "Add vimrc"
> config add .bashrc
> config commit -m "Add bashrc"
> config push
```

⚠ I packaged the above lines into a snippet so that you can set things up:

```bash
curl -Lks http://bit.do/cfg-init | /bin/bash
```

## Install your dotfiles onto a new system (or migrate to this setup)

```bash
> alias config='/usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME'

> echo ".dotfiles" >> .gitignore

> git clone --bare <git-repo-url> $HOME/.dotfiles

> alias config='/usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME'

> config checkout

> config config --local status.showUntrackedFiles no
```

Done!

From now on you can type config commands to add and update your dotfiles:

```bash
> config status
> config add .vimrc
> config commit -m "Add vimrc"
> config add .bashrc
> config commit -m "Add bashrc"
> config push
```

⚠ Again as a shortcut not to have to remember all these steps on any new machine you want to setup:

```bash
curl -Lks http://bit.do/cfg-install | /bin/bash
```