# Backup files in Github

## Creating Our Local Git Repo

```bash
cd ~/dotfiles
git init
git add makesymlinks.sh
git add vimrc
git remote add origin https://github.com/arturonline/dotfiles.git
git push -u origin master
```

## Tracking Updates to Our Git Repo

```bash
git add xxx
git commit -m 'Changed xxx'
git push origin master
```

## Cloning Our Dotfiles to Another Machine

```bash
git clone git://github.com/arturonline/dotfiles.git
```

## Updating a Local Git Repo

```bash
git pull origin master
```