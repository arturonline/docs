# Connect github with SSH

1. Create the SSH keys:

    ```bash
    cd ~                 #Your home directory
    ssh-keygen -t rsa    #Press enter for all values
    ```

1. Go to your account settings and click *"add SSH key"*. Copy the contents of your  `~/.ssh/id_rsa.pub` into the field labeled 'Key'.

1. Change the URL with:

    ```bash
    git remote set-url origin git+ssh://git@github.com/username/reponame.git
    ```

[Source](https://stackoverflow.com/questions/8588768/how-do-i-avoid-the-specification-of-the-username-and-password-at-every-git-push)