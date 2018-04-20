# Backup files in Github

## Creating Our Local Git Repo

cd ~/dotfiles
git init
git add makesymlinks.sh
git add vimrc
git remote add origin https://github.com/arturonline/dotfiles.git
git push -u origin master

## Tracking Updates to Our Git Repo

git add vimrc
git commit -m 'Changed vim colorscheme!'
git push origin master

## Cloning Our Dotfiles to Another Machine

git clone git://github.com/arturonline/dotfiles.git

## Updating a Local Git Repo

git pull origin master